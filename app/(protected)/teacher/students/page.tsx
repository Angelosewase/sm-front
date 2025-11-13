"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

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
import { useAuth } from "@/contexts/auth-context";
import { useStudents } from "@/hooks/use-students";
import {
  useGetTeacherByUserId,
  useTeacherClassesAssigned,
} from "@/hooks/use-teachers";
import { Student, StudentQueryParams } from "@/types/students.dto";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 100;

export default function StudentsPage() {
  const { user } = useAuth();
  const { data: teacher } = useGetTeacherByUserId(user?.id ?? "");
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

  const { data: classesResponse } = useTeacherClassesAssigned(teacherId);
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
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
        <p className="text-muted-foreground">
          Search and review the students assigned to your classes.
        </p>
      </header>

      <StudentsOverview stats={overviewStats} />

      <section className="">
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
            disabled={isFetching || classOptions.length === 0}
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
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          Loading students...
        </div>
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
