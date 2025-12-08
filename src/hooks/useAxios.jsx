import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const useAxios = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      async (config) => {
        if (currentUser) {
          const token = await currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(requestIntercept);
  }, [currentUser]);

  return axios;
};

export default useAxios;
