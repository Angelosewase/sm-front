"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { createActionsColumn } from "@/components/datatable/helpers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Student, StudentStatus } from "@/types/students.dto";

type StudentRow = {
  id: string;
  recordId?: string;
  name: string;
  studentId?: string;
  email?: string;
  className?: string;
  academicScore: number | null;
  status: StudentStatus;
  guardianName?: string;
  guardianPhoneNumber?: string;
};

const STATUS_LABEL: Record<StudentStatus, string> = {
  active: "Active",
  graduated: "Graduated",
  suspended: "Suspended",
  transferred: "Transferred",
};

const STATUS_VARIANT: Record<
  StudentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  active: "default",
  graduated: "outline",
  suspended: "destructive",
  transferred: "secondary",
};

interface StudentDataTableProps {
  students: Student[];
}

export function StudentDataTable({ students }: StudentDataTableProps) {
  const router = useRouter();

  const rows = React.useMemo<StudentRow[]>(() => {
    return students.map((student) => {
      const rawId =
        student._id ??
        student.id ??
        student.studentId ??
        (typeof crypto !== "undefined"
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2));

      return {
        id: rawId.toString(),
        recordId: student._id ?? student.id,
        name: student.name ?? "Unnamed student",
        studentId: student.studentId,
        email: student.email,
        className: student.class?.name ?? "Unassigned",
        academicScore:
          typeof student.academicScore === "number"
            ? Math.round(student.academicScore)
            : null,
        status: student.status ?? "active",
        guardianName: student.guardianName,
        guardianPhoneNumber: student.guardianPhoneNumber,
      };
    });
  }, [students]);

  const columns = React.useMemo<ColumnDef<StudentRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Student",
        cell: ({ row }) => {
          const initials = getInitials(row.original.name);
          const handleClick = () => {
            if (!row.original.recordId) return;
            router.push(`/teacher/students/${row.original.recordId}`);
          };

          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <button
                  onClick={handleClick}
                  className="text-left font-medium hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!row.original.recordId}
                >
                  {row.original.name}
                </button>
                <span className="text-xs text-muted-foreground">
                  {row.original.studentId ?? "—"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.email ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "className",
        header: "Class",
        cell: ({ row }) => (
          <Badge variant="outline" className="px-2 py-0 text-xs">
            {row.original.className ?? "Unassigned"}
          </Badge>
        ),
      },
      {
        accessorKey: "academicScore",
        header: "Academic Score",
        cell: ({ row }) => {
          const score = row.original.academicScore;
          if (score === null || Number.isNaN(score)) {
            return <span className="text-sm text-muted-foreground">—</span>;
          }

          return (
            <span className="text-sm font-semibold text-foreground">
              {score}%
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status ?? "active";
          return (
            <Badge
              variant={STATUS_VARIANT[status]}
              className="px-2 py-0 text-xs"
            >
              {STATUS_LABEL[status]}
            </Badge>
          );
        },
      },
      {
        accessorKey: "guardianName",
        header: "Guardian",
        cell: ({ row }) => {
          const { guardianName, guardianPhoneNumber } = row.original;
          if (!guardianName && !guardianPhoneNumber) {
            return <span className="text-sm text-muted-foreground">—</span>;
          }

          return (
            <div className="flex flex-col text-sm">
              <span className="font-medium">{guardianName ?? "—"}</span>
              {guardianPhoneNumber ? (
                <span className="text-xs text-muted-foreground">
                  {guardianPhoneNumber}
                </span>
              ) : null}
            </div>
          );
        },
      },
      createActionsColumn<StudentRow>((student) => {
        if (!student.recordId) {
          return [
            {
              label: "View Profile",
              onClick: () => {},
              disabled: true,
            },
          ];
        }

        return [
          {
            label: "View Profile",
            onClick: () =>
              router.push(`/teacher/students/${student.recordId}?activeTab=overview`),
          },
          {
            label: "Performance",
            onClick: () =>
              router.push(`/teacher/students/${student.recordId}?activeTab=performance`),
          },
        ];
      }),
    ],
    [router]
  );

  return (
    <GenericDataTable<StudentRow>
      data={rows}
      columns={columns}
      config={{
        enableDragDrop: false,
        enableSelection: false,
        enableColumnVisibility: true,
        enablePagination: true,
        enableSearch: false,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30, 40, 50],
      }}
      columnVisibilityLabel="Columns"
      getRowId={(row) => row.id}
    />
  );
}

function getInitials(name?: string) {
  if (!name) return "ST";
  const [first = "", second = ""] = name.split(" ");
  return `${first.charAt(0) ?? ""}${second.charAt(0) ?? ""}`.toUpperCase();
}

