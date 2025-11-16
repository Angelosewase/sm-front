"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  Settings,
  FileText,
  CalendarDays,
  ClipboardList,
  School,
  TrendingUp,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StatCard from "@/components/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { useSchool } from "@/contexts/school-context";

// Mock data - Replace with actual API calls
const mockStatsData = [
  {
    name: "Total Students",
    icon: <Users className="w-4 h-4" />,
    value: 245,
    change: "+12",
    percentageChange: "5.1%",
    changeType: "positive" as const,
    dataKey: "students",
    data: [
      { date: "Jan", students: 210 },
      { date: "Feb", students: 215 },
      { date: "Mar", students: 225 },
      { date: "Apr", students: 235 },
      { date: "May", students: 245 },
    ],
  },
  {
    name: "Active Teachers",
    icon: <GraduationCap className="w-4 h-4" />,
    value: 18,
    change: "+2",
    percentageChange: "12.5%",
    changeType: "positive" as const,
    dataKey: "teachers",
    data: [
      { date: "Jan", teachers: 15 },
      { date: "Feb", teachers: 16 },
      { date: "Mar", teachers: 16 },
      { date: "Apr", teachers: 17 },
      { date: "May", teachers: 18 },
    ],
  },
  {
    name: "Classes",
    icon: <School className="w-4 h-4" />,
    value: 12,
    change: "+1",
    percentageChange: "9.1%",
    changeType: "positive" as const,
    dataKey: "classes",
    data: [
      { date: "Jan", classes: 10 },
      { date: "Feb", classes: 11 },
      { date: "Mar", classes: 11 },
      { date: "Apr", classes: 11 },
      { date: "May", classes: 12 },
    ],
  },
  {
    name: "Subjects",
    icon: <BookOpen className="w-4 h-4" />,
    value: 15,
    change: "0",
    percentageChange: "0%",
    changeType: "neutral" as const,
    dataKey: "subjects",
    data: [
      { date: "Jan", subjects: 15 },
      { date: "Feb", subjects: 15 },
      { date: "Mar", subjects: 15 },
      { date: "Apr", subjects: 15 },
      { date: "May", subjects: 15 },
    ],
  },
];

const quickActions = [
  {
    title: "View Analytics",
    description: "Access comprehensive school performance metrics and insights.",
    href: "/head-teacher/analytics",
    icon: BarChart3,
    badge: "Analytics",
  },
  {
    title: "Generate Report",
    description: "Create and export detailed school reports and summaries.",
    href: "/head-teacher/reports",
    icon: FileText,
    badge: "Reports",
  },
  {
    title: "Academic Settings",
    description: "Configure academic calendar, terms, and curriculum settings.",
    href: "/head-teacher/academic-settings",
    icon: Settings,
    badge: "Settings",
  },
] as const;

const secondaryLinks = [
  { label: "Manage Teachers", href: "/head-teacher/teachers", icon: GraduationCap },
  { label: "View Students", href: "/head-teacher/students", icon: Users },
  { label: "Manage Classes", href: "/head-teacher/classes", icon: School },
  { label: "Manage Subjects", href: "/head-teacher/subjects", icon: BookOpen },
] as const;

const initialsFromName = (name?: string) => {
  if (!name) return "HT";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "HT";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export default function HeadTeacherPage() {
  const { user } = useAuth();
  const { school } = useSchool();
  const headTeacherName = user?.name ?? "Head Teacher";
  const headTeacherEmail = user?.email ?? "";

  // Replace with actual loading states from API hooks
  const isLoading = false;

  return (
    <div className="space-y-6 p-6">
      {/* Hero Section */}
      <Card className="overflow-hidden border border-border/50">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background h-40 w-full" />
        <CardHeader className="-mt-28 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
          <div className="flex items-start gap-4">
            <Avatar className="size-20 border-4 border-background shadow-lg">
              <AvatarFallback className="text-lg font-semibold">
                {initialsFromName(headTeacherName)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Badge variant="secondary" className="uppercase tracking-wide">
                Head Teacher Dashboard
              </Badge>
              <CardTitle className="text-3xl font-semibold tracking-tight">
                Welcome back, {headTeacherName.split(" ")[0]}
              </CardTitle>
              {headTeacherEmail && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4" />
                  <span>{headTeacherEmail}</span>
                </div>
              )}
              {school?.name && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <School className="size-4" />
                  <span>{school.name}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/head-teacher/analytics">View Analytics</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/head-teacher/reports">Generate Report</Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-4 border-t border-border/60 bg-background/40 px-6 py-4 sm:grid-cols-3">
          <QuickStat
            icon={<Users className="size-4 text-primary" />}
            label="Total Students"
            value={245}
            helper="Enrolled this academic year"
          />
          <QuickStat
            icon={<GraduationCap className="size-4 text-primary" />}
            label="Active Teachers"
            value={18}
            helper="Currently teaching"
          />
          <QuickStat
            icon={<School className="size-4 text-primary" />}
            label="Active Classes"
            value={12}
            helper="Across all grade levels"
          />
        </CardContent>
      </Card>

      {/* Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          <dl className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mockStatsData.map((stat) => (
              <StatCard key={stat.name} {...stat} />
            ))}
          </dl>
        </div>
      )}

      {/* Quick Actions and Summary Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions Card */}
        <div className="col-span-2">
          <Card>
            <CardHeader className="space-y-1">
              <Badge variant="outline" className="w-fit text-xs uppercase tracking-wide">
                Quick Actions
              </Badge>
              <CardTitle className="text-2xl font-semibold">
                What would you like to do today?
              </CardTitle>
              <CardDescription>
                Access your most frequently used features and manage school operations efficiently.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  asChild
                  variant="outline"
                  className="group h-auto justify-start gap-4 p-4"
                >
                  <Link
                    href={action.href}
                    className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <action.icon className="size-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="font-medium text-foreground group-hover:text-primary">
                          {action.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {action.description}
                        </span>
                      </span>
                    </span>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {action.badge}
                    </Badge>
                  </Link>
                </Button>
              ))}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 border-t border-border/60 bg-muted/20 px-6 py-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Shortcuts
              </p>
              <div className="flex flex-wrap gap-2">
                {secondaryLinks.map((item) => (
                  <Button key={item.label} asChild size="sm" variant="ghost" className="gap-2">
                    <Link href={item.href}>
                      <item.icon className="size-3.5" />
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Summary Information Card */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">School Overview</CardTitle>
              <CardDescription>Key information at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Attendance Rate</span>
                  <span className="text-sm font-semibold">94.5%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[94.5%] bg-primary" />
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Performance</span>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    Excellent
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Current Term</span>
                  </div>
                  <span className="text-sm font-medium">Term 2</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Pending Tasks</span>
                  </div>
                  <Badge variant="secondary">5</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/head-teacher/academic-settings">View Full Details</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickStat({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/60 p-4">
      <div className="rounded-md bg-primary/10 p-2">{icon}</div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{helper}</p>
      </div>
    </div>
  );
}
