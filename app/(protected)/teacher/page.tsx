"use client";

import { useMemo } from "react";
import { AlertCircle } from "lucide-react";

import {
  AssessmentStatusCard,
  TeacherClassesCard,
  TeacherHero,
  TeacherSummaryCards,
  QuickActionsCard,
} from "@/components/teacher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import {
  useTeacherClassesAssigned,
  useTeacherDashboardStats,
} from "@/hooks/use-teachers";

const getErrorMessage = (error: unknown) => {
  if (!error) return null;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (typeof (error as any)?.message === "string")
    return (error as any).message;
  return "Something went wrong while loading your data.";
};

export default function TeacherHomePage() {
  const { user } = useAuth();
  const teacherId = user?.id ?? "";

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useTeacherDashboardStats(teacherId);

  const {
    data: classesData,
    isLoading: classesLoading,
    error: classesError,
  } = useTeacherClassesAssigned(teacherId);

  const teacherName = dashboardData?.teacher?.name ?? user?.name ?? "Teacher";
  const teacherEmail = dashboardData?.teacher?.email ?? user?.email ?? "";

  const dashboardStats = dashboardData?.stats;

  const classItems = useMemo(
    () =>
      (classesData?.classes ?? []).map((classItem) => ({
        id: classItem.classId,
        name: classItem.className,
        studentCount: classItem.studentCount ?? 0,
        subjectCount: classItem.assignedSubjects ?? 0,
        pendingAssessments: classItem.pendingAssessments ?? 0,
      })),
    [classesData?.classes]
  );

  const heroMeta = {
    totalClasses: dashboardStats?.totalClasses ?? classItems.length,
    totalStudents:
      dashboardStats?.totalStudents ??
      classItems.reduce((acc, cls) => acc + cls.studentCount, 0),
    totalSubjects: dashboardStats?.totalSubjects,
  };

  return (
    <div className="space-y-6 p-6">
      {dashboardLoading ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : (
        <TeacherHero name={teacherName} email={teacherEmail} meta={heroMeta} />
      )}

      {dashboardError ? (
        <Alert variant="destructive">
          <AlertCircle className="size-5" />
          <div>
            <AlertTitle>Unable to load dashboard stats</AlertTitle>
            <AlertDescription>
              {getErrorMessage(dashboardError)}
            </AlertDescription>
          </div>
        </Alert>
      ) : dashboardLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <TeacherSummaryCards stats={dashboardStats} />
      )}

      <div className="-mr-4">
        <div className="grid  gap-6 grid-cols-[35%_60%]">
          <TeacherClassesCard
            classes={classItems}
            isLoading={classesLoading}
            error={getErrorMessage(classesError)}
          />
          <AssessmentStatusCard stats={dashboardStats} />
        </div>
      </div>
    </div>
  );
}
