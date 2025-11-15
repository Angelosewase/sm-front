"use client"

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ClassSubjectsView } from '@/components/teacher'
import { useClass, useClassSubjects } from '@/hooks/use-classes'
import { Skeleton } from '@/components/ui/skeleton'

export default function ClassDetailPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id as string

  const { data: classInfo, isLoading: classLoading, error: classError } = useClass(classId)
  const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useClassSubjects(classId)

  const isLoading = classLoading || subjectsLoading
  const isError = classError || subjectsError

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/teacher/classes/${classId}/subjects/${subjectId}`)
  }

  const handleBackClick = () => {
    router.push('/teacher/classes')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(k => (<Skeleton key={k} className="h-24 w-full" />))}
        </div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (<Skeleton key={i} className="h-16 w-full" />))}
        </div>
      </div>
    )
  }

  if (isError || !classInfo) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-muted-foreground">Failed to load class</h1>
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

  const classData = {
    id: classInfo._id,
    name: classInfo.name,
    studentCount: classInfo.studentCount ?? 0,
    subjects: (subjects ?? []).map(s => ({
      id: s._id,
      name: s.name,
      assessmentCount: s.totalAssessments,
      completedAssessments: s.assessmentsDone,
      averageScore: s.averageMark ?? 0,
      lastUpdated: s.latestMarkDate ?? ''
    }))
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
