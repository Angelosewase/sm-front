"use client"

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MarksEntryView } from '@/components/teacher/marks/marks-entry-view'
import { useAssessment } from '@/hooks/use-subjects'
import { Skeleton } from '@/components/ui/skeleton'

export default function AssessmentMarksPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id as string
  const subjectId = params.subjectId as string
  const assessmentId = params.assessmentId as string

  const { data: assessment, isLoading } = useAssessment(assessmentId)

  const handleBackClick = () => {
    router.push(`/teacher/classes/${classId}/subjects/${subjectId}`)
  }

  const handleScoreUpdate = (studentId: string, score: number | null, remarks: string) => {
    // TODO: Wire to submissions/grades API when available
    console.log('Score updated:', { studentId, score, remarks })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(k => (<Skeleton key={k} className="h-24 w-full" />))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!assessment) {
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

  const assessmentData = {
    id: assessment._id,
    title: assessment.title,
    category: assessment.AssessmentType,
    date: assessment.deadline,
    weight: assessment.weight ?? 0,
    maxScore: assessment.maxScore ?? 0,
    className: '', // optional until we have class name field
    subjectName: '', // optional until we have subject name field
    students: [], // will be populated when submissions API is available
    isSubmitted: assessment.status === 'completed',
    lastSaved: assessment.updatedAt ?? assessment.createdAt ?? new Date().toISOString(),
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
