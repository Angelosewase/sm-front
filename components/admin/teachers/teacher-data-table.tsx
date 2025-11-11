"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import {
  IconCircleCheckFilled,
  IconCircleDashed,
  IconMail,
  IconPhone,
  IconPlus,
  IconX,
  IconBook,
  IconSchool,
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
import {
  Dialog,
  DialogClose,
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
import { Separator } from "@/components/ui/separator";
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Teacher } from "@/types/teachers.dto";
import AssignedClassesSection from "./assigned-class-section";
import AssignedSubjectsSection from "./assigned-subjects-section";
import TeacherDetailViewer from "./teacher-detail-viewer";

import { useAssignClassesToTeacher, useDeleteTeacher } from "@/hooks/use-teachers";
import { useClasses } from "@/hooks/use-classes";


const columns: ColumnDef<Teacher>[] = [
/* columns are defined inside the component to access handlers */
createDragColumn<Teacher>(),
  createSelectColumn<Teacher>(),
{
  accessorKey: "name",
  header: "Teacher",
  cell: ({ row }) => {
    const initials = row.original.user?.name || ''
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <TeacherDetailViewer item={row.original} />
      </div>
    );
  },
  enableHiding: false,
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
    <Badge variant="outline" className="text-muted-foreground px-2">
      {row.original.qualification}
    </Badge>
  ),
},
// {
//   accessorKey: "subject",
//   header: "Subject",
//   cell: ({ row }) => (
//     <div className="font-medium">{row.original.subject}</div>
//   ),
// },
{
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => (
    <Badge variant="outline" className="text-muted-foreground px-1.5">
      {row.original.status === "Active" ? (
        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
      ) : (
        <IconCircleDashed className="text-orange-500" />
      )}
      {row.original.status}
    </Badge>
  ),
},
{
  accessorKey: "assignedClasses",
  header: () => <div className="w-full text-center">Classes</div>,
  cell: ({ row }) => (
    <div className="text-center font-semibold">
      {row.original.assignedClasses?.length}
    </div>
  ),
},
  // {
  //   accessorKey: "students",
  //   header: () => <div className="w-full text-center">Students</div>,
  //   cell: ({ row }) => (
  //     <div className="text-center font-semibold">
  //       {row.original.students}
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "experience",
  //   header: "Experience",
  //   cell: ({ row }) => (
  //     <div className="text-sm text-muted-foreground">
  //       {row.original.experience}
  //     </div>
  //   ),
  // },
  // placeholder (moved into component)
];

export function TeacherDataTable({
  data,
}: {
  data: Teacher[];
}) {
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [activeTeacher, setActiveTeacher] = React.useState<Teacher | null>(null);

  const openAssignDialog = (t: Teacher) => {
    setActiveTeacher(t);
    setAssignOpen(true);
  };
  const openConfirmDelete = (t: Teacher) => {
    setActiveTeacher(t);
    setConfirmOpen(true);
  };

  const deleteMutation = useDeleteTeacher();

  const tabs = [
    { value: "all-teachers", label: "All Teachers" },
    { value: "science", label: "Science", badge: 3, content: (<div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>) },
    { value: "mathematics", label: "Mathematics", badge: 1, content: (<div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>) },
    { value: "languages", label: "Languages", badge: 2, content: (<div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>) },
  ];

  const columns: ColumnDef<Teacher>[] = React.useMemo(() => [
    createDragColumn<Teacher>(),
    createSelectColumn<Teacher>(),
    {
      accessorKey: "name",
      header: "Teacher",
      cell: ({ row }) => {
        const initials = (row.original.user?.name || "")
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <TeacherDetailViewer item={row.original} />
          </div>
        );
      },
      enableHiding: false,
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
        <Badge variant="outline" className="text-muted-foreground px-2">
          {row.original.qualification}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.status === "Active" ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleDashed className="text-orange-500" />
          )}
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "assignedClasses",
      header: () => <div className="w-full text-center">Classes</div>,
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.original.assignedClasses?.length || 0}
        </div>
      ),
    },
    createActionsColumn<Teacher>((item) => [
      { label: "Edit Profile", onClick: () => { } },
      { label: "View Classes", onClick: () => openAssignDialog(item) },
      { label: "Assign Classes", onClick: () => openAssignDialog(item) },
      { label: "Remove", onClick: () => openConfirmDelete(item), variant: "destructive" },
    ]),
  ], []);

  return (
    <>
      <GenericDataTable<Teacher>
        data={data}
        columns={columns}
        tabs={tabs}
        defaultTab="all-teachers"
        config={{
          enableDragDrop: true,
          enableSelection: true,
          enableColumnVisibility: true,
          enablePagination: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 30, 40, 50],
        }}
        addButtonLabel="Add Teacher"
        columnVisibilityLabel="Customize Columns"
      />

      {/* Assign Classes Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Classes 1</DialogTitle>
            <DialogDescription>
              {activeTeacher ? `Manage classes for ${activeTeacher.user?.name}` : ""}
            </DialogDescription>
          </DialogHeader>
          {activeTeacher && (
            <div className="py-2">
              <AssignedClassesSection teacher={activeTeacher} />
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove teacher</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to remove {activeTeacher?.user?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                if (!activeTeacher) return;
                deleteMutation.mutate(activeTeacher._id, {
                  onSuccess: () => setConfirmOpen(false),
                });
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
