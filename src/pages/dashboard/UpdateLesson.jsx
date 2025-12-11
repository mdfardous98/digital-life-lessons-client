import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { FaSave, FaArrowLeft, FaInfoCircle } from "react-icons/fa";

const UpdateLesson = () => {
  const { id } = useParams();
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Personal Growth",
    emotionalTone: "Motivational",
    image: "",
    visibility: "private",
    accessLevel: "free",
  });

  const categories = [
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

  useEffect(() => {
    fetchLesson();
  }, [id, user]);

  const fetchLesson = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/lessons/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const lesson = response.data;
      setFormData({
        title: lesson.title,
        description: lesson.description,
        category: lesson.category,
        emotionalTone: lesson.emotionalTone,
        image: lesson.image || "",
        visibility: lesson.visibility,
        accessLevel: lesson.accessLevel,
      });
    } catch (error) {
      console.error("Error fetching lesson:", error);
      toast.error("Failed to load lesson");
      navigate("/dashboard/my-lessons");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.emotionalTone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.accessLevel === "premium" && !isPremium) {
      toast.error("Upgrade to Premium to set premium access");
      return;
    }

    setSaving(true);

    try {
      const token = await user.getIdToken();
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/lessons/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Lesson updated successfully!");
      navigate("/dashboard/my-lessons");
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error(error.response?.data?.message || "Failed to update lesson");
    } finally {
      setSaving(false);
    }
  };

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
        <title>Update Lesson - Digital Life Lessons</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard/my-lessons")}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to My Lessons
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Update Lesson
          </h1>
          <p className="text-gray-600">Edit and update your life lesson</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lesson Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              placeholder="Enter lesson title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description / Story / Insight *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              placeholder="Share your story, lesson learned, or insight..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="emotionalTone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Emotional Tone *
              </label>
              <select
                id="emotionalTone"
                name="emotionalTone"
                value={formData.emotionalTone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                required
              >
                {emotionalTones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="max-w-xs h-auto rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="visibility"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Visibility
              </label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              >
                <option value="private">Private (Only you can see)</option>
                <option value="public">Public (Everyone can see)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="accessLevel"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Access Level
              </label>
              <select
                id="accessLevel"
                name="accessLevel"
                value={formData.accessLevel}
                onChange={handleChange}
                disabled={!isPremium}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 ${
                  !isPremium
                    ? "bg-gray-100 cursor-not-allowed"
                    : "border-gray-300"
                }`}
              >
                <option value="free">Free (Everyone can view)</option>
                <option value="premium">Premium (Premium users only)</option>
              </select>
              {!isPremium && (
                <p className="mt-1 text-sm text-yellow-600 flex items-center">
                  <FaInfoCircle className="mr-1" />
                  Upgrade to Premium to create premium lessons
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/dashboard/my-lessons")}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FaSave className="mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateLesson;
