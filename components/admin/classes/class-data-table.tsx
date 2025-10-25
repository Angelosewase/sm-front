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
import { toast } from "react-toastify";
import { DataTable as GenericDataTable } from "@/components/datatable/table";

export const classSchema = z.object({
  id: z.number(),
  className: z.string(),
  gradeLevel: z.string(),
  teacher: z.string(),
  status: z.string(),
  enrolled: z.string(),
  capacity: z.string(),
  schedule: z.string(),
});

const columns: ColumnDef<z.infer<typeof classSchema>>[] = [
  createDragColumn<z.infer<typeof classSchema>>(),
  createSelectColumn<z.infer<typeof classSchema>>(),
  {
    accessorKey: "className",
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
    accessorKey: "teacher",
    header: "Teacher",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.teacher}</div>
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
          <IconCircleDashed />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "enrolled",
    header: () => <div className="w-full text-right">Enrolled</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            pending: `Updating ${row.original.className}`,
            success: "Enrollment updated",
            error: "Error updating enrollment",
          });
        }}
      >
        <Label htmlFor={`${row.original.id}-enrolled`} className="sr-only">
          Enrolled
        </Label>
        <Input
          className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.enrolled}
          id={`${row.original.id}-enrolled`}
        />
      </form>
    ),
  },
  {
    accessorKey: "capacity",
    header: () => <div className="w-full text-right">Capacity</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            pending: `Updating ${row.original.className}`,
            success: "Capacity updated",
            error: "Error updating capacity",
          });
        }}
      >
        <Label htmlFor={`${row.original.id}-capacity`} className="sr-only">
          Capacity
        </Label>
        <Input
          className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.capacity}
          id={`${row.original.id}-capacity`}
        />
      </form>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Schedule",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.schedule}
      </div>
    ),
  },
  createActionsColumn<z.infer<typeof classSchema>>([
    { label: "Edit", onClick: () => {} },
    { label: "View Students", onClick: () => {} },
    { label: "Duplicate", onClick: () => {} },
    { label: "Archive", onClick: () => {}, variant: "destructive" },
  ]),
];

export function ClassDataTable({
  data,
}: {
  data: z.infer<typeof classSchema>[];
}) {
  const tabs = [
    {
      value: "all-classes",
      label: "All Classes",
    },
    {
      value: "grade-9",
      label: "Grade 9",
      badge: 3,
      content: (
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      ),
    },
    {
      value: "grade-10",
      label: "Grade 10",
      badge: 4,
      content: (
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      ),
    },
    {
      value: "grade-11",
      label: "Grade 11",
      badge: 2,
      content: (
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      ),
    },
  ];

  return (
    <GenericDataTable<z.infer<typeof classSchema>>
      data={data}
      columns={columns}
      tabs={tabs}
      defaultTab="all-classes"
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
  );
}

// Sample attendance data for charts
const attendanceData = [
  { week: "Week 1", attendance: 92, enrollment: 28 },
  { week: "Week 2", attendance: 94, enrollment: 28 },
  { week: "Week 3", attendance: 91, enrollment: 28 },
  { week: "Week 4", attendance: 93, enrollment: 28 },
  { week: "Week 5", attendance: 95, enrollment: 28 },
  { week: "Week 6", attendance: 94, enrollment: 28 },
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

function ClassDetailViewer({ item }: { item: z.infer<typeof classSchema> }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.className}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.className}</DrawerTitle>
          <DrawerDescription>
            Class performance and attendance for the last 6 weeks
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
                  Attendance trending up by 3.3% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing attendance and enrollment data for the last 6 weeks.
                  The class maintains strong attendance rates with consistent
                  participation.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="className">Class Name</Label>
              <Input id="className" defaultValue={item.className} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Select defaultValue={item.gradeLevel}>
                  <SelectTrigger id="gradeLevel" className="w-full">
                    <SelectValue placeholder="Select grade level" />
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
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="enrolled">Enrolled Students</Label>
                <Input id="enrolled" defaultValue={item.enrolled} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="capacity">Class Capacity</Label>
                <Input id="capacity" defaultValue={item.capacity} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="teacher">Teacher</Label>
              <Select defaultValue={item.teacher}>
                <SelectTrigger id="teacher" className="w-full">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                  <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                  <SelectItem value="David Kim">David Kim</SelectItem>
                  <SelectItem value="Lisa Wong">Lisa Wong</SelectItem>
                  <SelectItem value="James Wilson">James Wilson</SelectItem>
                  <SelectItem value="Nina Patel">Nina Patel</SelectItem>
                  <SelectItem value="Carlos Rodriguez">
                    Carlos Rodriguez
                  </SelectItem>
                  <SelectItem value="Maria Garcia">Maria Garcia</SelectItem>
                  <SelectItem value="Alex Thompson">Alex Thompson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="schedule">Schedule</Label>
              <Input id="schedule" defaultValue={item.schedule} />
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
