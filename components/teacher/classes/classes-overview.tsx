"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, CheckCircle, Clock } from "lucide-react"

interface ClassesOverviewProps {
  stats: {
    totalClasses: number
    totalSubjects: number
    totalStudents: number
    completedAssessments: number
    pendingAssessments: number
  }
}

export function ClassesOverview({ stats }: ClassesOverviewProps) {
  const {
    totalClasses,
    totalSubjects,
    totalStudents,
    completedAssessments,
    pendingAssessments
  } = stats

  return (
    <div className="space-y-6 mb-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Classes</span>
          </div>
          <div className="text-xl font-semibold">{totalClasses}</div>
          <div className="text-sm text-muted-foreground">
            {totalSubjects} subject{totalSubjects !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Students</span>
          </div>
          <div className="text-xl font-semibold">{totalStudents}</div>
          <div className="text-sm text-muted-foreground">Total enrolled</div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Completed</span>
          </div>
          <div className="text-xl font-semibold">{completedAssessments}</div>
          <div className="text-sm text-muted-foreground">Assessments</div>
        </div>

        <div className={`rounded-lg p-4 border ${
          pendingAssessments > 0 
            ? 'bg-amber-50/80 border-amber-300/50' 
            : 'bg-muted/50 border-border/50'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {pendingAssessments > 0 ? (
              <Clock className="h-4 w-4 text-amber-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <span className={`text-sm font-medium ${
              pendingAssessments > 0 ? 'text-amber-700' : 'text-muted-foreground'
            }`}>
              {pendingAssessments > 0 ? 'Pending' : 'All Done'}
            </span>
          </div>
          <div className="text-xl font-semibold">{pendingAssessments}</div>
          <div className={`text-sm ${
            pendingAssessments > 0 ? 'text-amber-600' : 'text-muted-foreground'
          }`}>
            {pendingAssessments > 0 ? 'Need attention' : 'No pending'}
          </div>
        </div>
      </div>
    </div>
  )
}
