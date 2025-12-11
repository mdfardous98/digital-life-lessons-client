import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  FaBook,
  FaHeart,
  FaPlus,
  FaChartLine,
  FaArrowRight,
  FaUser,
} from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalFavorites: 0,
    totalLikes: 0,
  });
  const [recentLessons, setRecentLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
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

      setRecentLessons(lessons.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryChartData = {
    labels: ["Personal Growth", "Career", "Relationships", "Mindset", "Others"],
    datasets: [
      {
        label: "Lessons by Category",
        data: [12, 8, 5, 7, 3],
        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
        ],
        borderWidth: 1,
      },
    ],
  };

  const weeklyChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Lessons Created",
        data: [2, 3, 1, 4, 2, 1, 0],
        backgroundColor: "#6366f1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gradient-to-r from-purple-500 to-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Digital Life Lessons</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.displayName}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your lessons today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Lessons</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalLessons}
              </p>
            </div>
            <div className="p-3 bg-indigo-200 rounded-lg">
              <FaBook className="text-2xl text-indigo-600" />
            </div>
          </div>
          <Link
            to="/dashboard/my-lessons"
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all lessons
            <FaArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-6 rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Favorites</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalFavorites}
              </p>
            </div>
            <div className="p-3 bg-pink-200 rounded-lg">
              <FaHeart className="text-2xl text-pink-600" />
            </div>
          </div>
          <Link
            to="/dashboard/favorites"
            className="mt-4 inline-flex items-center text-pink-600 hover:text-pink-800 transition-colors"
          >
            View favorites
            <FaArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Likes</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalLikes}
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <FaHeart className="text-2xl text-green-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">From all your lessons</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/add-lesson"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-lg hover:scale-[1.03] transition-all flex items-center justify-center"
          >
            <FaPlus className="mr-2" />
            Add New Lesson
          </Link>
          <Link
            to="/public-lessons"
            className="bg-white border border-gray-300 text-gray-700 p-4 rounded-lg hover:bg-gray-50 hover:scale-[1.03] transition-all flex items-center justify-center"
          >
            <FaBook className="mr-2" />
            Browse Public Lessons
          </Link>
          <Link
            to="/dashboard/profile"
            className="bg-white border border-gray-300 text-gray-700 p-4 rounded-lg hover:bg-gray-50 hover:scale-[1.03] transition-all flex items-center justify-center"
          >
            <FaUser className="mr-2" />
            Update Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Lessons
            </h2>
            <Link
              to="/dashboard/my-lessons"
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              View all
            </Link>
          </div>

          {recentLessons.length === 0 ? (
            <div className="text-center py-8">
              <FaBook className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No lessons created yet</p>
              <Link
                to="/dashboard/add-lesson"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Create your first lesson
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentLessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="border-b pb-4 last:border-0 last:pb-0 hover:bg-indigo-50 transition-colors rounded-lg px-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                          {lesson.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(lesson.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {lesson.likesCount || 0} likes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Weekly Activity
            </h2>
            <div className="h-64">
              <Bar data={weeklyChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Lessons by Category
            </h2>
            <div className="h-64">
              <Pie data={categoryChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
