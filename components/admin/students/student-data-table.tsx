"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  IconCalendar,
  IconCircleCheckFilled,
  IconCircleDashed,
  IconMail,
  IconPhone,
  IconSchool,
  IconTransfer,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { createActionsColumn } from "@/components/datatable/helpers";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useChangeStudentClass,
  usePermanentlyDeleteStudent,
  useRestoreStudent,
  useStudents,
  useTrashStudent,
} from "@/hooks/use-students";
import { useClasses } from "@/hooks/use-classes";
import { useSchool } from "@/contexts/school-context";
import { Student, StudentStatus } from "@/types/students.dto";
import { toast } from "react-toastify";

const GRADE_LEVELS = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
] as const;

const STATUS_OPTIONS: { label: string; value: "all" | StudentStatus }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Transferred", value: "transferred" },
  { label: "Graduated", value: "graduated" },
];

const STATUS_ICON: Record<StudentStatus, React.ReactNode> = {
  active: <IconCircleCheckFilled className="mr-1 h-3 w-3 text-green-500" />,
  suspended: <IconCircleDashed className="mr-1 h-3 w-3 text-orange-500" />,
  transferred: <IconCircleDashed className="mr-1 h-3 w-3 text-blue-500" />,
  graduated: <IconCircleCheckFilled className="mr-1 h-3 w-3 text-emerald-500" />,
};

const STATUS_BADGE_VARIANT: Record<StudentStatus, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  suspended: "destructive",
  transferred: "secondary",
  graduated: "outline",
};

type StudentRow = Student & { id: string };

type StudentActionType = "trash" | "restore" | "permanent";

