"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, GraduationCap, TrendingUp } from "lucide-react";

interface SubjectStatsProps {
  totalSubjects?: number;
  activeSubjects?: number;
  totalTeachers?: number;
  averageClassSize?: number;
}

export function SubjectStats({
  totalSubjects = 13,
  activeSubjects = 12,
  totalTeachers = 18,
  averageClassSize = 28,
}: SubjectStatsProps) {
  const stats = [
    {
      title: "Total Subjects",
      value: totalSubjects,
      icon: BookOpen,
      description: `${activeSubjects} active`,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Total Teachers",
      value: totalTeachers,
      icon: Users,
      description: "Teaching staff",
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
      value: "87%",
      icon: TrendingUp,
      description: "Average score",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`rounded-md p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

