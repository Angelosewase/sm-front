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
  Settings,
  UserCircle,
  School,
  BarChart3,
  BookOpenCheck,
  FileCog,
  ChevronsUpDown,
} from "lucide-react";
import { Logo } from "@/components/logo";
import type { Route } from "./nav-main";
import DashboardNavigation from "@/components/nav-main";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const getCommonRoutes = (role: string): Route[] => [
  {
    id: "home",
    title: "Home",
    icon: <Home className="size-10" />,
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
    icon: <BookOpen className="size-10" />,
    link: `/admin/classes`,
  },
  {
    id: "teachers",
    title: "Teachers",
    icon: <GraduationCap className="size-10" />,
    link: `/admin/teachers`,
  },
  // {
  //   id: "head-teachers",
  //   title: "Head Teachers",
  //   icon: <GraduationCap className="size-10" />,
  //   link: `/admin/head-teachers`,
  // },
  {
    id: "students",
    title: "Students",
    icon: <Users className="size-10" />,
    link: `/admin/students`,
  },
  {
    id: "staff",
    title: "Staff",
    icon: <UserCog className="size-10" />,
    link: `/admin/staff`,
  },
];

const getHeaderTeacherRoutes = (): Route[] => [
  {
    id: "classes",
    title: "Classes",
    icon: <BookOpen className="size-10" />,
    link: `/head-teacher/classes`,
  },
  {
    id: "teachers",
    title: "Teachers",
    icon: <GraduationCap className="size-10" />,
    link: `/head-teacher/teachers`,
  },
  {
    id: "students",
    title: "Students",
    icon: <Users className="size-10" />,
    link: `/head-teacher/students`,
  },
  {
    id: "reports",
    title: "Reports",
    icon: <BookOpenCheck className="size-10" />,
    link: "/head-teacher/reports",
  },
  {
    id: "subjects",
    title: "Subjects",
    icon: <BookOpen className="size-10" />,
    link: "/head-teacher/subjects",
  },
  {
    id: "academic-settings",
    title: "Academic Setup",
    icon: <FileCog className="size-10" />,
    link: "/head-teacher/academic-settings",
  },
];

const getTeacherRoutes = (): Route[] => [
  {
    id: "classes",
    title: "My Classes",
    icon: <BookOpen className="size-10" />,
    link: `/teacher/classes`,
  },
  {
    id: "students",
    title: "My Students",
    icon: <Users className="size-10" />,
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

const teams = [
  { id: "1", name: "Alpha Inc.", logo: Logo, plan: "Free" },
  { id: "2", name: "Beta Corp.", logo: Logo, plan: "Free" },
  { id: "3", name: "Gamma Tech", logo: Logo, plan: "Free" },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const { user } = useAuth();
  const isCollapsed = state === "collapsed";
  const router = useRouter();
  const dashboardRoutes = getDashboardRoutes(
    user?.role == "head teacher" ? "head-teacher" : user?.role || "404" || "404"
  );

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
        <a href="#" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          {!isCollapsed && (
            <span className="font-semibold text-black dark:text-white">
              Acme
            </span>
          )}
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
      <SidebarFooter className="px-2">
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          onClick={() => {
            router.push("/setup-school-profile");
          }}
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-background text-foreground">
            <Logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">School name</span>
            <span className="truncate text-xs">School type</span>
          </div>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
