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
import { IconX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { useClasses } from "@/lib/api/classes.api";
import {
  useAssignSubjectToTeacher,
  useAssignSubjectToClassAndTeacher,
  useAssignSubjectBulk,
} from "@/hooks/use-subjects";
import { useTerms, useAcademicYears } from "@/lib/api/academic-terms";
import { useTeachers } from "@/hooks/use-teachers";

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
  mode,
  open: controlledOpen,
  onOpenChange,
}: AssignSubjectDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const assignBulkMutation = useAssignSubjectBulk();
  const assignTeacherMutation = useAssignSubjectToTeacher();
  const assignClassAndTeacherMutation = useAssignSubjectToClassAndTeacher();

  const [selectedClass, setSelectedClass] = React.useState("");
  const [selectedTeacher, setSelectedTeacher] = React.useState("");
  const [academicYear, setAcademicYear] = React.useState("");
  const [term, setTerm] = React.useState("");

  const [assignedClasses, setAssignedClasses] = React.useState<
    Array<{ id: string; className: string; teacher: string | undefined }>
  >([]);

  const { data: teachersData } = useTeachers()
  const { data: availableClassesData } = useClasses();

  const availableClasses = availableClassesData?.data ?? [];
  const availableTeachers = teachersData?.items ?? [];

  const { data: academicYearsData } = useAcademicYears();
  const academicYears = academicYearsData ?? [];

  const { data: termsData } = useTerms();
  const terms = termsData ?? [];

  const handleAddAssignment = () => {
    if (!selectedClass || !selectedTeacher) {
      toast.error("Please select both class and teacher");
      return;
    }

    const classObj = availableClasses.find((c) => c._id === selectedClass);
    const teacherObj = availableTeachers.find((t) => t._id === selectedTeacher);

    if (!classObj || !teacherObj) return;

    const already = assignedClasses.some((c) => c.id === classObj._id);
    if (already) {
      toast.error("This class is already assigned");
      return;
    }

    setAssignedClasses((prev) => [
      ...prev,
      {
        id: classObj._id,
        className: classObj.name,
        teacher: teacherObj.user.name,
      },
    ]);

    setSelectedClass("");
    setSelectedTeacher("");
    toast.success(`Assigned to ${classObj.name}`);
  };

  const handleRemoveAssignment = (classId: string) => {
    setAssignedClasses((prev) => prev.filter((c) => c.id !== classId));
    toast.success("Assignment removed");
  };


  const handleSubmit = () => {
 /* ---- teacher mode --------------------------------------------------- */
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

    /* ---- class mode ----------------------------------------------------- */
    if (mode === "class") {
      if (!subjectId) {
        toast.error("Missing subjectId");
        return;
      }
      if (!selectedClass || !academicYear) {
        toast.error("Please select a class and academic year");
        return;
      }

      assignClassAndTeacherMutation.mutate(
        {
          subjectId: String(subjectId),
          classId: selectedClass,
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


    /* ---- bulk (multiple) mode ------------------------------------------ */
    if (assignedClasses.length > 0) {
      if (!subjectId || !academicYear) {
        toast.error("Missing subjectId or academic year");
        return;
      }

      const assignmentsPayload = assignedClasses.map((a) => ({
        classId: a.id,
        teacherId: availableTeachers.find((t) => t.user.name === a.teacher)?._id,
        academicYear,
        term: term || undefined,
      }));

      assignBulkMutation.mutate(
        { subjectId: String(subjectId), assignments: assignmentsPayload },
        {
          onSuccess: () => {
            toast.success(
              `Assigned ${subjectName || "subject"} to ${assignedClasses.length} class(es) successfully.`
            );
            setOpen(false);
            setAssignedClasses([]);
            setSelectedClass("");
            setSelectedTeacher("");
            setAcademicYear("");
            setTerm("");
          },
          onError: (err) =>
            toast.error(
              err?.message || "Bulk assignment failed (maybe duplicate assignment?)"
            ),
        }
      );

      return;
    }


    /* ---- bulk (multiple) mode ------------------------------------------ */
    if (assignedClasses.length === 0) {
      toast.error("Please assign at least one class");
      return;
    }

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        pending: `Assigning ${subjectName || "subject"} to ${assignedClasses.length} class(es)`,
        success: "Subject assignments saved successfully!",
        error: "Failed to save assignments",
      }
    );

    setTimeout(() => {
      setOpen(false);
      setAssignedClasses([]);
    }, 1500);
  };

  /* --------------------------------------------------------------------- */
  /*  UI                                                                  */
  /* --------------------------------------------------------------------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            {mode === "teacher" ? "Assign to Teacher" : "Assign to Class"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>
            Assign Subject{subjectName ? `: ${subjectName}` : ""}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {mode === "teacher"
              ? "Assign this subject to a teacher for an academic year and term."
              : "Assign this subject to classes and designate teachers to teach each class."}
          </DialogDescription>
        </DialogHeader>

        {/* ------------------- FORM GRID ------------------- */}
        <div className="flex flex-col gap-5 py-4">
          {/* ----- Class selector (only when NOT teacher mode) ----- */}
          <div className="flex flex-row gap-5 justify-between items-center mb-4">
            {mode === "class" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="class-select">Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class-select">
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClasses.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* ----- Teacher + Year/Term + Add button ----- */}

            {/* Teacher */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="teacher-select">Teacher</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger id="teacher-select">
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.user.name ?? t.user.email ?? t._id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-row gap-5 justify-between items-center mb-4">
            {/* Year + Term (stacked on mobile) */}
            {/* <div className="flex flex-col gap-4 sm:grid-cols-2 sm:gap-3"> */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger id="academicYear">
                  <SelectValue placeholder="Select Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((a) => (
                    <SelectItem key={a._id} value={a.label}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="term">Term (optional)</Label>
              <Select value={term} onValueChange={setTerm}>
                <SelectTrigger id="term">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  {terms.map((t) => (
                    <SelectItem key={t._id} value={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Add Assignment button – full width on mobile */}
          <Button
            type="button"
            variant="outline"
            className="md:col-span-2"
            onClick={handleAddAssignment}
          >
            Add Assignment
          </Button>
          {/* </div> */}

          {/* ----- Assigned classes list ----- */}
          {assignedClasses.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Assigned Classes ({assignedClasses.length})</Label>
              <div className="rounded-md border p-3 max-h-48 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  {assignedClasses.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between rounded-md border bg-muted/50 p-2"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{a.className}</span>
                        <span className="text-xs text-muted-foreground">
                          Teacher: {a.teacher}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAssignment(a.id)}
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

        {/* ------------------- FOOTER ------------------- */}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setOpen(false);
              setAssignedClasses([]);
            }}
          >
            Cancel
          </Button>
          <Button type="button" className="w-full sm:w-auto" onClick={handleSubmit}>
            {mode === "teacher" ? "Assign" : "Save Assignments"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}