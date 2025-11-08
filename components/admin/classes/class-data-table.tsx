"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { z } from "zod";
import {
  IconCircleCheckFilled,
  IconCircleDashed,
  IconTrendingUp,
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
import { Class } from "@/lib/api/classes";
import { useUpdateClass, useDeleteClass } from "@/hooks/use-classes";
import { useTeachers } from "@/hooks/use-teachers";
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

export const classSchema = z.object({
  _id: z.string(),
  name: z.string(),
  gradeLevel: z.string(),
  classTeacher: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
  }).optional().nullable(),
  status: z.enum(["active", "inactive"]),
  studentCount: z.number(),
  capacity: z.number(),
  description: z.string().optional(),
});

export type ClassData = z.infer<typeof classSchema>;

interface ClassDataTableProps {
  data: Class[];
  isLoading?: boolean;
}

function ClassDetailViewer({ item }: { item: ClassData }) {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState(item.classTeacher?._id || '');
  const [selectedGrade, setSelectedGrade] = React.useState(item.gradeLevel || '');
  const [selectedStatus, setSelectedStatus] = React.useState<'active' | 'inactive'>(item.status || 'active');

  const updateClassMutation = useUpdateClass();
  const { data: teachersData, isLoading: isLoadingTeachers } = useTeachers({ limit: 100 });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updateData = {
      name: formData.get("className") as string,
      gradeLevel: selectedGrade,
      capacity: Number(formData.get("capacity")),
      description: formData.get("description") as string || undefined,
      status: selectedStatus as 'active' | 'inactive',
      classTeacher: selectedTeacher,
    };

    updateClassMutation.mutate(
      { id: item._id, data: updateData },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  // Sample attendance data for charts
  const attendanceData = [
    { week: "Week 1", attendance: 92, enrollment: item.studentCount },
    { week: "Week 2", attendance: 94, enrollment: item.studentCount },
    { week: "Week 3", attendance: 91, enrollment: item.studentCount },
    { week: "Week 4", attendance: 93, enrollment: item.studentCount },
    { week: "Week 5", attendance: 95, enrollment: item.studentCount },
    { week: "Week 6", attendance: 94, enrollment: item.studentCount },
  ];

  const chartConfig = {
    attendance: {
      label: "Attendance %",
      color: "var(--primary)",
    },
    enrollment: {
      label: "Enrollment",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

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
            Class performance and attendance overview
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={attendanceData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 6)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="enrollment"
                    type="natural"
                    fill="var(--color-enrollment)"
                    fillOpacity={0.6}
                    stroke="var(--color-enrollment)"
                    stackId="a"
                  />
                  <Area
                    dataKey="attendance"
                    type="natural"
                    fill="var(--color-attendance)"
                    fillOpacity={0.4}
                    stroke="var(--color-attendance)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Class maintaining strong attendance rates{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing attendance and enrollment data for the last 6 weeks.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <Label htmlFor="className">Class Name</Label>
              <Input 
                id="className" 
                name="className"
                defaultValue={item.name} 
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Select 
                  value={selectedGrade}
                  onValueChange={setSelectedGrade}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="gradeLevel" className="w-full">
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grade 1">Grade 1</SelectItem>
                    <SelectItem value="Grade 2">Grade 2</SelectItem>
                    <SelectItem value="Grade 3">Grade 3</SelectItem>
                    <SelectItem value="Grade 4">Grade 4</SelectItem>
                    <SelectItem value="Grade 5">Grade 5</SelectItem>
                    <SelectItem value="Grade 6">Grade 6</SelectItem>
                    <SelectItem value="Grade 7">Grade 7</SelectItem>
                    <SelectItem value="Grade 8">Grade 8</SelectItem>
                    <SelectItem value="Grade 9">Grade 9</SelectItem>
                    <SelectItem value="Grade 10">Grade 10</SelectItem>
                    <SelectItem value="Grade 11">Grade 11</SelectItem>
                    <SelectItem value="Grade 12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={selectedStatus}
                  onValueChange={(value) => setSelectedStatus(value as 'active' | 'inactive')}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="studentCount">Enrolled Students</Label>
                <Input 
                  id="studentCount" 
                  value={item.studentCount}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="capacity">Class Capacity</Label>
                <Input 
                  id="capacity" 
                  name="capacity"
                  type="number"
                  defaultValue={item.capacity} 
                  disabled={!isEditing}
                  min={item.studentCount}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="teacher">Class Teacher</Label>
              <Select 
                value={selectedTeacher || undefined}
                onValueChange={setSelectedTeacher}
                disabled={!isEditing || isLoadingTeachers}
              >
                <SelectTrigger id="teacher" className="w-full">
                  <SelectValue placeholder={isLoadingTeachers ? "Loading teachers..." : "Select teacher"} />
                </SelectTrigger>
                <SelectContent>
                  {teachersData?.data && teachersData.data.length > 0 ? (
                    teachersData.data.map((teacher) => (
                      <SelectItem key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No teachers available
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={item.description || ""}
                disabled={!isEditing}
                rows={3}
              />
            </div>
            {isEditing && (
              <div className="flex gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedTeacher(item.classTeacher?._id || '');
                    setSelectedGrade(item.gradeLevel || '');
                    setSelectedStatus(item.status || 'active');
                  }}
                  disabled={updateClassMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateClassMutation.isPending}>
                  {updateClassMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </div>
        <DrawerFooter>
          {!isEditing && (
            <>
              <Button onClick={() => setIsEditing(true)}>Edit Class</Button>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function DeleteClassDialog({ classId, className }: { classId: string; className: string }) {
  const [open, setOpen] = React.useState(false);
  const deleteClassMutation = useDeleteClass();

  const handleDelete = () => {
    deleteClassMutation.mutate(classId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Class</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{className}&quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteClassMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={deleteClassMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteClassMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ClassDataTable({ data, isLoading }: ClassDataTableProps) {
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    open: boolean;
    classId: string;
    className: string;
  }>({ open: false, classId: "", className: "" });

  const deleteClassMutation = useDeleteClass();

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
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.classTeacher?.name || 'No teacher assigned'}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.status === "active" ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconCircleDashed />
          )}
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </Badge>
      ),
    },
    {
      accessorKey: "studentCount",
      header: () => <div className="w-full text-right">Enrolled</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">{row.original.studentCount}</div>
      ),
    },
    {
      accessorKey: "capacity",
      header: () => <div className="w-full text-right">Capacity</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">{row.original.capacity}</div>
      ),
    },
    createActionsColumn<ClassData>([
      { 
        label: "View Details", 
        onClick: (row) => {
          // The ClassDetailViewer is already in the name cell
        } 
      },
      { 
        label: "Delete", 
        onClick: (row) => {
          setDeleteDialogState({
            open: true,
            classId: row._id,
            className: row.name,
          });
        }, 
        variant: "destructive" 
      },
    ]),
  ];

  const tabs = [
    {
      value: "all-classes",
      label: "All Classes",
    },
    {
      value: "active",
      label: "Active",
      badge: data.filter(c => c.status === "active").length,
    },
    {
      value: "inactive",
      label: "Inactive",
      badge: data.filter(c => c.status === "inactive").length,
    },
  ];

  // Filter data based on active tab
  const [activeTab, setActiveTab] = React.useState("all-classes");
  const filteredData = React.useMemo(() => {
    if (activeTab === "all-classes") return data;
    return data.filter(c => c.status === activeTab);
  }, [data, activeTab]);

  const handleDelete = () => {
    deleteClassMutation.mutate(deleteDialogState.classId, {
      onSuccess: () => {
        setDeleteDialogState({ open: false, classId: "", className: "" });
      },
    });
  };

  return (
    <>
      <GenericDataTable<ClassData>
        data={filteredData}
        columns={columns}
        tabs={tabs}
        defaultTab="all-classes"
        onTabChange={setActiveTab}
        getRowId={(row) => row._id}
        config={{
          enableDragDrop: true,
          enableSelection: true,
          enableColumnVisibility: true,
          enablePagination: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 30, 40, 50],
        }}
        addButtonLabel="Add Class"
        columnVisibilityLabel="Customize Columns"
      />

      <AlertDialog 
        open={deleteDialogState.open} 
        onOpenChange={(open) => setDeleteDialogState({ ...deleteDialogState, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteDialogState.className}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteClassMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleteClassMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteClassMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
