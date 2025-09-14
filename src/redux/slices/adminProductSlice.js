import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// Async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/products`, {
        headers: {
          Authorization: USER_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// async function to create a new product
export const createAdminProduct = createAsyncThunk(
  "adminProducts/createAdminProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/products`,
        productData,
        {
          headers: {
            Authorization: USER_TOKEN,
          }
        }
      );
      console.log("create product", response.data);
      return response.data;
    } catch (error) {
      // console.error("createAdminProduct error:", error.response?.data || error.message);
      return rejectWithValue(error || "Server Errorrr");
    }
  }
);


// async thunk to update an existing product
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/products/${id}`, productData, {
        headers: {
          Authorization: USER_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// async thunk to delete a product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
       await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: {
          Authorization: USER_TOKEN,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminProductSlice=createSlice({
    name:"adminProducts",
    initialState:{
        products:[],
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        // fetch admin products
        .addCase(fetchAdminProducts.pending,(state)=>{
            state.loading=true;
        })
        .addCase(fetchAdminProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=action.payload;
            console.log("product".action.payload)
        })
        .addCase(fetchAdminProducts.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message;
        })
        // create product
        .addCase(createAdminProduct.pending,(state)=>{
            state.loading=true;
        })
        .addCase(createAdminProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.products.push(action.payload);
            // console.log("neww product",action.payload)
        })
        .addCase(createAdminProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message;
        })
        // update product
        .addCase(updateProduct.pending,(state)=>{
            state.loading=true;
        })
        .addCase(updateProduct.fulfilled,(state,action)=>{
            state.loading=false;
            const index=state.products.findIndex(product=>product.id===action.payload.id);
            if(index!==-1){
                state.products[index]=action.payload;
            }
        })
        .addCase(updateProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message;
        })
        // delete product
        .addCase(deleteProduct.pending,(state)=>{
            state.loading=true;
        })
        .addCase(deleteProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=state.products.filter(product=>product._id!==action.payload);
        })
        .addCase(deleteProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message;
        });
    }
});

export default adminProductSlice.reducer;
// export const {}=adminProductSlice.actions;
