"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

interface CreateAssessmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssessmentCreated: (assessment: NewAssessment) => void
}

interface NewAssessment {
  title: string
  category: string
  date: string
  weight: number
  maxScore: number
}

const assessmentCategories = [
  { value: 'quiz', label: 'Quiz' },
  { value: 'homework', label: 'Homework' },
  { value: 'classwork', label: 'Classwork' },
  { value: 'test', label: 'Test' },
  { value: 'exam', label: 'Exam' }
]

export function CreateAssessmentDialog({ open, onOpenChange, onAssessmentCreated }: CreateAssessmentDialogProps) {
  const [formData, setFormData] = useState<NewAssessment>({
    title: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    weight: 10,
    maxScore: 20
  })
  const [errors, setErrors] = useState<Partial<NewAssessment>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: any = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    if (formData.weight <= 0 || formData.weight > 100) {
      newErrors.weight = 'Weight must be between 1 and 100'
    }

    if (formData.maxScore <= 0) {
      newErrors.maxScore = 'Max score must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onAssessmentCreated(formData)
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        weight: 10,
        maxScore: 20
      })
      setErrors({})
    } catch (error) {
      console.error('Error creating assessment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof NewAssessment, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Assessment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Assessment Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Quiz 1 - Grammar Basics"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {assessmentCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={errors.date ? 'border-red-500' : ''}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (%) *</Label>
              <Input
                id="weight"
                type="number"
                min="1"
                max="100"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
                className={errors.weight ? 'border-red-500' : ''}
              />
              {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxScore">Max Score *</Label>
              <Input
                id="maxScore"
                type="number"
                min="1"
                value={formData.maxScore}
                onChange={(e) => handleInputChange('maxScore', parseInt(e.target.value) || 0)}
                className={errors.maxScore ? 'border-red-500' : ''}
              />
              {errors.maxScore && <p className="text-sm text-red-500">{errors.maxScore}</p>}
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md text-sm">
            <p className="font-medium mb-1">Assessment Preview:</p>
            <p className="text-muted-foreground">
              {formData.title || 'Assessment Title'} • {formData.category || 'Category'} • 
              Weight: {formData.weight}% • Max Score: {formData.maxScore}
            </p>
          </div>
        </form>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Assessment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
