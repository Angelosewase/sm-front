"use client"

import Link from "next/link"
import { AlertCircle, ArrowRight, BookOpen, Users } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface TeacherClassListItem {
  id: string
  name: string
  studentCount: number
  subjectCount: number
  pendingAssessments?: number
}

interface TeacherClassesCardProps {
  classes?: TeacherClassListItem[]
  isLoading?: boolean
  error?: string | null
}

export function TeacherClassesCard({ classes, isLoading, error }: TeacherClassesCardProps) {
  const topClasses = (classes ?? [])
    .slice()
    .sort((a, b) => b.studentCount - a.studentCount)
    .slice(0, 4)

  return (
    <Card className="border-border/60 bg-card/80 h-full flex flex-col pb-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">My Classes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Quick view of the classes you&apos;re managing
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <BookOpen className="size-3.5" />
          {classes?.length ?? 0}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-14 animate-pulse rounded-lg bg-muted/60"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="size-4" />
            <span>{error}</span>
          </div>
        ) : topClasses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 bg-muted/40 p-6 text-sm text-muted-foreground">
            No classes assigned yet. Reach out to your administrator to get started.
          </div>
        ) : (
          <ul className="space-y-2">
            {topClasses.map((classItem) => (
              <li key={classItem.id}>
                <Link
                  href={`/teacher/classes/${classItem.id}`}
                  className="group flex items-center justify-between rounded-lg border border-transparent bg-muted/30 px-4 py-3 transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground group-hover:text-primary">
                      {classItem.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {classItem.studentCount} students
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="size-3" />
                        {classItem.subjectCount} subject{classItem.subjectCount === 1 ? "" : "s"}
                      </span>
                      {classItem.pendingAssessments ? (
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="size-3" />
                          {classItem.pendingAssessments} pending assessments
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground transition group-hover:text-primary">
                    <span className="text-xs">View Class</span>
                    <ArrowRight className="size-4" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter className="flex justify-end border-t border-border/60 bg-muted/20 pb-4">
        <Button asChild variant="ghost" size="sm" className="gap-1 text-sm">
          <Link href="/teacher/classes">
            View all classes
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


