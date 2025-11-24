"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/super-admin.dto";
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { Badge } from "@/components/ui/badge";
import {
  createSelectColumn,
} from "@/components/datatable/helpers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Building2 } from "lucide-react";
import UserDetailViewer from "./user-detail-viewer";

const columns: ColumnDef<User>[] = [
  createSelectColumn<User>(),
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      const initials = user.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U";

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <UserDetailViewer user={user} />
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Mail className="h-3 w-3 text-muted-foreground" />
        <span>{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const roleColors: Record<string, string> = {
        "super admin": "bg-purple-500",
        admin: "bg-blue-500",
        "school owner": "bg-indigo-500",
        teacher: "bg-green-500",
        "head teacher": "bg-teal-500",
        student: "bg-yellow-500",
        staff: "bg-orange-500",
        parent: "bg-pink-500",
      };

      return (
        <Badge
          variant="default"
          className={roleColors[role] || "bg-gray-500"}
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Phone className="h-3 w-3" />
        <span>{row.original.phone || "N/A"}</span>
      </div>
    ),
  },
  {
    accessorKey: "school",
    header: "School",
    cell: ({ row }) => {
      const schoolId = row.original.school;
      return schoolId ? (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Building2 className="h-3 w-3" />
          <span className="truncate max-w-[150px]">{schoolId}</span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">N/A</span>
      );
    },
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => {
      const city = row.original.city;
      const state = row.original.state;
      return city || state ? (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>
            {city}
            {state && `, ${state}`}
          </span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">N/A</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </div>
    ),
  },
];

interface UserDataTableProps {
  data: User[];
  isLoading?: boolean;
}

export function UserDataTable({
  data,
  isLoading = false,
}: UserDataTableProps) {
  return (
    <div className="px-4">
      <GenericDataTable
        data={data}
        columns={columns}
        config={{
          enableDragDrop: false,
          enableSelection: true,
          enableColumnVisibility: true,
          enablePagination: true,
          enableSearch: true,
          pageSize: 10,
        }}
        getRowId={(row) => row._id}
      />
    </div>
  );
}

