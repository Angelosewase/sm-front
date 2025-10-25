"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import {
  IconCircleCheckFilled,
  IconCircleDashed,
  IconMail,
  IconPhone,
  IconCalendar,
  IconUser,
  IconAward,
  IconChartBar,
  IconSchool,
  IconTransfer,
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
import { toast } from "react-toastify";
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const studentSchema = z.object({
  id: z.number(),
  studentId: z.string(),
  name: z.string(),
  email: z.string(),
  grade: z.string(),
  class: z.string(),
  status: z.string(),
  academicScore: z.string(),
  dateOfBirth: z.string(),
  phone: z.string(),
  parentName: z.string(),
  parentPhone: z.string(),
});

const columns: ColumnDef<z.infer<typeof studentSchema>>[] = [
  createDragColumn<z.infer<typeof studentSchema>>(),
  createSelectColumn<z.infer<typeof studentSchema>>(),
  {
    accessorKey: "name",
    header: "Student",
    cell: ({ row }) => {
      const initials = row.original.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <StudentDetailViewer item={row.original} />
            <span className="text-xs text-muted-foreground">
              {row.original.studentId}
            </span>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-2">
        {row.original.grade}
      </Badge>
    ),
  },
  {
    accessorKey: "class",
    header: "Current Class",
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.original.class}</div>
    ),
  },
  {
    accessorKey: "academicScore",
    header: () => <div className="w-full text-center">Academic Score</div>,
    cell: ({ row }) => {
      const score = parseInt(row.original.academicScore);
      const color =
        score >= 85
          ? "text-green-600 dark:text-green-500"
          : score >= 70
          ? "text-blue-600 dark:text-blue-500"
          : "text-orange-600 dark:text-orange-500";

      return (
        <div className={`text-center font-semibold ${color}`}>
          {row.original.academicScore}%
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "Active" ? "default" : "destructive"}
        className="text-xs"
      >
        {row.original.status === "Active" ? (
          <IconCircleCheckFilled className="h-3 w-3 mr-1" />
        ) : (
          <IconCircleDashed className="h-3 w-3 mr-1" />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "parentName",
    header: "Parent/Guardian",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.parentName}
      </div>
    ),
  },
  createActionsColumn<z.infer<typeof studentSchema>>([
    { label: "View Profile", onClick: () => {} },
    { label: "View Grades", onClick: () => {} },
    { label: "Contact Parent", onClick: () => {} },
    { label: "Edit Information", onClick: () => {} },
    { label: "Suspend", onClick: () => {}, variant: "destructive" },
  ]),
];

export function StudentDataTable({
  data,
}: {
  data: z.infer<typeof studentSchema>[];
}) {
  const tabs = [
    {
      value: "all-students",
      label: "All Students",
    },
    {
      value: "grade-9",
      label: "Grade 9",
      badge: 7,
      content: (
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      ),
    },
    {
      value: "grade-10",
      label: "Grade 10",
      badge: 8,
      content: (
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      ),
    },
    {
      value: "grade-11",
      label: "Grade 11",
      badge: 5,
      content: (
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      ),
    },
  ];

  return (
    <GenericDataTable<z.infer<typeof studentSchema>>
      data={data}
      columns={columns}
      tabs={tabs}
      defaultTab="all-students"
      config={{
        enableDragDrop: true,
        enableSelection: true,
        enableColumnVisibility: true,
        enablePagination: true,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30, 40, 50],
      }}
      addButtonLabel="Add Student"
      columnVisibilityLabel="Customize Columns"
    />
  );
}

