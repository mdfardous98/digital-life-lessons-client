import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Header/Navbar";

const DashboardLayout = () => {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="ml-64 w-full min-h-screen bg-base-200 p-8">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default DashboardLayout;
