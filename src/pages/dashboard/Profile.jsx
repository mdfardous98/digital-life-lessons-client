import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaBook,
  FaHeart,
  FaCrown,
  FaEdit,
  FaCamera,
  FaSave,
} from "react-icons/fa";

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalFavorites: 0,
    totalLikes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
      setFormData({
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      });
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();

      const lessonsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/lessons/mine`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const favoritesResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/favorites`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const lessons = lessonsResponse.data;
      const favorites = favoritesResponse.data;

      const totalLikes = lessons.reduce(
        (sum, lesson) => sum + (lesson.likesCount || 0),
        0
      );

      setStats({
        totalLessons: lessons.length,
        totalFavorites: favorites.length,
        totalLikes,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await user.getIdToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/sync`,
        {
          uid: user.uid,
          email: user.email,
          displayName: formData.displayName,
          photoURL: formData.photoURL,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Profile updated successfully");
      setEditing(false);

      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile - Digital Life Lessons</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                <img
                  src={
                    user?.photoURL ||
                    `https://ui-avatars.com/api/?name=${user?.displayName}&background=fff&color=6366f1`
                  }
                  alt={user?.displayName}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              {editing && (
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full text-purple-600 hover:bg-purple-100 transition-colors">
                  <FaCamera />
                </button>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{user?.displayName}</h1>
                  <div className="flex items-center space-x-2 mt-2">
                    <FaEnvelope className="text-white/80" />
                    <span className="text-white/80">{user?.email}</span>
                  </div>
                </div>
                {user?.isPremium && (
                  <div className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-yellow-200 text-yellow-900 rounded-full shadow-md">
                    <FaCrown className="mr-2" />
                    Premium Member
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt />
                  <span>
                    Joined {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUser />
                  <span>
                    {user?.role === "admin" ? "Administrator" : "Member"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 rounded-xl shadow-lg text-white hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Total Lessons</p>
                    <p className="text-3xl font-bold">{stats.totalLessons}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <FaBook className="text-2xl" />
                  </div>
                </div>
                <p className="mt-2 text-sm opacity-70">Lessons created</p>
              </div>

              <div className="bg-gradient-to-r from-red-400 to-pink-500 p-6 rounded-xl shadow-lg text-white hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Total Favorites</p>
                    <p className="text-3xl font-bold">{stats.totalFavorites}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <FaHeart className="text-2xl" />
                  </div>
                </div>
                <p className="mt-2 text-sm opacity-70">Lessons saved</p>
              </div>

              <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-xl shadow-lg text-white hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Total Likes</p>
                    <p className="text-3xl font-bold">{stats.totalLikes}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <FaHeart className="text-2xl" />
                  </div>
                </div>
                <p className="mt-2 text-sm opacity-70">Likes received</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Information
                </h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <FaSave className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      editing ? "border border-gray-300" : "bg-gray-100"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Photo URL
                  </label>
                  <input
                    type="url"
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      editing ? "border border-gray-300" : "bg-gray-100"
                    }`}
                    placeholder="https://example.com/photo.jpg"
                  />
                  {editing && (
                    <p className="mt-1 text-sm text-gray-500">
                      Enter a valid image URL for your profile photo
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Email cannot be changed for security reasons
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Account Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user?.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : user?.isPremium
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user?.role === "admin"
                      ? "Administrator"
                      : user?.isPremium
                      ? "Premium"
                      : "Free"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email Verified</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {!user?.isPremium && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-xl shadow-lg text-white hover:scale-105 transition-transform">
                <div className="flex items-center mb-4">
                  <FaCrown className="text-2xl mr-3" />
                  <h3 className="text-lg font-semibold">Upgrade to Premium</h3>
                </div>
                <p className="mb-4 text-white/90">
                  Unlock exclusive features and create premium content
                </p>
                <a
                  href="/pricing"
                  className="block w-full text-center bg-white text-yellow-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Upgrade Now
                </a>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white">
                    <FaBook />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created a new lesson</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center text-white">
                    <FaHeart />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Liked 3 lessons</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white">
                    <FaUser />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Profile updated</p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
