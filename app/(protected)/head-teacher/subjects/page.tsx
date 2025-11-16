"use client";

import React, { useMemo, useState } from "react";
import { SubjectDataTable, AddSubjectDialog, SubjectStats } from "@/components/head-teacher/subjects";
import { useSubjects } from "@/hooks/use-subjects";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; import { gradeLevels } from "@/lib/constants/grade-levels";
import { useSchool } from "@/contexts/school-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function HeadTeacherSubjects() {
  const { school } = useSchool()
  const [q, setQ] = useState<string>("");
  const [page, setPage] = useState<number>(1); // 1-based
  const [limit, setLimit] = useState<number>(10);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [gradeLevel, setGradeLevel] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"active" | "trashed">("active");
  const sortBy = "createdAt";
  const order: "asc" | "desc" = "desc";

  const { data, isLoading, isError, error, refetch, isFetching } = useSubjects({
    page,
    limit: 100,
    gradeLevel,
  });

  // const tableData = useMemo(() => {
  //   const items = data?.items || [];
  //   return items.map((s, idx) => ({
  //     id: String((s as any)._id || idx + 1),
  //     _id: (s as any)._id,
  //     subjectName: (s as any).name ?? "",
  //     subjectCode: (s as any).code ?? "",
  //     department: (s as any).department ?? "",
  //     category: (s as any).subjectType ?? "",
  //     gradeLevel: (s as any).gradeLevels ? (s as any).gradeLevels.join(", ") : "",
  //     teachers: "0",
  //     classes: "0",
  //     students: "0",
  //     status: (s as any).status ?? "Active",
  //     isTrashed: (s as any).isTrashed ?? false,
  //     subjectType: (s as any).subjectType ?? "",
  //     creditHours: String((s as any).creditHours ?? ""),
  //     level: (s as any).level ?? "",
  //     prerequisites: (s as any).prerequisites ?? "",
  //   }));
  // }, [data]);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));


  if (error) {
    return (
      <div className="py-4">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Error loading subjects
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {(error as any)?.response?.data?.message ||
                "Failed to fetch classes. Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="py-4">
      <div className="flex justify-between gap-1 ">
        <div className="flex flex-col gap-1 px-4">
          <h2 className="text-3xl font-semibold text-primary">
            Manage Subjects
          </h2>
          <span className="text-muted-foreground text-base font-normal">
            View and organize all of you school subjects here
          </span>
        </div>
        <div className="flex items-center justify-between px-4">
          <div />
          {/* Button will render at the end */}
          <AddSubjectDialog />
        </div>
      </div>
      {isLoading ? (
        <>
          <div className="flex items-center justify-center p-4 w-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
          <div className="px-4">
            <Skeleton className="h-96 w-full" />
          </div>
        </>
      ) : (
        <>
          <SubjectStats schoolId={school?.id} />
          <SubjectDataTable
            data={data?.items || []}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
