"use client";

import React from "react";
import { useHeadTeachers } from "@/hooks/use-head-teacher";
import { HeadTeacherDataTable } from "@/components/admin/head-teacher/head-teacher-data-table";
import { HeadTeacherStats } from "@/components/admin/head-teacher/head-teacher-stats";
import { AddHeadTeacherDialog } from "@/components/admin/head-teacher/add-head-teacher-dialog";


export default function AdminTeachersPage() {
  const {data: headTeachers, isLoading }= useHeadTeachers() 
  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-3xl font-semibold text-primary">Manage Head Teachers</h2>
        <AddHeadTeacherDialog />
      </div>
      <HeadTeacherStats />
      {headTeachers && (
        <HeadTeacherDataTable data={headTeachers.items} />
      )}
    </div>
  );
}
