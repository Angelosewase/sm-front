"use client";

import React from "react";
import { AddStudentDialog } from "@/components/common/students/add-student-dialog";
import { StudentDataTable } from "@/components/common/students/student-data-table";
import { StudentStats } from "@/components/common/students/student-stats";
import { useSchool } from "@/contexts/school-context";

export default function AdminStudentsPage() {
  const { school } = useSchool();

  return (
    <div className="py-4">
      <div className="flex flex-col gap-1 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-primary">Manage Students</h2>
          <AddStudentDialog />
        </div>
        <span className="text-muted-foreground text-base font-normal">
          View and organize all of your school's students here.
        </span>
      </div>
      <StudentStats schoolId={school?.id} />
      <StudentDataTable />
    </div>
  );
}
``