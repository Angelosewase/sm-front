"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, GraduationCap, TrendingUp } from "lucide-react";
import { useHeadTeacherSubjectStats } from "@/hooks/use-analytics";

interface SubjectStatsProps {
  schoolId?: string;
}

export function SubjectStats({ schoolId }: SubjectStatsProps) {
  const { data, isLoading } = useHeadTeacherSubjectStats(schoolId);

  const totalSubjects = data?.totalSubjects ?? 13;
  const totalTeachers = data?.totalTeachers ?? 18;
  const averageClassSize = data?.averageClassSize ?? 28;
  const averagePerformance = data?.averagePerformance ?? 87;
  const performanceGrade = data?.performanceGrade ?? "B";

  const stats = [
    {
      title: "Total Subjects",
      value: totalSubjects,
      icon: BookOpen,
      description: `${totalSubjects} subjects in curriculum`,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Total Teachers",
      value: totalTeachers,
      icon: Users,
      description: "Teaching staff assigned",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Avg. Class Size",
      value: averageClassSize,
      icon: GraduationCap,
      description: "Students per class",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Performance",
      value: `${averagePerformance}%`,
      icon: TrendingUp,
      description: `Average score (${performanceGrade} grade)`,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`rounded-md p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "…" : stat.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Loading..." : stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

