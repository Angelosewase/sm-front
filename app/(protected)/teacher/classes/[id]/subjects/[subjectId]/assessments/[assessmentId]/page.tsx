"use client"

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MarksEntryView } from '@/components/teacher/marks/marks-entry-view'

// Mock data - replace with actual API calls
const mockAssessmentData = {
  'quiz-1': {
    id: 'quiz-1',
    title: 'Quiz 1 - Grammar Basics',
    category: 'Quiz',
    date: '2024-10-15',
    weight: 10,
    maxScore: 20,
    className: 'Primary 5A',
    subjectName: 'English Language',
    students: [
      { id: 'std-001', name: 'Alice Johnson', admissionNumber: 'ADM001', score: 18, remarks: 'Excellent work' },
      { id: 'std-002', name: 'Bob Smith', admissionNumber: 'ADM002', score: 16, remarks: '' },
      { id: 'std-003', name: 'Carol Davis', admissionNumber: 'ADM003', score: 19, remarks: 'Outstanding' },
      { id: 'std-004', name: 'David Wilson', admissionNumber: 'ADM004', score: 14, remarks: 'Good effort' },
      { id: 'std-005', name: 'Emma Brown', admissionNumber: 'ADM005', score: 17, remarks: '' },
      { id: 'std-006', name: 'Frank Miller', admissionNumber: 'ADM006', score: 15, remarks: 'Needs improvement' },
      { id: 'std-007', name: 'Grace Lee', admissionNumber: 'ADM007', score: 20, remarks: 'Perfect score!' },
      { id: 'std-008', name: 'Henry Taylor', admissionNumber: 'ADM008', score: 13, remarks: '' },
      { id: 'std-009', name: 'Ivy Chen', admissionNumber: 'ADM009', score: 18, remarks: 'Well done' },
      { id: 'std-010', name: 'Jack Anderson', admissionNumber: 'ADM010', score: 16, remarks: '' }
    ],
    isSubmitted: false,
    lastSaved: '2024-10-20T10:30:00Z'
  },
  'homework-1': {
    id: 'homework-1',
    title: 'Homework 1 - Reading Comprehension',
    category: 'Homework',
    date: '2024-10-18',
    weight: 5,
    maxScore: 10,
    className: 'Primary 5A',
    subjectName: 'English Language',
    students: [
      { id: 'std-001', name: 'Alice Johnson', admissionNumber: 'ADM001', score: 9, remarks: '' },
      { id: 'std-002', name: 'Bob Smith', admissionNumber: 'ADM002', score: 8, remarks: '' },
      { id: 'std-003', name: 'Carol Davis', admissionNumber: 'ADM003', score: 10, remarks: 'Excellent' },
      { id: 'std-004', name: 'David Wilson', admissionNumber: 'ADM004', score: 7, remarks: '' },
      { id: 'std-005', name: 'Emma Brown', admissionNumber: 'ADM005', score: 8, remarks: '' },
      { id: 'std-006', name: 'Frank Miller', admissionNumber: 'ADM006', score: null, remarks: '' },
      { id: 'std-007', name: 'Grace Lee', admissionNumber: 'ADM007', score: 9, remarks: '' },
      { id: 'std-008', name: 'Henry Taylor', admissionNumber: 'ADM008', score: null, remarks: '' },
      { id: 'std-009', name: 'Ivy Chen', admissionNumber: 'ADM009', score: 8, remarks: '' },
      { id: 'std-010', name: 'Jack Anderson', admissionNumber: 'ADM010', score: 7, remarks: '' }
    ],
    isSubmitted: false,
    lastSaved: '2024-10-22T14:15:00Z'
  }
}

export default function AssessmentMarksPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id as string
  const subjectId = params.subjectId as string
  const assessmentId = params.assessmentId as string

  const assessmentData = mockAssessmentData[assessmentId as keyof typeof mockAssessmentData]

  if (!assessmentData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-muted-foreground">Assessment Not Found</h1>
          <p className="text-muted-foreground mt-2">The assessment you're looking for doesn't exist.</p>
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

  const handleBackClick = () => {
    router.push(`/teacher/classes/${classId}/subjects/${subjectId}`)
  }

  const handleScoreUpdate = (studentId: string, score: number | null, remarks: string) => {
    // In a real app, this would make an API call to save the score
    console.log('Score updated:', { studentId, score, remarks })
  }


  return (
    <div className="container mx-auto p-6">
      <MarksEntryView 
        assessmentData={assessmentData}
        onBackClick={handleBackClick}
        onScoreUpdate={handleScoreUpdate}
      />
    </div>
  )
}
