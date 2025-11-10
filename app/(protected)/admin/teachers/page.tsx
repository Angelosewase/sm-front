"use client";

import React from "react";
import { TeacherDataTable } from "../../../../components/admin/teachers/teacher-data-table";
import { TeacherStats } from "../../../../components/admin/teachers/teacher-stats";
import { AddTeacherDialog } from "../../../../components/admin/teachers/add-teacher-dialog";
import { useTeachers } from "@/hooks/use-teachers";

export default function AdminTeachersPage() {
  const { data, isLoading, isError } = useTeachers();

  const tableData = React.useMemo(() => {
    if (!data?.items) return [] as any[];
    return data.items.map((t, idx) => ({
      id: idx + 1,
      name: t.user?.name ?? "-",
      email: t.user?.email ?? "-",
      department: t.qualification ?? "-",
      subject: (t.subjectsCanTeach && t.subjectsCanTeach[0]) ?? "-",
      status: (t.status as any) ?? "Active",
      classesAssigned: String(t.assignedClasses?.length ?? 0),
      totalStudents: "-",
      experience: (t as any).experience ?? "-",
      phone: t.phone ?? "-",
    }));
  }, [data]);

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
        <TeacherDataTable data={tableData} />
      )}
    </div>
  );
}
