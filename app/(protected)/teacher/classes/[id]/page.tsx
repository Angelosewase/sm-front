"use client"

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ClassSubjectsView } from '@/components/teacher'
import { useClass, useClassSubjects } from '@/hooks/use-classes'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/auth-context'
import { useGetTeacherByUserId } from '@/hooks/use-teachers'
import { ClassesOverview } from '@/components/teacher/classes/classes-overview'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function ClassDetailPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id as string
  const { user } = useAuth()
  const { data: teacher } = useGetTeacherByUserId(user?.id ?? '')
  const teacherId = teacher?._id

  const { data: classInfo, isLoading: classLoading, error: classError } = useClass(classId)
  const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useClassSubjects(classId, teacherId ? { teacher: teacherId } : undefined)

  const isLoading = classLoading || subjectsLoading
  const isError = classError || subjectsError

  const handleSubjectClick = (subjectId: string) => {
    const query = teacherId ? `?teacher=${encodeURIComponent(teacherId)}` : ''
    router.push(`/teacher/classes/${classId}/subjects/${subjectId}${query}`)
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
      assessmentCount: s.assessments?.length ?? 0,
      // completedAssessments: s.assessmentsDone,
      // averageScore: s.averageMark ?? 0,
      // lastUpdated: s.updatedAt ?? ''
    }))
  }

  // Create overview stats similar to classes page
  const overviewStats = {
    totalClasses: 1,
    totalSubjects: classData.subjects.length,
    totalStudents: classData.studentCount,
    completedAssessments: 0, // This would come from API
    pendingAssessments: classData.subjects.reduce((sum, subject) => sum + subject.assessmentCount, 0),
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2 max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{classData.name}</h2>
          <span className="text-sm text-muted-foreground">
            {classData.subjects.length} subject{classData.subjects.length !== 1 ? "s" : ""} • {classData.studentCount} student{classData.studentCount !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Manage subjects, assessments, and track student progress.
        </p>

        {/* Overview Stats Section */}
        <ClassesOverview stats={overviewStats} />

        {/* Class Subjects View */}
        <ClassSubjectsView
          classData={classData}
          onSubjectClick={handleSubjectClick}
          onBackClick={handleBackClick}
        />
      </div>
    </div>
  )
}
