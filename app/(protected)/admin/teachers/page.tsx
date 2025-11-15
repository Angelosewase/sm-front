"use client";

import React from "react";
import { TeacherDataTable } from "@/components/common/teachers/teacher-data-table";
import { TeacherStats } from "@/components/common/teachers/teacher-stats";
import { AddTeacherDialog } from "@/components/common/teachers/add-teacher-dialog";
import { useTeachers } from "@/hooks/use-teachers";

import { Skeleton } from "@/components/ui/skeleton";

export default function AdminTeachersPage() {
  const { data, isLoading, isError } = useTeachers();

  return (
    <div className="py-4">
      <div className="flex flex-col gap-1 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-primary">Manage Teachers</h2>
          <AddTeacherDialog />
        </div>
        <span className="text-muted-foreground text-base font-normal">
          View and manage all your school's teachers here.
        </span>
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
        <TeacherStats />
      )}
      {isError && (
        <div className="px-4 py-8 text-destructive">Failed to load teachers</div>
      )}
      {!isLoading && !isError && data && (
        <TeacherDataTable data={data.items || []} />
      )}
    </div>
  );
}
