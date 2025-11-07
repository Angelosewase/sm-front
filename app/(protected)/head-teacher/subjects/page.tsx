"use client";

import React from "react";
import {
  SubjectDataTable,
  AddSubjectDialog,
  SubjectStats,
} from "@/components/head-teacher/subjects";

// Sample data for subjects
const sampleSubjects = [
  {
    id: 1,
    subjectName: "Mathematics",
    subjectCode: "MATH101",
    department: "Mathematics",
    category: "Core",
    gradeLevel: "All Grades",
    teachers: "3",
    classes: "8",
    students: "224",
    status: "Active",
    creditHours: "4",
    level: "Intermediate",
  },
  {
    id: 2,
    subjectName: "English Language",
    subjectCode: "ENG101",
    department: "English",
    category: "Core",
    gradeLevel: "All Grades",
    teachers: "4",
    classes: "8",
    students: "224",
    status: "Active",
    creditHours: "4",
    level: "Intermediate",
  },
  {
    id: 3,
    subjectName: "Physics",
    subjectCode: "PHY201",
    department: "Science",
    category: "Core",
    gradeLevel: "Grade 11",
    teachers: "2",
    classes: "4",
    students: "98",
    status: "Active",
    creditHours: "4",
    level: "Advanced",
  },
  {
    id: 4,
    subjectName: "Chemistry",
    subjectCode: "CHEM201",
    department: "Science",
    category: "Core",
    gradeLevel: "Grade 11",
    teachers: "2",
    classes: "4",
    students: "98",
    status: "Active",
    creditHours: "4",
    level: "Advanced",
  },
  {
    id: 5,
    subjectName: "Biology",
    subjectCode: "BIO201",
    department: "Science",
    category: "Core",
    gradeLevel: "Grade 10",
    teachers: "2",
    classes: "4",
    students: "112",
    status: "Active",
    creditHours: "3",
    level: "Intermediate",
  },
  {
    id: 6,
    subjectName: "History",
    subjectCode: "HIST101",
    department: "Social Studies",
    category: "Core",
    gradeLevel: "All Grades",
    teachers: "2",
    classes: "6",
    students: "168",
    status: "Active",
    creditHours: "3",
    level: "Intermediate",
  },
  {
    id: 7,
    subjectName: "Geography",
    subjectCode: "GEO101",
    department: "Social Studies",
    category: "Elective",
    gradeLevel: "Grade 9",
    teachers: "1",
    classes: "2",
    students: "56",
    status: "Active",
    creditHours: "3",
    level: "Beginner",
  },
  {
    id: 8,
    subjectName: "Computer Science",
    subjectCode: "CS101",
    department: "Technology",
    category: "Elective",
    gradeLevel: "Grade 10",
    teachers: "2",
    classes: "3",
    students: "84",
    status: "Active",
    creditHours: "3",
    level: "Intermediate",
  },
  {
    id: 9,
    subjectName: "Art & Design",
    subjectCode: "ART101",
    department: "Arts",
    category: "Elective",
    gradeLevel: "All Grades",
    teachers: "2",
    classes: "5",
    students: "70",
    status: "Active",
    creditHours: "2",
    level: "Beginner",
  },
  {
    id: 10,
    subjectName: "Music",
    subjectCode: "MUS101",
    department: "Arts",
    category: "Optional",
    gradeLevel: "All Grades",
    teachers: "1",
    classes: "3",
    students: "42",
    status: "Active",
    creditHours: "2",
    level: "Beginner",
  },
  {
    id: 11,
    subjectName: "Physical Education",
    subjectCode: "PE101",
    department: "Physical Education",
    category: "Core",
    gradeLevel: "All Grades",
    teachers: "3",
    classes: "8",
    students: "224",
    status: "Active",
    creditHours: "2",
    level: "Beginner",
  },
  {
    id: 12,
    subjectName: "Spanish",
    subjectCode: "SPA101",
    department: "Languages",
    category: "Elective",
    gradeLevel: "Grade 9",
    teachers: "2",
    classes: "4",
    students: "56",
    status: "Active",
    creditHours: "3",
    level: "Beginner",
  },
  {
    id: 13,
    subjectName: "French",
    subjectCode: "FRE101",
    department: "Languages",
    category: "Optional",
    gradeLevel: "Grade 10",
    teachers: "1",
    classes: "2",
    students: "28",
    status: "Inactive",
    creditHours: "3",
    level: "Beginner",
  },
];

export default function HeadTeacherSubjects() {
  return (
    <div className="mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Subject Management</h1>
        <p className="text-muted-foreground">
          Manage subjects, assign them to classes, and track performance
        </p>
      </div>

      {/* Stats Section */}
      <section>
        <SubjectStats
          totalSubjects={13}
          activeSubjects={12}
          totalTeachers={18}
          averageClassSize={28}
        />
      </section>

      {/* Data Table Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">All Subjects</h2>
            <p className="text-sm text-muted-foreground">
              View and manage all subjects in the curriculum
            </p>
          </div>
          <AddSubjectDialog />
        </div>
        <SubjectDataTable data={sampleSubjects} />
      </section>
    </div>
  );
}
