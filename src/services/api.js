import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request to add auth token
api.interceptors.request.use(
  async (config) => {
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//  error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  sync: (data, token) =>
    api.post("/api/auth/sync", data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  register: (data, token) =>
    api.post("/api/auth/register", data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getCurrentUser: (token) =>
    api.get("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Lessons API
export const lessonsAPI = {
  createLesson: (data, token) =>
    api.post("/api/lessons", data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateLesson: (id, data, token) =>
    api.put(`/api/lessons/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  deleteLesson: (id, token) =>
    api.delete(`/api/lessons/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getMyLessons: (token) =>
    api.get("/api/lessons/mine", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getPublicLessons: (params) => api.get("/api/lessons/public", { params }),
  getLessonById: (id, token) => {
    const headers = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return api.get(`/api/lessons/${id}`, headers);
  },
  toggleLike: (id, token) =>
    api.post(
      `/api/lessons/${id}/like`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),
  toggleFavorite: (id, token) =>
    api.post(
      `/api/lessons/${id}/favorite`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),
  reportLesson: (id, data, token) =>
    api.post(`/api/lessons/${id}/report`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getComments: (id) => api.get(`/api/lessons/${id}/comments`),
  addComment: (id, data, token) =>
    api.post(`/api/lessons/${id}/comments`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Favorites API
export const favoritesAPI = {
  getFavorites: (token) =>
    api.get("/api/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Admin API
export const adminAPI = {
  getUsers: (token) =>
    api.get("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getLessons: (token) =>
    api.get("/api/admin/lessons", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getReports: (token) =>
    api.get("/api/admin/reports", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  deleteLessonAdmin: (id, token) =>
    api.delete(`/api/admin/lessons/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Stripe API
export const stripeAPI = {
  createCheckoutSession: (token) =>
    api.post(
      "/api/create-checkout-session",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),
};

export default api;
