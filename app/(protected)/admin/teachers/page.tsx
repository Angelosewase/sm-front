"use client";

import React from "react";
import { TeacherDataTable } from "../../../../components/admin/teachers/teacher-data-table";
import { TeacherStats } from "../../../../components/admin/teachers/teacher-stats";
import { AddTeacherDialog } from "../../../../components/admin/teachers/add-teacher-dialog";
import { useTeachers } from "@/hooks/use-teachers";

export default function AdminTeachersPage() {
  const { data, isLoading, isError } = useTeachers();


  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-3xl font-semibold text-primary">Manage Teachers</h2>
        <AddTeacherDialog />
      </div>
      <TeacherStats />
      {isLoading && <div className="px-4 py-8 text-muted-foreground">Loading teachers...</div>}
      {isError && <div className="px-4 py-8 text-destructive">Failed to load teachers</div>}
      {!isLoading && !isError && (
       data && (
         <TeacherDataTable data={data.items || []} />
       )
      )}
    </div>
  );
}
