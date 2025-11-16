"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  GraduationCap,
  Users,
  UserCog,
  FileCog,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/logo";
import type { Route } from "./nav-main";
import DashboardNavigation from "@/components/nav-main";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useSchool } from "@/contexts/school-context";

const getCommonRoutes = (role: string): Route[] => [
  {
    id: "home",
    title: "Home",
    icon: <Home className="size-5" />,
    link: `/${role}`,
  },
  // {
  //   id: "analytics",
  //   title: "Analytics",
  //   icon: <BarChart3 className="size-10" />,
  //   link: `/${role}/analytics`,
  // },
];

const getAdminRoutes = (): Route[] => [
  {
    id: "classes",
    title: "Classes",
    icon: <BookOpen className="size-5" />,
    link: `/admin/classes`,
  },
  {
    id: "teachers",
    title: "Teachers",
    icon: <GraduationCap className="size-5" />,
    link: `/admin/teachers`,
  },
  // {
  //   id: "head-teachers",
  //   title: "Head Teachers",
  //   icon: <GraduationCap className="size-5" />,
  //   link: `/admin/head-teachers`,
  // },
  {
    id: "students",
    title: "Students",
    icon: <Users className="size-5" />,
    link: `/admin/students`,
  },
  {
    id: "staff",
    title: "Staff",
    icon: <UserCog className="size-5" />,
    link: `/admin/staff`,
  },
];

const getHeaderTeacherRoutes = (): Route[] => [
  {
    id: "classes",
    title: "Classes",
    icon: <BookOpen className="size-5" />,
    link: `/head-teacher/classes`,
  },
  {
    id: "teachers",
    title: "Teachers",
    icon: <GraduationCap className="size-5" />,
    link: `/head-teacher/teachers`,
  },
  {
    id: "students",
    title: "Students",
    icon: <Users className="size-5" />,
    link: `/head-teacher/students`,
  },
  // {
  //   id: "reports",
  //   title: "Reports",
  //   icon: <BookOpenCheck className="size-5" />,
  //   link: "/head-teacher/reports",
  // },
  {
    id: "subjects",
    title: "Subjects",
    icon: <BookOpen className="size-5" />,
    link: "/head-teacher/subjects",
  },
  {
    id: "academic-settings",
    title: "Academic Setup",
    icon: <FileCog className="size-5" />,
    link: "/head-teacher/academic-settings",
  },
];

const getTeacherRoutes = (): Route[] => [
  {
    id: "classes",
    title: "My Classes",
    icon: <BookOpen className="size-5" />,
    link: `/teacher/classes`,
  },
  {
    id: "students",
    title: "My Students",
    icon: <Users className="size-5" />,
    link: `/teacher/students`,
  },
];

const getDashboardRoutes = (role: string): Route[] => {
  switch (role) {
    case "admin":
      return [...getCommonRoutes(role), ...getAdminRoutes()];
    case "head-teacher":
      return [...getCommonRoutes(role), ...getHeaderTeacherRoutes()];
    case "teacher":
      return [...getCommonRoutes(role), ...getTeacherRoutes()];
    default:
      return [];
  }
};

export function DashboardSidebar() {
  const { state } = useSidebar();
  const { user } = useAuth();
  const isCollapsed = state === "collapsed";
  const router = useRouter();
  const dashboardRoutes = getDashboardRoutes(
    user?.role == "head teacher" ? "head-teacher" : user?.role || "404" || "404"
  );

  const { school, isLoading: isSchoolLoading } = useSchool();

  if (isSchoolLoading) {
    return (
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="flex md:pt-3.5">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-background text-foreground">
            <Loader2 className="size-4 animate-spin" />
          </div>
        </SidebarHeader>
      </Sidebar>
    );
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
            : "flex-row items-center justify-between"
        )}
      >
        <a href="#" className="flex items-center justify-center gap-2">
          <Logo
            className={cn(
              isCollapsed ? "h-8 w-8 rounded-none" : "h-24 w-24 ml-4 rounded"
            )}
          />
        </a>

        <motion.div
          key={isCollapsed ? "header-collapsed" : "header-expanded"}
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-row md:flex-col-reverse" : "flex-row"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        {user && <DashboardNavigation routes={dashboardRoutes} />}
      </SidebarContent>
      <SidebarFooter className="px-2  ">
        <div className="flex items-center justify-between">
          <div
            className="grid flex-1 text-left  bg-gray-100 dark:bg-card  px-4  py-2 rounded  mb-2 hover:scale-101 transition-all duration-300 hover:cursor-pointer"
            onClick={() => {
              if (user?.role === "admin") {
                router.push("/setup-school-profile");
              }
              // Otherwise, do nothing
            }}
          >
            <span className="truncate font-semibold">{school?.name}</span>
            <span className="truncate text-xs flex not-only-of-type:">
              school profile{" "}
              {user?.role === "admin" ? (
                <ArrowRight className="size-4" />
              ) : (
                <ArrowRight className="size-4" />
              )}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
