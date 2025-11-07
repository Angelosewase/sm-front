"use client"

import React from 'react'
import { StudentDataTable } from '@/components/teacher/students/student-data-table'
import { StudentsOverview } from '@/components/teacher/students/students-overview'

// Mock data - replace with actual API calls
const mockStudents = [
  {
    id: 'stu001',
    name: 'Emma Thompson',
    studentId: 'STU2024001',
    email: 'emma.thompson@student.edu',
    className: 'Primary 5A',
    averageScore: 85,
    attendance: 95,
    status: 'Active',
    dateOfBirth: '2009-05-15',
    phone: '+1 (555) 201-3001',
    parentName: 'Sarah Thompson',
    parentPhone: '+1 (555) 201-3000'
  },
  {
    id: 'stu002',
    name: 'Michael Chen',
    studentId: 'STU2024002',
    email: 'michael.chen@student.edu',
    className: 'Primary 5A',
    averageScore: 78,
    attendance: 90,
    status: 'Active',
    dateOfBirth: '2008-08-22',
    phone: '+1 (555) 202-3002',
    parentName: 'David Chen',
    parentPhone: '+1 (555) 202-3000'
  },
  {
    id: 'stu003',
    name: 'Sophia Rodriguez',
    studentId: 'STU2024003',
    email: 'sophia.rodriguez@student.edu',
    className: 'Primary 5B',
    averageScore: 92,
    attendance: 98,
    status: 'Active',
    dateOfBirth: '2007-12-10',
    phone: '+1 (555) 203-3003',
    parentName: 'Maria Rodriguez',
    parentPhone: '+1 (555) 203-3000'
  },
  {
    id: 'stu004',
    name: 'James Wilson',
    studentId: 'STU2024004',
    email: 'james.wilson@student.edu',
    className: 'Primary 5A',
    averageScore: 68,
    attendance: 85,
    status: 'Active',
    dateOfBirth: '2009-03-28',
    phone: '+1 (555) 204-3004',
    parentName: 'Robert Wilson',
    parentPhone: '+1 (555) 204-3000'
  },
  {
    id: 'stu005',
    name: 'Olivia Martinez',
    studentId: 'STU2024005',
    email: 'olivia.martinez@student.edu',
    className: 'Primary 5B',
    averageScore: 82,
    attendance: 92,
    status: 'Active',
    dateOfBirth: '2008-07-19',
    phone: '+1 (555) 205-3005',
    parentName: 'Carlos Martinez',
    parentPhone: '+1 (555) 205-3000'
  },
  {
    id: 'stu006',
    name: 'Ethan Brown',
    studentId: 'STU2024006',
    email: 'ethan.brown@student.edu',
    className: 'Primary 4A',
    averageScore: 95,
    attendance: 97,
    status: 'Active',
    dateOfBirth: '2007-11-05',
    phone: '+1 (555) 206-3006',
    parentName: 'Jennifer Brown',
    parentPhone: '+1 (555) 206-3000'
  },
  {
    id: 'stu007',
    name: 'Ava Johnson',
    studentId: 'STU2024007',
    email: 'ava.johnson@student.edu',
    className: 'Primary 5B',
    averageScore: 88,
    attendance: 94,
    status: 'Active',
    dateOfBirth: '2008-04-18',
    phone: '+1 (555) 207-3007',
    parentName: 'Michael Johnson',
    parentPhone: '+1 (555) 207-3000'
  },
  {
    id: 'stu008',
    name: 'Noah Davis',
    studentId: 'STU2024008',
    email: 'noah.davis@student.edu',
    className: 'Primary 4A',
    averageScore: 75,
    attendance: 88,
    status: 'Active',
    dateOfBirth: '2009-09-12',
    phone: '+1 (555) 208-3008',
    parentName: 'Linda Davis',
    parentPhone: '+1 (555) 208-3000'
  },
  {
    id: 'stu009',
    name: 'Isabella Garcia',
    studentId: 'STU2024009',
    email: 'isabella.garcia@student.edu',
    className: 'Primary 5A',
    averageScore: 91,
    attendance: 96,
    status: 'Active',
    dateOfBirth: '2008-11-30',
    phone: '+1 (555) 209-3009',
    parentName: 'Jose Garcia',
    parentPhone: '+1 (555) 209-3000'
  },
  {
    id: 'stu010',
    name: 'Liam Martinez',
    studentId: 'STU2024010',
    email: 'liam.martinez@student.edu',
    className: 'Primary 6C',
    averageScore: 79,
    attendance: 91,
    status: 'Active',
    dateOfBirth: '2007-02-14',
    phone: '+1 (555) 210-3010',
    parentName: 'Ana Martinez',
    parentPhone: '+1 (555) 210-3000'
  },
  {
    id: 'stu011',
    name: 'Mia Anderson',
    studentId: 'STU2024011',
    email: 'mia.anderson@student.edu',
    className: 'Primary 5B',
    averageScore: 86,
    attendance: 93,
    status: 'Active',
    dateOfBirth: '2008-06-25',
    phone: '+1 (555) 211-3011',
    parentName: 'Karen Anderson',
    parentPhone: '+1 (555) 211-3000'
  },
  {
    id: 'stu012',
    name: 'Benjamin Thomas',
    studentId: 'STU2024012',
    email: 'benjamin.thomas@student.edu',
    className: 'Primary 4A',
    averageScore: 72,
    attendance: 87,
    status: 'Active',
    dateOfBirth: '2009-08-08',
    phone: '+1 (555) 212-3012',
    parentName: 'James Thomas',
    parentPhone: '+1 (555) 212-3000'
  },
  {
    id: 'stu013',
    name: 'Charlotte Lee',
    studentId: 'STU2024013',
    email: 'charlotte.lee@student.edu',
    className: 'Primary 5A',
    averageScore: 89,
    attendance: 95,
    status: 'Active',
    dateOfBirth: '2008-12-03',
    phone: '+1 (555) 213-3013',
    parentName: 'Susan Lee',
    parentPhone: '+1 (555) 213-3000'
  },
  {
    id: 'stu014',
    name: 'Lucas White',
    studentId: 'STU2024014',
    email: 'lucas.white@student.edu',
    className: 'Primary 6C',
    averageScore: 65,
    attendance: 82,
    status: 'Active',
    dateOfBirth: '2007-03-17',
    phone: '+1 (555) 214-3014',
    parentName: 'Mark White',
    parentPhone: '+1 (555) 214-3000'
  },
  {
    id: 'stu015',
    name: 'Amelia Harris',
    studentId: 'STU2024015',
    email: 'amelia.harris@student.edu',
    className: 'Primary 5B',
    averageScore: 94,
    attendance: 99,
    status: 'Active',
    dateOfBirth: '2008-10-22',
    phone: '+1 (555) 215-3015',
    parentName: 'Patricia Harris',
    parentPhone: '+1 (555) 215-3000'
  }
]

const mockStats = {
  totalStudents: 108,
  averageScore: 82,
  topPerformers: 45,
  totalClasses: 4
}

export default function StudentsPage() {
  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
          <p className="text-muted-foreground">
            View and track your students' performance and attendance across all classes.
          </p>
        </div>
      </div>

      <StudentsOverview stats={mockStats} />
      
      <StudentDataTable data={mockStudents} />
    </div>
  )
}
