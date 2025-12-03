"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useSchool } from "@/contexts/school-context";

interface RoleProtectorProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function RoleProtector({ 
  children, 
  allowedRoles, 
  redirectTo 
}: RoleProtectorProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { school } = useSchool();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    // Check if user's role is allowed
    const userRole = user.role;
    const isAllowed = allowedRoles.includes(userRole);

    if (!isAllowed) {
      // Determine redirect path based on user role
      const getRedirectPath = () => {
        if (redirectTo) return redirectTo;
        
        if (userRole === "super admin") return "/super-admin";
        if (userRole === "school owner") return "/admin";
        if (userRole === "admin") {
          return school ? "/admin" : "/setup-school-profile";
        }
        if (userRole === "head teacher") return "/head-teacher";
        
        const normalizedRole = userRole.toLowerCase().replace(/\s+/g, "-");
        return `/${normalizedRole}`;
      };

      router.replace(getRedirectPath());
      return;
    }

    // Special check for admin role - needs school (except for setup-school-profile page)
    // This check is handled by AdminProtector component, not here
  }, [user, isAuthenticated, isLoading, allowedRoles, redirectTo, router, school]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated or role not allowed, show nothing (redirect is happening)
  if (!isAuthenticated || !user) {
    return null;
  }

  const userRole = user.role;
  const isAllowed = allowedRoles.includes(userRole);

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}

// Specific role protectors for convenience
export function SuperAdminProtector({ children }: { children: React.ReactNode }) {
  return <RoleProtector allowedRoles={["super admin"]}>{children}</RoleProtector>;
}

export function AdminProtector({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { school } = useSchool();
  const router = useRouter();

  useEffect(() => {
    // If admin doesn't have school, redirect to setup page
    if (user?.role === "admin" && !school) {
      router.replace("/setup-school-profile");
    }
  }, [user, school, router]);

  return (
    <RoleProtector allowedRoles={["admin", "school owner"]}>
      {children}
    </RoleProtector>
  );
}

export function HeadTeacherProtector({ children }: { children: React.ReactNode }) {
  return <RoleProtector allowedRoles={["head teacher"]}>{children}</RoleProtector>;
}

export function TeacherProtector({ children }: { children: React.ReactNode }) {
  return <RoleProtector allowedRoles={["teacher"]}>{children}</RoleProtector>;
}

export function StudentProtector({ children }: { children: React.ReactNode }) {
  return <RoleProtector allowedRoles={["student"]}>{children}</RoleProtector>;
}

