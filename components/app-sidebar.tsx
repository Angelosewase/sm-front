"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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
} from "lucide-react";
import { Logo } from "@/components/logo";
import type { Route } from "./nav-main";
import DashboardNavigation from "@/components/nav-main";

import { TeamSwitcher } from "@/components/team-switcher";
import { useAuth } from "@/contexts/auth-context";



const getDashboardRoutes = (role: string): Route[] => [
  {
    id: "home",
    title: "Home",
    icon: <Home className="size-10" />,
    link: `/${role}`,
  },
  {
    id: "classes",
    title: "Classes",
    icon: <BookOpen className="size-10" />,
    link: `/${role}/classes`,
  },
  {
    id: "teachers",
    title: "Teachers",
    icon: <GraduationCap className="size-10" />,
    link: `/${role}/teachers`,
  },
  {
    id: "staff",
    title: "Staff",
    icon: <UserCog className="size-10" />,
    link: `/${role}/staff`,
  },
  {
    id: "students",
    title: "Students",
    icon: <Users className="size-10" />,
    link: `/${role}/students`,
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: <BarChart3 className="size-10" />,
    link: `/${role}/analytics`,
  },

];

const teams = [
  { id: "1", name: "Alpha Inc.", logo: Logo, plan: "Free" },
  { id: "2", name: "Beta Corp.", logo: Logo, plan: "Free" },
  { id: "3", name: "Gamma Tech", logo: Logo, plan: "Free" },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const { user } = useAuth();
  const isCollapsed = state === "collapsed";
  
  const dashboardRoutes = getDashboardRoutes(user?.role || '404');

  return (
    <Sidebar variant="floating" collapsible="icon">
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
        <TeamSwitcher teams={teams} />
      </SidebarFooter>
    </Sidebar>
  );
}
