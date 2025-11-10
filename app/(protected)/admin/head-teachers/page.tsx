"use client";

import React from "react";
import { AddTeacherDialog } from "../../../../components/admin/teachers/add-teacher-dialog";
import { useHeadTeachers } from "@/hooks/use-head-teacher";
import { HeadTeacherDataTable } from "@/components/admin/head-teacher/head-teacher-data-table";
import { HeadTeacherStats } from "@/components/admin/head-teacher/head-teacher-stats";


export default function AdminTeachersPage() {
  const {data: headTeachers, isLoading }= useHeadTeachers() 
  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-3xl font-semibold text-primary">Manage Head Teachers</h2>
        <AddTeacherDialog />
      </div>
      <HeadTeacherStats />
      {headTeachers && (
        <HeadTeacherDataTable data={headTeachers.items.map((item) => ({
          id: item._id,
          name: item.user.name,
          email: item.user.email,
          school: item.school,
          department: item.department,
          subjects: item.subjects,
          status: item.status,
          phone: item.user.phone,
        }))} />
      )}
    </div>
  );
}
