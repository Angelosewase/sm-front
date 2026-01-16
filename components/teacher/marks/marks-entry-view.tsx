"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Target, CheckCircle, AlertCircle, Edit, Plus, ChevronDown, ChevronUp, Users, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { MarksEntryDialog } from "./marks-entry-dialog"

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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showStats, setShowStats] = useState(false)
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

  const handleOpenDialog = (student: Student, editing: boolean = false) => {
    setSelectedStudent(student)
    setIsEditing(editing)
    setDialogOpen(true)
  }

  const handleDialogSave = (studentId: string, score: number | null, remarks: string) => {
    setStudents(prev => {
      const updated = prev.map(student => {
        if (student.id === studentId) {
          return { ...student, score, remarks }
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
    <div className="space-y-4">
      {/* Compact Header with Prominent Save Status */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{title}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
            <span>{className} • {subjectName}</span>
            <span>•</span>
            <span>Max Score: {maxScore}</span>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 ml-2"
            >
              {showDetails ? (
                <>Hide details <ChevronUp className="h-3 w-3" /></>
              ) : (
                <>Show details <ChevronDown className="h-3 w-3" /></>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              Saving...
            </div>
          )}
          {!isSaving && !hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Saved {formatTime(lastSaved)}
            </div>
          )}
          {!isSaving && hasUnsavedChanges && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4" />
                Unsaved changes
              </div>
              <Button size="sm" onClick={handleSaveChanges} disabled={isSaving} className="h-8">
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="h-8"
              >
                Discard
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Details Section */}
      {showDetails && (
        <div className="space-y-3   rounded-lg ">
          <div className="flex items-center gap-4 flex-wrap text-sm">
            <Badge className={getCategoryColor(category)}>
              {category}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(date)}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              {weight}% weight
            </div>
            {isSubmitted && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                Submitted for Review
              </Badge>
            )}
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 ml-auto"
            >
              {showStats ? 'Hide' : 'Show'} subject statistics
              {showStats ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>

          {/* Collapsible Statistics */}
          {showStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Total Students</span>
                </div>
                <div className="text-xl font-semibold">{students.length}</div>
                <div className="text-sm text-muted-foreground">Enrolled</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Completed</span>
                </div>
                <div className="text-xl font-semibold">{completedCount}</div>
                <div className="text-sm text-muted-foreground">{completionPercentage.toFixed(0)}% done</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Average Score</span>
                </div>
                <div className="text-xl font-semibold">
                  {completedCount > 0 ? averageScore.toFixed(1) : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Out of {maxScore}</div>
              </div>
              <div className={`rounded-lg p-4 border ${
                students.length - completedCount > 0 
                  ? 'bg-amber-50/80 border-amber-300/50' 
                  : 'bg-muted/50 border-border/50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {students.length - completedCount > 0 ? (
                    <Clock className="h-4 w-4 text-amber-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    students.length - completedCount > 0 ? 'text-amber-700' : 'text-muted-foreground'
                  }`}>
                    {students.length - completedCount > 0 ? 'Pending' : 'All Done'}
                  </span>
                </div>
                <div className="text-xl font-semibold">{students.length - completedCount}</div>
                <div className={`text-sm ${
                  students.length - completedCount > 0 ? 'text-amber-600' : 'text-muted-foreground'
                }`}>
                  {students.length - completedCount > 0 ? 'Need marks' : 'No pending'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prominent Marks Entry Table */}
      <Card className="border-0 shadow-none px-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Student Marks Entry</CardTitle>
            <div className="text-sm text-muted-foreground">
              {completedCount} of {students.length} completed
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-32">Admission No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="w-40 text-center">
                  <div className="font-semibold">Score / {maxScore}</div>
                </TableHead>
                <TableHead className="w-20 text-center">Grade</TableHead>
                <TableHead className="w-20 text-center">%</TableHead>
                <TableHead className="min-w-48">Remarks</TableHead>
                <TableHead className="w-32 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    No students found for this class yet.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student, index) => {
                  const percentage =
                    student.score !== null && maxScore > 0
                      ? (student.score / maxScore) * 100
                      : null
                  const hasScore = student.score !== null

                  return (
                    <TableRow 
                      key={student.id}
                      className={cn(
                        "hover: transition-colors",
                        !hasScore && "bg-amber-50/30"
                      )}
                    >
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {student.admissionNumber ?? student.studentId ?? "—"}
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-center">
                        {hasScore ? (
                          <div className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-50 rounded-md border border-blue-200">
                            <span className="text-lg font-bold text-blue-900">
                              {student.score?.toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center px-3 py-1.5 bg-gray-100 rounded-md border border-gray-300">
                            <span className="text-sm text-gray-500">Not entered</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn("font-semibold text-base", getGradeColor(student.score))}>
                          {getGrade(student.score)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn("font-medium", getGradeColor(student.score))}>
                          {percentage !== null ? `${percentage.toFixed(0)}%` : '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-2">
                          {student.remarks || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          onClick={() => handleOpenDialog(student, hasScore)}
                          disabled={isSubmitted}
                          className={cn(
                            "h-9 gap-2",
                            !hasScore && "bg-green-600 hover:bg-green-700"
                          )}
                        >
                          {hasScore ? (
                            <>
                              <Edit className="h-4 w-4" />
                              Edit
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              Add Score
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Marks Entry Dialog */}
      <MarksEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        student={selectedStudent}
        maxScore={maxScore}
        assessmentTitle={title}
        isEditing={isEditing}
        onSave={handleDialogSave}
      />
    </div>
  )
}