function StudentDetailViewer({ item }: { item: z.infer<typeof studentSchema> }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.name}</DrawerTitle>
          <DrawerDescription>
            Student profile, academic records, and parent information
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {/* Basic Information Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <IconUser className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Student ID: {item.studentId}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconMail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{item.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconPhone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{item.phone}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Grade Level</Label>
                <p className="font-medium">{item.grade}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Current Class</Label>
                <p className="font-medium">{item.class}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                <div className="flex items-center gap-1">
                  <IconCalendar className="h-3 w-3" />
                  <p className="font-medium">
                    {new Date(item.dateOfBirth).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge
                    variant={item.status === "Active" ? "default" : "destructive"}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Academic Performance Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconAward className="h-4 w-4" />
                <h3 className="font-semibold">Academic Performance</h3>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-muted/30">
              <Label className="text-xs text-muted-foreground">Academic Score</Label>
              <div className="flex items-center gap-2 mt-1">
                <IconChartBar className="h-5 w-5 text-primary" />
                <p className="text-3xl font-bold text-primary">{item.academicScore}%</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {parseInt(item.academicScore) >= 85
                  ? "Excellent performance"
                  : parseInt(item.academicScore) >= 70
                  ? "Good performance"
                  : "Needs improvement"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Class Assignment Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconSchool className="h-4 w-4" />
                <h3 className="font-semibold">Class Assignment</h3>
              </div>
              <ClassAssignmentDialog student={item} />
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs text-muted-foreground">Current Class</Label>
                  <p className="font-medium">{item.class}</p>
                </div>
                <Badge variant="outline">{item.grade}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Parent/Guardian Information Section */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Parent/Guardian Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="font-medium">{item.parentName}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <div className="flex items-center gap-1">
                  <IconPhone className="h-3 w-3" />
                  <p className="font-medium">{item.parentPhone}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Edit Form */}
          <form className="flex flex-col gap-4">
            <h3 className="font-semibold">Edit Student Information</h3>
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={item.name} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={item.email} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" defaultValue={item.phone} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="grade">Grade Level</Label>
                <Select defaultValue={item.grade}>
                  <SelectTrigger id="grade" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grade 9">Grade 9</SelectItem>
                    <SelectItem value="Grade 10">Grade 10</SelectItem>
                    <SelectItem value="Grade 11">Grade 11</SelectItem>
                    <SelectItem value="Grade 12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="class">Current Class</Label>
                <Input id="class" defaultValue={item.class} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  defaultValue={item.dateOfBirth}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Graduated">Graduated</SelectItem>
                    <SelectItem value="Transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="parentName">Parent/Guardian Name</Label>
                <Input id="parentName" defaultValue={item.parentName} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
                <Input
                  id="parentPhone"
                  type="tel"
                  defaultValue={item.parentPhone}
                />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// Class Assignment Dialog Component
function ClassAssignmentDialog({ student }: { student: z.infer<typeof studentSchema> }) {
  const [open, setOpen] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState(student.class);
  const [selectedGrade, setSelectedGrade] = React.useState(student.grade);

  const availableClasses = [
    { id: 1, name: "Mathematics 101", grade: "Grade 9" },
    { id: 2, name: "English Literature", grade: "Grade 10" },
    { id: 3, name: "Physics Advanced", grade: "Grade 11" },
    { id: 4, name: "Chemistry Basics", grade: "Grade 9" },
    { id: 5, name: "World History", grade: "Grade 10" },
    { id: 6, name: "Computer Science", grade: "Grade 11" },
    { id: 7, name: "Biology Lab", grade: "Grade 10" },
    { id: 8, name: "Art & Design", grade: "Grade 9" },
    { id: 9, name: "Spanish Language", grade: "Grade 10" },
    { id: 10, name: "Physical Education", grade: "Grade 9" },
    { id: 11, name: "Algebra II", grade: "Grade 10" },
    { id: 12, name: "Geometry", grade: "Grade 11" },
  ];

  const handleAssignClass = () => {
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    toast.success(`Successfully assigned ${student.name} to ${selectedClass}`);
    setOpen(false);
  };

  const filteredClasses = availableClasses.filter(
    (cls) => cls.grade === selectedGrade
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <IconTransfer className="h-4 w-4 mr-1" />
          Change Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Class to {student.name}</DialogTitle>
          <DialogDescription>
            Change the student's class assignment. Select a grade level and then choose a class.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="current-class">Current Assignment</Label>
            <div className="p-3 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{student.class}</p>
                  <p className="text-xs text-muted-foreground">{student.grade}</p>
                </div>
                <Badge variant="outline">Current</Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label htmlFor="grade-select">Select Grade Level</Label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger id="grade-select" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Grade 9">Grade 9</SelectItem>
                <SelectItem value="Grade 10">Grade 10</SelectItem>
                <SelectItem value="Grade 11">Grade 11</SelectItem>
                <SelectItem value="Grade 12">Grade 12</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="class-select">Select New Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger id="class-select" className="w-full">
                <SelectValue placeholder="Choose a class" />
              </SelectTrigger>
              <SelectContent>
                {filteredClasses.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No classes available for {selectedGrade}
                  </div>
                ) : (
                  filteredClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.name}>
                      {cls.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedClass && selectedClass !== student.class && (
            <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <div className="flex items-center gap-2">
                <IconTransfer className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">New Assignment</p>
                  <p className="text-xs text-muted-foreground">
                    {student.name} will be moved to {selectedClass} ({selectedGrade})
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssignClass}>Assign Class</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
