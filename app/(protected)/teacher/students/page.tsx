"use client";

import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { StudentsOverview } from "@/components/teacher/students/students-overview";
import { StudentDataTable } from "@/components/teacher/students/student-data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useStudents } from "@/hooks/use-students";
import {
  useGetTeacherByUserId,
  useTeacherClassesAssigned,
} from "@/hooks/use-teachers";
import { Student, StudentQueryParams } from "@/types/students.dto";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 100;

function StudentsOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StudentDataTableSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  const { user } = useAuth();
  const { data: teacher, isLoading: isTeacherLoading } = useGetTeacherByUserId(user?.id ?? "");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [classFilter, setClassFilter] = React.useState("");
  const teacherId = teacher?._id ?? "";

  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  const queryParams = React.useMemo<StudentQueryParams>(() => {
    const params: StudentQueryParams = {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
    };

    if (teacherId) {
      params.teacher = teacherId;
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (classFilter) {
      params.classId = classFilter;
    }

    params.status = "active";

    return params;
  }, [teacherId, debouncedSearch, classFilter]);

  const studentsQuery = useStudents(queryParams, {
    enabled: Boolean(teacherId),
  });

  const { data: classesResponse, isLoading: isClassesLoading } = useTeacherClassesAssigned(teacherId);
  const classOptions = React.useMemo(
    () =>
      (classesResponse?.classes ?? []).map((cls) => ({
        value: cls.classId,
        label: cls.className,
      })),
    [classesResponse?.classes]
  );

  const students = studentsQuery.data?.data ?? [];

  const classCount = classOptions.length;
  const totalFromMeta = studentsQuery.data?.meta.total;
  const overviewStats = React.useMemo(
    () => buildOverviewStats(students, classCount, totalFromMeta),
    [students, classCount, totalFromMeta]
  );

  const filtersActive = Boolean(searchTerm) || Boolean(classFilter);

  const handleResetFilters = React.useCallback(() => {
    setSearchTerm("");
    setClassFilter("");
  }, []);

  // Show loading state while teacher is being fetched
  if (isTeacherLoading) {
    return (
      <div className="flex-1 space-y-6 p-4">
        <header className="flex flex-col gap-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96" />
        </header>
        <StudentsOverviewSkeleton />
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-10 w-full max-w-xs" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <StudentDataTableSkeleton />
      </div>
    );
  }

  if (!teacherId) {
    return (
      <div className="flex-1 space-y-4 p-6">
        <Alert>
          <AlertCircle className="size-5" />
          <div>
            <AlertTitle>Account details incomplete</AlertTitle>
            <AlertDescription>
              We could not determine your teacher profile. Please contact the
              admin team.
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }

  const isLoading = studentsQuery.isLoading && !studentsQuery.data;
  const isFetching = studentsQuery.isFetching;

  return (
    <div className="flex-1 space-y-6 p-4">
      <header className="flex flex-col gap-2 px-4">
        <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
        <p className="text-muted-foreground">
          Search and review the students assigned to your classes.
        </p>
      </header>

      {isLoading ? (
        <StudentsOverviewSkeleton />
      ) : (
        <StudentsOverview stats={overviewStats} />
      )}

      <section className="px-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            className="w-full max-w-xs"
            placeholder="Search name, ID, email..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            disabled={isFetching}
          />

          <Select
            value={classFilter}
            onValueChange={setClassFilter}
            disabled={isFetching || isClassesLoading || classOptions.length === 0}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              {classOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {filtersActive ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleResetFilters}
              disabled={isFetching}
            >
              Reset
            </Button>
          ) : null}
        </div>
      </section>

      {studentsQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle className="size-5" />
          <div>
            <AlertTitle>Unable to load students</AlertTitle>
            <AlertDescription>
              {getErrorMessage(studentsQuery.error)}
            </AlertDescription>
          </div>
        </Alert>
      ) : null}

      {isLoading ? (
        <StudentDataTableSkeleton />
      ) : (
        <StudentDataTable students={students} />
      )}
    </div>
  );
}

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}

function getErrorMessage(error: unknown) {
  if (!error) return "Unknown error";
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (typeof (error as any)?.message === "string")
    return (error as any).message;
  return "Something went wrong while fetching students.";
}

function buildOverviewStats(
  students: Student[],
  fallbackClassCount: number,
  totalFromMeta?: number
) {
  const totalStudents = totalFromMeta ?? students.length;

  const scores = students
    .map((student) => student.academicScore)
    .filter((score): score is number => typeof score === "number");

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length
        )
      : 0;

  const topPerformers = scores.filter((score) => score >= 85).length;

  const uniqueClassIds = new Set<string>();
  students.forEach((student) => {
    if (student.classId) {
      uniqueClassIds.add(student.classId);
    } else if (student.class?._id) {
      uniqueClassIds.add(student.class._id);
    }
  });

  const totalClasses =
    uniqueClassIds.size > 0 ? uniqueClassIds.size : fallbackClassCount;

  return {
    totalStudents,
    averageScore,
    topPerformers,
    totalClasses,
  };
}
