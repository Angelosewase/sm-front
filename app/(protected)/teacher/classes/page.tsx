"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ClassesGrid } from "@/components/teacher/classes/classes-grid";
import { ClassesOverview } from "@/components/teacher/classes/classes-overview";
import { useAuth } from "@/contexts/auth-context";
import {
  useTeacherClassesAssigned,
  useTeacherDashboardStats,
} from "@/hooks/use-teachers";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClassesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const teacherId = user?.id || "";

  const {
    data: classesRes,
    isLoading: classesLoading,
    error: classesError,
  } = useTeacherClassesAssigned(teacherId);
  const {
    data: statsRes,
    isLoading: statsLoading,
    error: statsError,
  } = useTeacherDashboardStats(teacherId);

  const handleClassClick = (classId: string) => {
    router.push(`/teacher/classes/${classId}`);
  };

  console.log("the classes", classesRes);

  console.log("statsRes ", statsRes);

  const isLoading = classesLoading || statsLoading;
  const isError = classesError || statsError;

  const overviewStats = {
    totalClasses: statsRes?.stats.totalClasses ?? 0,
    totalSubjects: statsRes?.stats.totalSubjects ?? 0,
    totalStudents: statsRes?.stats.totalStudents ?? 0,
    completedAssessments: statsRes?.stats.totalAssessmentsCompleted ?? 0,
    pendingAssessments: statsRes?.stats.totalAssessmentsPending ?? 0,
  };

  const classItems = (classesRes?.classes || []).map((c) => ({
    id: c.classId,
    name: c.className,
    subjectCount: c.assignedSubjects ?? 0,
    studentCount: c.studentCount ?? 0,
    pendingAssessments: c.pendingAssessments ?? 0,
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-muted-foreground">
          Manage your classes, view subjects, and track grading progress.
        </p>
      </div> */}

      <div className="space-y-2  mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Classes</h2>
          {!isLoading && !isError && classItems.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {classItems.length} class{classItems.length !== 1 ? "es" : ""}{" "}
              assigned to you
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Manage students, and track assessments.
        </p>

        
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((k) => (
            <Skeleton key={k} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <ClassesOverview stats={overviewStats} />
      )}

        {isError ? (
          <div className="text-center py-8">
            <div className="text-sm text-destructive mb-2">
              Unable to load your classes
            </div>
            <p className="text-xs text-muted-foreground">
              Please try refreshing the page or contact support if the issue
              persists.
            </p>
          </div>
        ) : classesLoading ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Loading your classes...
            </p>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <ClassesGrid classes={classItems} onClassClick={handleClassClick} />
        )}
      </div>
    </div>
  );
}
