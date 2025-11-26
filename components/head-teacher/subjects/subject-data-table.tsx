"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import {
  IconCircleCheckFilled,
  IconCircleDashed,
  IconBook2,
  IconUsers,
  IconSchool,
  IconAward,
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
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { Textarea } from "@/components/ui/textarea";
import type { DataTableConfig } from "@/components/datatable";
import {
  useClassesOfSubject, useCreateSubject, useDeleteSubject, useToggleSubjectStatus, useUpdateSubject, useDeleteAssignment, useRestoreSubject, usePermanentlyDeleteSubject, useBulkTrashSubjects,
  useBulkRestoreSubjects, useBulkPermanentlyDeleteSubjects, useSubjects
} from "@/hooks/use-subjects";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SubjectDetailViewer from "./subject-detail-viewer";
import { deleteSubject } from "@/features/subjects.mutations";
import { Subject } from "@/types/subjects.dto";

import { gradeLevels } from "@/lib/constants/grade-levels";
import { IconSearch } from "@tabler/icons-react";

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const handler = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}


const SubjectActionsColumn = (
  toggleStatus: (id: string, currentStatus: string) => void,
  handleTrash: (id: string) => void,
  onAssignClass: (item: Subject) => void,
  onAssignTeacher: (item: Subject) => void,
  onDuplicate: (item: Subject) => void,
  restoreSubject: (id: string) => void,
  permanentlyDeleteSubject: (id: string) => void,
): ColumnDef<Subject> => {
  const handleToggleStatus = (item: Subject) => {
    const id = (item._id as string) || String(item._id);
    const next = item.status.toLowerCase() === "active" ? "inactive" : "active";
    toggleStatus(id, next);
  };

  return createActionsColumn<Subject>((item) => {
    const id = (item._id as string) || String(item._id);

    if (item.isTrashed) {
      return [
        {
          label: "Restore",
          onClick: () => restoreSubject(id),
        },
        {
          label: "Delete Permanently",
          onClick: () => permanentlyDeleteSubject(id),
          variant: "destructive",
        },
      ];
    }

    return [
      { label: "Duplicate", onClick: onDuplicate },
      {
        label: (row) =>
          row.status === "Active" ? "Deactivate" : "Activate",
        onClick: handleToggleStatus,
        variant: "destructive",
      },
      {
        label: "Move to Trash",
        onClick: () => handleTrash(id),
        variant: "destructive",
      },
    ];
  });
};

const columns = (
  toggleStatus: (id: string, currentStatus: string) => void,
  handleDelete: (id: string) => void,
  onAssignClass: (item: Subject) => void,
  onAssignTeacher: (item: Subject) => void,
  onDuplicate: (item: Subject) => void,
  restoreSubject: (id: string) => void,
  permanentlyDeleteSubject: (id: string) => void,
  onDeleteSubject: (id: string) => void,
): ColumnDef<Subject>[] => [
    createDragColumn<Subject>(),
    createSelectColumn<Subject>(),
    {
      accessorKey: "subjectName",
      header: "Subject Name",
      cell: ({ row }) => {
        return <SubjectDetailViewer item={row.original} />;
      },
      enableHiding: false,
    },
    {
      accessorKey: "subjectCode",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          <Badge variant="outline" className="text-muted-foreground px-2">
            {row.original.code}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.department}</div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {

        const category = row.original.subjectType;
        const variant =
          category === "Core"
            ? "default"
            : category === "Elective"
              ? "secondary"
              : "outline";

        return <Badge variant={variant}>{category}</Badge>;
      },
    },
    {
      accessorKey: "gradeLevel",
      header: "Grade Level",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.original.gradeLevels.join(", ")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isTrashed = !!row.original.isTrashed;
        return (
          <Badge
            variant="outline"
            className={`text-muted-foreground px-1.5 ${isTrashed ? "text-destructive border-destructive/40" : ""}`}
          >
            {isTrashed ? (
              <>Trashed</>
            ) : row.original.status.toLowerCase() === "active" ? (
              <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
            ) : (
              <IconCircleDashed />
            )}
            {!isTrashed &&
              row.original.status.charAt(0).toUpperCase() +
              row.original.status.slice(1)}
          </Badge>
        );
      },
    },
    SubjectActionsColumn(
      toggleStatus,
      onDeleteSubject,
      onAssignClass,
      onAssignTeacher,
      onDuplicate,
      restoreSubject,
      permanentlyDeleteSubject,
    ),
  ];


