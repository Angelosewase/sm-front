"use client"

import Link from "next/link"
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardPlus,
  MessageSquare,
  Users,
} from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface QuickActionsCardProps {
  teacherName?: string
  className?: string
}

const actions = [
  {
    title: "Create assessment",
    description: "Plan a new quiz or test for your class.",
    href: "/teacher/classes",
    icon: ClipboardPlus,
    badge: "Assessments",
  },
  {
    title: "Update attendance",
    description: "Capture today’s attendance in seconds.",
    href: "/teacher/classes",
    icon: CalendarDays,
    badge: "Attendance",
  },
  {
    title: "Message guardians",
    description: "Send quick updates to families.",
    href: "/teacher/students",
    icon: MessageSquare,
    badge: "Communications",
  },
] as const

const secondaryLinks = [
  {
    label: "Manage classes",
    href: "/teacher/classes",
    icon: BookOpen,
  },
  {
    label: "Review students",
    href: "/teacher/students",
    icon: Users,
  },
  {
    label: "Open analytics",
    href: "/teacher/analytics",
    icon: BarChart3,
  },
] as const

export function QuickActionsCard({ teacherName, className }: QuickActionsCardProps) {
  const greetingName = teacherName?.split(" ")[0] ?? "there"

  return (
    <Card className={cn("", className)}>
      <CardHeader className="space-y-1">
        <Badge variant="outline" className="w-fit text-xs uppercase tracking-wide">
          Quick actions
        </Badge>
        <CardTitle className="text-2xl font-semibold">
          What would you like to do today, {greetingName}?
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Jump back into your most common tasks and keep your classes moving forward.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className=" space-y-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              asChild
              variant="outline"
              className="group justify-start gap-4 p-4"
            >
              <Link
                href={action.href}
                className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex items-start gap-3 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <action.icon className="size-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium text-foreground group-hover:text-primary">
                      {action.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  </span>
                </span>
                <Badge variant="secondary" className="w-fit text-xs">
                  {action.badge}
                </Badge>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-border/60 bg-muted/20 px-6 py-4">
        <p className="text-xs font-medium uppercase text-muted-foreground">
          Shortcuts
        </p>
        <div className="flex flex-wrap gap-2">
          {secondaryLinks.map((item) => (
            <Button key={item.label} asChild size="sm" variant="ghost" className="gap-2">
              <Link href={item.href}>
                <item.icon className="size-3.5" />
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}


