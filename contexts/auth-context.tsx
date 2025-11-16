"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  authApi,
  type AuthUserSchool,
  type LoginCredentials,
  type LoginResponse,
} from "@/lib/api/auth";
import {
  setAuthCookie,
  setUserCookie,
  clearAuthCookies,
} from "@/lib/actions/auth";
import { School, useSchool } from "@/contexts/school-context";

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
  // refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get cookie value on client
function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setSchool, clearSchool } = useSchool();

  useEffect(() => {
    // Check if user is logged in on mount from cookie
    const userCookie = getCookie("user");

    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const normalizeSchool = (school: AuthUserSchool | null): School | null =>
    school ? { id: school.id, name: school.name } : null;

  const applyAuthState = async (payload: {
    user: User;
    school: AuthUserSchool | null;
    accessToken?: string;
  }) => {
    if (payload.accessToken) {
      const normalizedToken = payload.accessToken.replace(/^Bearer\s+/i, "");
      await setAuthCookie(normalizedToken);
    }
    await setUserCookie(payload.user);
    setUser(payload.user);
    setSchool(normalizeSchool(payload.school));
  };

  // const refreshUser = async () => {
  //   try {
  //     const response = await authApi.getProfile();
  //     await applyAuthState({
  //       user: response.user,
  //       school: response.school ?? null,
  //     });
  //   } catch (error) {
  //     console.error('Failed to refresh user profile:', error);
  //   }
  // };

  const login = async (credentials: LoginCredentials) => {
    const response: LoginResponse = await authApi.login(credentials);
    const userSchoolData = response.school ?? null;

    if (!userSchoolData && response.user.role !== "admin") {
      await clearAuthCookies();
      setUser(null);
      clearSchool();
      throw new Error(
        "Your account is not associated with a school. Please contact your administrator."
      );
    }

    await applyAuthState({
      user: response.user,
      school: userSchoolData,
      accessToken: response.accessToken,
    });

    if (!userSchoolData && response.user.role === "admin") {
      router.push("/setup-school-profile");
    } else if (response.user.role === "head teacher") {
      router.push("/head-teacher");
    } else {
      router.push(`/${response.user.role}`);
    }

    router.refresh(); // Refresh to update middleware
  };

  const logout = async () => {
    await clearAuthCookies();
    setUser(null);
    clearSchool();
    router.push("/login");
    router.refresh(); // Refresh to update middleware
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        // refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