function useDebouncedValue<T>(value: T, delay = 400) {
  const [state, setState] = React.useState(value);

  React.useEffect(() => {
    const handle = window.setTimeout(() => setState(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);

  return state;
}

export function StudentDataTable() {
  const { school } = useSchool();
  const schoolId = school?.id;
  const isSchoolSelected = Boolean(schoolId);

  const [activeTab, setActiveTab] = React.useState<"all" | "trashed">("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedGrade, setSelectedGrade] = React.useState("");
  const [selectedClassId, setSelectedClassId] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<"" | StudentStatus>(
    ""
  );

  const debouncedSearch = useDebouncedValue(searchTerm);

  const queryParams = React.useMemo(
    () => ({
      schoolId: schoolId ?? undefined,
      limit: 100,
      page: 1,
      search: debouncedSearch || undefined,
      gradeLevel: selectedGrade || undefined,
      classId: selectedClassId || undefined,
      status: (selectedStatus || undefined) as StudentStatus | undefined,
      onlyTrashed: activeTab === "trashed" ? true : undefined,
    }),
    [schoolId, debouncedSearch, selectedGrade, selectedClassId, selectedStatus, activeTab]
  );

  const studentsQuery = useStudents(queryParams, {
    enabled: isSchoolSelected,
  });

  const resolvedData = React.useMemo<StudentRow[]>(() => {
    const items = studentsQuery.data?.data ?? [];
    return items.map((student) => ({
      ...student,
      id: (
        student._id ??
        student.studentId ??
        (typeof crypto !== "undefined"
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2))
      ).toString(),
    }));
  }, [studentsQuery.data]);

  const { data: classesResponse } = useClasses({ limit: 100 });
  const classes = React.useMemo(
    () => classesResponse?.data ?? [],
    [classesResponse?.data]
  );

  const filteredClassOptions = React.useMemo(() => {
    if (!selectedGrade) return [];
    return classes.filter((cls) => cls.gradeLevel === selectedGrade);
  }, [classes, selectedGrade]);

  const trashStudentMutation = useTrashStudent();
  const restoreStudentMutation = useRestoreStudent();
  const permanentlyDeleteStudentMutation = usePermanentlyDeleteStudent();

  const [confirmState, setConfirmState] = React.useState<{
    open: boolean;
    studentId: string;
    studentName: string;
    action: StudentActionType;
  }>({
    open: false,
    studentId: "",
    studentName: "",
    action: "trash",
  });

  const openConfirmation = React.useCallback(
    (action: StudentActionType, student: StudentRow) => {
      if (!student._id) {
        toast.error("No student identifier found for this action.");
        return;
      }
      setConfirmState({
        open: true,
        studentId: student._id,
        studentName: student.name,
        action,
      });
    },
    []
  );

  const resetConfirmation = React.useCallback(() => {
    setConfirmState({
      open: false,
      studentId: "",
      studentName: "",
      action: "trash",
    });
  }, []);

  const handleConfirm = React.useCallback(() => {
    const { studentId, action } = confirmState;
    if (!studentId) {
      return;
    }
    const onSuccess = () => resetConfirmation();
    if (action === "trash") {
      trashStudentMutation.mutate(studentId, { onSuccess });
    } else if (action === "restore") {
      restoreStudentMutation.mutate(studentId, { onSuccess });
    } else {
      permanentlyDeleteStudentMutation.mutate(studentId, { onSuccess });
    }
  }, [
    confirmState,
    permanentlyDeleteStudentMutation,
    resetConfirmation,
    restoreStudentMutation,
    trashStudentMutation,
  ]);

  const pendingByAction: Record<StudentActionType, boolean> = {
    trash: trashStudentMutation.isPending,
    restore: restoreStudentMutation.isPending,
    permanent: permanentlyDeleteStudentMutation.isPending,
  };

  const columns = React.useMemo<ColumnDef<StudentRow>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Student",
        cell: ({ row }) => {
          const student = row.original;
          const initials = getInitials(student.name);
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <StudentDetailViewer student={student} />
                <span className="text-xs text-muted-foreground">
                  {student.studentId ?? "—"}
                </span>
              </div>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
          const student = row.original;
          if (!student.email) {
            return <span className="text-xs text-muted-foreground">—</span>;
          }
          return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconMail className="h-4 w-4" />
              <span className="truncate max-w-[180px]">{student.email}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "gradeLevel",
        header: "Grade",
        cell: ({ row }) => {
          const grade =
            row.original.gradeLevel ?? row.original.class?.gradeLevel ?? "—";
          return (
            <Badge variant="outline" className="px-2 py-0 text-xs">
              {grade}
            </Badge>
          );
        },
      },
      {
        accessorKey: "class",
        header: "Class",
        cell: ({ row }) => {
          const className = row.original.class?.name ?? "Unassigned";
          return (
            <span className="text-sm font-medium text-foreground">
              {className}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const student = row.original;
          if (student.isTrashed) {
            return (
              <Badge
                variant="outline"
                className="border-destructive/40 px-2 text-xs text-destructive"
              >
                <IconTrash className="mr-1 h-3 w-3" /> Trashed
              </Badge>
            );
          }
          const status = student.status ?? "active";
          return (
            <Badge
              variant={STATUS_BADGE_VARIANT[status]}
              className="px-2 py-0 text-xs"
            >
              {STATUS_ICON[status]}
              {formatStatus(status)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "guardianName",
        header: "Guardian",
        cell: ({ row }) => {
          const student = row.original;
          if (!student.guardianName) {
            return <span className="text-xs text-muted-foreground">—</span>;
          }
          return (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">{student.guardianName}</span>
              {student.guardianPhoneNumber && (
                <span className="text-xs text-muted-foreground">
                  {student.guardianPhoneNumber}
                </span>
              )}
            </div>
          );
        },
      },
      createActionsColumn<StudentRow>((student) => {
        if (!student._id) {
          return [
            {
              label: "No actions available",
              onClick: () => {},
              disabled: true,
            },
          ];
        }

        if (student.isTrashed) {
          return [
            {
              label: "Restore",
              onClick: () => openConfirmation("restore", student),
              disabled: restoreStudentMutation.isPending,
            },
            {
              label: "Delete Permanently",
              onClick: () => openConfirmation("permanent", student),
              variant: "destructive",
              disabled: permanentlyDeleteStudentMutation.isPending,
            },
          ];
        }

        return [
          {
            label: "Move to Trash",
            variant: "destructive",
            onClick: () => openConfirmation("trash", student),
            disabled: trashStudentMutation.isPending,
          },
        ];
      }),
    ];
  }, [
    openConfirmation,
    permanentlyDeleteStudentMutation.isPending,
    restoreStudentMutation.isPending,
    trashStudentMutation.isPending,
  ]);

  const filterControls = (
    <div className="flex w-full flex-col gap-3 px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-md border">
            <Button
              type="button"
              variant={activeTab === "all" ? "default" : "outline"}
              size="sm"
              className={cn("rounded-none border-0", "rounded-l-md")}
              onClick={() => setActiveTab("all")}
              disabled={studentsQuery.isFetching}
            >
              All
            </Button>
            <Button
              type="button"
              variant={activeTab === "trashed" ? "default" : "outline"}
              size="sm"
              className={cn("rounded-none border-0", "rounded-r-md")}
              onClick={() => setActiveTab("trashed")}
              disabled={studentsQuery.isFetching}
            >
              Trash
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search name, ID, email..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-[200px] sm:w-[240px]"
          />
          <Select
            value={selectedGrade}
            onValueChange={(value) => {
              setSelectedGrade(value);
              setSelectedClassId("");
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="">All Grades</SelectItem> */}
              {GRADE_LEVELS.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedClassId}
            onValueChange={setSelectedClassId}
            disabled={!selectedGrade}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue
                placeholder={
                  selectedGrade ? "Class" : "Select grade first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="">All Classes</SelectItem> */}
              {filteredClassOptions.length === 0 && (
                <SelectItem value="__none__" disabled>
                  {selectedGrade
                    ? "No classes for grade"
                    : "Select grade first"}
                </SelectItem>
              )}
              {filteredClassOptions.map((cls) => (
                <SelectItem key={cls._id} value={cls._id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedStatus}
            onValueChange={(value) =>
              setSelectedStatus(value as "" | StudentStatus)
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.label} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  if (!isSchoolSelected) {
    return (
      <div className="px-4 py-8 text-sm text-muted-foreground">
        Select a school to manage students.
      </div>
    );
  }

  const dialogCopy: Record<
    StudentActionType,
    { title: string; description: string; actionLabel: string; destructive?: boolean }
  > = {
    trash: {
      title: "Move Student to Trash",
      description: `Move "${confirmState.studentName}" to the trash? You can restore them later.`,
      actionLabel: pendingByAction.trash ? "Moving..." : "Move to Trash",
      destructive: true,
    },
    restore: {
      title: "Restore Student",
      description: `Restore "${confirmState.studentName}" so they become active again?`,
      actionLabel: pendingByAction.restore ? "Restoring..." : "Restore",
    },
    permanent: {
      title: "Permanently Delete Student",
      description: `This will permanently delete "${confirmState.studentName}" and remove all assignments. This action cannot be undone.`,
      actionLabel: pendingByAction.permanent
        ? "Deleting..."
        : "Delete Permanently",
      destructive: true,
    },
  };

  const isCurrentActionPending = pendingByAction[confirmState.action];

  return (
    <>
      {studentsQuery.isError && (
        <div className="px-4 py-2 text-sm text-destructive">
          Failed to load students. Please try again.
        </div>
      )}
      <GenericDataTable<StudentRow>
        data={resolvedData}
        columns={columns}
        config={{
          enableDragDrop: false,
          enableSelection: false,
          enableColumnVisibility: true,
          enablePagination: true,
          enableSearch: false,
          pageSize: 10,
          pageSizeOptions: [10, 20, 30, 40, 50],
        }}
        getRowId={(row) => row.id}
        customToolbarActions={filterControls}
        columnVisibilityLabel="Customize Columns"
      />

      <AlertDialog
        open={confirmState.open}
        onOpenChange={(open) => {
          if (!open) {
            resetConfirmation();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogCopy[confirmState.action].title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogCopy[confirmState.action].description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCurrentActionPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isCurrentActionPending}
              className={
                dialogCopy[confirmState.action].destructive
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
            >
              {dialogCopy[confirmState.action].actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function StudentDetailViewer({ student }: { student: Student }) {
  const isMobile = useIsMobile();
  const hasIdentifier = Boolean(student._id);

  const primaryPhone = student.phoneNumber ?? (student as any).phone ?? "";
  const guardianPhone =
    student.guardianPhoneNumber ?? (student as any).parentPhone ?? "";

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left font-semibold">
          {student.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-2xl">
        <DrawerHeader className="gap-1">
          <DrawerTitle>{student.name}</DrawerTitle>
          <DrawerDescription>
            Student profile, academic records, and guardian information.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-6 text-sm">
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconUser className="h-4 w-4" />
              <span>Student ID: {student.studentId ?? "—"}</span>
            </div>
            {student.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconMail className="h-4 w-4" />
                <span>{student.email}</span>
              </div>
            )}
            {primaryPhone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconPhone className="h-4 w-4" />
                <span>{primaryPhone}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Grade Level
                </Label>
                <p className="font-medium">
                  {student.gradeLevel ?? student.class?.gradeLevel ?? "—"}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Current Class
                </Label>
                <p className="font-medium">{student.class?.name ?? "Unassigned"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Date of Birth
                </Label>
                <p className="font-medium">{formatDate(student.dob)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge
                    variant={STATUS_BADGE_VARIANT[student.status ?? "active"]}
                  >
                    {STATUS_ICON[student.status ?? "active"]}
                    {formatStatus(student.status ?? "active")}
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconSchool className="h-4 w-4" />
                <h3 className="font-semibold">Class Assignment</h3>
              </div>
              <ClassAssignmentDialog student={student} disabled={!hasIdentifier} />
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Current Class
                  </Label>
                  <p className="font-medium">{student.class?.name ?? "Unassigned"}</p>
                </div>
                <Badge variant="outline">
                  {student.gradeLevel ?? student.class?.gradeLevel ?? "—"}
                </Badge>
              </div>
            </div>
          </section>

          <Separator />

          <section className="flex flex-col gap-3">
            <h3 className="font-semibold">Guardian Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="font-medium">
                  {student.guardianName ?? (student as any).parentName ?? "—"}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <p className="font-medium">
                  {guardianPhone || "—"}
                </p>
              </div>
            </div>
            {student.guardianRelationShip && (
              <div>
                <Label className="text-xs text-muted-foreground">
                  Relationship
                </Label>
                <p className="font-medium capitalize">
                  {student.guardianRelationShip}
                </p>
              </div>
            )}
            {student.guardianEmail && (
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="font-medium">{student.guardianEmail}</p>
              </div>
            )}
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ClassAssignmentDialog({
  student,
  disabled,
}: {
  student: Student;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const initialGrade =
    student.gradeLevel ?? student.class?.gradeLevel ?? "";
  const initialClassId = student.classId ?? student.class?._id ?? "";
  const [selectedGrade, setSelectedGrade] = React.useState(initialGrade);
  const [selectedClassId, setSelectedClassId] = React.useState(
    initialClassId || ""
  );

  const { data: classesResponse } = useClasses({ limit:100 });
  const classes = React.useMemo(
    () => classesResponse?.data ?? [],
    [classesResponse?.data]
  );
  const filteredClasses = React.useMemo(() => {
    if (!selectedGrade) return [];
    return classes.filter((cls) => cls.gradeLevel === selectedGrade);
  }, [classes, selectedGrade]);

  const changeClassMutation = useChangeStudentClass();

  const handleAssignClass = () => {
    if (!student._id) {
      toast.error("Student identifier missing. Cannot update class.");
      return;
    }
    if (selectedClassId === "__unassigned__") {
      changeClassMutation.mutate(
        { id: student._id, payload: { classId: null } },
        { onSuccess: () => setOpen(false) }
      );
      return;
    }
    if (!selectedGrade) {
      toast.error("Select a grade before assigning a class.");
      return;
    }
    if (!selectedClassId) {
      toast.error("Please select a class to assign.");
      return;
    }
    changeClassMutation.mutate(
      { id: student._id, payload: { classId: selectedClassId } },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !disabled && setOpen(value)}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={disabled}>
          <IconTransfer className="mr-1 h-4 w-4" />
          Change Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Class to {student.name}</DialogTitle>
          <DialogDescription>
            Select the grade level to filter classes, then assign the student.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Current Assignment</Label>
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {student.class?.name ?? "Unassigned"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {student.gradeLevel ?? student.class?.gradeLevel ?? "—"}
                  </p>
                </div>
                <Badge variant="outline">Current</Badge>
              </div>
            </div>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label htmlFor="grade-select">Select Grade Level</Label>
            <Select
              value={selectedGrade}
              onValueChange={(value) => {
                setSelectedGrade(value);
                setSelectedClassId("");
              }}
            >
              <SelectTrigger id="grade-select" className="w-full">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="">Select grade</SelectItem> */}
                {GRADE_LEVELS.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="class-select">Select Class</Label>
            <Select
              value={selectedClassId}
              onValueChange={setSelectedClassId}
              disabled={!selectedGrade}
            >
              <SelectTrigger id="class-select" className="w-full">
                <SelectValue
                  placeholder={
                    selectedGrade ? "Select class" : "Select grade first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredClasses.length === 0 ? (
                  <SelectItem value="__none__" disabled>
                    {selectedGrade
                      ? `No classes for ${selectedGrade}`
                      : "Select grade first"}
                  </SelectItem>
                ) : (
                  filteredClasses.map((cls) => (
                    <SelectItem key={cls._id} value={cls._id}>
                      {cls.name}
                    </SelectItem>
                  ))
                )}
                {(student.classId || student.class?._id) && (
                  <SelectItem value="__unassigned__">
                    Remove class assignment
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          {selectedClassId && selectedClassId !== "__unassigned__" && (
            <div className="rounded-lg border border-primary/40 bg-primary/5 p-3">
              <p className="text-sm text-primary">
                {student.name} will be moved to{" "}
                {
                  filteredClasses.find((cls) => cls._id === selectedClassId)
                    ?.name
                }{" "}
                ({selectedGrade})
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={changeClassMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignClass}
            disabled={changeClassMutation.isPending}
          >
            {changeClassMutation.isPending ? "Updating..." : "Assign Class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getInitials(name?: string) {
  if (!name) return "ST";
  const [first = "", second = ""] = name.split(" ");
  return (first[0] ?? "") + (second[0] ?? "");
}

function formatStatus(status: StudentStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

