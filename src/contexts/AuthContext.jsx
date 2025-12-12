/* eslint-disable react-refresh/only-export-components */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase.config";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://digital-life-lessons-server-lilac.vercel.app";

  const syncUserWithBackend = useCallback(
    async (firebaseUser) => {
      try {
        const token = await firebaseUser.getIdToken();
        const response = await axios.post(
          `${API_URL}/api/auth/sync`,
          {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName:
              firebaseUser.displayName || firebaseUser.email.split("@")[0],
            photoURL:
              firebaseUser.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                firebaseUser.email.split("@")[0]
              )}&background=6366f1&color=fff`,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      } catch (error) {
        console.error("Sync error:", error);
        try {
          const token = await firebaseUser.getIdToken();
          const registerResponse = await axios.post(
            `${API_URL}/api/auth/register`,
            {
              displayName:
                firebaseUser.displayName || firebaseUser.email.split("@")[0],
              photoURL:
                firebaseUser.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  firebaseUser.email.split("@")[0]
                )}&background=6366f1&color=fff`,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return registerResponse.data;
        } catch (registerError) {
          console.error("Register error:", registerError);
          return null;
        }
      }
    },
    [API_URL]
  );

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = await syncUserWithBackend(userCredential.user);

      if (userData) {
        const fullUser = {
          ...userCredential.user,
          ...userData,
          getIdToken: userCredential.user.getIdToken.bind(userCredential.user),
        };
        setUser(fullUser);
        setIsPremium(userData.isPremium || false);
        toast.success("Login successful!");
      }
      return userData;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const register = async (name, email, password, photoURL) => {
    try {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasMinimumLength = password.length >= 6;

      if (!hasUpperCase || !hasLowerCase || !hasMinimumLength) {
        throw new Error(
          "Password must contain uppercase, lowercase letters and be at least 6 characters long"
        );
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL:
          photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=6366f1&color=fff`,
      });

      const token = await userCredential.user.getIdToken();
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          displayName: name,
          photoURL:
            photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              name
            )}&background=6366f1&color=fff`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const fullUser = {
        ...userCredential.user,
        ...response.data,
        getIdToken: userCredential.user.getIdToken.bind(userCredential.user),
      };
      setUser(fullUser);
      setIsPremium(response.data.isPremium || false);
      toast.success("Registration successful!");
      return response.data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = await syncUserWithBackend(result.user);

      if (userData) {
        const fullUser = {
          ...result.user,
          ...userData,
          getIdToken: result.user.getIdToken.bind(result.user),
        };
        setUser(fullUser);
        setIsPremium(userData.isPremium || false);
        toast.success("Google login successful!");
      }
      return userData;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsPremium(false);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const checkPremiumStatus = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await axios.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsPremium(response.data.isPremium);
    } catch (error) {
      console.error("Error checking premium status:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await syncUserWithBackend(firebaseUser);
        if (userData) {
          const fullUser = {
            ...firebaseUser,
            ...userData,
            getIdToken: firebaseUser.getIdToken.bind(firebaseUser),
          };
          setUser(fullUser);
          setIsPremium(userData.isPremium || false);
        }
      } else {
        setUser(null);
        setIsPremium(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [syncUserWithBackend]);

  const value = {
    user,
    loading,
    isPremium,
    login,
    register,
    googleLogin,
    logout,
    checkPremiumStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
