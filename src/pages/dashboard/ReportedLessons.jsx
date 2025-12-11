import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaFlag,
  FaExclamationTriangle,
  FaEye,
  FaTrash,
  FaCheck,
  FaTimes,
  FaUser,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaExternalLinkAlt,
  FaEnvelope,
  FaChevronDown,
  FaChevronUp,
  FaCommentAlt,
} from "react-icons/fa";

const ReportedLessons = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedReport, setExpandedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/reports`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reported lessons");
    } finally {
      setLoading(false);
    }
  };

  const resolveReport = async (reportId, action) => {
    try {
      const token = await user.getIdToken();

      if (action === "delete") {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/admin/lessons/${reportId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Lesson deleted and report resolved");
      } else {
        toast.success("Report marked as resolved");
      }

      setReports(reports.filter((report) => report._id !== reportId));
    } catch (error) {
      console.error("Error resolving report:", error);
      toast.error("Failed to resolve report");
    }
  };

  const getReasonColor = (reason) => {
    const colors = {
      "Inappropriate Content": "bg-red-200 text-red-900",
      "Hate Speech or Harassment": "bg-red-200 text-red-900",
      "Misleading or False Information": "bg-yellow-200 text-yellow-900",
      "Spam or Promotional Content": "bg-orange-200 text-orange-900",
      "Sensitive or Disturbing Content": "bg-purple-200 text-purple-900",
      Other: "bg-gray-200 text-gray-900",
    };
    return colors[reason] || "bg-gray-200 text-gray-900";
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.lessonId?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "resolved" && report.resolved) ||
      (statusFilter === "pending" && !report.resolved);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reported Lessons - Digital Life Lessons</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-red-300 to-red-500 rounded-lg shadow-md">
              <FaFlag className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Reported Lessons
              </h1>
              <p className="text-gray-600">
                Review and take action on reported content
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">
                {filteredReports.length} reports found (
                {reports.filter((r) => !r.resolved).length} pending)
              </p>
            </div>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <FaFlag className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter"
                : "No reported lessons at the moment"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-300"
                  onClick={() =>
                    setExpandedReport(
                      expandedReport === report._id ? null : report._id
                    )
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getReasonColor(
                            report.reason
                          )}`}
                        >
                          {report.reason}
                        </span>
                        {report.resolved && (
                          <span className="px-3 py-1 bg-green-200 text-green-900 rounded-full text-xs font-medium">
                            Resolved
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {report.lessonId?.title || "Lesson not found"}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <FaUser className="mr-1" />
                          Reported by: {report.reporterEmail}
                        </span>
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {expandedReport === report._id ? (
                        <FaChevronUp className="text-gray-400" />
                      ) : (
                        <FaChevronDown className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedReport === report._id && (
                  <div className="px-6 pb-6 border-t pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Lesson Details
                        </h4>
                        {report.lessonId ? (
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-600">Title</p>
                              <p className="font-medium">
                                {report.lessonId.title}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Category</p>
                              <span className="inline-block px-2 py-1 bg-gray-200 text-gray-900 rounded text-xs">
                                {report.lessonId.category}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Author</p>
                              <p className="font-medium">
                                {report.lessonId.author?.displayName ||
                                  "Unknown"}
                              </p>
                            </div>
                            <a
                              href={`/lessons/${report.lessonId._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-500 text-sm transition-colors duration-300"
                            >
                              <FaExternalLinkAlt className="mr-1" />
                              View Lesson
                            </a>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Lesson has been deleted or not found
                          </p>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Report Details
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Reason</p>
                            <p className="font-medium">{report.reason}</p>
                          </div>
                          {report.message && (
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                Additional Message
                              </p>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-start space-x-2">
                                  <FaCommentAlt className="text-gray-400 mt-1 flex-shrink-0" />
                                  <p className="text-gray-700">
                                    {report.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              Reporter Info
                            </p>
                            <div className="flex items-center space-x-2">
                              <FaEnvelope className="text-gray-400" />
                              <span className="text-sm">
                                {report.reporterEmail}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!report.resolved && report.lessonId && (
                      <div className="mt-6 pt-6 border-t flex space-x-3">
                        <button
                          onClick={() =>
                            resolveReport(report.lessonId._id, "delete")
                          }
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                        >
                          <FaTrash className="mr-2" />
                          Delete Lesson & Resolve
                        </button>
                        <button
                          onClick={() => resolveReport(report._id, "ignore")}
                          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
                        >
                          <FaCheck className="mr-2" />
                          Mark as Resolved
                        </button>
                        <button
                          onClick={() => setExpandedReport(null)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                        >
                          <FaTimes className="mr-2 inline" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredReports.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm text-red-800">Total Reports</p>
              <p className="text-2xl font-bold text-red-900">
                {reports.length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm text-yellow-800">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-900">
                {reports.filter((r) => !r.resolved).length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm text-green-800">Resolved</p>
              <p className="text-2xl font-bold text-green-900">
                {reports.filter((r) => r.resolved).length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm text-purple-800">Most Common Reason</p>
              <p className="text-2xl font-bold text-purple-900">
                {reports.length > 0
                  ? reports.reduce((acc, report) => {
                      acc[report.reason] = (acc[report.reason] || 0) + 1;
                      return acc;
                    }, {}) &&
                    Object.entries(
                      reports.reduce((acc, report) => {
                        acc[report.reason] = (acc[report.reason] || 0) + 1;
                        return acc;
                      }, {})
                    )
                      .sort((a, b) => b[1] - a[1])[0][0]
                      .split(" ")[0]
                  : "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportedLessons;
