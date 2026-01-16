"use client"

import { BookOpen, ClipboardList, Target, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TeacherSummaryCardsProps {
  stats?: {
    totalClasses?: number
    totalStudents?: number
    totalSubjects?: number
    totalAssessments?: number
    totalAssessmentsCompleted?: number
    totalAssessmentsActive?: number
    totalAssessmentsPending?: number
  }
}

export function TeacherSummaryCards({ stats }: TeacherSummaryCardsProps) {
  const totalClasses = stats?.totalClasses ?? 0
  const totalStudents = stats?.totalStudents ?? 0
  const totalSubjects = stats?.totalSubjects ?? 0
  const totalAssessments = stats?.totalAssessments ?? 0
  const completed = stats?.totalAssessmentsCompleted ?? 0
  const active = stats?.totalAssessmentsActive ?? 0
  const pending = stats?.totalAssessmentsPending ?? 0

  const cards = [
    {
      title: "Active Classes",
      value: totalClasses,
      helper: `${totalSubjects} subject${totalSubjects === 1 ? "" : "s"} assigned`,
      icon: <BookOpen className="size-4 text-primary" />,
    },
    {
      title: "Students",
      value: totalStudents,
      helper: "Across all active classes",
      icon: <Users className="size-4 text-primary" />,
    },
    {
      title: "Assessments in Progress",
      value: active,
      helper: `${pending} awaiting grading`,
      icon: <ClipboardList className="size-4 text-primary" />,
    },
    {
      title: "Completed Assessments",
      value: completed,
      helper: `${totalAssessments} total assessments`,
      icon: <Target className="size-4 text-primary" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="border-border/60 bg-muted/50 shadow-sm transition hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <Badge variant="outline" className="bg-primary/5 text-xs">
              {card.icon}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight">
              {card.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{card.helper}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


