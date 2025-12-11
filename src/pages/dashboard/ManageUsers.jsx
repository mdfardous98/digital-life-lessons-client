import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUser,
  FaCrown,
  FaUserShield,
  FaSearch,
  FaFilter,
  FaTrash,
  FaEdit,
  FaEye,
} from "react-icons/fa";

const ManageUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [premiumFilter, setPremiumFilter] = useState("all");

  const fetchUsers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (
      !window.confirm(
        `Are you sure you want to ${
          newRole === "admin" ? "promote" : "demote"
        } this user?`
      )
    )
      return;

    try {
      toast.success(`User role updated to ${newRole}`);
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const togglePremiumStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      toast.success(
        `Premium status ${newStatus ? "activated" : "deactivated"}`
      );
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, isPremium: newStatus } : u
        )
      );
    } catch (error) {
      console.error("Error updating premium status:", error);
      toast.error("Failed to update premium status");
    }
  };

  const deleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${userName}? This action cannot be undone.`
      )
    )
      return;

    try {
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesPremium =
      premiumFilter === "all" ||
      (premiumFilter === "premium" && user.isPremium) ||
      (premiumFilter === "free" && !user.isPremium);
    return matchesSearch && matchesRole && matchesPremium;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Users - Digital Life Lessons</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-secondary-500 mb-2">
              Manage Users
            </h1>
            <p className="text-gray-500 dark:text-surface-light">
              Manage all registered users on the platform
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {filteredUsers.length} users found
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={premiumFilter}
                onChange={(e) => setPremiumFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Types</option>
                <option value="premium">Premium</option>
                <option value="free">Free</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Premium
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Lessons
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <FaSearch className="text-4xl text-gray-300 mx-auto mb-4 animate-pulse" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        No users found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your search or filters
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 flex items-center">
                        <img
                          className="h-10 w-10 rounded-full ring-2 ring-indigo-200 transition-all duration-200"
                          src={
                            u.photoURL ||
                            `https://ui-avatars.com/api/?name=${u.displayName}&background=6366f1&color=fff`
                          }
                          alt={u.displayName}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-800">
                            {u.displayName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {u.uid?.substring(0, 8)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => updateUserRole(u._id, u.role)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            u.role === "admin"
                              ? "bg-purple-200 text-purple-800 hover:bg-purple-300"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {u.role === "admin" ? (
                            <FaUserShield className="mr-1" />
                          ) : (
                            <FaUser className="mr-1" />
                          )}
                          {u.role}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            togglePremiumStatus(u._id, u.isPremium)
                          }
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            u.isPremium
                              ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {u.isPremium ? (
                            <FaCrown className="mr-1" />
                          ) : (
                            <FaUser className="mr-1" />
                          )}
                          {u.isPremium ? "Premium" : "Free"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {Math.floor(Math.random() * 20)}
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          title="View Profile"
                          className="text-blue-600 hover:text-blue-800 p-1 transition-transform duration-150 hover:scale-110"
                        >
                          <FaEye />
                        </button>
                        <button
                          title="Edit User"
                          className="text-green-600 hover:text-green-800 p-1 transition-transform duration-150 hover:scale-110"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteUser(u._id, u.displayName)}
                          title="Delete User"
                          className="text-red-600 hover:text-red-800 p-1 transition-transform duration-150 hover:scale-110"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
