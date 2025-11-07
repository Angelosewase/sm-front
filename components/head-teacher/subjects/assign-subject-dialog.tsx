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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { IconX } from "@tabler/icons-react";

interface AssignSubjectDialogProps {
  trigger?: React.ReactNode;
  subjectId?: number;
  subjectName?: string;
}

export function AssignSubjectDialog({
  trigger,
  subjectId,
  subjectName,
}: AssignSubjectDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState("");
  const [selectedTeacher, setSelectedTeacher] = React.useState("");
  const [assignedClasses, setAssignedClasses] = React.useState<
    Array<{ id: string; className: string; teacher: string }>
  >([]);

  const availableClasses = [
    { id: "1", name: "Grade 9A", students: 28 },
    { id: "2", name: "Grade 9B", students: 30 },
    { id: "3", name: "Grade 10A", students: 25 },
    { id: "4", name: "Grade 10B", students: 27 },
    { id: "5", name: "Grade 11A", students: 24 },
    { id: "6", name: "Grade 11B", students: 26 },
    { id: "7", name: "Grade 12A", students: 22 },
    { id: "8", name: "Grade 12B", students: 23 },
  ];

  const availableTeachers = [
    { id: "1", name: "Sarah Johnson", department: "Mathematics" },
    { id: "2", name: "Michael Chen", department: "Science" },
    { id: "3", name: "Emma Davis", department: "English" },
    { id: "4", name: "David Kim", department: "Mathematics" },
    { id: "5", name: "Lisa Wong", department: "Science" },
    { id: "6", name: "James Wilson", department: "Social Studies" },
    { id: "7", name: "Nina Patel", department: "Languages" },
    { id: "8", name: "Carlos Rodriguez", department: "Arts" },
  ];

  const handleAddAssignment = () => {
    if (!selectedClass || !selectedTeacher) {
      toast.error("Please select both class and teacher");
      return;
    }

    const classObj = availableClasses.find((c) => c.id === selectedClass);
    const teacherObj = availableTeachers.find((t) => t.id === selectedTeacher);

    if (classObj && teacherObj) {
      const isAlreadyAssigned = assignedClasses.some(
        (c) => c.id === classObj.id
      );

      if (isAlreadyAssigned) {
        toast.error("This class is already assigned");
        return;
      }

      setAssignedClasses([
        ...assignedClasses,
        {
          id: classObj.id,
          className: classObj.name,
          teacher: teacherObj.name,
        },
      ]);

      setSelectedClass("");
      setSelectedTeacher("");
      toast.success(`Assigned to ${classObj.name}`);
    }
  };

  const handleRemoveAssignment = (classId: string) => {
    setAssignedClasses(assignedClasses.filter((c) => c.id !== classId));
    toast.success("Assignment removed");
  };

  const handleSubmit = () => {
    if (assignedClasses.length === 0) {
      toast.error("Please assign at least one class");
      return;
    }

    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      pending: `Assigning ${subjectName || "subject"} to ${assignedClasses.length} class(es)`,
      success: "Subject assignments saved successfully!",
      error: "Failed to save assignments",
    });

    setTimeout(() => {
      setOpen(false);
      setAssignedClasses([]);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Assign to Class
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Assign Subject{subjectName ? `: ${subjectName}` : ""}
          </DialogTitle>
          <DialogDescription>
            Assign this subject to classes and designate teachers to teach each
            class.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="class-select">Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class-select" className="w-full">
                  <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name} ({classItem.students} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacher-select">Select Teacher</Label>
              <Select
                value={selectedTeacher}
                onValueChange={setSelectedTeacher}
              >
                <SelectTrigger id="teacher-select" className="w-full">
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddAssignment}
            variant="outline"
            className="w-full"
          >
            Add Assignment
          </Button>

          {/* Display Assigned Classes */}
          {assignedClasses.length > 0 && (
            <div className="grid gap-2">
              <Label>Assigned Classes ({assignedClasses.length})</Label>
              <div className="rounded-md border p-3 max-h-[200px] overflow-y-auto">
                <div className="flex flex-col gap-2">
                  {assignedClasses.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between rounded-md border bg-muted/50 p-2"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {assignment.className}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Teacher: {assignment.teacher}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAssignment(assignment.id)}
                      >
                        <IconX className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false);
              setAssignedClasses([]);
            }}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Save Assignments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

