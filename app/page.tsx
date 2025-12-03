"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useSchool } from "@/contexts/school-context";

function getRolePath(role: string) {
  if (!role) {
    return "/login";
  }

  if (role === "super admin") {
    return "/super-admin";
  }
  if (role === "school owner") {
    return "/admin";
  }

  const normalizedRole = role.toLowerCase().replace(/\s+/g, "-");
  return `/${normalizedRole}`;
}

export default function Home() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { school } = useSchool();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    if (user.role === "admin" && !school) {
      router.push("/setup-school-profile");
      return;
    }

    // Super admin doesn't need school association
    if (user.role === "super admin") {
      router.push("/super-admin");
      return;
    }

    router.push(getRolePath(user.role));
  }, [user, isLoading, isAuthenticated, school, router]);

  return null;
}