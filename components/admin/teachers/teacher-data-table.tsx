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
import { toast } from "react-toastify";
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Teacher } from "@/types/teachers.dto";


const columns: ColumnDef<Teacher>[] = [
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
        {row.original.assignedClasses}
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
  createActionsColumn<Teacher>([
    { label: "Edit Profile", onClick: () => {} },
    { label: "View Classes", onClick: () => {} },
    { label: "View Performance", onClick: () => {} },
    { label: "Send Message", onClick: () => {} },
    { label: "Remove", onClick: () => {}, variant: "destructive" },
  ]),
];

export function TeacherDataTable({
  data,
}: {
  data: Teacher[];
}) {
  const tabs = [
    {
      value: "all-teachers",
      label: "All Teachers",
    },
    {
      value: "science",
      label: "Science",
      badge: 3,
      content: (
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      ),
    },
    {
      value: "mathematics",
      label: "Mathematics",
      badge: 1,
      content: (
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      ),
    },
    {
      value: "languages",
      label: "Languages",
      badge: 2,
      content: (
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      ),
    },
  ];

  console.log("the data being passed is: ", data)

  return (
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
  );
}

// Sample assigned classes for teachers
const sampleAssignedClasses = [
  { id: 1, name: "Mathematics 101", grade: "Grade 9", role: "Class Teacher" },
  { id: 2, name: "Algebra II", grade: "Grade 10", role: "Subject Teacher" },
  { id: 3, name: "Geometry", grade: "Grade 11", role: "Subject Teacher" },
];

// Sample assigned subjects
const sampleAssignedSubjects = [
  { id: 1, name: "Mathematics", level: "Advanced" },
  { id: 2, name: "Algebra", level: "Intermediate" },
  { id: 3, name: "Statistics", level: "Basic" },
];

// Available classes for assignment
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
];

// Available subjects for assignment
const availableSubjects = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "English" },
  { id: 3, name: "Physics" },
  { id: 4, name: "Chemistry" },
  { id: 5, name: "Biology" },
  { id: 6, name: "History" },
  { id: 7, name: "Geography" },
  { id: 8, name: "Computer Science" },
  { id: 9, name: "Art" },
  { id: 10, name: "Music" },
  { id: 11, name: "Physical Education" },
  { id: 12, name: "Spanish" },
  { id: 13, name: "French" },
];

function TeacherDetailViewer({
  item,
}: {
  item: Teacher;
}) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} >
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.user.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="rounded-lg  m-1 min-w-[50vw]">
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.user.name}</DrawerTitle>
          <DrawerDescription>
            Teacher profile, assigned classes, and subject assignments
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {/* Basic Information Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <IconMail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{item.user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconPhone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{item.phone}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* <div>
                <Label className="text-xs text-muted-foreground">Department</Label>
                <p className="font-medium">{item.user.department}</p>
              </div> */}
              <div>
                <Label className="text-xs text-muted-foreground">Experience</Label>
                <p className="font-medium">{item.user.experience}</p>
              </div>
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Classes Assigned</Label>
                <p className="font-medium">{item.classesAssigned}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Total Students</Label>
                <p className="font-medium">{item.totalStudents}</p>
              </div>
            </div> */}
          </div>

          <Separator />

          {/* Assigned Classes Section */}
          <AssignedClassesSection />

          <Separator />

          {/* Assigned Subjects Section */}
          <AssignedSubjectsSection />

          <Separator />

          {/* Edit Form */}
          <form className="flex flex-col gap-4">
            <h3 className="font-semibold">Edit Teacher Information</h3>
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={item.user.name} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={item.user.email} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" defaultValue={item.user.phone} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="department">Department</Label>
                <Select defaultValue={item.department}>
                  <SelectTrigger id="department" className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Social Studies">
                      Social Studies
                    </SelectItem>
                    <SelectItem value="Languages">Languages</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Physical Education">
                      Physical Education
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="subject">Subject/Specialization</Label>
                <Input id="subject" defaultValue={item.subjectsCanTeach?.join(", ")} />
              </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="experience">Experience</Label>
                <Input id="experience" defaultValue={item.qualification} />
              </div>
              {/* <div className="flex flex-col gap-3">
                <Label htmlFor="classesAssigned">Classes Assigned</Label>
                <Input
                  id="classesAssigned"
                  type="number"
                  defaultValue={item.classesAssigned}
                />
              </div> */}
            </div>

            {/* <div className="flex flex-col gap-3">
              <Label htmlFor="totalStudents">Total Students</Label>
              <Input
                id="totalStudents"
                type="number"
                defaultValue={item.totalStudents}
                disabled
              />
            </div> */}
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

