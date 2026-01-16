// components/AddSubjectDialog.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useCreateSubject } from "@/hooks/use-subjects";
import { CreateSubjectDto } from "@/types/subjects.dto";
import { useSchool } from "@/contexts/school-context";
import { gradeLevels } from "@/lib/constants/grade-levels";
import { PlusIcon } from "lucide-react";

export function AddSubjectDialog() {
  const { school } = useSchool();
  const [open, setOpen] = React.useState(false);
  const createSubjectMutation = useCreateSubject();

  const [selectedGradeLevels, setSelectedGradeLevels] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<{ maxScore?: string; minPassingScore?: string }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const maxScoreValue = formData.get("maxScore");
    const minPassingScoreValue = formData.get("minPassingScore");

    // Reset errors
    setErrors({});

    // Validate maxScore
    if (!maxScoreValue || maxScoreValue === "") {
      setErrors((prev) => ({ ...prev, maxScore: "Maximum score is required" }));
      return;
    }

    const maxScore = Number(maxScoreValue);
    if (isNaN(maxScore) || maxScore <= 0) {
      setErrors((prev) => ({ ...prev, maxScore: "Maximum score must be greater than 0" }));
      return;
    }

    // Validate minPassingScore
    if (!minPassingScoreValue || minPassingScoreValue === "") {
      setErrors((prev) => ({ ...prev, minPassingScore: "Minimum passing score is required" }));
      return;
    }

    const minPassingScore = Number(minPassingScoreValue);
    if (isNaN(minPassingScore) || minPassingScore < 0) {
      setErrors((prev) => ({ ...prev, minPassingScore: "Minimum passing score must be 0 or greater" }));
      return;
    }

    // Validate that minPassingScore <= maxScore
    if (minPassingScore > maxScore) {
      setErrors((prev) => ({ ...prev, minPassingScore: "Minimum passing score cannot exceed maximum score" }));
      return;
    }

    const subjectData: CreateSubjectDto = {
      subjectName: formData.get("subjectName") as string,
      subjectCode: formData.get("subjectCode") as string | undefined,
      shortName: formData.get("shortName") as string | undefined,
      maxScore: maxScore,
      category: formData.get("category") as string | undefined,
      minPassingScore: minPassingScore,
      school: school?.id,
      department: formData.get("department") as string | undefined,
      creditHours: formData.get("creditHours") ? Number(formData.get("creditHours")) : undefined,
      level: formData.get("level") as string | undefined,
      gradeLevels: selectedGradeLevels.length ? selectedGradeLevels : undefined,
      status: formData.get("status") as string | undefined,
      prerequisites: formData.get("prerequisites") as string | undefined,
    };

    createSubjectMutation.mutate(subjectData, {
      onSuccess: () => {
        toast.success(`Subject ${subjectData.subjectName} added successfully!`);
        setOpen(false);
        setErrors({});
      },
      // Error is handled by the hook's onError callback
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mr-4">
          <PlusIcon className="size-4 mr-2" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Add a new subject to the school curriculum. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subjectName">Subject Name</Label>
              <Input
                id="subjectName"
                name="subjectName"
                placeholder="e.g., Mathematics"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subjectCode">Subject Code (Optional)</Label>
              <Input
                id="subjectCode"
                name="subjectCode"
                placeholder="e.g., MATH101"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shortName">Short Name (Optional)</Label>
              <Input
                id="shortName"
                name="shortName"
                placeholder="e.g., Math"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="maxScore">Maximum Score *</Label>
                <Input
                  id="maxScore"
                  name="maxScore"
                  type="number"
                  placeholder="e.g., 100"
                  min="1"
                  required
                  className={errors.maxScore ? "border-destructive" : ""}
                />
                {errors.maxScore && (
                  <p className="text-sm text-destructive">{errors.maxScore}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="minPassingScore">Minimum Passing Score *</Label>
                <Input
                  id="minPassingScore"
                  name="minPassingScore"
                  type="number"
                  placeholder="e.g., 50"
                  min="0"
                  required
                  className={errors.minPassingScore ? "border-destructive" : ""}
                />
                {errors.minPassingScore && (
                  <p className="text-sm text-destructive">{errors.minPassingScore}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Department (Optional)</Label>
              <Select name="department">
                <SelectTrigger id="department" className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Social Studies">Social Studies</SelectItem>
                  <SelectItem value="Languages">Languages</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Physical Education">Physical Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Select name="category">
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core</SelectItem>
                  <SelectItem value="elective">Elective</SelectItem>
                  <SelectItem value="optional">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="creditHours">Credit Hours (Optional)</Label>
              <Input
                id="creditHours"
                name="creditHours"
                type="number"
                placeholder="e.g., 3"
                min="1"
                max="10"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="level">Level (Optional)</Label>
              <Select name="level">
                <SelectTrigger id="level" className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
           
              <div className="flex flex-col gap-3">
                <Label>Grade Levels</Label>
                <div className="grid grid-cols-2 gap-2">
                  {gradeLevels.map((grade) => (
                    <label
                      key={grade.value}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        name="gradeLevels"
                        value={grade.value}
                        className="h-4 w-4"
                        defaultChecked={selectedGradeLevels.includes(grade.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGradeLevels((prev) => [...prev, grade.value]);
                          } else {
                            setSelectedGradeLevels((prev) => prev.filter((item) => item !== grade.value));
                          }
                        }}
                      />
                      <span>{grade.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status (Optional)</Label>
                <Select name="status" defaultValue="Active">
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prerequisites">Prerequisites (Optional)</Label>
                <Input
                  id="prerequisites"
                  name="prerequisites"
                  placeholder="e.g., Basic Mathematics"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSubjectMutation.isPending}>
                {createSubjectMutation.isPending ? "Adding..." : "Add Subject"}
              </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}