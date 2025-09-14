import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
// Helper function to load cart from local storage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  // console.log("Loaded cart from storage:", storedCart);
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

// Helper function to save cart to localStorage
const saveCartToStorage=(cart)=>{
    localStorage.setItem("cart",JSON.stringify(cart));
}

// Fetch cart for a  user or guest
export const fetchCart = createAsyncThunk("cart/fetchCart", async ({ userId, guestId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, { params: { userId, guestId } });
    return response.data;
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.response.data);
  }
});

// Add an item to the cart for a user or guest
export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity, size, color, userId, guestId }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, { productId, quantity, size, color, userId, guestId });
    return response.data;
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.response.data);
  }
});

// update the quantity of an item in the cart for a user or guest
export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItemQuantity", async ({ productId, quantity, userId, guestId,size,color }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart/`, { productId, quantity, userId, guestId,size,color });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Remove an item from the cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({ productId, userId, guestId,size,color }, { rejectWithValue }) => {
  try {
    const response = await axios({ method: "DELETE", url: `${import.meta.env.VITE_BACKEND_URL}/api/cart/`, data: { productId, userId, guestId,size,color } });
    return response.data;
  } catch (error) {
        // console.error("nnnnnnnnnnn",error);

    return rejectWithValue(error.response.data);
  }
});

// Merge guest cart into user cart
export const mergeCarts = createAsyncThunk("cart/mergeCarts", async ({ userId, guestId }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`, { userId, guestId }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return rejectWithValue(error.response.data);
  }
});

const cartSlice=createSlice({
    name:"cart",
    initialState:{
        cart:loadCartFromStorage(),
//         When addToCart runs, initially cart = loadCartFromStorage() (before API call).
// After success, cart = action.payload (because fulfilled case overwrites it).
        loading:false,
        error:null
    },
    reducers:{
        clearCart:(state)=>{
            state.cart={products:[]};
            localStorage.removeItem("cart");
        }
    },
    extraReducers:(builder)=>{
        builder
        // fetch cart
        .addCase(fetchCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchCart.fulfilled,(state,action)=>{
            state.loading=false;
            // console.log("fetchcart payload",action.payload);
            state.cart=action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(fetchCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message || "Failed to fetch cart";
        })
        // add to cart
        .addCase(addToCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(addToCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            // console.log("add to cart payload",action.payload);
            saveCartToStorage(action.payload);
//             state.cart = action.payload → updates Redux state for the current session.
// saveCartToStorage(action.payload) → persists the state to localStorage, so it survives page reloads.
// They work together:
// Redux updates → UI updates immediately. so number of items will shown
// LocalStorage updates → user won’t lose the cart after refresh.
        })
        .addCase(addToCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "Failed to add to cart";
        })
           
        // update cart item quantity
       .addCase(updateCartItemQuantity.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(updateCartItemQuantity.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(updateCartItemQuantity.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "Failed to update item quantity";
        })

        // remove from cart
        .addCase(removeFromCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(removeFromCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(removeFromCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "Failed to remove item from cart";
        })

        // merge carts
        .addCase(mergeCarts.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(mergeCarts.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            // console.log("merger carts paylaod",action.payload);
            saveCartToStorage(action.payload);
        })
        .addCase(mergeCarts.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "Failed to merge carts";
        });
    },
});

export const {clearCart}=cartSlice.actions;
export default cartSlice.reducer;
