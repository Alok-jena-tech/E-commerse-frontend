import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import login from "../assets/login.webp";
import { loginUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { mergeCarts } from "../redux/slices/cartSlice";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  // console.log("lohin error", error);
  const { cart } = useSelector((state) => state.cart);

  // Get redirect parameter and check if it is checkout or something else
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");
  React.useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCarts({ user, guestId })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
          // dont do login but select some product so cart create as guerst user and when click on checkout
          // then come to this page (login) as no token and this useEffect will not run and after login
          // this useEffect will run and as he select some product so must have guest cart so then mergeCarts will run and merger the guest cart to user cart.
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
        // if user no select any product but click on checkout then he come to this login page as no token so thies useEffect will not run but after login this useEffect run
        // and as token it thre now and may be user have cart or thre is noe guestId as user before login did not slecet any product so he dont have any guest cart so else condition
        // will run and directe navigate to  checkout page as per redirect value.
      }
    }
  }, [user, guestId, cart, navigate, dispatch, isCheckoutRedirect]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const io = await dispatch(loginUser({ email, password })).unwrap();
    // console.log("login info", io);
    toast.success("Successfully logged in");
  } catch (err) {
    // console.error(err);
    toast.error("Invalid credentials");
  }
};

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white- p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Rabbit</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey ther!</h2>
          <p className="text-center mb-6">
            Enter your username and password to Login
          </p>
          <div className="mb-4">
            <label htmlFor="" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your email address"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {loading ? "loading..." : "Sign In"}
          </button>
          <p className="mt-6 text-center text-sm ">
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              // ***
              //               const redirect = "/checkout?step=2&promo=SAVE10";
              // console.log(redirect);
              // // "/checkout?step=2&promo=SAVE10"

              // console.log(encodeURIComponent(redirect));
              // // "%2Fcheckout%3Fstep%3D2%26promo%3DSAVE10"
              //               👉 In short:
              // encodeURIComponent(redirect) = “Make sure the redirect URL doesn’t break my query string and is safe to pass inside another URL.”
              // ***
              className="text-blue-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={login}
            alt="Login to Account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>{" "}
    </div>
  );
};

export default Login;
