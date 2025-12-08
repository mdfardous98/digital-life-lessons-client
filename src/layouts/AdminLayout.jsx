import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Header/Navbar";

const AdminLayout = () => {
  return (
    <>
      <Navbar />
      <div className="flex bg-gradient-to-r from-red-50 to-orange-50 dark:from-base-300">
        <Sidebar />
        <div className="ml-64 w-full min-h-screen bg-base-200 p-8">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">
              Admin Panel
            </h2>
            <p>Manage users, lessons, and reports</p>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
export default AdminLayout;