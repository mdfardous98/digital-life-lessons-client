import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { FaHeart, FaTimes, FaSearch, FaFilter, FaUser } from "react-icons/fa";

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/favorites`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const favoritesData = response.data;
      setFavorites(favoritesData);
      const uniqueCategories = [
        ...new Set(favoritesData.map((f) => f.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (lessonId) => {
    try {
      const token = await user.getIdToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/lessons/${lessonId}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Removed from favorites");
      setFavorites(favorites.filter((fav) => fav._id !== lessonId));
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  const filteredFavorites = favorites.filter((fav) => {
    const matchesSearch =
      fav.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fav.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || fav.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gradient-to-r from-pink-500 to-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Favorites - Digital Life Lessons</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-red-200 to-red-100 rounded-lg">
            <FaHeart className="text-2xl text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-gray-600">
              All the lessons you've saved for later
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-right text-gray-600">
              Showing {filteredFavorites.length} of {favorites.length} favorites
            </div>
          </div>
        </div>

        {filteredFavorites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow hover:shadow-lg transition-shadow">
            <FaHeart className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory !== "all"
                ? "No matching favorites found"
                : "No favorites yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter"
                : "Start by exploring public lessons and saving your favorites"}
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <Link
                to="/public-lessons"
                className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
              >
                Browse Public Lessons →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((fav) => (
              <div
                key={fav._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow hover:scale-[1.02] duration-300"
              >
                {fav.image && (
                  <img
                    src={fav.image}
                    alt={fav.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {fav.category || "General"}
                    </span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                      {fav.emotionalTone || "Neutral"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{fav.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {fav.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {fav.author?.photoURL ? (
                        <img
                          src={fav.author.photoURL}
                          alt={fav.author.displayName}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <FaUser className="text-gray-600" />
                        </div>
                      )}
                      <span className="text-sm text-gray-600">
                        {fav.author?.displayName || "Anonymous"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <FaHeart className="text-red-500" />
                      <span className="text-sm">{fav.likesCount || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/lessons/${fav._id}`}
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Read More →
                    </Link>
                    <button
                      onClick={() => removeFromFavorites(fav._id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Remove from favorites"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredFavorites.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-800">Total Favorites</p>
              <p className="text-2xl font-bold text-red-900">
                {filteredFavorites.length}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">Unique Authors</p>
              <p className="text-2xl font-bold text-blue-900">
                {
                  [...new Set(filteredFavorites.map((f) => f.author?._id))]
                    .length
                }
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">Categories</p>
              <p className="text-2xl font-bold text-green-900">
                {[...new Set(filteredFavorites.map((f) => f.category))].length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-800">Last Added</p>
              <p className="text-2xl font-bold text-purple-900">
                {filteredFavorites.length > 0
                  ? new Date(
                      Math.max(
                        ...filteredFavorites.map((f) => new Date(f.createdAt))
                      )
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Favorites;
