import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaEye,
  FaLock,
  FaHeart,
  FaBookmark,
  FaCalendarAlt,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
} from "react-icons/fa";

const PublicLessons = () => {
  const { user, isPremium } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    tone: "all",
    sortBy: "newest",
    page: 1,
    limit: 12,
  });

  const categories = [
    "All Categories",
    "Personal Growth",
    "Career",
    "Relationships",
    "Mindset",
    "Mistakes Learned",
    "Health & Wellness",
    "Financial",
    "Spiritual",
    "Other",
  ];

  const emotionalTones = [
    "All Tones",
    "Motivational",
    "Sad",
    "Realization",
    "Gratitude",
    "Inspirational",
    "Reflective",
    "Hopeful",
    "Challenging",
    "Transformative",
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most_liked", label: "Most Liked" },
    { value: "most_saved", label: "Most Saved" },
  ];

  useEffect(() => {
    fetchPublicLessons();
  }, [filters, user]);

  const fetchPublicLessons = async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
      };

      if (filters.search) params.search = filters.search;
      if (filters.category !== "all") params.category = filters.category;
      if (filters.tone !== "all") params.tone = filters.tone;

      const token = user ? await user.getIdToken() : null;
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/lessons/public`,
        { params, ...config }
      );

      setLessons(response.data.lessons);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setCurrentPage(response.data.pagination?.currentPage || 1);
    } catch (error) {
      console.error("Error fetching public lessons:", error);
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderLessonCard = (lesson) => {
    const isPremiumContent = lesson.accessLevel === "premium";
    const canViewPremium = isPremium || (user && lesson.authorUid === user.uid);

    if (isPremiumContent && !canViewPremium) {
      return (
        <div
          key={lesson._id}
          className="bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 rounded-xl shadow-xl overflow-hidden relative transform hover:scale-105 transition-transform duration-300"
        >
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div className="relative z-20 p-6 text-white text-center">
            <div className="mb-4">
              <FaLock className="text-4xl mx-auto mb-3 animate-pulse" />
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                Premium Content
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
            <p className="text-white/80 mb-4">
              This lesson is available to Premium members only
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              <FaStar className="mr-2" />
              Upgrade to Premium
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div
        key={lesson._id}
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300"
      >
        {lesson.image && (
          <img
            src={lesson.image}
            alt={lesson.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                {lesson.category}
              </span>
              {lesson.accessLevel === "premium" && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs flex items-center">
                  <FaStar className="mr-1" size={10} />
                  Premium
                </span>
              )}
            </div>
            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">
              {lesson.emotionalTone}
            </span>
          </div>

          <h3 className="text-xl font-bold mb-2 line-clamp-1">
            {lesson.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {lesson.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {lesson.author?.photoURL ? (
                <img
                  src={lesson.author.photoURL}
                  alt={lesson.author.displayName}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <FaUser className="text-gray-500" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium">
                  {lesson.author?.displayName}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(lesson.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-500">
              <span className="flex items-center">
                <FaHeart className="mr-1 text-pink-500" />
                {lesson.likesCount || 0}
              </span>
            </div>
          </div>

          <Link
            to={`/lessons/${lesson._id}`}
            className="block w-full text-center py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white rounded-lg hover:opacity-90 transition-opacity duration-300"
          >
            Read Lesson
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Public Lessons - Digital Life Lessons</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4">
        <div className="py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Public Lessons
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover wisdom, insights, and life lessons shared by our community
            members
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filters.tone}
                onChange={(e) => handleFilterChange("tone", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              >
                {emotionalTones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <p className="text-gray-600">
                Showing {lessons.length} lessons
                {filters.category !== "all" && ` in ${filters.category}`}
                {filters.tone !== "all" && ` with ${filters.tone} tone`}
              </p>
            </div>
            {user && !isPremium && (
              <div className="mt-2 md:mt-0">
                <Link
                  to="/pricing"
                  className="inline-flex items-center text-purple-600 hover:text-purple-500 transition-colors duration-300"
                >
                  <FaStar className="mr-2" />
                  Upgrade to Premium to view all content
                </Link>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <FaSearch className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No lessons found
            </h3>
            <p className="text-gray-500 mb-4">
              {filters.search ||
              filters.category !== "all" ||
              filters.tone !== "all"
                ? "Try adjusting your search or filters"
                : "Be the first to share a lesson!"}
            </p>
            {user && (
              <Link
                to="/dashboard/add-lesson"
                className="inline-flex items-center text-purple-600 hover:text-purple-500 font-medium transition-colors duration-300"
              >
                Share Your First Lesson →
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {lessons.map((lesson) => renderLessonCard(lesson))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mb-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors duration-300"
                >
                  <FaChevronLeft />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                          currentPage === page
                            ? "bg-purple-500 text-white"
                            : "border border-gray-300 hover:bg-purple-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors duration-300"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PublicLessons;
