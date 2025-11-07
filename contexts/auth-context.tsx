'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, LoginCredentials, LoginResponse } from '@/lib/api/auth';
import { setAuthCookie, setUserCookie, clearAuthCookies, setSchoolCookie } from '@/lib/actions/auth';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  userSchool: UserSchool | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}
interface UserSchool {
  id: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get cookie value on client
function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userSchool, setUserSchool] = useState<UserSchool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount from cookie
    const userCookie = getCookie('user');
    const schoolCookie = getCookie('school');

    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
    if (schoolCookie) {
      try {
        setUserSchool(JSON.parse(schoolCookie));
      } catch (error) {
        console.error('Failed to parse school data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response: LoginResponse = await authApi.login(credentials);

    // Store token and user data in cookies via server action
    await setAuthCookie(response.accessToken);
    await setUserCookie(response.user);
    await setSchoolCookie(response.school);
    
    setUser(response.user);
    setUserSchool(response.school);
    if (response.user.role == 'head teacher') {
      router.push('head-teacher')
    } else {
      router.push(`/${response.user.role}`);
    }

    router.refresh(); // Refresh to update middleware
  };

  const logout = async () => {
    await clearAuthCookies();
    setUser(null);
    router.push('/login');
    router.refresh(); // Refresh to update middleware
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userSchool,
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
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
