"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Student {
  id: string
  studentId?: string
  studentRecordId?: string
  name: string
  admissionNumber?: string
  score: number | null
  remarks: string
  markId?: string
}

interface MarksEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: Student | null
  maxScore: number
  assessmentTitle: string
  isEditing: boolean
  onSave: (studentId: string, score: number | null, remarks: string) => void
}

export function MarksEntryDialog({
  open,
  onOpenChange,
  student,
  maxScore,
  assessmentTitle,
  isEditing,
  onSave,
}: MarksEntryDialogProps) {
  const [score, setScore] = useState<string>(student?.score?.toString() ?? "")
  const [remarks, setRemarks] = useState<string>(student?.remarks ?? "")

  // Reset form when student changes
  React.useEffect(() => {
    if (student) {
      setScore(student.score?.toString() ?? "")
      setRemarks(student.remarks ?? "")
    }
  }, [student])

  const handleSave = () => {
    if (!student) return

    const scoreValue = score === "" ? null : parseFloat(score)
    
    // Validate score
    if (scoreValue !== null && (scoreValue < 0 || (maxScore > 0 && scoreValue > maxScore))) {
      return
    }

    onSave(student.id, scoreValue, remarks)
    onOpenChange(false)
  }

  const getScoreValidation = (scoreValue: string) => {
    if (scoreValue === "") return { isValid: true, message: '' }
    const num = parseFloat(scoreValue)
    if (isNaN(num)) return { isValid: false, message: 'Must be a number' }
    if (num < 0) return { isValid: false, message: 'Must be ≥ 0' }
    if (maxScore > 0 && num > maxScore) return { isValid: false, message: `Must be 0-${maxScore}` }
    return { isValid: true, message: '' }
  }

  const validation = getScoreValidation(score)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Marks" : "Enter Marks"} - {student?.name}
          </DialogTitle>
          <DialogDescription>
            {assessmentTitle} • Max Score: {maxScore}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="admission" className="text-right">
              Admission No.
            </Label>
            <div className="col-span-3">
              <Badge variant="outline" className="font-mono">
                {student?.admissionNumber ?? student?.studentId ?? "—"}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="score" className="text-right">
              Score
            </Label>
            <div className="col-span-3">
              <Input
                id="score"
                type="number"
                min="0"
                max={maxScore > 0 ? maxScore : undefined}
                step="0.5"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className={cn(
                  !validation.isValid && "border-red-500 focus-visible:border-red-500"
                )}
                placeholder={maxScore > 0 ? `0 - ${maxScore}` : "0"}
              />
              {!validation.isValid && (
                <p className="text-xs text-red-500 mt-1">{validation.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="remarks" className="text-right pt-2">
              Remarks
            </Label>
            <div className="col-span-3">
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional remarks about the student's performance..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!validation.isValid}
          >
            {isEditing ? "Update" : "Save"} Marks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
