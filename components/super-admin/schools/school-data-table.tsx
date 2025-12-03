"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { School } from "@/types/super-admin.dto";
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createSelectColumn,
  createActionsColumn,
} from "@/components/datatable/helpers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useActivateSchool,
  useDeactivateSchool,
} from "@/hooks/use-super-admin";
import { Building2, MapPin, Mail, Phone, Globe, Users } from "lucide-react";
import SchoolDetailViewer from "./school-detail-viewer";

const columns: ColumnDef<School>[] = [
  createSelectColumn<School>(),
  {
    accessorKey: "name",
    header: "School Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <SchoolDetailViewer school={row.original} />
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>
          {row.original.city}, {row.original.district}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Contact",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 text-sm">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span>{row.original.email}</span>
        </div>
        {row.original.phoneNumber && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{row.original.phoneNumber}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "users",
    header: "Users",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Users className="h-3 w-3 text-muted-foreground" />
        <span>{row.original.users?.length || 0}</span>
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive ?? true;
      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={isActive ? "bg-green-500" : "bg-gray-500"}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <SchoolActionsCell school={row.original} />;
    },
  },
];

// Separate component for actions to avoid hook usage in cell renderer
function SchoolActionsCell({ school }: { school: School }) {
  const isActive = school.isActive ?? true;
  const activateMutation = useActivateSchool();
  const deactivateMutation = useDeactivateSchool();

  const handleToggle = () => {
    if (isActive) {
      deactivateMutation.mutate(school._id);
    } else {
      activateMutation.mutate(school._id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant={isActive ? "destructive" : "default"}
            size="sm"
            disabled={
              activateMutation.isPending || deactivateMutation.isPending
            }
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive ? "Deactivate School" : "Activate School"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {isActive ? "deactivate" : "activate"} the school "
              {school.name}"?{" "}
              {isActive
                ? "This will prevent users from accessing the school."
                : "This will allow users to access the school again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggle}>
              {isActive ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface SchoolDataTableProps {
  data: School[];
  isLoading?: boolean;
}

export function SchoolDataTable({
  data,
  isLoading = false,
}: SchoolDataTableProps) {
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