export function SubjectDataTable({
  data,
  config,
  onTabChange,
  isLoading,
}: {
  data: Subject[];
  config?: DataTableConfig<Subject>;
  onTabChange?: (value: string) => void;
  isLoading?: boolean;
}) {


  const toggleStatus = useToggleSubjectStatus();
  const { mutate: updateSubject } = useUpdateSubject();
  const { mutate: createSubject } = useCreateSubject();
  const deleteSubjectMutation = useDeleteSubject();
  const restoreSubjectMutation = useRestoreSubject();
  const permanentlyDeleteSubjectMutation = usePermanentlyDeleteSubject();

  const [selectedRows, setSelectedRows] = React.useState<Subject[]>([]);
  const [activeTab, setActiveTab] =
    React.useState<"all-subjects" | "active" | "inactive" | "trashed">(
      "all-subjects"
    );
  const bulkTrashMutation = useBulkTrashSubjects();
  const bulkRestoreMutation = useBulkRestoreSubjects();
  const bulkPermanentDeleteMutation = useBulkPermanentlyDeleteSubjects();

  const [assignTeacherOpen, setAssignTeacherOpen] = React.useState(false);
  const [assignClassOpen, setAssignClassOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [activeSubject, setActiveSubject] = React.useState<Subject | null>(null);// or more tabs if you want
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedGrade, setSelectedGrade] = React.useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>();

  const debouncedSearch = useDebouncedValue(searchTerm, 400);
  const isTrashView = activeTab === "trashed";

  const openAssignTeacher = (item: Subject) => {
    setActiveSubject(item);
    setAssignTeacherOpen(true);
  };
  const openAssignClass = (item: Subject) => {
    setActiveSubject(item);
    setAssignClassOpen(true);
  };
  const openEdit = (item: Subject) => {
    return <SubjectDetailViewer item={item} />
  };
  const openView = (item: Subject) => {
    setActiveSubject(item);
    setViewOpen(true);
  };
  const handleDuplicate = (item: Subject) => {
    // Create a duplicate with minimal fields; user can edit after creation
    createSubject({
      // @ts-ignore keep flexible if DTO differs
      subjectName: `${item.subjectName} (Copy)`,
      // @ts-ignore keep flexible if DTO differs
      subjectCode: `${item.subjectCode}-COPY`,
    } as any);
  };

  const queryParams = React.useMemo(
    () => ({
      q: debouncedSearch || undefined,
      limit: 100,
      page: 1,
      subjectType: selectedCategory?.toLowerCase(),
      gradeLevel: selectedGrade || undefined,
      includeTrashed: true,           // to get both
    }),
    [debouncedSearch, selectedGrade, selectedCategory]
  );

  const { data: subjectsResponse, isLoading: isLoadingSubjects } = useSubjects(queryParams);
  const resolvedData = subjectsResponse?.items ?? [];


  const isTableLoading = isLoading || isLoadingSubjects

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
        return nonTrashedData.filter((item) => item.status === "Active");
      case "inactive":
        return nonTrashedData.filter((item) => item.status === "Inactive");
      case "trashed":
        return trashedData;
      default:
        return nonTrashedData;
    }
  }, [activeTab, nonTrashedData, trashedData]);


  const tabs = [
    {
      value: "all-subjects",
      label: "All Subjects",
    },
    {
      value: "core",
      label: "Core Subjects",
      badge: data.filter((s) => s.subjectType === "Core").length,
    },
    {
      value: "elective",
      label: "Elective Subjects",
      badge: data.filter((s) => s.subjectType === "Elective").length,
    },
    {
      value: "optional",
      label: "Optional Subjects",
      badge: data.filter((s) => s.subjectType === "Optional").length,
    },
  ];


  const handleBulkTrash = () => {
    if (!selectedNonTrashedIds.length) return;
    bulkTrashMutation.mutate(selectedNonTrashedIds, { onSuccess: () => setSelectedRows([]) });
  };

  const handleBulkRestore = () => {
    if (!selectedTrashedIds.length) return;
    bulkRestoreMutation.mutate(selectedTrashedIds, { onSuccess: () => setSelectedRows([]) });
  };

  const handleBulkPermanentDelete = () => {
    if (!selectedTrashedIds.length) return;
    bulkPermanentDeleteMutation.mutate(selectedTrashedIds, {
      onSuccess: () => setSelectedRows([]),
    });
  };

  const mergedConfig: DataTableConfig<Subject> = {
    enableDragDrop: true,
    enableSelection: true,
    enableColumnVisibility: true,
    enablePagination: true,
    pageSize: 10,
    pageSizeOptions: [10, 20, 30, 40, 50],
    ...(config || {}),
  };


  const statusButtons: { label: string; value: "all-subjects" | "active" | "inactive" }[] =
    [
      { label: "All", value: "all-subjects" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ];

  const hasNonTrashedSelection = selectedNonTrashedIds.length > 0;
  const hasTrashedSelection = selectedTrashedIds.length > 0;


  const filterControls = (
    <div className="flex w-full flex-col gap-3 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {statusButtons.map((button) => (
            <Button
              key={button.value}
              type="button"
              variant={activeTab === button.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(button.value)}
              disabled={isTableLoading || isTrashView}
            >
              {button.label}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex items-center rounded-md p-0.5">
          <Button
            type="button"
            variant={!isTrashView ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("all-subjects")}
            disabled={isTableLoading || !isTrashView}
            className="rounded-none rounded-l-md"
          >
            Active Subjects
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

      <div className="flex w-full flex-wrap justify-between items-center gap-4">
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subjects..."
            className="pl-8"
            disabled={isTableLoading}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedGrade ?? "all"}
            onValueChange={(value) =>
              setSelectedGrade(value === "all" ? undefined : value)
            }
            disabled={isTableLoading}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Grade level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All grades</SelectItem>
              {gradeLevels.map((grade) => (
                <SelectItem key={grade.value} value={grade.value}>
                  {grade.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2">
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
                {bulkRestoreMutation.isPending ? "Restoring..." : "Restore Selected"}
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
    </div>
  );

  return (
    <>
      <GenericDataTable<Subject>
        data={filteredData}
        columns={columns(
          toggleStatus,
          deleteSubjectMutation.mutate,
          openAssignClass,
          openAssignTeacher,
          handleDuplicate,
          (id) => restoreSubjectMutation.mutate(id),
          (id) => permanentlyDeleteSubjectMutation.mutate(id),
          deleteSubjectMutation.mutate
        )}
        defaultTab="all-subjects"
        onTabChange={(value) => setActiveTab(value as any)}
        getRowId={(row) => row._id}
        onSelectionChange={setSelectedRows}
        config={mergedConfig}
        addButtonLabel="Add Subject"
        columnVisibilityLabel="Customize Columns"
        customToolbarActions={filterControls}
      />

      {/* View Details Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subject Details</DialogTitle>
            <DialogDescription>Basic subject information.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2 text-sm">
            <div>
              <div className="text-muted-foreground">Name</div>
              <div className="font-medium">{activeSubject?.name}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Code</div>
              <div className="font-medium">{activeSubject?.code}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Department</div>
              <div className="font-medium">{activeSubject?.department}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Category</div>
              <div className="font-medium">{activeSubject?.category}</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
