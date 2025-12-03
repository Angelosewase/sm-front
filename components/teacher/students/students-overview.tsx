"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Award, BookOpen } from "lucide-react"

interface StudentsOverviewProps {
  stats: {
    totalStudents: number
    averageScore: number
    topPerformers: number
    totalClasses: number
  }
}

export function StudentsOverview({ stats }: StudentsOverviewProps) {
  const {
    totalStudents,
    averageScore,
    topPerformers,
    totalClasses
  } = stats

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
          <p className="text-xs text-muted-foreground">
            Across {totalClasses} class{totalClasses !== 1 ? 'es' : ''}
          </p>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageScore}%</div>
          <p className="text-xs text-muted-foreground">
            Overall performance
          </p>
        </CardContent>
      </Card> */}

      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topPerformers}</div>
          <p className="text-xs text-muted-foreground">
            Scoring above 85%
          </p>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClasses}</div>
          <p className="text-xs text-muted-foreground">
            Classes taught
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

