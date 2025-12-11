import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUnlock,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const MyLessons = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchLessons();
  }, [user]);

  const fetchLessons = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/lessons/mine`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const lessonsData = response.data;
      setLessons(lessonsData);

      const uniqueCategories = [
        ...new Set(lessonsData.map((lesson) => lesson.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (lessonId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this lesson? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Lesson deleted successfully");
      setLessons(lessons.filter((lesson) => lesson._id !== lessonId));
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson");
    }
  };

  const toggleVisibility = async (lessonId, currentVisibility) => {
    const newVisibility = currentVisibility === "public" ? "private" : "public";

    try {
      const token = await user.getIdToken();
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/lessons/${lessonId}`,
        { visibility: newVisibility },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`Lesson made ${newVisibility}`);
      setLessons(
        lessons.map((lesson) =>
          lesson._id === lessonId
            ? { ...lesson, visibility: newVisibility }
            : lesson
        )
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
      toast.error("Failed to update visibility");
    }
  };

  const toggleAccessLevel = async (lessonId, currentAccessLevel) => {
    if (currentAccessLevel === "premium" && !user.isPremium) {
      toast.error("You need Premium subscription to create premium lessons");
      return;
    }

    const newAccessLevel =
      currentAccessLevel === "premium" ? "free" : "premium";

    try {
      const token = await user.getIdToken();
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/lessons/${lessonId}`,
        { accessLevel: newAccessLevel },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`Access level changed to ${newAccessLevel}`);
      setLessons(
        lessons.map((lesson) =>
          lesson._id === lessonId
            ? { ...lesson, accessLevel: newAccessLevel }
            : lesson
        )
      );
    } catch (error) {
      console.error("Error updating access level:", error);
      toast.error(
        error.response?.data?.message || "Failed to update access level"
      );
    }
  };

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || lesson.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
        <title>My Lessons - Digital Life Lessons</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold dark:text-secondary-500 mb-2">
                My Lessons
              </h1>
              <p className="text-gray-500">
                Manage and organize all your life lessons in one place
              </p>
            </div>
            <Link
              to="/dashboard/add-lesson"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-all duration-200"
            >
              Add New Lesson
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">
                Showing {filteredLessons.length} of {lessons.length} lessons
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <FaSearch className="text-4xl text-gray-300 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No lessons found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter"
                  : "Start by creating your first lesson"}
              </p>
              {!searchTerm && selectedCategory === "all" && (
                <Link
                  to="/dashboard/add-lesson"
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                >
                  Create your first lesson →
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      Lesson
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      Visibility
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      Access
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredLessons.map((lesson) => (
                    <tr
                      key={lesson._id}
                      className="hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-800">
                            {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {lesson.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(lesson.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded transition-colors duration-200">
                          {lesson.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            toggleVisibility(lesson._id, lesson.visibility)
                          }
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            lesson.visibility === "public"
                              ? "bg-green-200 text-green-800 hover:bg-green-300"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {lesson.visibility === "public" ? (
                            <>
                              <FaEye className="mr-1" />
                              Public
                            </>
                          ) : (
                            <>
                              <FaEyeSlash className="mr-1" />
                              Private
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            toggleAccessLevel(lesson._id, lesson.accessLevel)
                          }
                          disabled={
                            lesson.accessLevel === "premium" && !user.isPremium
                          }
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            lesson.accessLevel === "premium"
                              ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                              : "bg-blue-200 text-blue-800 hover:bg-blue-300"
                          } ${
                            lesson.accessLevel === "premium" && !user.isPremium
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {lesson.accessLevel === "premium" ? (
                            <>
                              <FaLock className="mr-1" />
                              Premium
                            </>
                          ) : (
                            <>
                              <FaUnlock className="mr-1" />
                              Free
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">
                            ❤️ {lesson.likesCount || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/lessons/${lesson._id}`}
                            className="text-blue-600 hover:text-blue-800 p-1 transition-transform duration-150 hover:scale-110"
                            title="View"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            to={`/dashboard/update-lesson/${lesson._id}`}
                            className="text-green-600 hover:text-green-800 p-1 transition-transform duration-150 hover:scale-110"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => deleteLesson(lesson._id)}
                            className="text-red-600 hover:text-red-800 p-1 transition-transform duration-150 hover:scale-110"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {filteredLessons.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl transition-all duration-200 hover:bg-blue-100">
              <p className="text-sm text-blue-800">Total Lessons</p>
              <p className="text-2xl font-bold text-blue-900">
                {filteredLessons.length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl transition-all duration-200 hover:bg-green-100">
              <p className="text-sm text-green-800">Public Lessons</p>
              <p className="text-2xl font-bold text-green-900">
                {
                  filteredLessons.filter((l) => l.visibility === "public")
                    .length
                }
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl transition-all duration-200 hover:bg-yellow-100">
              <p className="text-sm text-yellow-800">Premium Lessons</p>
              <p className="text-2xl font-bold text-yellow-900">
                {
                  filteredLessons.filter((l) => l.accessLevel === "premium")
                    .length
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyLessons;
