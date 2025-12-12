/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const StripeContext = createContext();

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error("useStripe must be used within StripeProvider");
  }
  return context;
};

export const StripeProvider = ({ children }) => {
  const { user } = useAuth();

  // Load Stripe once
  const [stripePromise] = useState(() =>
    loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "")
  );

  const createCheckoutSession = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL ||
          "https://digital-life-lessons-server-lilac.vercel.app"
        }/api/create-checkout-session`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { url } = response.data;
      window.location.href = url;
    } catch (error) {
      console.error("Stripe session error:", error);
      toast.error(
        error.response?.data?.message || "Failed to create checkout session"
      );
    }
  };

  const value = {
    stripePromise,
    createCheckoutSession,
  };

  return (
    <Elements stripe={stripePromise}>
      <StripeContext.Provider value={value}>{children}</StripeContext.Provider>
    </Elements>
  );
};
