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
import { Input } from "@/components/ui/input";
import { useAssignSubjectToTeacher, useUsers } from "@/features/users.api";
import { useClasses } from "@/features/classes.api";

interface AssignSubjectDialogProps {
  trigger?: React.ReactNode;
  subjectId?: number | string;
  subjectName?: string;
  mode?: "class" | "teacher";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AssignSubjectDialog({
  trigger,
  subjectId,
  subjectName,
  mode = "class",
  open: controlledOpen,
  onOpenChange,
}: AssignSubjectDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;
  const assignTeacherMutation = useAssignSubjectToTeacher();

  const [selectedClass, setSelectedClass] = React.useState("");
  const [selectedTeacher, setSelectedTeacher] = React.useState("");
  const [academicYear, setAcademicYear] = React.useState("");
  const [term, setTerm] = React.useState("");
  const [assignedClasses, setAssignedClasses] = React.useState<
    Array<{ id: string; className: string; teacher: string | undefined }>
  >([]);

  const { data: teachersData } = useUsers({ role: "teacher", limit: 50 });
  const { data: availableClassesData } = useClasses();

  const availableClasses = availableClassesData?.items || [];

  const availableTeachers = teachersData?.items || [];
  const handleAddAssignment = () => {
    if (!selectedClass || !selectedTeacher) {
      toast.error("Please select both class and teacher");
      return;
    }

    const classObj = availableClasses.find((c) => c._id === selectedClass);
    const teacherObj = availableTeachers.find((t) => t._id === selectedTeacher);

    if (classObj && teacherObj) {
      const isAlreadyAssigned = assignedClasses.some(
        (c) => c.id === classObj._id
      );

      if (isAlreadyAssigned) {
        toast.error("This class is already assigned");
        return;
      }

      setAssignedClasses([
        ...assignedClasses,
        {
          id: classObj._id,
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
    if (mode === "teacher") {
      if (!subjectId) {
        toast.error("Missing subjectId");
        return;
      }
      if (!selectedTeacher || !academicYear) {
        toast.error("Please select a teacher and academic year");
        return;
      }
      assignTeacherMutation.mutate(
        {
          subjectId: String(subjectId),
          teacherId: selectedTeacher,
          academicYear,
          term: term || undefined,
        },
        {
          onSuccess: () => {
            setOpen(false);
            setSelectedTeacher("");
            setAcademicYear("");
            setTerm("");
          },
        }
      );
      return;
    }

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
            {mode === "teacher" ? "Assign to Teacher" : "Assign to Class"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Assign Subject{subjectName ? `: ${subjectName}` : ""}
          </DialogTitle>
          <DialogDescription>
            {mode === "teacher"
              ? "Assign this subject to a teacher for an academic year and term."
              : "Assign this subject to classes and designate teachers to teach each class."}
          </DialogDescription>
        </DialogHeader>

        {mode === "teacher" ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="teacher-select">Select Teacher</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger id="teacher-select" className="w-full">
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachersData?.items?.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.fullName || t.name || t.email || t._id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input
                  id="academicYear"
                  placeholder="e.g. 2024/2025"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="term">Term</Label>
                <Select value={term} onValueChange={setTerm}>
                  <SelectTrigger id="term" className="w-full">
                    <SelectValue placeholder="Select term (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Term 1">Term 1</SelectItem>
                    <SelectItem value="Term 2">Term 2</SelectItem>
                    <SelectItem value="Term 3">Term 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : (
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
                      <SelectItem key={classItem._id} value={classItem._id}>
                        {classItem.name}
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
                      <SelectItem key={teacher._id} value={teacher._id}>
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
        )}

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
            {mode === "teacher" ? "Assign" : "Save Assignments"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

