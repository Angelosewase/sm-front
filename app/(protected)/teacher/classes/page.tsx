"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { ClassesGrid } from '@/components/teacher/classes/classes-grid'
import { ClassesOverview } from '@/components/teacher/classes/classes-overview'
import { useAuth } from '@/contexts/auth-context'
import { useTeacherClassesAssigned, useTeacherDashboardStats } from '@/hooks/use-teachers'
import { Skeleton } from '@/components/ui/skeleton'

export default function ClassesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const teacherId = user?.id || ''

  const { data: classesRes, isLoading: classesLoading, error: classesError } =
    useTeacherClassesAssigned(teacherId)
  const { data: statsRes, isLoading: statsLoading, error: statsError } =
    useTeacherDashboardStats(teacherId)

  const handleClassClick = (classId: string) => {
    router.push(`/teacher/classes/${classId}`)
  }

  console.log("the classes", classesRes)

  console.log("statsRes ",statsRes )

  const isLoading = classesLoading || statsLoading
  const isError = classesError || statsError

  const overviewStats = {
    totalClasses: statsRes?.totalClasses ?? 0,
    totalSubjects: statsRes?.totalSubjects ?? 0,
    totalStudents: statsRes?.totalStudents ?? 0,
    completedAssessments: statsRes?.assessments?.completed ?? 0,
    pendingAssessments: statsRes?.assessments?.pending ?? 0,
  }

  const classItems = (classesRes?.items || []).map((c) => ({
    id: c.id,
    name: c.name,
    subjectCount: c.subjectCount ?? 0,
    studentCount: c.studentCount ?? 0,
    pendingAssessments: c.pendingAssessments ?? 0,
  }))

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-muted-foreground">
          Manage your classes, view subjects, and track grading progress.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((k) => (
            <Skeleton key={k} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <ClassesOverview stats={overviewStats} />
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Classes</h2>
        {isError ? (
          <div className="text-sm text-destructive">Failed to load classes.</div>
        ) : classesLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <ClassesGrid classes={classItems} onClassClick={handleClassClick} />
        )}
      </div>
    </div>
  )
}
