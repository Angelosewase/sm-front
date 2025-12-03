"use client"

import Link from "next/link"
import { CalendarDays, GraduationCap, Mail, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TeacherHeroProps {
  name?: string
  email?: string
  meta?: {
    totalClasses?: number
    totalStudents?: number
    totalSubjects?: number
    currentTerm?: string | null
  }
  className?: string
}

const initialsFromName = (name?: string) => {
  if (!name) return "TN"
  const parts = name.trim().split(" ").filter(Boolean)
  if (parts.length === 0) return "TN"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function TeacherHero({ name, email, meta, className }: TeacherHeroProps) {
  const totalClasses = meta?.totalClasses ?? 0
  const totalStudents = meta?.totalStudents ?? 0
  const totalSubjects = meta?.totalSubjects ?? 0
  const currentTerm = meta?.currentTerm ?? undefined

  return (
    <Card className={cn("overflow-hidden border border-border/50", className)}>
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background h-40 w-full" />
      <CardHeader className="-mt-28 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
        <div className="flex items-start gap-4">
          <Avatar className="size-20 border-4 border-background shadow-lg">
            <AvatarFallback className="text-lg font-semibold">
              {initialsFromName(name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <Badge variant="secondary" className="uppercase tracking-wide">
              Teacher Dashboard
            </Badge>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {name ?? "Welcome back"}
            </CardTitle>
            {email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" />
                <span>{email}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {currentTerm ? (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <CalendarDays className="size-3" />
              {currentTerm}
            </Badge>
          ) : null}

          <Button asChild size="sm" variant="outline">
            <Link href="/teacher/classes">Manage Classes</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/teacher/students">Student Roster</Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}

function QuickStat({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode
  label: string
  value: number
  helper: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border-none bg-card/60 p-4">
      <div className="rounded-md bg-primary/10 p-2">{icon}</div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{helper}</p>
      </div>
    </div>
  )
}


