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
import { useCreateClass } from "@/hooks/use-classes";
import { useTeachers } from "@/hooks/use-teachers";
import { PlusIcon } from "lucide-react";
import { gradeLevels } from "@/lib/constants/grade-levels";

export function AddClassDialog() {
  const [open, setOpen] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState("");
  const [selectedGrade, setSelectedGrade] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("active");

  const createClassMutation = useCreateClass();
  const { data: teachersData, isLoading: isLoadingTeachers } = useTeachers({ limit: 100 });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const classData = {
      name: formData.get("className") as string,
      gradeLevel: selectedGrade,
      capacity: Number(formData.get("capacity")),
      description: formData.get("description") as string || undefined,
      status: selectedStatus as 'active' | 'inactive',
      classTeacher: selectedTeacher,
    };

    createClassMutation.mutate(classData, {
      onSuccess: () => {
        setOpen(false);
        // Reset form
        setSelectedTeacher("");
        setSelectedGrade("");
        setSelectedStatus("active");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mr-4">
        <PlusIcon className="w-4 h-4 mr-2" /> Add Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Create a new class by filling in the details below. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="className">Class Name</Label>
              <Input
                id="className"
                name="className"
                placeholder="e.g., Mathematics 101"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Select 
                  value={selectedGrade} 
                  onValueChange={setSelectedGrade}
                  required
                >
                  <SelectTrigger id="gradeLevel" className="w-full">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeLevels.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="teacher">Class Teacher</Label>
                <Select 
                  value={selectedTeacher} 
                  onValueChange={setSelectedTeacher}
                  required
                  disabled={isLoadingTeachers}
                >
                  <SelectTrigger id="teacher" className="w-full">
                    <SelectValue placeholder={isLoadingTeachers ? "Loading teachers..." : "Select teacher"} />
                  </SelectTrigger>
                  <SelectContent>
                    {teachersData?.items.map((teacher) => (
                      <SelectItem key={teacher._id} value={teacher._id}>
                        {teacher.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="capacity">Class Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  placeholder="30"
                  min="1"
                  max="100"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={selectedStatus} 
                  onValueChange={setSelectedStatus}
                  required
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the class"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createClassMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createClassMutation.isPending}>
              {createClassMutation.isPending ? "Creating..." : "Create Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
