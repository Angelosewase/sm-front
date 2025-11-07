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
import { useCreateSubject } from "@/features/subjects.api";
import { CreateSubjectDto } from "@/types/subjects.dto";
import { useAuth } from "@/contexts/auth-context";

export function AddSubjectDialog() {
  const {userSchool} = useAuth()
  const [open, setOpen] = React.useState(false);
  const createSubjectMutation = useCreateSubject();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const subjectData: CreateSubjectDto = {
      subjectName: formData.get("subjectName") as string,
      subjectCode: formData.get("subjectCode") as string | undefined,
      shortName: formData.get("shortName") as string | undefined,
      maxScore: formData.get("maxScore") ? Number(formData.get("maxScore")) : undefined,
      category: formData.get("category") as string | undefined,
      minPassingScore: formData.get("minPassingScore") ? Number(formData.get("minPassingScore")) : undefined,
      school: userSchool?.id,
      department: formData.get("department") as string | undefined,
      creditHours: formData.get("creditHours") ? Number(formData.get("creditHours")) : undefined,
      level: formData.get("level") as string | undefined,
      gradeLevel: formData.get("gradeLevel") as string | undefined,
      status: formData.get("status") as string | undefined,
      prerequisites: formData.get("prerequisites") as string | undefined,
    };

    createSubjectMutation.mutate(subjectData, {
      onSuccess: () => {
        toast.success(`Subject ${subjectData.subjectName} added successfully!`);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(`Failed to add subject: ${error.message}`);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-4">
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
                <Label htmlFor="maxScore">Maximum Score (Optional)</Label>
                <Input
                  id="maxScore"
                  name="maxScore"
                  type="number"
                  placeholder="e.g., 100"
                  min="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="minPassingScore">Minimum Passing Score (Optional)</Label>
                <Input
                  id="minPassingScore"
                  name="minPassingScore"
                  type="number"
                  placeholder="e.g., 50"
                  min="0"
                />
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

            <div className="grid gap-2">
              <Label htmlFor="gradeLevel">Grade Level (Optional)</Label>
              <Select name="gradeLevel">
                <SelectTrigger id="gradeLevel" className="w-full">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grade 9">Grade 9</SelectItem>
                  <SelectItem value="Grade 10">Grade 10</SelectItem>
                  <SelectItem value="Grade 11">Grade 11</SelectItem>
                  <SelectItem value="Grade 12">Grade 12</SelectItem>
                  <SelectItem value="All Grades">All Grades</SelectItem>
                </SelectContent>
              </Select>
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