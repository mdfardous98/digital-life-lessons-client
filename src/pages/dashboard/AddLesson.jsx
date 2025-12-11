import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus, FaUpload, FaInfoCircle } from "react-icons/fa";

const AddLesson = () => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      toast.error("Upgrade to Premium to create premium lessons");
      return;
    }

    setLoading(true);

    try {
      const token = await user.getIdToken();
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/lessons`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(data?.message || "Lesson created successfully!");
      navigate("/dashboard/my-lessons");
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error(error.response?.data?.message || "Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Lesson - Digital Life Lessons</title>
      </Helmet>

      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-indigo-50 via-white to-pink-50 rounded-xl shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gradient-to-r from-purple-600 via-pink-500 to-red-500 mb-2 animate-gradient-x">
            Create New Lesson
          </h1>
          <p className="text-gray-700 dark:text-gray-200">
            Share your wisdom and experiences with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
            >
              Lesson Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:scale-[1.01]"
              placeholder="Enter lesson title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
            >
              Description / Story / Insight *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:scale-[1.01]"
              placeholder="Share your story, lesson learned, or insight..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:scale-[1.01]"
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
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
              >
                Emotional Tone *
              </label>
              <select
                id="emotionalTone"
                name="emotionalTone"
                value={formData.emotionalTone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:scale-[1.01]"
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
              className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
            >
              Image URL (Optional)
            </label>
            <div className="flex items-center space-x-2">
              <FaUpload className="text-purple-400" />
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:scale-[1.01]"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="visibility"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
              >
                Visibility
              </label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:scale-[1.01]"
              >
                <option value="private">Private (Only you can see)</option>
                <option value="public">Public (Everyone can see)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="accessLevel"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
              >
                Access Level
              </label>
              <select
                id="accessLevel"
                name="accessLevel"
                value={formData.accessLevel}
                onChange={handleChange}
                disabled={!isPremium}
                className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:scale-[1.01] ${
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

          <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/dashboard/my-lessons")}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-purple-50 transition-transform transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <FaPlus className="mr-2" />
              {loading ? "Creating..." : "Create Lesson"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddLesson;
