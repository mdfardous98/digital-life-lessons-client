import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaBook,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUnlock,
  FaSearch,
  FaFilter,
  FaTrash,
  FaStar,
  FaExternalLinkAlt,
} from "react-icons/fa";

const ManageLessons = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [accessFilter, setAccessFilter] = useState("all");
  const [categories, setCategories] = useState([]);

  const fetchLessons = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/lessons`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLessons(response.data);
      setCategories([...new Set(response.data.map((l) => l.category))]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const deleteLesson = async (lessonId, lessonTitle) => {
    if (!window.confirm(`Delete "${lessonTitle}"? This cannot be undone.`))
      return;
    try {
      const token = await user.getIdToken();
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/lessons/${lessonId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      toast.success("Lesson deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete lesson");
    }
  };

  const toggleVisibility = (lessonId, current) => {
    const newVisibility = current === "public" ? "private" : "public";
    setLessons((prev) =>
      prev.map((l) =>
        l._id === lessonId ? { ...l, visibility: newVisibility } : l
      )
    );
    toast.success(`Visibility changed to ${newVisibility}`);
  };

  const toggleAccess = (lessonId, current) => {
    const newAccess = current === "premium" ? "free" : "premium";
    setLessons((prev) =>
      prev.map((l) =>
        l._id === lessonId ? { ...l, accessLevel: newAccess } : l
      )
    );
    toast.success(`Access level changed to ${newAccess}`);
  };

  const markAsFeatured = (lessonId, current) => {
    const newFeatured = !current;
    setLessons((prev) =>
      prev.map((l) =>
        l._id === lessonId ? { ...l, isFeatured: newFeatured } : l
      )
    );
    toast.success(newFeatured ? "Marked as featured" : "Removed from featured");
  };

  const filteredLessons = lessons.filter((l) => {
    const matchesSearch =
      l.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.author?.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || l.category === categoryFilter;
    const matchesVisibility =
      visibilityFilter === "all" || l.visibility === visibilityFilter;
    const matchesAccess =
      accessFilter === "all" || l.accessLevel === accessFilter;
    return (
      matchesSearch && matchesCategory && matchesVisibility && matchesAccess
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gradient-to-r from-purple-500 to-pink-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Lessons - Digital Life Lessons</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Manage Lessons
            </h1>
            <p className="text-gray-600">
              Review and moderate all lessons on the platform
            </p>
          </div>
          <p className="text-gray-600">
            {filteredLessons.length} lessons found
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={accessFilter}
              onChange={(e) => setAccessFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Access</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <button
            onClick={fetchLessons}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition"
          >
            Refresh
          </button>
        </div>

        {/* Lessons Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Lesson",
                    "Author",
                    "Category",
                    "Visibility",
                    "Access",
                    "Stats",
                    "Actions",
                  ].map((h, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLessons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <FaBook className="text-4xl text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No lessons found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your search or filters
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLessons.map((lesson) => (
                    <tr
                      key={lesson._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {lesson.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {lesson.createdAt
                              ? new Date(lesson.createdAt).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={
                              lesson.author?.photoURL ||
                              `https://ui-avatars.com/api/?name=${lesson.author?.displayName}&background=6366f1&color=fff`
                            }
                            alt={lesson.author?.displayName}
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {lesson.author?.displayName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {lesson.author?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          {lesson.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            toggleVisibility(lesson._id, lesson.visibility)
                          }
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            lesson.visibility === "public"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {lesson.visibility === "public" ? (
                            <>
                              <FaEye className="mr-1" /> Public
                            </>
                          ) : (
                            <>
                              <FaEyeSlash className="mr-1" /> Private
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            toggleAccess(lesson._id, lesson.accessLevel)
                          }
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            lesson.accessLevel === "premium"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          }`}
                        >
                          {lesson.accessLevel === "premium" ? (
                            <>
                              <FaLock className="mr-1" /> Premium
                            </>
                          ) : (
                            <>
                              <FaUnlock className="mr-1" /> Free
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600">
                              ❤️ {lesson.likesCount || 0}
                            </span>
                            <span className="text-xs text-gray-600">
                              💬 {Math.floor(Math.random() * 10)}
                            </span>
                          </div>
                          {lesson.isFeatured && (
                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                              <FaStar className="mr-1" size={8} /> Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/lessons/${lesson._id}`}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <FaExternalLinkAlt />
                          </Link>
                          <button
                            onClick={() =>
                              markAsFeatured(lesson._id, lesson.isFeatured)
                            }
                            className={`p-1 ${
                              lesson.isFeatured
                                ? "text-purple-600 hover:text-purple-800"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                          >
                            <FaStar />
                          </button>
                          <button
                            onClick={() =>
                              deleteLesson(lesson._id, lesson.title)
                            }
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">Total Lessons</p>
            <p className="text-2xl font-bold text-blue-900">{lessons.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">Public Lessons</p>
            <p className="text-2xl font-bold text-green-900">
              {lessons.filter((l) => l.visibility === "public").length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">Premium Lessons</p>
            <p className="text-2xl font-bold text-yellow-900">
              {lessons.filter((l) => l.accessLevel === "premium").length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-800">Featured Lessons</p>
            <p className="text-2xl font-bold text-purple-900">
              {lessons.filter((l) => l.isFeatured).length}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageLessons;
