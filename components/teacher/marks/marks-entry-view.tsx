"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Save, Send, Calendar, Target, Users, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Student {
  id: string
  name: string
  admissionNumber: string
  score: number | null
  remarks: string
}

interface AssessmentData {
  id: string
  title: string
  category: string
  date: string
  weight: number
  maxScore: number
  className: string
  subjectName: string
  students: Student[]
  isSubmitted: boolean
  lastSaved: string
}

interface MarksEntryViewProps {
  assessmentData: AssessmentData
  onBackClick: () => void
  onScoreUpdate: (studentId: string, score: number | null, remarks: string) => void
}

export function MarksEntryView({ 
  assessmentData, 
  onBackClick, 
  onScoreUpdate 
}: MarksEntryViewProps) {
  const [students, setStudents] = useState<Student[]>(assessmentData.students)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(new Date(assessmentData.lastSaved))
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const { title, category, date, weight, maxScore, className, subjectName, isSubmitted } = assessmentData

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const timeoutId = setTimeout(() => {
      handleAutoSave()
    }, 2000) // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [students, hasUnsavedChanges])

  const handleAutoSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      console.log("Changes saved automatically")
    } catch (error) {
      console.error("Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  const handleScoreChange = (studentId: string, value: string) => {
    const score = value === '' ? null : parseFloat(value)
    
    // Validate score
    if (score !== null && (score < 0 || score > maxScore)) {
      console.error(`Score must be between 0 and ${maxScore}`)
      return
    }

    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, score }
        : student
    ))
    setHasUnsavedChanges(true)
    
    const student = students.find(s => s.id === studentId)
    if (student) {
      onScoreUpdate(studentId, score, student.remarks)
    }
  }

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, remarks }
        : student
    ))
    setHasUnsavedChanges(true)
    
    const student = students.find(s => s.id === studentId)
    if (student) {
      onScoreUpdate(studentId, student.score, remarks)
    }
  }

  const getScoreValidation = (score: number | null) => {
    if (score === null) return { isValid: true, message: '' }
    if (score < 0 || score > maxScore) return { isValid: false, message: `Must be 0-${maxScore}` }
    return { isValid: true, message: '' }
  }

  const getGrade = (score: number | null) => {
    if (score === null) return 'N/A'
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B'
    if (percentage >= 60) return 'C'
    if (percentage >= 50) return 'D'
    return 'F'
  }

  const getGradeColor = (score: number | null) => {
    if (score === null) return 'text-gray-500'
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 70) return 'text-blue-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const completedCount = students.filter(s => s.score !== null).length
  const averageScore = students.filter(s => s.score !== null).reduce((sum, s) => sum + (s.score || 0), 0) / completedCount || 0
  const completionPercentage = (completedCount / students.length) * 100

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {subjectName}
        </Button>
        
        <div className="flex items-center gap-2 ml-auto">
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              Saving...
            </div>
          )}
          {!isSaving && !hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Saved at {formatTime(lastSaved)}
            </div>
          )}
          {!isSaving && hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              Unsaved changes
            </div>
          )}
        </div>
      </div>

      {/* Assessment Info */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">
            {className} • {subjectName}
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Badge className={getCategoryColor(category)}>
            {category}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(date)}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            {weight}% weight
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Max Score: {maxScore}
          </div>
          {isSubmitted && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              Submitted for Review
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              {completionPercentage.toFixed(0)}% completion
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
              {completedCount > 0 ? averageScore.toFixed(1) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {maxScore}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average %</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedCount > 0 ? ((averageScore / maxScore) * 100).toFixed(1) : 'N/A'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Class average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Marks Entry Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Marks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Admission No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="w-24">Score</TableHead>
                <TableHead className="w-16">Grade</TableHead>
                <TableHead className="w-16">%</TableHead>
                <TableHead className="min-w-48">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => {
                const validation = getScoreValidation(student.score)
                const percentage = student.score !== null ? (student.score / maxScore) * 100 : null
                
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-mono text-sm">{student.admissionNumber}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max={maxScore}
                        step="0.5"
                        value={student.score ?? ''}
                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                        className={cn(
                          "w-20 text-center",
                          !validation.isValid && "border-red-500 focus-visible:border-red-500"
                        )}
                        placeholder="0"
                        disabled={isSubmitted}
                      />
                      {!validation.isValid && (
                        <p className="text-xs text-red-500 mt-1">{validation.message}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={cn("font-medium", getGradeColor(student.score))}>
                        {getGrade(student.score)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn("font-medium", getGradeColor(student.score))}>
                        {percentage !== null ? percentage.toFixed(0) + '%' : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={student.remarks}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        placeholder="Optional remarks..."
                        className="min-w-48"
                        disabled={isSubmitted}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


    </div>
  )
}