// Assigned Classes Section Component
function AssignedClassesSection() {
  const [assignedClasses, setAssignedClasses] = React.useState(sampleAssignedClasses);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("Subject Teacher");

  const handleAddClass = () => {
    if (!selectedClass) return;
    
    const classToAdd = availableClasses.find(c => c.id.toString() === selectedClass);
    if (!classToAdd) return;

    const newClass = {
      id: classToAdd.id,
      name: classToAdd.name,
      grade: classToAdd.grade,
      role: selectedRole,
    };

    setAssignedClasses([...assignedClasses, newClass]);
    setSelectedClass("");
    setIsDialogOpen(false);
    
    toast.success(`Assigned to ${classToAdd.name} as ${selectedRole}`);
  };

  const handleRemoveClass = (classId: number) => {
    setAssignedClasses(assignedClasses.filter(c => c.id !== classId));
    toast.success("Class assignment removed");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconSchool className="h-4 w-4" />
          <h3 className="font-semibold">Assigned Classes</h3>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
            >
              <IconPlus className="h-4 w-4 mr-1" />
              Assign Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Class</DialogTitle>
              <DialogDescription>
                Assign a class to this teacher and specify their role
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="class-select">Select Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class-select" className="w-full">
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name} ({cls.grade})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="role-select">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role-select" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Class Teacher">Class Teacher</SelectItem>
                    <SelectItem value="Subject Teacher">Subject Teacher</SelectItem>
                    <SelectItem value="Assistant Teacher">Assistant Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleAddClass}>
                Add Assignment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-2">
        {assignedClasses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No classes assigned yet</p>
        ) : (
          assignedClasses.map((cls) => (
            <div
              key={cls.id}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">{cls.name}</span>
                <div className="flex gap-2 items-center">
                  <Badge variant="outline" className="text-xs">
                    {cls.grade}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {cls.role}
                  </Badge>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveClass(cls.id)}
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Assigned Subjects Section Component
function AssignedSubjectsSection() {
  const [assignedSubjects, setAssignedSubjects] = React.useState(sampleAssignedSubjects);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [selectedLevel, setSelectedLevel] = React.useState("Intermediate");

  const handleAddSubject = () => {
    if (!selectedSubject) return;
    
    const subjectToAdd = availableSubjects.find(s => s.id.toString() === selectedSubject);
    if (!subjectToAdd) return;

    const newSubject = {
      id: subjectToAdd.id,
      name: subjectToAdd.name,
      level: selectedLevel,
    };

    setAssignedSubjects([...assignedSubjects, newSubject]);
    setSelectedSubject("");
    setIsDialogOpen(false);
    
    toast.success(`Assigned ${subjectToAdd.name} at ${selectedLevel} level`);
  };

  const handleRemoveSubject = (subjectId: number) => {
    setAssignedSubjects(assignedSubjects.filter(s => s.id !== subjectId));
    toast.success("Subject assignment removed");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconBook className="h-4 w-4" />
          <h3 className="font-semibold">Assigned Subjects</h3>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
            >
              <IconPlus className="h-4 w-4 mr-1" />
              Assign Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Subject</DialogTitle>
              <DialogDescription>
                Assign a subject to this teacher and specify the level
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="subject-select">Select Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject-select" className="w-full">
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="level-select">Level</Label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger id="level-select" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleAddSubject}>
                Add Subject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-2">
        {assignedSubjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No subjects assigned yet</p>
        ) : (
          assignedSubjects.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{subject.name}</span>
                <Badge variant="outline" className="text-xs">
                  {subject.level}
                </Badge>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveSubject(subject.id)}
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
