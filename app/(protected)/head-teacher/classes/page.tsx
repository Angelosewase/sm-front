"use client";

import React from "react";
import {
  ClassDataTable,
  ClassStats,
  AddClassDialog,
} from "@/components/common/classes";
import { useClasses } from "@/hooks/use-classes";
import { Skeleton } from "@/components/ui/skeleton";

export default function HeadTeacherClassesPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [gradeLevel, setGradeLevel] = React.useState<string | undefined>();

  const {
    data: classesData,
    isLoading,
    error,
  } = useClasses({
    page,
    limit: 100,
    search: search || undefined,
    gradeLevel,
  });

  if (error) {
    return (
      <div className="py-4">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Error loading classes
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
      <div className="flex items-center justify-between px-4">
        <h2 className="text-3xl font-semibold text-primary">Manage Classes</h2>
        <AddClassDialog />
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
          <ClassStats data={[]} />
          <ClassDataTable
            data={classesData?.data || []}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
