import { useAuth } from "../contexts/AuthContext";

const useRole = () => {
  const { userRole } = useAuth();
  return userRole;
};

export default useRole;
