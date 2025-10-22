"use client";

import React from "react";
import { ClassDataTable } from "./class-data-table";
import { ClassStats } from "./class-stats";
import { AddClassDialog } from "./add-class-dialog";

// Sample class data
const classData = [
  {
    id: 1,
    className: "Mathematics 101",
    gradeLevel: "Grade 9",
    teacher: "Sarah Johnson",
    status: "Active",
    enrolled: "28",
    capacity: "30",
    schedule: "Mon/Wed/Fri 9:00-10:30",
  },
  {
    id: 2,
    className: "English Literature",
    gradeLevel: "Grade 10",
    teacher: "Michael Chen",
    status: "Active",
    enrolled: "25",
    capacity: "30",
    schedule: "Tue/Thu 10:00-11:30",
  },
  {
    id: 3,
    className: "Physics Advanced",
    gradeLevel: "Grade 11",
    teacher: "Emma Davis",
    status: "Active",
    enrolled: "22",
    capacity: "25",
    schedule: "Mon/Wed 13:00-14:30",
  },
  {
    id: 4,
    className: "Chemistry Basics",
    gradeLevel: "Grade 9",
    teacher: "David Kim",
    status: "Active",
    enrolled: "30",
    capacity: "30",
    schedule: "Tue/Thu 14:00-15:30",
  },
  {
    id: 5,
    className: "World History",
    gradeLevel: "Grade 10",
    teacher: "Lisa Wong",
    status: "Active",
    enrolled: "27",
    capacity: "30",
    schedule: "Mon/Wed/Fri 11:00-12:00",
  },
  {
    id: 6,
    className: "Computer Science",
    gradeLevel: "Grade 11",
    teacher: "James Wilson",
    status: "Active",
    enrolled: "20",
    capacity: "25",
    schedule: "Tue/Thu 9:00-10:30",
  },
  {
    id: 7,
    className: "Biology Lab",
    gradeLevel: "Grade 10",
    teacher: "Nina Patel",
    status: "Active",
    enrolled: "24",
    capacity: "25",
    schedule: "Wed/Fri 13:00-15:00",
  },
  {
    id: 8,
    className: "Art & Design",
    gradeLevel: "Grade 9",
    teacher: "Carlos Rodriguez",
    status: "Inactive",
    enrolled: "15",
    capacity: "20",
    schedule: "Mon/Wed 15:00-16:30",
  },
  {
    id: 9,
    className: "Spanish Language",
    gradeLevel: "Grade 10",
    teacher: "Maria Garcia",
    status: "Active",
    enrolled: "29",
    capacity: "30",
    schedule: "Tue/Thu 11:00-12:30",
  },
  {
    id: 10,
    className: "Physical Education",
    gradeLevel: "Grade 9",
    teacher: "Alex Thompson",
    status: "Active",
    enrolled: "32",
    capacity: "35",
    schedule: "Mon/Wed/Fri 14:00-15:00",
  },
];

export default function AdminClassesPage() {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-3xl font-semibold text-primary">Manage Classes</h2>
        <AddClassDialog />
      </div>
      <ClassStats />
      <ClassDataTable data={classData} />
    </div>
  );
}
