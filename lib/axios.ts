// lib/axios.ts
import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  const token = getCookie("accessToken");
  if (!token) return null;
  return typeof token === "string" ? token.replace(/^Bearer\s+/i, "") : token;
}

export const axiosInstance = axios.create({
  baseURL: API_URL,
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
  return config;
});

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie("accessToken");
      deleteCookie("user");
      deleteCookie("school");

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
