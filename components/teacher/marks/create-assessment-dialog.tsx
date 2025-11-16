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
import { Calendar } from "lucide-react";
import { useCreateAssessment } from "@/hooks/use-subjects";
import {
  useAcademicYears,
  useActiveAcademicYear,
  useTermsByAcademicYear,
} from "@/hooks/use-academic-terms";

interface CreateAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Context ids; academicYearId can be provided or typed in
  subjectId: string;
  classId: string;
  termId?: string;
  academicYearId?: string;
  remainingWeight?: number;
  onAssessmentCreated?: (id: string) => void;
}

interface NewAssessmentForm {
  title: string;
  category: string;
  date: string;
  weight: string; // store as string to avoid defaulting to 0
  maxScore: string; // store as string to avoid defaulting to 0
  description?: string;
  academicYear: string;
  term: string;
}

const assessmentCategories = [
  { value: "Quiz", label: "Quiz" },
  { value: "Homework", label: "Homework" },
  { value: "Classwork", label: "Classwork" },
  { value: "Test", label: "Test" },
  { value: "Exam", label: "Exam" },
];

export function CreateAssessmentDialog({
  open,
  onOpenChange,
  subjectId,
  classId,
  termId,
  academicYearId,
  remainingWeight,
  onAssessmentCreated,
}: CreateAssessmentDialogProps) {
  const [formData, setFormData] = useState<NewAssessmentForm>({
    title: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    weight: "",
    maxScore: "",
    description: "",
    academicYear: academicYearId ?? "",
    term: termId ?? "",
  });
  const [errors, setErrors] = useState<Partial<NewAssessmentForm>>({});

  const createMutation = useCreateAssessment();

  // Load AY and Terms
  const { data: academicYears, isLoading: ayLoading } = useAcademicYears();
  const { data: activeAcademicYear } = useActiveAcademicYear();
  const { data: terms, isLoading: termsLoading } = useTermsByAcademicYear(
    activeAcademicYear?._id
  );
  const openTerms = (terms ?? []).filter((t: any) => !!t.isOpen);

  // Default academic year to active one if none set
  useEffect(() => {
    if (!formData.academicYear && activeAcademicYear?._id) {
      setFormData((prev) => ({
        ...prev,
        academicYear: activeAcademicYear._id,
      }));
    }
  }, [activeAcademicYear?._id]);

  // Default term to provided prop (if open) or first open term
  useEffect(() => {
    if (!formData.term) {
      if (termId && openTerms.some((t: any) => t._id === termId)) {
        setFormData((prev) => ({ ...prev, term: termId }));
      } else if (openTerms.length > 0) {
        setFormData((prev) => ({ ...prev, term: openTerms[0]._id }));
      }
    }
  }, [termId, openTerms]);

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.date) newErrors.date = "Date is required";
    const weightNum = formData.weight ? Number(formData.weight) : NaN;
    if (!formData.weight || isNaN(weightNum) || weightNum <= 0) {
      newErrors.weight = "Weight must be greater than 0";
    } else {
      const cap = typeof remainingWeight === "number" ? remainingWeight : 100;
      if (weightNum > cap) {
        newErrors.weight = `Weight cannot exceed remaining ${cap}%`;
      }
    }
    const maxScoreNum = formData.maxScore ? Number(formData.maxScore) : NaN;
    if (!formData.maxScore || isNaN(maxScoreNum) || maxScoreNum <= 0) {
      newErrors.maxScore = "Max score must be greater than 0";
    }
    if (!formData.academicYear)
      newErrors.academicYear = "Academic Year ID is required";
    if (!formData.term) newErrors.term = "Term ID is required";
    // Enforce open term only
    if (formData.term && !openTerms.some((t: any) => t._id === formData.term)) {
      newErrors.term = "Only open terms can be used for creating assessments";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    createMutation.mutate(
      {
        academicYear: formData.academicYear,
        term: formData.term,
        subject: subjectId,
        class: classId,
        title: formData.title,
        description: formData.description || undefined,
        weight: Number(formData.weight),
        AssessmentType: formData.category, // enum string expected by backend
        deadline: new Date(formData.date).toISOString(),
        maxScore: Number(formData.maxScore),
      },
      {
        onSuccess: (res: any) => {
          onAssessmentCreated?.(res._id);
          // Reset minimal fields but keep AY/term
          setFormData((prev) => ({
            ...prev,
            title: "",
            category: "",
            date: new Date().toISOString().split("T")[0],
            weight: "",
            maxScore: "",
            description: "",
          }));
          onOpenChange(false);
        },
      }
    );
  };

  const handleInputChange = (
    field: keyof NewAssessmentForm,
    value: string | number
  ) => {
    // Keep numeric fields as strings to avoid defaulting to 0 on empty
    if (field === "weight" || field === "maxScore") {
      setFormData((prev) => ({ ...prev, [field]: String(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value as any }));
    }
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

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
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Quiz 1 - Grammar Basics"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger
                  className={errors.category ? "border-red-500" : ""}
                >
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

            <div className="space-y-2">
              <Label htmlFor="date">Deadline *</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className={errors.date ? "border-red-500" : ""}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (%) *</Label>
              <Input
                id="weight"
                type="number"
                min="1"
                max={typeof remainingWeight === "number" ? remainingWeight : 100}
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder={
                  typeof remainingWeight === "number"
                    ? `Max ${remainingWeight}%`
                    : "Enter weight"
                }
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
                min="1"
                value={formData.maxScore}
                onChange={(e) => handleInputChange("maxScore", e.target.value)}
                placeholder="e.g., 20"
                className={errors.maxScore ? "border-red-500" : ""}
              />
              {errors.maxScore && (
                <p className="text-sm text-red-500">{errors.maxScore}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year *</Label>
              <Select
                value={formData.academicYear}
                onValueChange={(value) =>
                  handleInputChange("academicYear", value)
                }
                disabled={ayLoading}
              >
                <SelectTrigger
                  className={errors.academicYear ? "border-red-500" : ""}
                >
                  <SelectValue
                    placeholder={
                      ayLoading ? "Loading..." : "Select Academic Year"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {(academicYears ?? []).map((ay: any) => (
                    <SelectItem key={ay._id} value={ay._id}>
                      {ay.name || ay.label || ay.year || ay._id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.academicYear && (
                <p className="text-sm text-red-500">{errors.academicYear}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Term *</Label>
              <Select
                value={formData.term}
                onValueChange={(value) => handleInputChange("term", value)}
                disabled={termsLoading || openTerms.length === 0}
              >
                <SelectTrigger className={errors.term ? "border-red-500" : ""}>
                  <SelectValue
                    placeholder={
                      termsLoading
                        ? "Loading..."
                        : openTerms.length === 0
                        ? "No open term"
                        : "Select Term"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {openTerms.map((t: any) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.name || t.label || t.title || `Term ${t.order}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.term && (
                <p className="text-sm text-red-500">{errors.term}</p>
              )}
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md text-sm">
            <p className="font-medium mb-1">Assessment Preview:</p>
            <p className="text-muted-foreground">
              {formData.title || "Assessment Title"} •{" "}
              {formData.category || "Category"} • Weight: {formData.weight}% •
              Max Score: {formData.maxScore}
            </p>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={
              createMutation.isPending ||
              openTerms.length === 0 ||
              (!!formData.term && !openTerms.some((t: any) => t._id === formData.term))
            }
            title={
              openTerms.length === 0
                ? "No open term available"
                : !!formData.term && !openTerms.some((t: any) => t._id === formData.term)
                ? "Select an open term"
                : undefined
            }
          >
            {createMutation.isPending ? "Creating..." : "Create Assessment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
