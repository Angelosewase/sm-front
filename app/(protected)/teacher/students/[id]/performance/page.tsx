"use client"

import React from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import StudentPerformanceView from "@/components/reports/student-performance-view"

export default function StudentPerformancePage() {
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string

  return (
    <div className="py-4 w-full">
      <div className="flex items-center justify-between px-4 lg:px-4 mb-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push(`/teacher/students/${studentId}`)}
          >
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back to Student Profile
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Student Performance</h1>
            <p className="text-muted-foreground">
              Detailed performance across all assessments
            </p>
          </div>
        </div>
      </div>

      <StudentPerformanceView />
    </div>
  )
}

