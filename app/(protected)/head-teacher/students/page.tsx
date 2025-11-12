"use client";

import React from "react";
import { AddStudentDialog } from "@/components/common/students/add-student-dialog";
import { StudentDataTable } from "@/components/common/students/student-data-table";
import { StudentStats } from "@/components/common/students/student-stats";
import { useSchool } from "@/contexts/school-context";

export default function HeadTeacherStudentsPage() {
  const { school } = useSchool();

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-3xl font-semibold text-primary">Manage Students</h2>
        <AddStudentDialog />
      </div>
      <StudentStats schoolId={school?.id} />
      <StudentDataTable />
    </div>
  );
}