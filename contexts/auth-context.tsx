"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type LoginCredentials } from "@/lib/api/auth";
import { useSchool } from "@/contexts/school-context";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setSchool, clearSchool } = useSchool();

  // Load user on first render
  useEffect(() => {
    const userCookie = getCookie("user");

    if (userCookie && typeof userCookie === "string") {
      try {
        setUser(JSON.parse(userCookie));
      } catch (err) {
        console.error("Failed to parse user cookie:", err);
      }
    }

    const schoolCookie = getCookie("school");
    if (schoolCookie && typeof schoolCookie === "string") {
      try {
        const parsedSchool = JSON.parse(schoolCookie);
        setSchool({ id: parsedSchool.id, name: parsedSchool.name });
      } catch (err) {
        console.error("Failed to parse school cookie:", err);
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const { user, school } = await response.json();

      // Store user cookie
      setCookie("user", JSON.stringify(user), {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Store school cookie if exists
      if (school) {
        setCookie("school", JSON.stringify(school), {
          maxAge: 60 * 60 * 24 * 7,
        });
        setSchool({ id: school.id, name: school.name });
      }

      // Update UI state
      setUser(user);

      // Redirect by role
      if (user.role === "super admin") {
        router.push("/super-admin");
      } else if (["school owner", "admin"].includes(user.role)) {
        if (!school && user.role === "admin") {
          router.push("/setup-school-profile");
        } else {
          router.push("/admin");
        }
      } else if (user.role === "head teacher") {
        router.push("/head-teacher");
      } else {
        router.push(`/${user.role}`);
      }

      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
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

      await fetch("/api/auth/logout", { method: "POST" });

      deleteCookie("user");
      deleteCookie("school");

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
