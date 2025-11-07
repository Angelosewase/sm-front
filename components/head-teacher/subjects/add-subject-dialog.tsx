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

export function AddSubjectDialog() {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subjectName = formData.get("subjectName");

    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      pending: `Adding subject: ${subjectName}`,
      success: "Subject added successfully!",
      error: "Failed to add subject",
    });

    setTimeout(() => {
      setOpen(false);
    }, 1500);
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
            Add a new subject to the school curriculum. Fill in the details
            below.
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
              <Label htmlFor="subjectCode">Subject Code</Label>
              <Input
                id="subjectCode"
                name="subjectCode"
                placeholder="e.g., MATH101"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select name="department" required>
                  <SelectTrigger id="department" className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Social Studies">
                      Social Studies
                    </SelectItem>
                    <SelectItem value="Languages">Languages</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Physical Education">
                      Physical Education
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Core">Core</SelectItem>
                    <SelectItem value="Elective">Elective</SelectItem>
                    <SelectItem value="Optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="creditHours">Credit Hours</Label>
                <Input
                  id="creditHours"
                  name="creditHours"
                  type="number"
                  placeholder="3"
                  min="1"
                  max="10"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="level">Level</Label>
                <Select name="level" required>
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gradeLevel">Grade Level(s)</Label>
              <Select name="gradeLevel" required>
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
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="Active" required>
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the subject..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prerequisites">
                Prerequisites (Optional)
              </Label>
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
            <Button type="submit">Add Subject</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

