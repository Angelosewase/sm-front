"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { ClassesGrid } from '@/components/teacher/classes/classes-grid'
import { ClassesOverview } from '@/components/teacher/classes/classes-overview'

// Mock data - replace with actual API calls
const mockClasses = [
  {
    id: 'primary-5a',
    name: 'Primary 5A',
    subjectCount: 4,
    studentCount: 28,
    pendingAssessments: 2
  },
  {
    id: 'primary-5b',
    name: 'Primary 5B',
    subjectCount: 3,
    studentCount: 26,
    pendingAssessments: 4
  },
  {
    id: 'primary-4a',
    name: 'Primary 4A',
    subjectCount: 5,
    studentCount: 30,
    pendingAssessments: 6
  },
  {
    id: 'primary-6c',
    name: 'Primary 6C',
    subjectCount: 3,
    studentCount: 24,
    pendingAssessments: 1
  }
]

const mockStats = {
  totalClasses: 4,
  totalSubjects: 15,
  totalStudents: 108,
  completedAssessments: 24,
  pendingAssessments: 13
}

export default function ClassesPage() {
  const router = useRouter()

  const handleClassClick = (classId: string) => {
    router.push(`/teacher/classes/${classId}`)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-muted-foreground">
          Manage your classes, view subjects, and track grading progress.
        </p>
      </div>

      <ClassesOverview stats={mockStats} />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Classes</h2>
        <ClassesGrid classes={mockClasses} onClassClick={handleClassClick} />
      </div>
    </div>
  )
}
