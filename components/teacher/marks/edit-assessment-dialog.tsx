"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, AlertCircle } from "lucide-react";
import { useUpdateAssessment } from "@/hooks/use-assessments";
import { AssessmentType } from "@/lib/api/assessments";

interface EditAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: {
    id: string;
    title: string;
    category: string;
    date: string;
    weight: number;
    maxScore: number;
    description?: string;
  } | null;
  onAssessmentUpdated?: () => void;
}

interface EditAssessmentForm {
  title: string;
  category: string;
  weight: string; // store as string to avoid defaulting to 0
  maxScore: string; // store as string to avoid defaulting to 0
  description?: string;
}

const assessmentCategories = [
  { value: "Quiz", label: "Quiz" },
  { value: "Test", label: "Test" },
  { value: "Exam", label: "Exam" },
  { value: "Homework", label: "Homework" },
  { value: "Assignment", label: "Assignment" },
  { value: "Project", label: "Project" },
  { value: "Practical", label: "Practical" },
];

export function EditAssessmentDialog({
  open,
  onOpenChange,
  assessment,
  onAssessmentUpdated,
}: EditAssessmentDialogProps) {
  const [form, setForm] = useState<EditAssessmentForm>({
    title: "",
    category: "",
    weight: "",
    maxScore: "",
    description: "",
  });

  const [errors, setErrors] = useState<Partial<EditAssessmentForm>>({});

  // Update mutation
  const updateAssessmentMutation = useUpdateAssessment();

  // Reset form when assessment changes
  useEffect(() => {
    if (assessment) {
      setForm({
        title: assessment.title,
        category: assessment.category,
        weight: assessment.weight.toString(),
        maxScore: assessment.maxScore.toString(),
        description: assessment.description || "",
      });
      setErrors({});
    } else {
      setForm({
        title: "",
        category: "",
        weight: "",
        maxScore: "",
        description: "",
      });
      setErrors({});
    }
  }, [assessment]);

  const validateForm = (): boolean => {
    const newErrors: Partial<EditAssessmentForm> = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.category) {
      newErrors.category = "Category is required";
    }

    const weight = parseFloat(form.weight);
    if (isNaN(weight) || weight <= 0 || weight > 100) {
      newErrors.weight = "Weight must be between 0 and 100";
    }

    const maxScore = parseFloat(form.maxScore);
    if (isNaN(maxScore) || maxScore <= 0) {
      newErrors.maxScore = "Max score must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !assessment) return;

    const updateData = {
      title: form.title,
      AssessmentType: form.category as AssessmentType, // Cast to AssessmentType enum
      weight: parseFloat(form.weight),
      maxScore: parseFloat(form.maxScore),
      description: form.description || undefined,
    };

    updateAssessmentMutation.mutate(
      { id: assessment.id, dto: updateData },
      {
        onSuccess: () => {
          onAssessmentUpdated?.();
          onOpenChange(false);
        },
      }
    );
  };

  const handleInputChange = (field: keyof EditAssessmentForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!assessment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Assessment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Display */}
          {updateAssessmentMutation.error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="text-sm text-destructive">
                  {updateAssessmentMutation.error.message || "Failed to update assessment"}
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter assessment title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={form.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
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
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (%) *</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="0"
                className={errors.weight ? "border-red-500" : ""}
              />
              {errors.weight && (
                <p className="text-sm text-red-500">{errors.weight}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxScore">Max Score *</Label>
              <Input
                id="maxScore"
                type="number"
                min="0"
                step="0.1"
                value={form.maxScore}
                onChange={(e) => handleInputChange("maxScore", e.target.value)}
                placeholder="0"
                className={errors.maxScore ? "border-red-500" : ""}
              />
              {errors.maxScore && (
                <p className="text-sm text-red-500">{errors.maxScore}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter assessment description"
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateAssessmentMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateAssessmentMutation.isPending}>
              {updateAssessmentMutation.isPending ? "Updating..." : "Update Assessment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
