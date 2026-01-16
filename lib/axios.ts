// lib/axios.ts
import axios from "axios";
import { storage } from "./storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_STORAGE_KEY = "sm-accessToken";
const USER_STORAGE_KEY = "sm-user";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  const token = storage.getItem(TOKEN_STORAGE_KEY);
  if (!token) return null;
  return token.replace(/^Bearer\s+/i, "");
}

function getUser() {
  if (typeof window === "undefined") return null;
  const userStr = storage.getItem(USER_STORAGE_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://138.197.93.9:7000";
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add user info to header for middleware
  const user = getUser();
  if (user) {
    config.headers["x-user-info"] = JSON.stringify(user);
  }
  
  return config;
});

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear localStorage
      if (typeof window !== "undefined") {
        storage.removeItem(TOKEN_STORAGE_KEY);
        storage.removeItem("sm-user");
        storage.removeItem("sm-school");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
