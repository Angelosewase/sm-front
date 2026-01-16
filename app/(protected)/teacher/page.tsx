"use client";

import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import {
  TeacherClassesCard,
  TeacherHero,
  TeacherSummaryCards,
  QuickActionsCard,
  TeacherStudentsCard,
} from "@/components/teacher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import {
  useTeacherClassesAssigned,
  useTeacherDashboardStats,
  useGetTeacherByUserId,
} from "@/hooks/use-teachers";
import { useStudents } from "@/hooks/use-students";
import { StudentQueryParams } from "@/types/students.dto";

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
  const userId = user?.id ?? "";

  const {
    data: teacher,
    isLoading: teacherLoading,
    error: teacherError,
  } = useGetTeacherByUserId(userId);

  const teacherId = teacher?._id ?? "";

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

  // Students query with teacher filter
  const studentsQueryParams: StudentQueryParams = {
    page: 1,
    limit: 10, // Limit to 10 for dashboard overview
    status: "active",
    teacher: teacherId,
  };

  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useStudents(studentsQueryParams, {
    enabled: Boolean(teacherId),
  });

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

  // Transform students data for TeacherStudentsCard
  const studentItems = useMemo(
    () =>
      (studentsData?.data ?? []).map((student) => ({
        id: student._id ?? student.id ?? "",
        name: student.name,
        email: student.email ?? "",
        class: {
          name: student.class?.name ?? null,
        },
      })),
    [studentsData?.data]
  );
  return (
    <div className="flex flex-col h-[90%] p-6 space-y-6">
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

      <div className="flex-1">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 h-full">
          <TeacherClassesCard
            classes={classItems}
            isLoading={classesLoading}
            error={getErrorMessage(classesError)}
          />
          <TeacherStudentsCard
            students={studentItems}
            isLoading={studentsLoading}
            error={getErrorMessage(studentsError)}
          />
        </div>
      </div>
    </div>
  );
}
