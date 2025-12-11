import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaBook,
  FaHeart,
  FaUser,
  FaCrown,
  FaChartLine,
  FaUsers,
  FaFlag,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  const userNavItems = [
    { path: "/dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/dashboard/add-lesson", icon: <FaPlus />, label: "Add Lesson" },
    { path: "/dashboard/my-lessons", icon: <FaBook />, label: "My Lessons" },
    { path: "/dashboard/favorites", icon: <FaHeart />, label: "Favorites" },
    { path: "/dashboard/profile", icon: <FaUser />, label: "Profile" },
  ];

  const adminNavItems = [
    { path: "/dashboard/admin", icon: <FaChartLine />, label: "Admin Panel" },
    {
      path: "/dashboard/admin/manage-users",
      icon: <FaUsers />,
      label: "Manage Users",
    },
    {
      path: "/dashboard/admin/manage-lessons",
      icon: <FaBook />,
      label: "Manage Lessons",
    },
    {
      path: "/dashboard/admin/reported-lessons",
      icon: <FaFlag />,
      label: "Reported Lessons",
    },
    { path: "/dashboard/premium", icon: <FaCrown />, label: "Go Premium" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-xl min-h-screen fixed transition-colors duration-300">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white transform hover:scale-105 transition-transform duration-300">
                <FaBook />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h2>
            </div>

            <nav className="space-y-2">
              {userNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}

              {isAdmin && (
                <>
                  <div className="pt-6 pb-2">
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4">
                      Admin
                    </p>
                  </div>
                  {adminNavItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </>
              )}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full dark:bg-gray-700 transform hover:scale-105 transition-transform duration-300"></div>
                <div className="text-gray-900 dark:text-white">
                  <p className="font-medium">{user?.displayName || "User"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role === "admin" ? "Administrator" : "User"}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 ml-64 p-6 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
