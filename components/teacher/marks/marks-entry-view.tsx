"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Calendar, Target, Users, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Student {
  id: string
  studentId?: string
  studentRecordId?: string
  name: string
  admissionNumber?: string
  email?: string
  phoneNumber?: string
  score: number | null
  remarks: string
  markId?: string
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

export interface StudentMarkChange {
  id: string
  studentId?: string
  studentRecordId?: string
  markId?: string
  score: number | null
  remarks: string
}

interface MarksEntryViewProps {
  assessmentData: AssessmentData
  onBackClick: () => void
  onSaveChanges: (changes: StudentMarkChange[]) => Promise<Record<string, string | undefined> | void>
}

export function MarksEntryView({
  assessmentData,
  onBackClick,
  onSaveChanges,
}: MarksEntryViewProps) {
  const [students, setStudents] = useState<Student[]>(assessmentData.students)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(new Date(assessmentData.lastSaved))
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const initialStudentsRef = useRef<Map<string, Student>>(new Map())

  const { title, category, date, weight, maxScore, className, subjectName, isSubmitted } = assessmentData

  useEffect(() => {
    setStudents(assessmentData.students)
    setLastSaved(new Date(assessmentData.lastSaved))
    setHasUnsavedChanges(false)
    initialStudentsRef.current = new Map(
      assessmentData.students.map(student => [student.id, { ...student }]),
    )
  }, [assessmentData.id, assessmentData.lastSaved, assessmentData.students])

  const detectChanges = useCallback((list: Student[]) => {
    return list.some(student => {
      const original = initialStudentsRef.current.get(student.id)
      if (!original) return true
      const scoreChanged = (student.score ?? null) !== (original.score ?? null)
      const remarksChanged = (student.remarks ?? "") !== (original.remarks ?? "")
      return scoreChanged || remarksChanged
    })
  }, [])

  const collectChanges = useCallback((list: Student[]): StudentMarkChange[] => {
    const changes: StudentMarkChange[] = []
    list.forEach(student => {
      const original = initialStudentsRef.current.get(student.id)
      const scoreChanged = (student.score ?? null) !== (original?.score ?? null)
      const remarksChanged = (student.remarks ?? "") !== (original?.remarks ?? "")

      if (!original || scoreChanged || remarksChanged) {
        changes.push({
          id: student.id,
          studentId: student.studentId,
          studentRecordId: student.studentRecordId,
          markId: student.markId,
          score: student.score ?? null,
          remarks: student.remarks ?? "",
        })
      }
    })
    return changes
  }, [])

  const handleScoreChange = (studentKey: string, value: string) => {
    const score = value === '' ? null : parseFloat(value)
    
    // Validate score
    if (score !== null && (score < 0 || (maxScore > 0 && score > maxScore))) {
      console.error(`Score must be between 0 and ${maxScore > 0 ? maxScore : "∞"}`)
      return
    }

    setStudents(prev => {
      const updated = prev.map(student => {
        if (student.id === studentKey) {
          return { ...student, score }
        }
        return student
      })
      setHasUnsavedChanges(detectChanges(updated))
      return updated
    })
  }

  const handleRemarksChange = (studentKey: string, remarks: string) => {
    setStudents(prev => {
      const updated = prev.map(student => {
        if (student.id === studentKey) {
          return { ...student, remarks }
        }
        return student
      })
      setHasUnsavedChanges(detectChanges(updated))
      return updated
    })
  }

  const handleDiscardChanges = () => {
    if (assessmentData.isSubmitted) return
    const restored = Array.from(initialStudentsRef.current.values()).map(student => ({ ...student }))
    setStudents(restored)
    setHasUnsavedChanges(false)
  }

  const handleSaveChanges = async () => {
    if (assessmentData.isSubmitted) return
    const changes = collectChanges(students)
    if (changes.length === 0) return

    setIsSaving(true)
    try {
      const markUpdates = (await onSaveChanges(changes)) ?? {}
      const finalStudents = students.map(student => {
        const updatedMarkId = markUpdates[student.id]
        if (updatedMarkId && updatedMarkId !== student.markId) {
          return { ...student, markId: updatedMarkId }
        }
        return student
      })
      setStudents(finalStudents)
      initialStudentsRef.current = new Map(
        finalStudents.map(s => [s.id, { ...s }]),
      )
      setHasUnsavedChanges(false)
      setLastSaved(new Date())
    } catch (error) {
      console.error("Failed to save changes:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getScoreValidation = (score: number | null) => {
    if (score === null) return { isValid: true, message: '' }
    if (score < 0) return { isValid: false, message: 'Must be ≥ 0' }
    if (maxScore > 0 && score > maxScore) return { isValid: false, message: `Must be 0-${maxScore}` }
    return { isValid: true, message: '' }
  }

  const getGrade = (score: number | null) => {
    if (score === null) return 'N/A'
    if (maxScore <= 0) return 'N/A'
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
    if (maxScore <= 0) return 'text-gray-500'
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 70) return 'text-blue-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const completedCount = students.filter(s => s.score !== null).length
  const totalScore = students.reduce((sum, s) => sum + (s.score ?? 0), 0)
  const averageScore = completedCount > 0 ? totalScore / completedCount : 0
  const completionPercentage = students.length > 0 ? (completedCount / students.length) * 100 : 0
  const averagePercentage = maxScore > 0 && completedCount > 0 ? (averageScore / maxScore) * 100 : null

  const getCategoryColor = (category: string) => {
    const safeCategory = category?.toLowerCase?.() ?? ''
    switch (safeCategory) {
      case 'quiz': return "bg-purple-100 text-purple-800"
      case 'homework': return "bg-blue-100 text-blue-800"
      case 'test': return "bg-orange-100 text-orange-800"
      case 'exam': return "bg-red-100 text-red-800"
      case 'classwork': return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '—'
    const dateValue = new Date(dateString)
    if (Number.isNaN(dateValue.getTime())) return '—'
    return dateValue.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    if (!date || Number.isNaN(date.getTime())) return '—'
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {subjectName || "subject"}
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
              {averagePercentage !== null ? `${averagePercentage.toFixed(1)}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Class average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Marks Entry Table */}
      <Card className="border-0 shadow-none px-0">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold">Student Marks</CardTitle>
            {!isSubmitted && hasUnsavedChanges && (
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSaveChanges} disabled={isSaving}>
                  Save changes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDiscardChanges}
                  disabled={isSaving}
                >
                  Discard
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="py-4 px-0 border-2 rounded-lg">
          <Table className="border-none">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Admission No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="w-24">
                  Score
                  {maxScore > 0 && (
                    <span className="block text-xs text-muted-foreground">
                      Max: {maxScore}
                    </span>
                  )}
                </TableHead>
                <TableHead className="w-16">Grade</TableHead>
                <TableHead className="w-16">%</TableHead>
                <TableHead className="min-w-48">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    No students found for this class yet.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student, index) => {
                  const validation = getScoreValidation(student.score)
                  const percentage =
                    student.score !== null && maxScore > 0
                      ? (student.score / maxScore) * 100
                      : null

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {student.admissionNumber ?? student.studentId ?? "—"}
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={maxScore > 0 ? maxScore : undefined}
                          step="0.5"
                          value={student.score ?? ''}
                          onChange={(e) => handleScoreChange(student.id, e.target.value)}
                          className={cn(
                            "w-20 text-center",
                            !validation.isValid && "border-red-500 focus-visible:border-red-500"
                          )}
                          placeholder={maxScore > 0 ? `0 - ${maxScore}` : "0"}
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
                          {percentage !== null ? `${percentage.toFixed(0)}%` : 'N/A'}
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
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


    </div>
  )
}
