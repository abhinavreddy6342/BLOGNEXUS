import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("blognexus_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* =========================
   AUTH
========================= */

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const getCurrentUser = () =>
  api.get("/auth/me");

/* =========================
   POSTS
========================= */

export const getPosts = (params = {}) =>
  api.get("/posts", { params });

export const getPost = (postId) =>
  api.get(`/posts/${postId}`);

export const createPost = (data) =>
  api.post("/posts", data);

export const updatePost = (postId, data) =>
  api.put(`/posts/${postId}`, data);

export const deletePost = (postId) =>
  api.delete(`/posts/${postId}`);

/* =========================
   COMMENTS
========================= */

export const getComments = (postId) =>
  api.get(`/posts/${postId}/comments`);

export const createComment = (postId, data) =>
  api.post(`/posts/${postId}/comments`, data);

export const updateComment = (commentId, data) =>
  api.put(`/comments/${commentId}`, data);

export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`);

/* =========================
   USERS
========================= */

export const getMyProfile = () =>
  api.get("/users/me");

export const getUserProfile = (userId) =>
  api.get(`/users/${userId}`);

export const updateMyProfile = (data) =>
  api.put("/users/me", data);

/* =========================
   LIKES
========================= */

export const likePost = (postId) =>
  api.post(`/posts/${postId}/like`);

export const unlikePost = (postId) =>
  api.delete(`/posts/${postId}/like`);

export const getPostLikes = (postId) =>
  api.get(`/posts/${postId}/likes`);

/* =========================
   BOOKMARKS
========================= */

export const bookmarkPost = (postId) =>
  api.post(`/posts/${postId}/bookmark`);

export const removeBookmark = (postId) =>
  api.delete(`/posts/${postId}/bookmark`);

export const getMyBookmarks = () =>
  api.get("/bookmarks");

/* =========================
   CATEGORIES
========================= */

export const getCategories = () =>
  api.get("/categories");

export const createCategory = (data) =>
  api.post("/categories", data);

export const getCategory = (categoryId) =>
  api.get(`/categories/${categoryId}`);

export default api;