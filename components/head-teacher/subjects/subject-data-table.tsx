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
import { AssignSubjectDialog } from "./assign-subject-dialog";
import type { DataTableConfig } from "@/components/datatable";
import { useClassesOfSubject, useCreateSubject, useDeleteSubject, useToggleSubjectStatus, useUpdateSubject, useDeleteAssignment } from "@/features/subjects.api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SubjectDetailViewer from "./subject-detail-viewer";

export const subjectSchema = z.object({
  id: z.number(),
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
});

const SubjectActionsColumn = (
  toggleStatus: (id: string, currentStatus: string) => void,
  handleDelete: (id: string) => void,
  onAssignClass: (item: z.infer<typeof subjectSchema>) => void,
  onAssignTeacher: (item: z.infer<typeof subjectSchema>) => void,
  onDuplicate: (item: z.infer<typeof subjectSchema>) => void,
): ColumnDef<z.infer<typeof subjectSchema>> => {
  const handleToggleStatus = (item: z.infer<typeof subjectSchema>) => {
    const id = String(item.id);
    const next = item.status.toLowerCase() === "active" ? "inactive" : "active";
    toggleStatus(id, next);
  };

  return createActionsColumn<z.infer<typeof subjectSchema>>([
    { label: "Assign to Class", onClick: onAssignClass },
    { label: "Assign to Teacher", onClick: onAssignTeacher },
    { label: "Duplicate", onClick: onDuplicate },
    {
      label: (item) => (item.status === "Active" ? "Deactivate" : "Activate"),
      onClick: handleToggleStatus,
      variant: "destructive",
    },
    {
      label: "Delete",
      onClick: (item) => handleDelete(String(item.id)),
      variant: "destructive",
    },
  ]);
};

const columns = (
  toggleStatus: (id: string, currentStatus: string) => void,
  handleDelete: (id: string) => void,
  onAssignClass: (item: z.infer<typeof subjectSchema>) => void,
  onAssignTeacher: (item: z.infer<typeof subjectSchema>) => void,
  onDuplicate: (item: z.infer<typeof subjectSchema>) => void,
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
        // console.log("the status is: ", row.original.status)
        return <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.status.toLowerCase() === "active" ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleDashed />
          )}
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </Badge>
      },
    },
    SubjectActionsColumn(toggleStatus, handleDelete, onAssignClass, onAssignTeacher, onDuplicate),
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
        )}
        tabs={tabs}
        defaultTab="all-subjects"
        config={mergedConfig}
        addButtonLabel="Add Subject"
        columnVisibilityLabel="Customize Columns"
        onTabChange={onTabChange}

      />

      {/* Assign to Teacher */}
      {activeSubject && (
        <AssignSubjectDialog
          mode="teacher"
          subjectId={activeSubject.id}
          subjectName={activeSubject.subjectName}
          open={assignTeacherOpen}
          onOpenChange={setAssignTeacherOpen}
        />
      )}

      {/* Assign to Class (keeps existing mock flow) */}
      {activeSubject && (
        <AssignSubjectDialog
          mode="class"
          subjectId={activeSubject.id}
          subjectName={activeSubject.subjectName}
          open={assignClassOpen}
          onOpenChange={setAssignClassOpen}
        />
      )}

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


// function SubjectDetailViewer({ item }: { item: z.infer<typeof subjectSchema> }) {
//   const isMobile = useIsMobile();
//   const { data: subjectAnalytics } = useClassesOfSubject(item.id?.toString() || '', { academicYear: "2024/2025" })


