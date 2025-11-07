"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import {
  IconCircleCheckFilled,
  IconCircleDashed,
  IconAward,
  IconChartBar,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  createDragColumn,
  createSelectColumn,
  createActionsColumn,
} from "@/components/datatable/helpers";
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const studentSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  name: z.string(),
  email: z.string(),
  className: z.string(),
  status: z.string(),
  averageScore: z.number(),
  attendance: z.number(),
  dateOfBirth: z.string(),
  phone: z.string(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
});

export function StudentDataTable({
  data,
}: {
  data: z.infer<typeof studentSchema>[];
}) {
  const router = useRouter();

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
              <button
                onClick={() => router.push(`/teacher/students/${row.original.id}`)}
                className="font-medium hover:underline text-left"
              >
                {row.original.name}
              </button>
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
      accessorKey: "className",
      header: "Class",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-2">
          {row.original.className}
        </Badge>
      ),
    },
    {
      accessorKey: "averageScore",
      header: () => <div className="w-full text-center">Average Score</div>,
      cell: ({ row }) => {
        const score = row.original.averageScore;
        const color =
          score >= 85
            ? "text-green-600 dark:text-green-500"
            : score >= 70
            ? "text-blue-600 dark:text-blue-500"
            : score >= 60
            ? "text-yellow-600 dark:text-yellow-500"
            : "text-red-600 dark:text-red-500";

        return (
          <div className={`text-center font-semibold ${color}`}>
            {score}%
          </div>
        );
      },
    },
    {
      accessorKey: "attendance",
      header: () => <div className="w-full text-center">Attendance</div>,
      cell: ({ row }) => {
        const attendance = row.original.attendance;
        const color =
          attendance >= 95
            ? "text-green-600 dark:text-green-500"
            : attendance >= 85
            ? "text-blue-600 dark:text-blue-500"
            : attendance >= 75
            ? "text-yellow-600 dark:text-yellow-500"
            : "text-red-600 dark:text-red-500";

        return (
          <div className={`text-center font-medium ${color}`}>
            {attendance}%
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const getStatusInfo = (score: number) => {
          if (score >= 85) return { label: "Excellent", variant: "default" as const, icon: IconAward };
          if (score >= 70) return { label: "Good", variant: "secondary" as const, icon: IconCircleCheckFilled };
          return { label: "Needs Attention", variant: "destructive" as const, icon: IconChartBar };
        };
        
        const statusInfo = getStatusInfo(row.original.averageScore);
        const Icon = statusInfo.icon;
        
        return (
          <Badge variant={statusInfo.variant} className="text-xs">
            <Icon className="h-3 w-3 mr-1" />
            {statusInfo.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "parentName",
      header: "Parent/Guardian",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.original.parentName || "N/A"}
        </div>
      ),
    },
    createActionsColumn<z.infer<typeof studentSchema>>([
      { 
        label: "View Profile", 
        onClick: (row) => router.push(`/teacher/students/${row.id}`)
      },
      { 
        label: "View Report", 
        onClick: (row) => router.push(`/teacher/students/${row.id}/report`)
      },
      { 
        label: "View Performance", 
        onClick: (row) => router.push(`/teacher/students/${row.id}/performance`)
      },
    ]),
  ];

  const tabs = [
    {
      value: "all-students",
      label: "All Students",
    },
  ];

  // Get unique classes for tabs
  const uniqueClasses = Array.from(new Set(data.map(s => s.className))).sort();
  uniqueClasses.forEach(className => {
    const count = data.filter(s => s.className === className).length;
    tabs.push({
      value: className.toLowerCase().replace(/\s+/g, '-'),
      label: className,
      badge: count,
      content: undefined
    } as any);
  });

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
      columnVisibilityLabel="Customize Columns"
    />
  );
}

