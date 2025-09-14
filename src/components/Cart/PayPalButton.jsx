import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
  // Make sure amount is always a number with 2 decimals
  const formattedAmount = parseFloat(amount).toFixed(2);

  return (
    <div>
      <PayPalScriptProvider
        options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: "USD" }}
      >
        {console.log("id",import.meta.env.VITE_PAYPAL_CLIENT_ID)}
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: formattedAmount, // ✅ formatted value
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              // Call parent success handler
              onSuccess(details);
            });
          }}
          onError={(err) => {
            console.error("PayPal Checkout Error:", err);
            onError(err);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalButton;
