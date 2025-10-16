"use client";

import { useAuth } from "@/contexts/auth-context";
import { BellIcon, Menu } from "lucide-react";
import React from "react";
import { usePathname } from "next/navigation";
import { NotificationsPopover } from "@/components/nav-notifications";
import { UserProfileMenu } from "@/components/user-profile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const sampleNotifications = [
  {
    id: "1",
    avatar: "/avatars/01.png",
    fallback: "JD",
    text: "New student enrolled in your class.",
    time: "5m ago",
  },
  {
    id: "2",
    avatar: "/avatars/02.png",
    fallback: "SM",
    text: "Assignment deadline approaching.",
    time: "1h ago",
  },
  {
    id: "3",
    avatar: "/avatars/03.png",
    fallback: "TK",
    text: "Parent meeting scheduled for tomorrow.",
    time: "3h ago",
  },
];

// Route titles mapping based on sidebar routes
const routeTitles: Record<string, string> = {
  "/admin": "Home",
  "/admin/classes": "Classes",
  "/admin/teachers": "Teachers",
  "/admin/staff": "Staff",
  "/admin/students": "Students",
  "/admin/analytics": "Analytics",
  "/teacher": "Home",
  "/teacher/classes": "Classes",
  "/teacher/students": "Students",
  "/teacher/analytics": "Analytics",
  "/student": "Home",
  "/student/classes": "Classes",
  "/student/analytics": "Analytics",
  "/profile": "Profile",
  "/settings": "Settings",
};

export default function Header() {
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  // Get page title based on current route
  const getPageTitle = () => {
    // Exact match
    if (routeTitles[pathname]) {
      return routeTitles[pathname];
    }

    // Check for partial matches (for nested routes)
    for (const [route, title] of Object.entries(routeTitles)) {
      if (pathname.startsWith(route) && route !== "/") {
        return title;
      }
    }

    // Default fallback
    return "Dashboard";
  };

  const pageTitle = getPageTitle();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Page title */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">{pageTitle}</h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <NotificationsPopover notifications={sampleNotifications} />

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-border" />

          {/* User profile menu */}
          {user && <UserProfileMenu />}
        </div>
      </div>
    </header>
  );
}
