import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  FaUsers,
  FaBook,
  FaFlag,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaUserPlus,
  FaBookOpen,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLessons: 0,
    totalReports: 0,
    totalPremiumUsers: 0,
    newUsersToday: 0,
    newLessonsToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();

      const usersResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const lessonsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/lessons`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const reportsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/reports`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const users = usersResponse.data;
      const lessons = lessonsResponse.data;
      const reports = reportsResponse.data;

      const today = new Date().toDateString();
      const newUsersToday = users.filter(
        (u) => new Date(u.createdAt).toDateString() === today
      ).length;

      const newLessonsToday = lessons.filter(
        (l) => new Date(l.createdAt).toDateString() === today
      ).length;

      setStats({
        totalUsers: users.length,
        totalLessons: lessons.length,
        totalReports: reports.length,
        totalPremiumUsers: users.filter((u) => u.isPremium).length,
        newUsersToday,
        newLessonsToday,
      });

      const activities = [
        ...users.slice(0, 3).map((u) => ({
          type: "user",
          title: `${u.displayName} joined`,
          time: u.createdAt,
          icon: <FaUserPlus className="text-blue-500" />,
        })),
        ...lessons.slice(0, 3).map((l) => ({
          type: "lesson",
          title: `New lesson: ${l.title}`,
          time: l.createdAt,
          icon: <FaBookOpen className="text-green-500" />,
        })),
        ...reports.slice(0, 3).map((r) => ({
          type: "report",
          title: `Lesson reported`,
          time: r.createdAt,
          icon: <FaExclamationTriangle className="text-red-500" />,
        })),
      ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 8);

      setRecentActivities(activities);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const userGrowthData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "New Users",
        data: [65, 78, 90, 81, 86, 92, 105, 110, 95, 120, 115, 130],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryDistributionData = {
    labels: ["Personal Growth", "Career", "Relationships", "Mindset", "Other"],
    datasets: [
      {
        label: "Lessons",
        data: [120, 85, 60, 45, 30],
        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#4b5563" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#4b5563" },
      },
      x: {
        ticks: { color: "#4b5563" },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Digital Life Lessons</title>
      </Helmet>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md">
            <FaChartLine className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-700">
              Overview of platform statistics and activities
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
                <p className="text-sm text-green-600 flex items-center">
                  <FaArrowUp className="mr-1" />
                  {stats.newUsersToday} today
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUsers className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Lessons</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalLessons}
                </p>
                <p className="text-sm text-green-600 flex items-center">
                  <FaArrowUp className="mr-1" />
                  {stats.newLessonsToday} today
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaBook className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalReports}
                </p>
                <p className="text-sm text-red-600 flex items-center">
                  <FaArrowUp className="mr-1" />
                  Needs attention
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FaFlag className="text-2xl text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Premium Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalPremiumUsers}
                </p>
                <p className="text-sm text-yellow-600">
                  {(
                    (stats.totalPremiumUsers / stats.totalUsers) * 100 || 0
                  ).toFixed(1)}
                  % of total
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaChartLine className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/dashboard/admin/manage-users"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUsers className="text-xl text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-500">
                  View and manage all users
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard/admin/manage-lessons"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaBook className="text-xl text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Lessons</h3>
                <p className="text-sm text-gray-500">
                  Review and moderate lessons
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard/admin/reported-lessons"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FaFlag className="text-xl text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Reported Lessons
                </h3>
                <p className="text-sm text-gray-500">Review reported content</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                User Growth (2024)
              </h2>
              <div className="h-64">
                <Line data={userGrowthData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Lesson Categories
              </h2>
              <div className="h-64">
                <Bar data={categoryDistributionData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Activity
              </h2>
              <button
                onClick={fetchAdminData}
                className="text-sm text-purple-500 hover:text-purple-600 transition-colors"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent activities</p>
                </div>
              ) : (
                recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.time).toLocaleDateString()} at{" "}
                        {new Date(activity.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Server</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    72% used
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
