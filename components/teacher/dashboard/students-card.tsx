"use client"

import Link from "next/link"
import { ArrowRight, Users } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface TeacherStudentListItem {
  id: string
  name: string
  email: string
  class?: {
    name: string | null
  }
}

interface TeacherStudentsCardProps {
  students?: TeacherStudentListItem[]
  isLoading?: boolean
  error?: string | null
}

export function TeacherStudentsCard({ students, isLoading, error }: TeacherStudentsCardProps) {
  const topStudents = (students ?? [])
    .slice()
    .slice(0, 4)

  return (
    <Card className="border-border/60 bg-card/80 h-full flex flex-col pb-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">My Students</CardTitle>
          <p className="text-sm text-muted-foreground">
            Quick view of your recent students
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Users className="size-3.5" />
          {students?.length ?? 0}
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
            <span>{error}</span>
          </div>
        ) : topStudents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 bg-muted/40 p-6 text-sm text-muted-foreground">
            No students found. Students will appear here once they are enrolled in your classes.
          </div>
        ) : (
          <ul className="space-y-2">
            {topStudents.map((student) => (
              <li key={student.id}>
                <Link
                  href={`/teacher/students/${student.id}`}
                  className="group flex items-center justify-between rounded-lg border border-transparent bg-muted/30 px-4 py-3 transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground group-hover:text-primary">
                      {student.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {student.class?.name ? (
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          Class: {student.class.name}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          No class assigned
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground transition group-hover:text-primary">
                    <span className="text-xs">View Student</span>
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
          <Link href="/teacher/students">
            View all students
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
