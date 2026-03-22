"use client"

import axios from "axios"

const api = axios.create({
  baseURL: typeof window !== "undefined" ? "/api" : "http://localhost:3000/api",
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
        if (!refreshToken) throw new Error("No refresh token");
        
        const res = await axios.post("/api/auth/refresh", { token: refreshToken });
        
        if (res.data.token) {
          if (typeof window !== "undefined") {
            localStorage.setItem("token", res.data.token);
          }
          api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
          originalRequest.headers["Authorization"] = `Bearer ${res.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api
