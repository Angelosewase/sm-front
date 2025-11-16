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
import { useClassesOfSubject, useCreateSubject, useDeleteSubject, useToggleSubjectStatus, useUpdateSubject, useDeleteAssignment, useRestoreSubject, usePermanentlyDeleteSubject } from "@/hooks/use-subjects";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SubjectDetailViewer from "./subject-detail-viewer";
import { deleteSubject } from "@/features/subjects.mutations";

export const subjectSchema = z.object({
  id: z.string(),
  _id: z.string().optional(),
  subjectName: z.string(),
  subjectCode: z.string(),
  department: z.string(),
  category: z.string(),
  gradeLevel: z.string(),
  teachers: z.any(),
  classes: z.any(),
  students: z.string(),
  status: z.string(),
  subjectType: z.string(),
  creditHours: z.string(),
  level: z.string(),
  prerequisites: z.string(),
  isTrashed: z.boolean().optional(),
});

const SubjectActionsColumn = (
  toggleStatus: (id: string, currentStatus: string) => void,
  handleTrash: (id: string) => void,
  onAssignClass: (item: z.infer<typeof subjectSchema>) => void,
  onAssignTeacher: (item: z.infer<typeof subjectSchema>) => void,
  onDuplicate: (item: z.infer<typeof subjectSchema>) => void,
  restoreSubject: (id: string) => void,
  permanentlyDeleteSubject: (id: string) => void,
): ColumnDef<z.infer<typeof subjectSchema>> => {
  const handleToggleStatus = (item: z.infer<typeof subjectSchema>) => {
    const id = (item._id as string) || String(item.id);
    const next = item.status.toLowerCase() === "active" ? "inactive" : "active";
    toggleStatus(id, next);
  };

  return createActionsColumn<z.infer<typeof subjectSchema>>((item) => {
    const id = (item._id as string) || String(item.id);

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
  onAssignClass: (item: z.infer<typeof subjectSchema>) => void,
  onAssignTeacher: (item: z.infer<typeof subjectSchema>) => void,
  onDuplicate: (item: z.infer<typeof subjectSchema>) => void,
  restoreSubject: (id: string) => void,
  permanentlyDeleteSubject: (id: string) => void,
  onDeleteSubject: (id: string) => void,
): ColumnDef<z.infer<typeof subjectSchema>>[] => [
    createDragColumn<z.infer<typeof subjectSchema>>(),
    createSelectColumn<z.infer<typeof subjectSchema>>(),
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
            {row.original.subjectCode}
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

        const category = row.original.category;
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
          {row.original.gradeLevel}
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
}: {
  data: z.infer<typeof subjectSchema>[];
  config?: DataTableConfig<z.infer<typeof subjectSchema>>;
  onTabChange?: (value: string) => void;
}) {
  const toggleStatus = useToggleSubjectStatus();
  const deleteSubjectMutation = useDeleteSubject();
  const restoreSubjectMutation = useRestoreSubject();
  const permanentlyDeleteSubjectMutation = usePermanentlyDeleteSubject();
  const { mutate: updateSubject } = useUpdateSubject();
  const { mutate: createSubject } = useCreateSubject();

  const [assignTeacherOpen, setAssignTeacherOpen] = React.useState(false);
  const [assignClassOpen, setAssignClassOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [activeSubject, setActiveSubject] = React.useState<z.infer<typeof subjectSchema> | null>(null);

  const openAssignTeacher = (item: z.infer<typeof subjectSchema>) => {
    setActiveSubject(item);
    setAssignTeacherOpen(true);
  };
  const openAssignClass = (item: z.infer<typeof subjectSchema>) => {
    setActiveSubject(item);
    setAssignClassOpen(true);
  };
  const openEdit = (item: z.infer<typeof subjectSchema>) => {
    return <SubjectDetailViewer item={item} />
  };
  const openView = (item: z.infer<typeof subjectSchema>) => {
    setActiveSubject(item);
    setViewOpen(true);
  };
  const handleDuplicate = (item: z.infer<typeof subjectSchema>) => {
    // Create a duplicate with minimal fields; user can edit after creation
    createSubject({
      // @ts-ignore keep flexible if DTO differs
      subjectName: `${item.subjectName} (Copy)`,
      // @ts-ignore keep flexible if DTO differs
      subjectCode: `${item.subjectCode}-COPY`,
    } as any);
  };

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

  const mergedConfig: DataTableConfig<z.infer<typeof subjectSchema>> = {
    enableDragDrop: true,
    enableSelection: true,
    enableColumnVisibility: true,
    enablePagination: true,
    pageSize: 10,
    pageSizeOptions: [10, 20, 30, 40, 50],
    ...(config || {}),
  };

  return (
    <>
      <GenericDataTable<z.infer<typeof subjectSchema>>
        data={data}
        columns={columns(
          toggleStatus,
          deleteSubjectMutation.mutate,
          openAssignClass,
          openAssignTeacher,
          handleDuplicate,
          restoreSubjectMutation.mutate,
          permanentlyDeleteSubjectMutation.mutate,
          deleteSubjectMutation.mutate,
        )}
        tabs={tabs}
        defaultTab="all-subjects"
        config={mergedConfig}
        addButtonLabel="Add Subject"
        columnVisibilityLabel="Customize Columns"
        onTabChange={onTabChange}

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
              <div className="font-medium">{activeSubject?.subjectName}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Code</div>
              <div className="font-medium">{activeSubject?.subjectCode}</div>
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
