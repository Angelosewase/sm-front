"use client"

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MarksManagementView } from '@/components/teacher/marks/marks-management-view'
import { useSubjectAssessments, useSubjectStats } from '@/hooks/use-subjects'
import { useClass } from '@/hooks/use-classes'
import { Skeleton } from '@/components/ui/skeleton'

export default function SubjectMarksPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id as string
  const subjectId = params.subjectId as string

  const [term, setTerm] = React.useState<string | undefined>(undefined)

  const { data: classInfo } = useClass(classId)
  const { data: stats, isLoading: statsLoading } = useSubjectStats(subjectId, { classId, term })
  const { data: assessments, isLoading: assessmentsLoading } = useSubjectAssessments(subjectId, { classId, term })

  const isLoading = statsLoading || assessmentsLoading

  const handleAssessmentClick = (assessmentId: string) => {
    router.push(`/teacher/classes/${classId}/subjects/${subjectId}/assessments/${assessmentId}`)
  }

  const handleBackClick = () => {
    router.push(`/teacher/classes/${classId}`)
  }

  const handleTermChange = (termId: string) => {
    setTerm(termId)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(k => (<Skeleton key={k} className="h-24 w-full" />))}
        </div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (<Skeleton key={i} className="h-16 w-full" />))}
        </div>
      </div>
    )
  }

  // Build SubjectData for MarksManagementView
  const subjectData = {
    id: subjectId,
    name: assessments?.[0]?.class ? undefined : '', // placeholder; subject name not from this endpoint
    className: classInfo?.name ?? 'Class',
    studentCount: classInfo?.studentCount ?? 0,
    currentTerm: term ?? 'default-term',
    terms: [
      // If you have a terms API, replace this with live data
      { id: 'First Term 2024', name: 'First Term 2024', isActive: !term || term === 'First Term 2024' },
    ],
    assessments: (assessments ?? []).map((a) => ({
      id: a.assessmentId,
      title: a.title,
      category: a.assessmentType,
      date: a.createdAt,
      weight: a.weight,
      maxScore: a.maxScore,
      studentsCompleted: a.completedCount,
      averageScore: a.averageScore,
      status: (a.status || '').toLowerCase() as 'pending' | 'in_progress' | 'completed',
    })),
  }

  return (
    <div className="container mx-auto p-6">
      <MarksManagementView
        subjectData={subjectData as any}
        onAssessmentClick={handleAssessmentClick}
        onBackClick={handleBackClick}
        onTermChange={handleTermChange}
        context={{ subjectId, classId, termId: term }}
      />
    </div>
  )
}
