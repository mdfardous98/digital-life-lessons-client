
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("user");
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get ID token
        const token = await user.getIdToken();
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Fetch user data from our backend to get role & premium status
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/me`
          );
          setCurrentUser({ ...user, ...res.data });
          setUserRole(res.data.role || "user");
          setIsPremium(res.data.isPremium || false);
        } catch (err) {
          console.error("Failed to fetch user data", err);
        }
      } else {
        setCurrentUser(null);
        setUserRole("user");
        setIsPremium(false);
        delete axios.defaults.headers.common["Authorization"];
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  const value = {
    currentUser,
    userRole,
    isPremium,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
