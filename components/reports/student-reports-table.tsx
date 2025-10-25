"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  IconFileCheck,
  IconFileX,
  IconClock,
  IconEye,
  IconDownload,
} from "@tabler/icons-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createSelectColumn,
} from "@/components/datatable/helpers";
import { toast } from "react-toastify";
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const studentReportSchema = z.object({
  id: z.number(),
  studentId: z.string(),
  studentName: z.string(),
  grade: z.string(),
  class: z.string(),
  submittedDate: z.string(),
  status: z.enum(["Approved", "Pending", "Rejected"]),
  academicScore: z.number(),
  teacherName: z.string(),
  description: z.string(),
});

export type StudentReport = z.infer<typeof studentReportSchema>;

// View Report Button Component
function ViewReportButton({ reportId }: { reportId: number }) {
  const router = useRouter();

  const handleViewReport = () => {
    router.push(`/head-teacher/reports/${reportId}`);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleViewReport}>
      <IconEye className="h-4 w-4" />
    </Button>
  );
}

const columns: ColumnDef<StudentReport>[] = [
  createSelectColumn<StudentReport>(),
  {
    accessorKey: "studentName",
    header: "Student",
    cell: ({ row }) => {
      const initials = row.original.studentName
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
            <span className="font-medium text-sm">{row.original.studentName}</span>
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
    header: "Class",
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.original.class}</div>
    ),
  },
  {
    accessorKey: "teacherName",
    header: "Teacher",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.teacherName}
      </div>
    ),
  },
  {
    accessorKey: "submittedDate",
    header: "Submitted",
    cell: ({ row }) => (
      <div className="text-sm">
        {new Date(row.original.submittedDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    ),
  },
  {
    accessorKey: "academicScore",
    header: () => <div className="w-full text-center">Score</div>,
    cell: ({ row }) => {
      const score = row.original.academicScore;
      const color =
        score >= 85
          ? "text-green-600 dark:text-green-500"
          : score >= 70
          ? "text-blue-600 dark:text-blue-500"
          : "text-orange-600 dark:text-orange-500";

      return (
        <div className={`text-center font-semibold ${color}`}>
          {score}%
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === "Approved"
          ? "default"
          : status === "Rejected"
          ? "destructive"
          : "secondary";

      const Icon =
        status === "Approved"
          ? IconFileCheck
          : status === "Rejected"
          ? IconFileX
          : IconClock;

      return (
        <Badge variant={variant} className="text-xs">
          <Icon className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ViewReportButton reportId={row.original.id} />
      </div>
    ),
  },
];

interface StudentReportsTableProps {
  data: StudentReport[];
  onApproveAll?: () => void;
  onRejectAll?: () => void;
  onExportAll?: () => void;
}

export function StudentReportsTable({
  data,
  onApproveAll,
  onRejectAll,
  onExportAll,
}: StudentReportsTableProps) {
  const [selectedRows, setSelectedRows] = React.useState<StudentReport[]>([]);
  const [isAllSelected, setIsAllSelected] = React.useState(false);

  const handleSelectionChange = React.useCallback((selected: StudentReport[]) => {
    setSelectedRows(selected);
    setIsAllSelected(selected.length === data.length && data.length > 0);
  }, [data.length]);

  const tabs = [
    {
      value: "all-reports",
      label: "All Reports",
      badge: data.length,
    },
    {
      value: "pending",
      label: "Pending",
      badge: data.filter((r) => r.status === "Pending").length,
    },
    {
      value: "approved",
      label: "Approved",
      badge: data.filter((r) => r.status === "Approved").length,
    },
    {
      value: "rejected",
      label: "Rejected",
      badge: data.filter((r) => r.status === "Rejected").length,
    },
  ];

  const handleBulkApprove = React.useCallback(() => {
    if (isAllSelected) {
      onApproveAll?.();
      toast.success("All reports approved");
    } else if (selectedRows.length > 0) {
      toast.success(`${selectedRows.length} selected reports approved`);
    }
    setSelectedRows([]);
    setIsAllSelected(false);
  }, [isAllSelected, selectedRows.length, onApproveAll]);

  const handleBulkReject = React.useCallback(() => {
    if (isAllSelected) {
      onRejectAll?.();
      toast.error("All reports rejected");
    } else if (selectedRows.length > 0) {
      toast.error(`${selectedRows.length} selected reports rejected`);
    }
    setSelectedRows([]);
    setIsAllSelected(false);
  }, [isAllSelected, selectedRows.length, onRejectAll]);

  const handleBulkExport = React.useCallback(() => {
    if (isAllSelected) {
      onExportAll?.();
      toast.success("All reports exported");
    } else if (selectedRows.length > 0) {
      toast.success(`${selectedRows.length} selected reports exported`);
    }
    setSelectedRows([]);
    setIsAllSelected(false);
  }, [isAllSelected, selectedRows.length, onExportAll]);

  const customToolbarActions = React.useMemo(() => (
    <div className="flex items-center gap-2">
      {(isAllSelected || selectedRows.length > 0) && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkApprove}
          >
            <IconFileCheck className="h-4 w-4 mr-1" />
            {isAllSelected ? "Approve All" : `Approve Selected (${selectedRows.length})`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkReject}
          >
            <IconFileX className="h-4 w-4 mr-1" />
            {isAllSelected ? "Reject All" : `Reject Selected (${selectedRows.length})`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkExport}
          >
            <IconDownload className="h-4 w-4 mr-1" />
            {isAllSelected ? "Export All" : `Export Selected (${selectedRows.length})`}
          </Button>
        </>
      )}
    </div>
  ), [isAllSelected, selectedRows.length, handleBulkApprove, handleBulkReject, handleBulkExport]);

  return (
    <GenericDataTable<StudentReport>
      data={data}
      columns={columns}
      tabs={tabs}
      defaultTab="all-reports"
      config={{
        enableDragDrop: false,
        enableSelection: true,
        enableColumnVisibility: true,
        enablePagination: true,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30, 40, 50],
      }}
      columnVisibilityLabel="Customize Columns"
      customToolbarActions={customToolbarActions}
      onSelectionChange={handleSelectionChange}
    />
  );
}

// Removed dialog components - using navigation instead
