"use client";

import React from "react";
import { TeacherDataTable } from "./teacher-data-table";
import { TeacherStats } from "./teacher-stats";
import { AddTeacherDialog } from "./add-teacher-dialog";

// Sample teacher data
const teacherData = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@school.edu",
    department: "Mathematics",
    subject: "Advanced Mathematics",
    status: "Active",
    classesAssigned: "3",
    totalStudents: "85",
    experience: "8 years",
    phone: "+1 (555) 123-4567",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@school.edu",
    department: "English",
    subject: "Literature & Writing",
    status: "Active",
    classesAssigned: "4",
    totalStudents: "102",
    experience: "12 years",
    phone: "+1 (555) 234-5678",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.davis@school.edu",
    department: "Science",
    subject: "Physics",
    status: "Active",
    classesAssigned: "3",
    totalStudents: "67",
    experience: "6 years",
    phone: "+1 (555) 345-6789",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@school.edu",
    department: "Science",
    subject: "Chemistry",
    status: "Active",
    classesAssigned: "3",
    totalStudents: "78",
    experience: "10 years",
    phone: "+1 (555) 456-7890",
  },
  {
    id: 5,
    name: "Lisa Wong",
    email: "lisa.wong@school.edu",
    department: "Social Studies",
    subject: "World History",
    status: "Active",
    classesAssigned: "4",
    totalStudents: "95",
    experience: "15 years",
    phone: "+1 (555) 567-8901",
  },
  {
    id: 6,
    name: "James Wilson",
    email: "james.wilson@school.edu",
    department: "Technology",
    subject: "Computer Science",
    status: "Active",
    classesAssigned: "2",
    totalStudents: "45",
    experience: "5 years",
    phone: "+1 (555) 678-9012",
  },
  {
    id: 7,
    name: "Nina Patel",
    email: "nina.patel@school.edu",
    department: "Science",
    subject: "Biology",
    status: "Active",
    classesAssigned: "3",
    totalStudents: "72",
    experience: "9 years",
    phone: "+1 (555) 789-0123",
  },
  {
    id: 8,
    name: "Carlos Rodriguez",
    email: "carlos.rodriguez@school.edu",
    department: "Arts",
    subject: "Art & Design",
    status: "On Leave",
    classesAssigned: "2",
    totalStudents: "35",
    experience: "7 years",
    phone: "+1 (555) 890-1234",
  },
  {
    id: 9,
    name: "Maria Garcia",
    email: "maria.garcia@school.edu",
    department: "Languages",
    subject: "Spanish",
    status: "Active",
    classesAssigned: "4",
    totalStudents: "98",
    experience: "11 years",
    phone: "+1 (555) 901-2345",
  },
  {
    id: 10,
    name: "Alex Thompson",
    email: "alex.thompson@school.edu",
    department: "Physical Education",
    subject: "PE & Sports",
    status: "Active",
    classesAssigned: "5",
    totalStudents: "125",
    experience: "13 years",
    phone: "+1 (555) 012-3456",
  },
];

export default function AdminTeachersPage() {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-3xl font-semibold text-primary">Manage Teachers</h2>
        <AddTeacherDialog />
      </div>
      <TeacherStats />
      <TeacherDataTable data={teacherData} />
    </div>
  );
}
