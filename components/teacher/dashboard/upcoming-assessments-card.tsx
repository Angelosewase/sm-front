"use client"

import Link from "next/link"
import { CalendarClock, FileText, Loader2, MinusCircle } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface TeacherAssessmentListItem {
  id: string
  title: string
  classId?: string
  className?: string
  subjectId?: string
  subjectName?: string
  dueDate?: string
  status?: string
}

interface UpcomingAssessmentsCardProps {
  assessments?: TeacherAssessmentListItem[]
  isLoading?: boolean
  error?: string | null
}

const formatDate = (date?: string) => {
  if (!date) return "No due date"
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return "No due date"

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(parsed)
}

export function UpcomingAssessmentsCard({
  assessments,
  isLoading,
  error,
}: UpcomingAssessmentsCardProps) {
  return (
    <Card className="h-full border-border/60 bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Upcoming Assessments</CardTitle>
          <p className="text-sm text-muted-foreground">
            Assessments that need attention soon
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <CalendarClock className="size-3.5" />
          {assessments?.length ?? 0}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Loading assessments…
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : assessments && assessments.length > 0 ? (
          <ul className="space-y-3">
            {assessments.map((assessment) => (
              <li key={assessment.id}>
                <div className="flex flex-col gap-2 rounded-lg border border-border/50 bg-muted/20 p-4 transition hover:border-primary/40 hover:bg-primary/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {assessment.title}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {assessment.className ? (
                          <Badge variant="outline" className="text-xs">
                            {assessment.className}
                          </Badge>
                        ) : null}
                        {assessment.subjectName ? (
                          <Badge variant="outline" className="text-xs">
                            {assessment.subjectName}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <CalendarClock className="size-3" />
                      {formatDate(assessment.dueDate)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="size-3" />
                      {assessment.status ? assessment.status : "Pending"}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="gap-1 text-xs"
                    >
                      <Link
                        href={
                          assessment.classId && assessment.subjectId
                            ? `/teacher/classes/${assessment.classId}/subjects/${assessment.subjectId}/assessments/${assessment.id}`
                            : "/teacher/classes"
                        }
                      >
                        Grade now
                      </Link>
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/40 py-12 text-center text-sm text-muted-foreground">
            <MinusCircle className="size-6" />
            <span>No assessments due in the next few days.</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end border-t border-border/60 bg-muted/20">
        <Button asChild variant="ghost" size="sm" className="gap-1 text-sm">
          <Link href="/teacher/analytics">Open assessment analytics</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


