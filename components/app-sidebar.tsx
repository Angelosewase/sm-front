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
  Building2,
  Shield,
  Key,
} from "lucide-react";
import { Logo } from "@/components/logo";
import type { Route } from "./nav-main";
import DashboardNavigation from "@/components/nav-main";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useSchool as getSchool } from "@/hooks/use-school";
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
  {
    id: "tokens",
    title: "Registration Tokens",
    icon: <Key className="size-5" />,
    link: `/admin/tokens`,
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
  {
    id: "tokens",
    title: "Registration Tokens",
    icon: <Key className="size-5" />,
    link: `/head-teacher/tokens`,
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

const getSuperAdminRoutes = (): Route[] => [
  {
    id: "schools",
    title: "Schools",
    icon: <Building2 className="size-5" />,
    link: `/super-admin/schools`,
  },
  {
    id: "users",
    title: "Users",
    icon: <Users className="size-5" />,
    link: `/super-admin/users`,
  },
  {
    id: "tokens",
    title: "Tokens",
    icon: <Key className="size-5" />,
    link: `/super-admin/tokens`,
  },
];

const getDashboardRoutes = (role: string): Route[] => {
  switch (role) {
    case "super admin":
      return [...getCommonRoutes("super-admin"), ...getSuperAdminRoutes()];
    case "admin":
      return [...getCommonRoutes(role), ...getAdminRoutes()];
    case "school owner":
      return [...getCommonRoutes("admin"), ...getAdminRoutes()];
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
  const normalizedRole =
    user?.role === "head teacher"
      ? "head-teacher"
      : user?.role === "super admin"
      ? "super admin"
      : user?.role || "404";
  const dashboardRoutes = getDashboardRoutes(normalizedRole);

  const { school, isLoading } = useSchool();
  const {data: schooldata, isLoading: isSchoolLoading} = getSchool(school ? school.id : '')
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
          url={schooldata?.logoUrl ? schooldata?.logoUrl : './back-free.png'}
            className={cn(
              isCollapsed ? "h-8 w-8 rounded" : "h-24 w-24 ml-4 rounded"
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
      {user?.role !== "super admin" && (
        <SidebarFooter className="px-2  ">
          <div className="flex items-center justify-between">
            <div
              className="grid flex-1 text-left  bg-gray-100 dark:bg-card  px-4  py-2 rounded  mb-2 hover:scale-101 transition-all duration-300 hover:cursor-pointer"
              onClick={() => {
                if (user?.role === "admin" || user?.role === " school owner") {
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
      )}
    </Sidebar>
  );
}
