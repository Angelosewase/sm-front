"use client"

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MarksManagementView } from '@/components/teacher/marks/marks-management-view'

// Mock data - replace with actual API calls
const mockSubjectData = {
  'primary-5a': {
    english: {
      id: 'english',
      name: 'English Language',
      className: 'Primary 5A',
      studentCount: 28,
      currentTerm: 'first-term-2024',
      terms: [
        { id: 'first-term-2024', name: 'First Term 2024', isActive: true },
        { id: 'second-term-2024', name: 'Second Term 2024', isActive: false },
        { id: 'third-term-2024', name: 'Third Term 2024', isActive: false }
      ],
      assessments: [
        {
          id: 'quiz-1',
          title: 'Quiz 1 - Grammar Basics',
          category: 'Quiz',
          date: '2024-10-15',
          weight: 10,
          maxScore: 20,
          studentsCompleted: 28,
          averageScore: 16.5,
          status: 'completed'
        },
        {
          id: 'homework-1',
          title: 'Homework 1 - Reading Comprehension',
          category: 'Homework',
          date: '2024-10-18',
          weight: 5,
          maxScore: 10,
          studentsCompleted: 26,
          averageScore: 8.2,
          status: 'in_progress'
        },
        {
          id: 'test-1',
          title: 'Mid-Term Test - Literature',
          category: 'Test',
          date: '2024-10-25',
          weight: 25,
          maxScore: 50,
          studentsCompleted: 0,
          averageScore: 0,
          status: 'pending'
        },
        {
          id: 'classwork-1',
          title: 'Classwork 1 - Essay Writing',
          category: 'Classwork',
          date: '2024-10-20',
          weight: 15,
          maxScore: 25,
          studentsCompleted: 28,
          averageScore: 20.8,
          status: 'completed'
        }
      ]
    },
    mathematics: {
      id: 'mathematics',
      name: 'Mathematics',
      className: 'Primary 5A',
      studentCount: 28,
      currentTerm: 'first-term-2024',
      terms: [
        { id: 'first-term-2024', name: 'First Term 2024', isActive: true },
        { id: 'second-term-2024', name: 'Second Term 2024', isActive: false },
        { id: 'third-term-2024', name: 'Third Term 2024', isActive: false }
      ],
      assessments: [
        {
          id: 'quiz-1',
          title: 'Quiz 1 - Fractions',
          category: 'Quiz',
          date: '2024-10-12',
          weight: 10,
          maxScore: 20,
          studentsCompleted: 28,
          averageScore: 17.2,
          status: 'completed'
        },
        {
          id: 'homework-1',
          title: 'Homework 1 - Word Problems',
          category: 'Homework',
          date: '2024-10-16',
          weight: 5,
          maxScore: 15,
          studentsCompleted: 28,
          averageScore: 12.8,
          status: 'completed'
        }
      ]
    }
  }
}

export default function SubjectMarksPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id as string
  const subjectId = params.subjectId as string

  const subjectData = mockSubjectData[classId as keyof typeof mockSubjectData]?.[subjectId as keyof typeof mockSubjectData['primary-5a']]

  if (!subjectData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-muted-foreground">Subject Not Found</h1>
          <p className="text-muted-foreground mt-2">The subject you're looking for doesn't exist.</p>
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

  const handleAssessmentClick = (assessmentId: string) => {
    router.push(`/teacher/classes/${classId}/subjects/${subjectId}/assessments/${assessmentId}`)
  }

  const handleBackClick = () => {
    router.push(`/teacher/classes/${classId}`)
  }

  const handleTermChange = (termId: string) => {
    // In a real app, this would fetch assessments for the selected term
    console.log('Term changed to:', termId)
  }

  return (
    <div className="container mx-auto p-6">
      <MarksManagementView 
        subjectData={subjectData as any}
        onAssessmentClick={handleAssessmentClick}
        onBackClick={handleBackClick}
        onTermChange={handleTermChange}
      />
    </div>
  )
}
