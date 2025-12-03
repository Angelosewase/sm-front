"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { z } from "zod";
import {
  IconCircleCheckFilled,
  IconCircleDashed,
  IconTrendingUp,
  IconSearch,
} from "@tabler/icons-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createDragColumn,
  createSelectColumn,
  createActionsColumn,
} from "@/components/datatable/helpers";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSubjects } from "@/hooks/use-subjects";
import { useAssignSubjectToClass } from "@/hooks/use-classes";
import { Class } from "@/lib/api/classes";
import {
  useUpdateClass,
  useDeleteClass,
  useClasses,
  useRestoreClass,
  usePermanentlyDeleteClass,
  useBulkTrashClasses,
  useBulkRestoreClasses,
  useBulkPermanentlyDeleteClasses,
} from "@/hooks/use-classes";
import { useTeachers } from "@/hooks/use-teachers";
import {
  useAcademicYears,
  useActiveAcademicYear,
} from "@/hooks/use-academic-terms";
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
import ClassDetailViewer from "./class-detail-viewer";

export const classSchema = z.object({
  _id: z.string(),
  name: z.string(),
  gradeLevel: z.string(),
  academicYear: z.string().optional().nullable(),
  classTeacher: z
    .object({
      _id: z.string(),
      name: z.string(),
      email: z.string(),
    })
    .optional()
    .nullable(),
  teacherProfile: z
    .object({
      _id: z.string(),
      user: z.object({
        _id: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    })
    .optional()
    .nullable(),
  status: z.enum(["active", "inactive"]),
  assignedSubjects: z.array(z.object({
    _id: z.string(),
    name: z.string(),
    code: z.string(),
  })).optional(),
  studentCount: z.number(),
  capacity: z.number(),
  description: z.string().optional(),
  isTrashed: z.boolean().optional(),
  trashedAt: z.string().optional().nullable(),
});

export type ClassData = z.infer<typeof classSchema>;

interface ClassDataTableProps {
  data: Class[];
  isLoading?: boolean;
}

type ClassesTab = "all-classes" | "active" | "inactive" | "trashed";
type ClassActionType = "trash" | "restore" | "permanent";

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const handler = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}


export function ClassDataTable({ data, isLoading }: ClassDataTableProps) {
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [activeClass, setActiveClass] = React.useState<ClassData | null>(null);
  const [selectedSubjectIds, setSelectedSubjectIds] = React.useState<string[]>([]);

  const { data: subjects } = useSubjects({ limit: 100 });
  const assignSubjectToClass = useAssignSubjectToClass();
  const [activeTab, setActiveTab] = React.useState<ClassesTab>("all-classes");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [gradeLevel, setGradeLevel] = React.useState<string | undefined>(
    undefined
  );
  const [academicYear, setAcademicYear] = React.useState<string | undefined>(
    undefined
  );
  const [selectedRows, setSelectedRows] = React.useState<ClassData[]>([]);

  const debouncedSearch = useDebouncedValue(searchTerm);

  const { data: academicYearsData } = useAcademicYears();
  const { data: activeAcademicYear } = useActiveAcademicYear();

  React.useEffect(() => {
    if (!academicYear && activeAcademicYear?.label) {
      setAcademicYear(activeAcademicYear.label);
    }
  }, [activeAcademicYear, academicYear]);

  const queryParams = React.useMemo(
    () => ({
      page: 1,
      limit: 100,
      search: debouncedSearch || undefined,
      gradeLevel,
      academicYear,
      includeTrashed: true,
      includeTeacherProfile: true,
    }),
    [debouncedSearch, gradeLevel, academicYear]
  );

  const { data: classesResponse, isLoading: isLoadingClasses } =
    useClasses(queryParams);

  const resolvedData = classesResponse?.data ?? data;
  const isTableLoading = isLoading || isLoadingClasses;

  const nonTrashedData = React.useMemo(
    () => resolvedData.filter((item) => !item.isTrashed),
    [resolvedData]
  );
  const trashedData = React.useMemo(
    () => resolvedData.filter((item) => !!item.isTrashed),
    [resolvedData]
  );

  const selectionCount = selectedRows.length;
  const selectedNonTrashedIds = React.useMemo(
    () =>
      selectedRows.filter((item) => !item.isTrashed).map((item) => item._id),
    [selectedRows]
  );
  const selectedTrashedIds = React.useMemo(
    () => selectedRows.filter((item) => item.isTrashed).map((item) => item._id),
    [selectedRows]
  );

  const filteredData = React.useMemo(() => {
    switch (activeTab) {
      case "active":
        return nonTrashedData.filter((item) => item.status === "active");
      case "inactive":
        return nonTrashedData.filter((item) => item.status === "inactive");
      case "trashed":
        return trashedData;
      default:
        return nonTrashedData;
    }
  }, [activeTab, nonTrashedData, trashedData]);

  const trashClassMutation = useDeleteClass();
  const restoreClassMutation = useRestoreClass();
  const permanentlyDeleteClassMutation = usePermanentlyDeleteClass();
  const bulkTrashMutation = useBulkTrashClasses();
  const bulkRestoreMutation = useBulkRestoreClasses();
  const bulkPermanentDeleteMutation = useBulkPermanentlyDeleteClasses();

  const [confirmState, setConfirmState] = React.useState<{
    open: boolean;
    classId: string;
    className: string;
    action: ClassActionType;
  }>({
    open: false,
    classId: "",
    className: "",
    action: "trash",
  });

  const openConfirmation = (action: ClassActionType, row: ClassData) => {
    setConfirmState({
      open: true,
      classId: row._id,
      className: row.name,
      action,
    });
  };

  const resetConfirmationState = () =>
    setConfirmState({
      open: false,
      classId: "",
      className: "",
      action: "trash",
    });

  const handleBulkTrash = () => {
    if (!selectedNonTrashedIds.length) return;
    bulkTrashMutation.mutate(selectedNonTrashedIds, {
      onSuccess: () => {
        setSelectedRows([]);
      },
    });
  };

  const handleBulkRestore = () => {
    if (!selectedTrashedIds.length) return;
    bulkRestoreMutation.mutate(selectedTrashedIds, {
      onSuccess: () => {
        setSelectedRows([]);
      },
    });
  };

  const handleBulkPermanentDelete = () => {
    if (!selectedTrashedIds.length) return;
    bulkPermanentDeleteMutation.mutate(selectedTrashedIds, {
      onSuccess: () => {
        setSelectedRows([]);
      },
    });
  };

  const handleConfirm = () => {
    if (!confirmState.classId) {
      return;
    }

    const onSuccess = () => {
      resetConfirmationState();
    };

    if (confirmState.action === "trash") {
      trashClassMutation.mutate(confirmState.classId, { onSuccess });
    } else if (confirmState.action === "restore") {
      restoreClassMutation.mutate(confirmState.classId, { onSuccess });
    } else {
      permanentlyDeleteClassMutation.mutate(confirmState.classId, {
        onSuccess,
      });
    }
  };

  const columns: ColumnDef<ClassData>[] = [
    createDragColumn<ClassData>(),
    createSelectColumn<ClassData>(),
    {
      accessorKey: "name",
      header: "Class Name",
      cell: ({ row }) => {
        return <ClassDetailViewer item={row.original} />;
      },
      enableHiding: false,
    },
    {
      accessorKey: "gradeLevel",
      header: "Grade Level",
      cell: ({ row }) => (
        <div className="w-24">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.gradeLevel}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "classTeacher",
      header: "Teacher",
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {row.original.teacherProfile?.user?.name || "No teacher assigned"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`flex items-center gap-1 px-1.5 ${row.original.isTrashed
            ? "text-destructive border-destructive/40"
            : "text-muted-foreground"
            }`}
        >
          {row.original.isTrashed ? (
            <>Trashed</>
          ) : row.original.status === "active" ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleDashed />
          )}
          {!row.original.isTrashed &&
            row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1)}
        </Badge>
      ),
    },
    {
      accessorKey: "studentCount",
      header: () => <div className="w-full text-right">Enrolled</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.original.studentCount}
        </div>
      ),
    },
    {
      accessorKey: "capacity",
      header: () => <div className="w-full text-right">Capacity</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">{row.original.capacity}</div>
      ),
    },
    {
      accessorKey: "assignedSubjects",
      header: () => <div className="w-full text-right">Subjects</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">{row.original.assignedSubjects ? row.original.assignedSubjects.length : 0}</div>
      ),
    },
    createActionsColumn<ClassData>((row) => {
      if (row.isTrashed) {
        return [
          {
            label: "Restore",
            onClick: () => openConfirmation("restore", row),
            disabled: restoreClassMutation.isPending,
          },
          {
            label: "Delete Permanently",
            onClick: () => openConfirmation("permanent", row),
            variant: "destructive",
            disabled: permanentlyDeleteClassMutation.isPending,
          },
        ];
      }

      return [
        {
          label: "Assign Subjects",
          onClick: () => {
            setActiveClass(row);
            setSelectedSubjectIds([]);
            setAssignOpen(true);
          },
        },
        {
          label: "Move to Trash",
          onClick: () => openConfirmation("trash", row),
          variant: "destructive",
          disabled: trashClassMutation.isPending,
        },
      ];
    }),
  ];

  const gradeLevels = React.useMemo(
    () => [
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
    ],
    []
  );

  const isTrashView = activeTab === "trashed";
  const hasNonTrashedSelection = selectedNonTrashedIds.length > 0;
  const hasTrashedSelection = selectedTrashedIds.length > 0;

  const statusButtons: { label: string; value: ClassesTab }[] = [
    { label: "All", value: "all-classes" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const items = subjects?.items ?? [];
  const toggleSubject = (id: string) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const handleAssign = () => {
    if (!activeClass || selectedSubjectIds.length === 0) return;
    const classId = String((activeClass as any)._id ?? activeClass._id);
    assignSubjectToClass.mutate(
      { classId, subjectIds: selectedSubjectIds },
      {
        onSuccess: () => {
          setAssignOpen(false);
          setSelectedSubjectIds([]);
        },
      }
    );
  };

  const filterControls = (
    <div className="flex w-full flex-col gap-3 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center ">
          {statusButtons.map((button, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === statusButtons.length - 1;
            let roundedClass = "";
            if (isFirst) roundedClass = "rounded-none rounded-l-md";
            else if (isLast) roundedClass = "rounded-none rounded-r-md";
            else roundedClass = "rounded-none";
            return (
              <Button
                key={button.value}
                type="button"
                variant={activeTab === button.value ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(button.value)}
                disabled={isTableLoading || isTrashView}
                className={roundedClass}
              >
                {button.label}
              </Button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center  rounded-md  p-0.5">
          <Button
            type="button"
            variant={!isTrashView ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("all-classes")}
            disabled={isTableLoading || !isTrashView}
            className="rounded-none rounded-l-md"
          >
            Active Classes
          </Button>
          <Button
            type="button"
            variant={isTrashView ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("trashed")}
            disabled={isTableLoading || isTrashView}
            className="rounded-none rounded-r-md"
          >
            Trash
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-between items-center gap-16">
        <div className="relative  flex-1">
          <IconSearch className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search classes..."
            className="pl-8"
            disabled={isTableLoading}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={gradeLevel ?? "all"}
            onValueChange={(value) =>
              setGradeLevel(value === "all" ? undefined : value)
            }
            disabled={isTableLoading}
          >
            <SelectTrigger className="w-[140px] sm:w-[160px]">
              <SelectValue placeholder="Grade level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All grades</SelectItem>
              {gradeLevels.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={academicYear ?? "all"}
            onValueChange={(value) =>
              setAcademicYear(value === "all" ? undefined : value)
            }
            disabled={isTableLoading}
          >
            <SelectTrigger className="w-[150px] sm:w-[180px]">
              <SelectValue placeholder="Academic year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {academicYearsData?.map((year) => (
                <SelectItem key={year._id} value={year.label}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectionCount > 0 && (
        <div className="flex w-full flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setGradeLevel(undefined);
                setAcademicYear(activeAcademicYear?.label || undefined);
                setActiveTab("all-classes");
              }}
              disabled={isTableLoading}
            >
              Reset
            </Button>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {selectionCount > 0 && (
              <Badge variant="secondary" className="font-normal">
                {selectionCount} selected
              </Badge>
            )}
            {isTrashView ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleBulkRestore}
                  disabled={
                    isTableLoading ||
                    !hasTrashedSelection ||
                    bulkRestoreMutation.isPending
                  }
                >
                  {bulkRestoreMutation.isPending
                    ? "Restoring..."
                    : "Restore Selected"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkPermanentDelete}
                  disabled={
                    isTableLoading ||
                    !hasTrashedSelection ||
                    bulkPermanentDeleteMutation.isPending
                  }
                >
                  {bulkPermanentDeleteMutation.isPending
                    ? "Deleting..."
                    : "Delete Selected"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBulkTrash}
                disabled={
                  isTableLoading ||
                  !hasNonTrashedSelection ||
                  bulkTrashMutation.isPending
                }
              >
                {bulkTrashMutation.isPending
                  ? "Moving..."
                  : "Move Selected to Trash"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const pendingByAction: Record<ClassActionType, boolean> = {
    trash: trashClassMutation.isPending,
    restore: restoreClassMutation.isPending,
    permanent: permanentlyDeleteClassMutation.isPending,
  };

  const confirmationCopy: Record<
    ClassActionType,
    {
      title: string;
      description: string;
      actionLabel: string;
      destructive?: boolean;
    }
  > = {
    trash: {
      title: "Move Class to Trash",
      description: `Are you sure you want to move "${confirmState.className}" to the trash?`,
      actionLabel: pendingByAction.trash ? "Moving..." : "Move to Trash",
      destructive: true,
    },
    restore: {
      title: "Restore Class",
      description: `Restore "${confirmState.className}" so it becomes available again?`,
      actionLabel: pendingByAction.restore ? "Restoring..." : "Restore",
    },
    permanent: {
      title: "Permanently Delete Class",
      description: `This will permanently remove "${confirmState.className}". This action cannot be undone.`,
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
      <GenericDataTable<ClassData>
        data={filteredData}
        columns={[
          ...columns,
          {
            id: "actions",
            Header: "Actions",
            Cell: ({ row }: { row: any }) => (
              <div className="flex items-center gap-2">
                {!row.original.isTrashed && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveClass(row.original);
                      setAssignOpen(true);
                    }}
                  >
                    Assign Subjects
                  </Button>
                )}
              </div>
            ),
          },
        ]}
        defaultTab="all-classes"
        onTabChange={(tab) => setActiveTab(tab as ClassesTab)}
        getRowId={(row) => row._id}
        onSelectionChange={setSelectedRows}
        config={{
          enableDragDrop: true,
          enableSelection: true,
          enableColumnVisibility: false,
          enablePagination: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 30, 40, 50],
          enableSearch: false,
        }}
        addButtonLabel="Add Class"
        columnVisibilityLabel="Customize Columns"
        customToolbarActions={filterControls}
      />

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Subjects to Class</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto p-1">
            {items.map((s: any) => (
              <label key={s._id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedSubjectIds.includes(s._id)}
                  onChange={() => toggleSubject(s._id)}
                />
                <span>{s.name ?? s.subjectName ?? s._id}</span>
              </label>
            ))}
            {items.length === 0 && (
              <div className="text-sm text-muted-foreground">No subjects found.</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!activeClass || selectedSubjectIds.length === 0 || assignSubjectToClass.isPending}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmState.open}
        onOpenChange={(open) => {
          if (!open) {
            resetConfirmationState();
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
