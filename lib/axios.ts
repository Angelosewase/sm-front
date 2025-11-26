// lib/axios.ts
import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAccessToken() {
  const token = await getCookie("accessToken");
  if (!token) return null;
  return token.replace(/^Bearer\s+/i, "");
}

export const axiosInstance = axios.create({
  baseURL: "http://138.197.93.9:7000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
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
