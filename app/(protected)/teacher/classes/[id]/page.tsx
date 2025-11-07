"use client"

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ClassSubjectsView } from '@/components/teacher'

// Mock data - replace with actual API calls
const mockClassData = {
  'primary-5a': {
    id: 'primary-5a',
    name: 'Primary 5A',
    studentCount: 28,
    subjects: [
      {
        id: 'english',
        name: 'English Language',
        assessmentCount: 8,
        completedAssessments: 6,
        averageScore: 78.5,
        lastUpdated: '2024-10-20'
      },
      {
        id: 'mathematics',
        name: 'Mathematics',
        assessmentCount: 10,
        completedAssessments: 8,
        averageScore: 82.3,
        lastUpdated: '2024-10-22'
      },
      {
        id: 'science',
        name: 'Basic Science',
        assessmentCount: 6,
        completedAssessments: 4,
        averageScore: 75.8,
        lastUpdated: '2024-10-18'
      },
      {
        id: 'social-studies',
        name: 'Social Studies',
        assessmentCount: 5,
        completedAssessments: 5,
        averageScore: 85.2,
        lastUpdated: '2024-10-23'
      }
    ]
  },
  'primary-5b': {
    id: 'primary-5b',
    name: 'Primary 5B',
    studentCount: 26,
    subjects: [
      {
        id: 'english',
        name: 'English Language',
        assessmentCount: 8,
        completedAssessments: 5,
        averageScore: 76.2,
        lastUpdated: '2024-10-19'
      },
      {
        id: 'mathematics',
        name: 'Mathematics',
        assessmentCount: 10,
        completedAssessments: 7,
        averageScore: 79.8,
        lastUpdated: '2024-10-21'
      },
      {
        id: 'science',
        name: 'Basic Science',
        assessmentCount: 6,
        completedAssessments: 3,
        averageScore: 73.5,
        lastUpdated: '2024-10-17'
      }
    ]
  }
}

export default function ClassDetailPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id as string

  const classData = mockClassData[classId as keyof typeof mockClassData]

  if (!classData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-muted-foreground">Class Not Found</h1>
          <p className="text-muted-foreground mt-2">The class you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 text-primary hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/teacher/classes/${classId}/subjects/${subjectId}`)
  }

  const handleBackClick = () => {
    router.push('/teacher/classes')
  }

  return (
    <div className="container mx-auto p-6">
      <ClassSubjectsView 
        classData={classData}
        onSubjectClick={handleSubjectClick}
        onBackClick={handleBackClick}
      />
    </div>
  )
}
