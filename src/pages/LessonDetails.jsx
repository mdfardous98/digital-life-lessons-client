import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaBookmark,
  FaEye,
  FaShareAlt,
  FaFlag,
  FaUser,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaClock,
  FaLock,
  FaUnlock,
  FaComment,
  FaThumbsUp,
  FaThumbsDown,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaCopy,
  FaCrown,
} from "react-icons/fa";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";

const LessonDetails = () => {
  const { id } = useParams();
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [similarLessons, setSimilarLessons] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportMessage, setReportMessage] = useState("");

  useEffect(() => {
    fetchLessonDetails();
  }, [id, user]);

  const fetchLessonDetails = async () => {
    setLoading(true);

    try {
      const token = user ? await user.getIdToken() : null;
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      // Fetch lesson
      const lessonResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/lessons/${id}`,
        config
      );
      setLesson(lessonResponse.data);

      // Check if user liked
      if (user) {
        const likes = lessonResponse.data.likes || [];
        setIsLiked(likes.includes(user.uid));
      }

      // Fetch comments
      const commentsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/lessons/${id}/comments`
      );
      setComments(commentsResponse.data);

      // Fetch similar lessons
      const similarResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/lessons/public?category=${
          lessonResponse.data.category
        }&limit=6`
      );
      setSimilarLessons(
        similarResponse.data.lessons.filter((l) => l._id !== id).slice(0, 6)
      );
    } catch (error) {
      console.error("Error fetching lesson details:", error);
      toast.error("Failed to load lesson");
      navigate("/public-lessons");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like this lesson");
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/lessons/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsLiked(!isLiked);
      setLesson((prev) => ({
        ...prev,
        likesCount: response.data.likesCount,
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error("Please login to save this lesson");
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/lessons/${id}/favorite`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsFavorited(response.data.favorited);
      toast.success(
        response.data.favorited
          ? "Added to favorites"
          : "Removed from favorites"
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/lessons/${id}/comments`,
        { commentText: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments([response.data, ...comments]);
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/lessons/${id}/report`,
        { reason: reportReason, message: reportMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowReportModal(false);
      setReportReason("");
      setReportMessage("");
      toast.success("Thank you for reporting. We will review this lesson.");
    } catch (error) {
      console.error("Error reporting lesson:", error);
      toast.error("Failed to submit report");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this lesson? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/lessons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Lesson deleted successfully");
      navigate("/dashboard/my-lessons");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Lesson not found
        </h1>
        <p className="text-gray-600 mb-6">
          The lesson you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/public-lessons"
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
        >
          Browse Public Lessons →
        </Link>
      </div>
    );
  }

  const isOwner = user && lesson.authorUid === user.uid;
  const isAdmin = user?.role === "admin";
  const canViewPremium = isPremium || isOwner || isAdmin;
  const isPremiumContent = lesson.accessLevel === "premium" && !canViewPremium;

  return (
    <>
      <Helmet>
        <title>{lesson.title} - Digital Life Lessons</title>
        <meta name="description" content={lesson.description} />
      </Helmet>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Report Lesson
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please tell us why you're reporting this lesson:
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason *
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="Inappropriate Content">
                    Inappropriate Content
                  </option>
                  <option value="Hate Speech or Harassment">
                    Hate Speech or Harassment
                  </option>
                  <option value="Misleading or False Information">
                    Misleading or False Information
                  </option>
                  <option value="Spam or Promotional Content">
                    Spam or Promotional Content
                  </option>
                  <option value="Sensitive or Disturbing Content">
                    Sensitive or Disturbing Content
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Message (Optional)
                </label>
                <textarea
                  value={reportMessage}
                  onChange={(e) => setReportMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Please provide more details..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Premium Content Warning */}
        {isPremiumContent && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <FaLock className="text-2xl" />
              <h2 className="text-xl font-bold">Premium Content</h2>
            </div>
            <p className="mb-4">
              This lesson is only available to Premium members.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center px-6 py-3 bg-white text-yellow-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <FaCrown className="mr-2" />
              Upgrade to Premium
            </Link>
          </div>
        )}

        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {lesson.category}
                </span>
                <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                  {lesson.emotionalTone}
                </span>
                {lesson.accessLevel === "premium" && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center">
                    <FaCrown className="mr-1" size={12} />
                    Premium
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {isPremiumContent ? "[Premium Content]" : lesson.title}
              </h1>
            </div>
            {(isOwner || isAdmin) && (
              <div className="flex space-x-2">
                {isOwner && (
                  <Link
                    to={`/dashboard/update-lesson/${id}`}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </Link>
                )}
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {lesson.image && !isPremiumContent && (
            <img
              src={lesson.image}
              alt={lesson.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl mb-6"
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lesson Content */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Lesson Details
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">
                  {isPremiumContent
                    ? "This lesson is available to Premium members only. Upgrade to Premium to read the full content."
                    : lesson.description}
                </p>
              </div>
            </div>

            {/* Stats & Engagement */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Stats & Engagement
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 p-2 rounded-lg ${
                      isLiked
                        ? "text-red-600 bg-red-50"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <FaHeart className={isLiked ? "fill-current" : ""} />
                    <span>{lesson.likesCount || 0}</span>
                  </button>
                  <button
                    onClick={handleFavorite}
                    className={`flex items-center space-x-2 p-2 rounded-lg ${
                      isFavorited
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <FaBookmark className={isFavorited ? "fill-current" : ""} />
                  </button>
                  {!isOwner && user && (
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FaFlag />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor(Math.random() * 10000)}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Likes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {lesson.likesCount || 0}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Favorites</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor(Math.random() * 500)}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Reading Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.ceil(lesson.description.length / 200)} min
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Comments ({comments.length})
              </h2>

              {/* Add Comment */}
              {user && (
                <div className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-3"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Post Comment
                  </button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="border-b pb-4 last:border-0"
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={
                            comment.userId?.photoURL ||
                            `https://ui-avatars.com/api/?name=${comment.userId?.displayName}`
                          }
                          alt={comment.userId?.displayName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">
                              {comment.userId?.displayName}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1">
                            {comment.commentText}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Author
              </h3>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={
                    lesson.author?.photoURL ||
                    `https://ui-avatars.com/api/?name=${lesson.author?.displayName}`
                  }
                  alt={lesson.author?.displayName}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-bold text-gray-900">
                    {lesson.author?.displayName}
                  </h4>
                  <p className="text-sm text-gray-600">Creator</p>
                </div>
              </div>
              <Link
                to={`/public-lessons?author=${lesson.author?.displayName}`}
                className="block w-full text-center py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                View All Lessons
              </Link>
            </div>

            {/* Lesson Metadata */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Lesson Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium">
                      {new Date(lesson.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Updated</p>
                    <p className="font-medium">
                      {new Date(lesson.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {lesson.visibility === "public" ? (
                    <FaEye className="text-green-500" />
                  ) : (
                    <FaEyeSlash className="text-gray-500" />
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Visibility</p>
                    <p className="font-medium capitalize">
                      {lesson.visibility}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {lesson.accessLevel === "premium" ? (
                    <FaLock className="text-yellow-500" />
                  ) : (
                    <FaUnlock className="text-green-500" />
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Access Level</p>
                    <p className="font-medium capitalize">
                      {lesson.accessLevel}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Share
              </h3>
              <div className="flex space-x-2 mb-3">
                <TwitterShareButton
                  url={window.location.href}
                  title={lesson.title}
                  className="flex-1"
                >
                  <div className="flex items-center justify-center space-x-2 p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                    <FaTwitter />
                    <span>Tweet</span>
                  </div>
                </TwitterShareButton>
                <FacebookShareButton
                  url={window.location.href}
                  quote={lesson.title}
                  className="flex-1"
                >
                  <div className="flex items-center justify-center space-x-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <FaFacebook />
                    <span>Share</span>
                  </div>
                </FacebookShareButton>
              </div>
              <div className="flex space-x-2">
                <LinkedinShareButton
                  url={window.location.href}
                  title={lesson.title}
                  summary={lesson.description}
                  className="flex-1"
                >
                  <div className="flex items-center justify-center space-x-2 p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                    <FaLinkedin />
                    <span>Share</span>
                  </div>
                </LinkedinShareButton>
                <button
                  onClick={copyLink}
                  className="flex-1 flex items-center justify-center space-x-2 p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FaCopy />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Similar Lessons */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Similar Lessons
              </h3>
              <div className="space-y-4">
                {similarLessons.length === 0 ? (
                  <p className="text-gray-500 text-center py-2">
                    No similar lessons found
                  </p>
                ) : (
                  similarLessons.map((similar) => (
                    <Link
                      key={similar._id}
                      to={`/lessons/${similar._id}`}
                      className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 line-clamp-1">
                        {similar.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-600">
                          {similar.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.floor(Math.random() * 1000)} views
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonDetails;
