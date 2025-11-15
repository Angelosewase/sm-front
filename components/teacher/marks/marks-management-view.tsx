"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Calendar, Users, Target, TrendingUp, ChevronRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { CreateAssessmentDialog } from "./create-assessment-dialog"

interface Assessment {
  id: string
  title: string
  category: string
  date: string
  weight: number
  maxScore: number
  studentsCompleted: number
  averageScore: number
  status: 'pending' | 'in_progress' | 'completed'
}

interface Term {
  id: string
  name: string
  isActive: boolean
}

interface SubjectData {
  id: string
  name: string
  className: string
  studentCount: number
  currentTerm: string
  terms: Term[]
  assessments: Assessment[]
}

interface MarksManagementViewProps {
  subjectData: SubjectData
  onAssessmentClick: (assessmentId: string) => void
  onBackClick: () => void
  onTermChange: (termId: string) => void
  context?: { subjectId: string; classId: string; termId?: string; academicYearId?: string }
}

const ITEMS_PER_PAGE = 8

export function MarksManagementView({
  subjectData,
  onAssessmentClick,
  onBackClick,
  onTermChange,
  context,
}: MarksManagementViewProps) {
  const [selectedTerm, setSelectedTerm] = useState(subjectData.currentTerm)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const { name, className, studentCount, terms, assessments } = subjectData

  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment =>
      assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [assessments, searchQuery])

  const totalPages = Math.ceil(filteredAssessments.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedAssessments = filteredAssessments.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const getStatusBadge = (status: Assessment['status']) => {
    switch (status) {
      case 'completed':
        return { variant: "default" as const, text: "Completed", color: "bg-green-100 text-green-800" }
      case 'in_progress':
        return { variant: "secondary" as const, text: "In Progress", color: "bg-blue-100 text-blue-800" }
      case 'pending':
        return { variant: "outline" as const, text: "Pending", color: "bg-gray-100 text-gray-800" }
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'quiz': return "bg-purple-100 text-purple-800"
      case 'homework': return "bg-blue-100 text-blue-800"
      case 'test': return "bg-orange-100 text-orange-800"
      case 'exam': return "bg-red-100 text-red-800"
      case 'classwork': return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleTermSelect = (termId: string) => {
    setSelectedTerm(termId)
    onTermChange(termId)
    setSearchQuery("") // Clear search when changing terms
    setCurrentPage(1) // Reset pagination
  }

  const totalWeight = assessments.reduce((sum, assessment) => sum + assessment.weight, 0)
  const completedAssessments = assessments.filter(a => a.status === 'completed').length
  const averageScore = assessments.length > 0
    ? assessments.reduce((sum, a) => sum + (a.averageScore / a.maxScore) * 100, 0) / assessments.length
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {className}
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-muted-foreground">
          {className} • {studentCount} students
        </p>
      </div>

      {/* Term Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Term:</label>
        <Select value={selectedTerm} onValueChange={handleTermSelect}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {terms.map((term) => (
              <SelectItem key={term.id} value={term.id}>
                {term.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedAssessments} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeight}%</div>
            <p className="text-xs text-muted-foreground">
              Assessment weights
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Class performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((completedAssessments / assessments.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Assessments done
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assessments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Assessments</h2>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results Info */}
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            {filteredAssessments.length} assessment{filteredAssessments.length !== 1 ? 's' : ''} found
          </div>
        )}

        {/* Assessments List */}
        {filteredAssessments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground text-lg mb-2">No assessments yet</div>
              <div className="text-muted-foreground text-sm mb-4">
                Create your first assessment to start recording marks.
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-card rounded-lg border">
            {assessments.map((assessment, index) => {
              const statusBadge = getStatusBadge(assessment.status)
              const categoryColor = getCategoryColor(assessment.category)

              return (
                <div
                  key={assessment.id}
                  className={`flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors ${index !== assessments.length - 1 ? 'border-b' : ''
                    }`}
                  onClick={() => onAssessmentClick(assessment.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Target className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{assessment.title}</div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatDate(assessment.date)}</span>
                        <span>{assessment.weight}% weight</span>
                        <span>Max: {assessment.maxScore}</span>
                        <span>
                          {assessment.studentsCompleted}/{studentCount} completed
                        </span>
                        {assessment.averageScore > 0 && (
                          <span>
                            Avg: {assessment.averageScore}/{assessment.maxScore}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={categoryColor}>
                      {assessment.category}
                    </Badge>
                    <Badge className={statusBadge.color}>
                      {statusBadge.text}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <CreateAssessmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        subjectId={context?.subjectId ?? subjectData.id}
        classId={context?.classId ?? ''}
        termId={context?.termId ?? subjectData.currentTerm}
        academicYearId={context?.academicYearId}
        onAssessmentCreated={() => {
          // dialog will close itself on success; list will refetch via invalidation
          setIsCreateDialogOpen(false)
        }}
      />
    </div>
  )
}
