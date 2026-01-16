"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type LoginCredentials } from "@/lib/api/auth";
import { useSchool } from "@/contexts/school-context";
import { storage } from "@/lib/storage";
import { axiosInstance } from "@/lib/axios";

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "sm-user";
const TOKEN_STORAGE_KEY = "sm-accessToken";
const SCHOOL_STORAGE_KEY = "sm-school";

// Helper function to get the appropriate portal route based on user role
function getRolePortalPath(role: string, hasSchool: boolean): string {
  if (role === "super admin") {
    return "/super-admin";
  }
  
  if (role === "school owner") {
    return "/admin";
  }
  
  if (role === "admin") {
    // Admin needs school profile setup if no school
    return hasSchool ? "/admin" : "/setup-school-profile";
  }
  
  if (role === "head teacher") {
    return "/head-teacher";
  }
  
  // For other roles (teacher, student, etc.), normalize the role name
  const normalizedRole = role.toLowerCase().replace(/\s+/g, "-");
  return `/${normalizedRole}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setSchool, clearSchool } = useSchool();

  // Load user on first render
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    try {
      const storedUser = storage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }

      const storedSchool = storage.getItem(SCHOOL_STORAGE_KEY);
      if (storedSchool) {
        const parsedSchool = JSON.parse(storedSchool);
        setSchool({ id: parsedSchool.id, name: parsedSchool.name });
      }
    } catch (err) {
      console.error("Failed to parse stored data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [setSchool]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.post("/api/auth/login", credentials);
      const { user, school, accessToken } = response.data;

      // Store user and token in localStorage (encrypted)
      if (typeof window !== "undefined") {
        storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        if (accessToken) {
          storage.setItem(TOKEN_STORAGE_KEY, accessToken);
        }
      }

      // Store school if exists
      if (school) {
        setSchool({ id: school.id, name: school.name });
      }

      // Update UI state
      setUser(user);

      // Determine the appropriate portal path based on role and school status
      const portalPath = getRolePortalPath(user.role, !!school);
      
      // Use replace instead of push to avoid adding login to browser history
      router.replace(portalPath);
      router.refresh();
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Login failed";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------
  // LOGOUT
  // -----------------------
  const logout = async () => {
    try {
      setIsLoading(true);

      // Clear localStorage (no server-side logout needed)
      if (typeof window !== "undefined") {
        storage.removeItem(USER_STORAGE_KEY);
        storage.removeItem(TOKEN_STORAGE_KEY);
        storage.removeItem(SCHOOL_STORAGE_KEY);
      }

      setUser(null);
      clearSchool();

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
