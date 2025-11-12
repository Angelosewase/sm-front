"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  IconCircleCheckFilled,
  IconCircleDashed,
  IconMail,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";

import {
  createActionsColumn,
  createDragColumn,
  createSelectColumn,
} from "@/components/datatable/helpers";
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import { Teacher } from "@/types/teachers.dto";
import {
  useBulkPermanentlyDeleteTeachers,
  useBulkRestoreTeachers,
  useBulkTrashTeachers,
  usePermanentlyDeleteTeacher,
  useRestoreTeacher,
  useTeachers,
  useTrashTeacher,
  useAssignClassesToTeacher,
} from "@/hooks/use-teachers";
import { useSubjects } from "@/hooks/use-subjects";
import { useClasses } from "@/hooks/use-classes";
import TeacherDetailViewer from "./teacher-detail-viewer";
import { AssignSubjectDialog } from "@/components/head-teacher/subjects/assign-subject-dialog";

type TeacherTab = "all" | "Active" | "On Leave" | "Inactive" | "trashed";
type TeacherActionType = "trash" | "restore" | "permanent";

function useDebouncedValue<T>(value: T, delay = 400) {
  const [state, setState] = React.useState(value);

  React.useEffect(() => {
    const handle = window.setTimeout(() => setState(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);

  return state;
}

interface TeacherDataTableProps {
  data?: Teacher[];
}

export function TeacherDataTable({ data = [] }: TeacherDataTableProps) {
  const [activeTab, setActiveTab] = React.useState<TeacherTab>("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>("");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("");
  const [selectedClass, setSelectedClass] = React.useState<string>("");
  const [selectedRows, setSelectedRows] = React.useState<Teacher[]>([]);
  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);
  const [activeTeacherId, setActiveTeacherId] = React.useState<string | undefined>(undefined);
  const [assignClassOpen, setAssignClassOpen] = React.useState(false);
  const [activeTeacherForClass, setActiveTeacherForClass] = React.useState<string | undefined>(undefined);
  const [selectedClassIdForAssign, setSelectedClassIdForAssign] = React.useState<string>("");

  const debouncedSearch = useDebouncedValue(searchTerm);

  const isTrashView = activeTab === "trashed";
  const statusFilter =
    activeTab !== "all" && activeTab !== "trashed" ? activeTab : undefined;

  const { data: subjectsResponse } = useSubjects();
  const { data: classesResponse } = useClasses({ limit: 100 });

  const teacherQuery = useTeachers({
    q: debouncedSearch || undefined,
    status: statusFilter,
    department: selectedDepartment || undefined,
    subjectId: selectedSubject || undefined,
    classId: selectedClass || undefined,
    includeTrashed: isTrashView ? undefined : true,
    onlyTrashed: isTrashView ? true : undefined,
    limit: 100,
    page: 1,
  });

  const resolvedData =
    teacherQuery.data?.items ??
    (isTrashView ? [] : teacherQuery.data?.items ?? data);

  const isLoading = teacherQuery.isLoading;

  const trashTeacherMutation = useTrashTeacher();
  const restoreTeacherMutation = useRestoreTeacher();
  const permanentlyDeleteTeacherMutation = usePermanentlyDeleteTeacher();
  const bulkTrashMutation = useBulkTrashTeachers();
  const bulkRestoreMutation = useBulkRestoreTeachers();
  const bulkPermanentDeleteMutation = useBulkPermanentlyDeleteTeachers();

  const [confirmState, setConfirmState] = React.useState<{
    open: boolean;
    teacherId: string;
    teacherName: string;
    action: TeacherActionType;
  }>({
    open: false,
    teacherId: "",
    teacherName: "",
    action: "trash",
  });

  const openConfirmation = React.useCallback(
    (action: TeacherActionType, teacher: Teacher) => {
      setConfirmState({
        open: true,
        teacherId: teacher._id,
        teacherName: teacher.user?.name ?? "this teacher",
        action,
      });
    },
    []
  );

  const resetConfirmation = () =>
    setConfirmState({
      open: false,
      teacherId: "",
      teacherName: "",
      action: "trash",
    });

  const handleConfirm = () => {
    const { teacherId, action } = confirmState;
    if (!teacherId) return;

    const onSuccess = () => resetConfirmation();

    if (action === "trash") {
      trashTeacherMutation.mutate(teacherId, { onSuccess });
    } else if (action === "restore") {
      restoreTeacherMutation.mutate(teacherId, { onSuccess });
    } else {
      permanentlyDeleteTeacherMutation.mutate(teacherId, { onSuccess });
    }
  };

  const selectedNonTrashedIds = React.useMemo(
    () =>
      selectedRows
        .filter((teacher) => !teacher.isTrashed)
        .map((teacher) => teacher._id),
    [selectedRows]
  );

  const selectedTrashedIds = React.useMemo(
    () =>
      selectedRows
        .filter((teacher) => teacher.isTrashed)
        .map((teacher) => teacher._id),
    [selectedRows]
  );

  const hasNonTrashedSelection = selectedNonTrashedIds.length > 0;
  const hasTrashedSelection = selectedTrashedIds.length > 0;

  const handleBulkTrash = () => {
    if (!selectedNonTrashedIds.length) return;
    bulkTrashMutation.mutate(selectedNonTrashedIds, {
      onSuccess: () => setSelectedRows([]),
    });
  };

  const handleBulkRestore = () => {
    if (!selectedTrashedIds.length) return;
    bulkRestoreMutation.mutate(selectedTrashedIds, {
      onSuccess: () => setSelectedRows([]),
    });
  };

  const handleBulkPermanentDelete = () => {
    if (!selectedTrashedIds.length) return;
    bulkPermanentDeleteMutation.mutate(selectedTrashedIds, {
      onSuccess: () => setSelectedRows([]),
    });
  };

  const pendingByAction: Record<TeacherActionType, boolean> = {
    trash: trashTeacherMutation.isPending,
    restore: restoreTeacherMutation.isPending,
    permanent: permanentlyDeleteTeacherMutation.isPending,
  };

  const departmentOptions = React.useMemo(() => {
    const departments = new Set<string>();
    for (const teacher of resolvedData ?? []) {
      const dept = teacher.department || teacher.qualification;
      if (dept) {
        departments.add(dept);
      }
    }
    return Array.from(departments).sort();
  }, [resolvedData]);

  const subjects = subjectsResponse?.items ?? [];
  const classes = classesResponse?.data ?? [];

  const assignClassMutation = useAssignClassesToTeacher();
  const activeTeacherForClassObj = React.useMemo(
    () => resolvedData?.find((t) => t._id === activeTeacherForClass),
    [resolvedData, activeTeacherForClass]
  );
  const availableClassesForActiveTeacher = React.useMemo(() => {
    if (!activeTeacherForClassObj) return classes;
    const assignedIds = new Set(
      (activeTeacherForClassObj.assignedClasses ?? []).map((c: any) => c._id)
    );
    return classes.filter((c: any) => !assignedIds.has(c._id));
  }, [classes, activeTeacherForClassObj]);

  const columns: ColumnDef<Teacher>[] = React.useMemo(() => {
    return [
      createDragColumn<Teacher>(),
      createSelectColumn<Teacher>(),
      {
        accessorKey: "name",
        header: "Teacher",
        enableHiding: false,
        cell: ({ row }) => {
          const teacher = row.original;
          const initials =
            (teacher.user?.name || "")
              .split(" ")
              .map((char) => char[0])
              .join("")
              .toUpperCase() || "T";

          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <TeacherDetailViewer item={teacher} />
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconMail className="h-4 w-4" />
            {row.original.user.email}
          </div>
        ),
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
          <Badge variant="outline" className="px-2 text-muted-foreground">
            {row.original.department || row.original.qualification || "—"}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const teacher = row.original;
          if (teacher.isTrashed) {
            return (
              <Badge
                variant="outline"
                className="border-destructive/40 px-1.5 text-destructive"
              >
                <IconTrash className="mr-1 h-3 w-3" />
                Trashed
              </Badge>
            );
          }

          return (
            <Badge variant="outline" className="px-1.5 text-muted-foreground">
              {teacher.status === "Active" ? (
                <IconCircleCheckFilled className="mr-1 h-3 w-3 text-green-500 dark:text-green-400" />
              ) : (
                <IconCircleDashed className="mr-1 h-3 w-3 text-orange-500" />
              )}
              {teacher.status ?? "Active"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "assignedClasses",
        header: () => <div className="w-full text-right">Classes</div>,
        cell: ({ row }) => (
          <div className="text-right font-medium">
            {row.original.assignedClasses?.length ?? 0}
          </div>
        ),
      },
      {
        accessorKey: "subjects",
        header: () => <div className="w-full text-right">Subjects</div>,
        cell: ({ row }) => (
          <div className="text-right font-medium">
            {row.original.subjectsCanTeach?.length ?? 0}
          </div>
        ),
      },
      createActionsColumn<Teacher>((teacher) => {
        if (teacher.isTrashed) {
          return [
            {
              label: "Restore",
              onClick: () => openConfirmation("restore", teacher),
              disabled: restoreTeacherMutation.isPending,
            },
            {
              label: "Delete Permanently",
              onClick: () => openConfirmation("permanent", teacher),
              variant: "destructive",
              disabled: permanentlyDeleteTeacherMutation.isPending,
            },
          ];
        }

        return [
          {
            label: "Assign Subject",
            onClick: () => {
              setActiveTeacherId(teacher._id);
              setAssignDialogOpen(true);
            },
          },
          {
            label: "Assign Class",
            onClick: () => {
              setActiveTeacherForClass(teacher._id);
              setSelectedClassIdForAssign("");
              setAssignClassOpen(true);
            },
          },
          {
            label: "Move to Trash",
            onClick: () => openConfirmation("trash", teacher),
            variant: "destructive",
            disabled: trashTeacherMutation.isPending,
          },
        ];
      }),
    ];
  }, [
    openConfirmation,
    permanentlyDeleteTeacherMutation.isPending,
    restoreTeacherMutation.isPending,
    trashTeacherMutation.isPending,
  ]);

  const primaryTabs: { label: string; value: TeacherTab }[] = [
    { label: "All", value: "all" },
    { label: "Trash", value: "trashed" },
  ];

  const statusButtons: { label: string; value: TeacherTab }[] = [
    { label: "Active", value: "Active" },
    { label: "On Leave", value: "On Leave" },
    { label: "Inactive", value: "Inactive" },
  ];

  const filterControls = (
    <div className="flex w-full flex-col gap-3 px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-md border">
            {primaryTabs.map((button, index) => (
              <Button
                key={button.value}
                type="button"
                variant={activeTab === button.value ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-none border-0",
                  index === 0 ? "rounded-l-md" : "",
                  index === primaryTabs.length - 1 ? "rounded-r-md" : ""
                )}
                onClick={() =>
                  setActiveTab(
                    button.value === "trashed" && isTrashView ? "all" : button.value
                  )
                }
                disabled={
                  button.value === "all"
                    ? isLoading
                    : isLoading
                }
              >
                {button.label}
              </Button>
            ))}
          </div>
          <div className="inline-flex overflow-hidden rounded-md border">
            {statusButtons.map((button, index) => (
              <Button
                key={button.value}
                type="button"
                variant={activeTab === button.value ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-none border-0",
                  index === 0 ? "rounded-l-md" : "",
                  index === statusButtons.length - 1 ? "rounded-r-md" : ""
                )}
                onClick={() => setActiveTab(button.value)}
                disabled={isLoading || isTrashView}
              >
                {button.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search name or email"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-[180px] sm:w-[220px]"
          />
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departmentOptions.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject._id} value={subject._id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls._id} value={cls._id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {/* <div className="flex items-center gap-1">
          <IconUsers className="h-4 w-4" />
          {teacherQuery.data?.total ?? resolvedData?.length ?? 0} total teachers
        </div> */}
        {selectedRows.length > 0 && (
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">
              {selectedRows.length} selected
            </span>
            {!isTrashView && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleBulkTrash}
                disabled={
                  isLoading ||
                  !hasNonTrashedSelection ||
                  bulkTrashMutation.isPending
                }
              >
                {bulkTrashMutation.isPending ? "Moving..." : "Move to Trash"}
              </Button>
            )}
            {isTrashView && (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleBulkRestore}
                  disabled={
                    isLoading ||
                    !hasTrashedSelection ||
                    bulkRestoreMutation.isPending
                  }
                >
                  {bulkRestoreMutation.isPending ? "Restoring..." : "Restore"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkPermanentDelete}
                  disabled={
                    isLoading ||
                    !hasTrashedSelection ||
                    bulkPermanentDeleteMutation.isPending
                  }
                >
                  {bulkPermanentDeleteMutation.isPending
                    ? "Deleting..."
                    : "Delete Permanently"}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const confirmationCopy: Record<
    TeacherActionType,
    { title: string; description: string; actionLabel: string; destructive?: boolean }
  > = {
    trash: {
      title: "Move Teacher to Trash",
      description: `Move "${confirmState.teacherName}" to the trash? You can restore them later.`,
      actionLabel: pendingByAction.trash ? "Moving..." : "Move to Trash",
      destructive: true,
    },
    restore: {
      title: "Restore Teacher",
      description: `Restore "${confirmState.teacherName}" so they become active again?`,
      actionLabel: pendingByAction.restore ? "Restoring..." : "Restore",
    },
    permanent: {
      title: "Permanently Delete Teacher",
      description: `This will permanently delete "${confirmState.teacherName}" and remove all assignments. This action cannot be undone.`,
      actionLabel: pendingByAction.permanent
        ? "Deleting..."
        : "Delete Permanently",
      destructive: true,
    },
  };

  const dialogContent = confirmationCopy[confirmState.action];
  const isCurrentActionPending = pendingByAction[confirmState.action];

  return (
    <>
      <GenericDataTable<Teacher>
        data={resolvedData ?? []}
        columns={columns}
        defaultTab="all"
        onTabChange={(tab) => setActiveTab(tab as TeacherTab)}
        getRowId={(row) => row._id}
        onSelectionChange={setSelectedRows}
        config={{
          enableDragDrop: true,
          enableSelection: true,
          enableColumnVisibility: true,
          enablePagination: true,
          enableSearch: false,
          pageSize: 10,
          pageSizeOptions: [10, 20, 30, 40, 50],
        }}
        columnVisibilityLabel="Customize Columns"
        customToolbarActions={filterControls}
      />

      <AssignSubjectDialog
        open={assignDialogOpen}
        onOpenChange={(open) => {
          setAssignDialogOpen(open);
          if (!open) setActiveTeacherId(undefined);
        }}
        mode="teacher"
        teacherId={activeTeacherId}
      />

      <Dialog
        open={assignClassOpen}
        onOpenChange={(open) => {
          setAssignClassOpen(open);
          if (!open) {
            setActiveTeacherForClass(undefined);
            setSelectedClassIdForAssign("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Class</DialogTitle>
            <DialogDescription>
              Choose a class to assign to this teacher.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="assign-class-select">Class</Label>
              <Select
                value={selectedClassIdForAssign}
                onValueChange={setSelectedClassIdForAssign}
                disabled={!availableClassesForActiveTeacher.length}
              >
                <SelectTrigger id="assign-class-select">
                  <SelectValue
                    placeholder={
                      availableClassesForActiveTeacher.length
                        ? "Choose a class"
                        : "No classes available"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableClassesForActiveTeacher.map((cls: any) => (
                    <SelectItem key={cls._id} value={cls._id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAssignClassOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={
                !selectedClassIdForAssign || assignClassMutation.isPending
              }
              onClick={() => {
                if (!activeTeacherForClass || !selectedClassIdForAssign) return;
                assignClassMutation.mutate(
                  {
                    id: activeTeacherForClass,
                    payload: { classIds: [selectedClassIdForAssign] },
                  },
                  {
                    onSuccess: () => {
                      setAssignClassOpen(false);
                      setSelectedClassIdForAssign("");
                      setActiveTeacherForClass(undefined);
                    },
                  }
                );
              }}
            >
              {assignClassMutation.isPending ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogContent.description}
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
                dialogContent.destructive
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
            >
              {dialogContent.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