//   return (
//     <Drawer direction={isMobile ? "bottom" : "right"}>
//       <DrawerTrigger asChild>
//         <Button variant="link" className="text-foreground w-fit px-0 text-left">
//           {item.subjectName}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader className="gap-1">
//           <DrawerTitle>{item.subjectName}</DrawerTitle>
//           <DrawerDescription>
//             Subject details, assignments, and performance metrics
//           </DrawerDescription>
//         </DrawerHeader>
//         <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
//           {!isMobile && (
//             <>
//               <div className="grid grid-cols-4 gap-3">
//                 <div className="flex flex-col gap-2 rounded-lg border p-3">
//                   <div className="flex items-center gap-2 text-muted-foreground text-xs">
//                     <IconUsers className="h-4 w-4" />
//                     <span>Teachers</span>
//                   </div>
//                   <div className="text-2xl font-bold">{subjectAnalytics?.totalTeachers}</div>
//                 </div>
//                 <div className="flex flex-col gap-2 rounded-lg border p-3">
//                   <div className="flex items-center gap-2 text-muted-foreground text-xs">
//                     <IconSchool className="h-4 w-4" />
//                     <span>Classes</span>
//                   </div>
//                   <div className="text-2xl font-bold">{subjectAnalytics?.totalClasses}</div>
//                 </div>
//                 <div className="flex flex-col gap-2 rounded-lg border p-3">
//                   <div className="flex items-center gap-2 text-muted-foreground text-xs">
//                     <IconBook2 className="h-4 w-4" />
//                     <span>Students</span>
//                   </div>
//                   <div className="text-2xl font-bold">{subjectAnalytics?.totalStudents}</div>
//                 </div>
//                 <div className="flex flex-col gap-2 rounded-lg border p-3">
//                   <div className="flex items-center gap-2 text-muted-foreground text-xs">
//                     <IconAward className="h-4 w-4" />
//                     <span>Avg Score</span>
//                   </div>
//                   <div className="text-2xl font-bold">{subjectAnalytics?.avgScore}</div>
//                 </div>
//               </div>
//               <Separator />
//             </>
//           )}
//           <form className="flex flex-col gap-4">
//             <div className="flex flex-col gap-3">
//               <Label htmlFor="subjectName">Subject Name</Label>
//               <Input id="subjectName" defaultValue={item.subjectName} />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="subjectCode">Subject Code</Label>
//                 <Input id="subjectCode" defaultValue={item.subjectCode} />
//               </div>
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="creditHours">Credit Hours</Label>
//                 <Input id="creditHours" defaultValue={item.creditHours} />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="department">Department</Label>
//                 <Select defaultValue={item.department}>
//                   <SelectTrigger id="department" className="w-full">
//                     <SelectValue placeholder="Select department" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Mathematics">Mathematics</SelectItem>
//                     <SelectItem value="Science">Science</SelectItem>
//                     <SelectItem value="English">English</SelectItem>
//                     <SelectItem value="Social Studies">
//                       Social Studies
//                     </SelectItem>
//                     <SelectItem value="Languages">Languages</SelectItem>
//                     <SelectItem value="Technology">Technology</SelectItem>
//                     <SelectItem value="Arts">Arts</SelectItem>
//                     <SelectItem value="Physical Education">
//                       Physical Education
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="category">Category</Label>
//                 <Select defaultValue={item.category}>
//                   <SelectTrigger id="category" className="w-full">
//                     <SelectValue placeholder="Select category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Core">Core</SelectItem>
//                     <SelectItem value="Elective">Elective</SelectItem>
//                     <SelectItem value="Optional">Optional</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="gradeLevel">Grade Level</Label>
//                 <Select defaultValue={item.gradeLevel}>
//                   <SelectTrigger id="gradeLevel" className="w-full">
//                     <SelectValue placeholder="Select grade level" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Grade 9">Grade 9</SelectItem>
//                     <SelectItem value="Grade 10">Grade 10</SelectItem>
//                     <SelectItem value="Grade 11">Grade 11</SelectItem>
//                     <SelectItem value="Grade 12">Grade 12</SelectItem>
//                     <SelectItem value="All Grades">All Grades</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="level">Level</Label>
//                 <Select defaultValue={item.level}>
//                   <SelectTrigger id="level" className="w-full">
//                     <SelectValue placeholder="Select level" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Beginner">Beginner</SelectItem>
//                     <SelectItem value="Intermediate">Intermediate</SelectItem>
//                     <SelectItem value="Advanced">Advanced</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="flex flex-col gap-3">
//               <Label htmlFor="status">Status</Label>
//               <Select defaultValue={item.status}>
//                 <SelectTrigger id="status" className="w-full">
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="inactive">Inactive</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex flex-col gap-3">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 placeholder="Brief description of the subject..."
//                 rows={3}
//               />
//             </div>

//             <div className="flex flex-col gap-3">
//               <Label htmlFor="prerequisite">Prerequisite</Label>
//               <Textarea
//                 defaultValue={item.prerequisites}
//                 id="prerequisite"
//                 placeholder="Brief description of the subject..."
//                 rows={3}
//               />
//             </div>
//             <Separator />

//             <div className="flex flex-col gap-3">
//               <div className="flex items-center justify-between">
//                 <Label>Class Assignments</Label>
//                 <AssignSubjectDialog
//                   subjectId={item.id}
//                   subjectName={item.subjectName}
//                   trigger={
//                     <Button variant="outline" size="sm">
//                       Assign to Class
//                     </Button>
//                   }
//                 />
//               </div>
//               <div className="rounded-md border p-3 text-muted-foreground text-sm">
//                 Currently assigned to {item.classes} class(es) with{" "}
//                 {item.students} students total.
//               </div>
//             </div>
//           </form>
//         </div>
//         <DrawerFooter>
//           <Button>Save Changes</Button>
//           <DrawerClose asChild>
//             <Button variant="outline">Cancel</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// }

