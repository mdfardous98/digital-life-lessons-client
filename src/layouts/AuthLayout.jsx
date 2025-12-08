import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-base-300 dark:to-base-200 flex items-center justify-center">
      <Outlet />
    </div>
  );
}
export default  AuthLayout;