"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, BookOpen, TrendingUp, Calendar, CheckCircle, ChevronRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface Subject {
  id: string
  name: string
  assessmentCount: number
  completedAssessments: number
  averageScore: number
  lastUpdated: string
}

interface ClassData {
  id: string
  name: string
  studentCount: number
  subjects: Subject[]
}

interface ClassSubjectsViewProps {
  classData: ClassData
  onSubjectClick: (subjectId: string) => void
  onBackClick: () => void
}

const ITEMS_PER_PAGE = 8

export function ClassSubjectsView({ classData, onSubjectClick, onBackClick }: ClassSubjectsViewProps) {
  const { name, studentCount, subjects } = classData
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [subjects, searchQuery])

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedSubjects = filteredSubjects.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const getCompletionBadge = (completed: number, total: number) => {
    const percentage = (completed / total) * 100
    if (percentage === 100) return { variant: "default" as const, text: "Complete", color: "bg-green-100 text-green-800" }
    if (percentage >= 75) return { variant: "secondary" as const, text: "Almost Done", color: "bg-blue-100 text-blue-800" }
    if (percentage >= 50) return { variant: "outline" as const, text: "In Progress", color: "bg-yellow-100 text-yellow-800" }
    return { variant: "destructive" as const, text: "Behind", color: "bg-red-100 text-red-800" }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-muted-foreground">
          {studentCount} students • {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Class Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjects.reduce((sum, subject) => sum + subject.assessmentCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjects.reduce((sum, subject) => sum + subject.completedAssessments, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((subjects.reduce((sum, subject) => sum + subject.completedAssessments, 0) / subjects.reduce((sum, subject) => sum + subject.assessmentCount, 0)) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(subjects.reduce((sum, subject) => sum + subject.averageScore, 0) / subjects.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all subjects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Subjects</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results Info */}
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            {filteredSubjects.length} subject{filteredSubjects.length !== 1 ? 's' : ''} found
          </div>
        )}

        {/* Subjects List */}
        {filteredSubjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? 'No subjects match your search.' : 'No subjects found.'}
          </div>
        ) : (
          <div className="bg-card rounded-lg border">
            {paginatedSubjects.map((subject, index) => {
              const completionBadge = getCompletionBadge(subject.completedAssessments, subject.assessmentCount)
              
              return (
                <div
                  key={subject.id}
                  className={`flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    index !== paginatedSubjects.length - 1 ? 'border-b' : ''
                  }`}
                  onClick={() => onSubjectClick(subject.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{subject.name}</div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {subject.completedAssessments}/{subject.assessmentCount} assessments
                        </span>
                        <span className={cn("font-medium", getScoreColor(subject.averageScore))}>
                          {subject.averageScore.toFixed(1)}% avg
                        </span>
                        <span>
                          Updated {formatDate(subject.lastUpdated)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={completionBadge.color}>
                      {completionBadge.text}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredSubjects.length)} of {filteredSubjects.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
