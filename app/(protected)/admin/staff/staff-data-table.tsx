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
  IconClock,
  IconCurrencyDollar,
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

export const staffSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  position: z.string(),
  department: z.string(),
  status: z.string(),
  employmentType: z.string(),
  salary: z.string(),
  hireDate: z.string(),
  phone: z.string(),
  shift: z.string(),
});

const columns: ColumnDef<z.infer<typeof staffSchema>>[] = [
  createDragColumn<z.infer<typeof staffSchema>>(),
  createSelectColumn<z.infer<typeof staffSchema>>(),
  {
    accessorKey: "name",
    header: "Staff Member",
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
          <StaffDetailViewer item={row.original} />
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.position}</div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-2">
        {row.original.department}
      </Badge>
    ),
  },
  {
    accessorKey: "employmentType",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.employmentType === "Full-time" ? "default" : "secondary"
        }
        className="text-xs"
      >
        {row.original.employmentType}
      </Badge>
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
          <IconCircleDashed className="text-orange-500" />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "shift",
    header: "Shift",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <IconClock className="h-3 w-3" />
        {row.original.shift}
      </div>
    ),
  },
  {
    accessorKey: "hireDate",
    header: "Hire Date",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {new Date(row.original.hireDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
    ),
  },
  {
    accessorKey: "salary",
    header: "Salary",
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.original.salary}</div>
    ),
  },
  createActionsColumn<z.infer<typeof staffSchema>>([
    { label: "Edit Profile", onClick: () => {} },
    { label: "View Details", onClick: () => {} },
    { label: "Update Salary", onClick: () => {} },
    { label: "Send Message", onClick: () => {} },
    { label: "Terminate", onClick: () => {}, variant: "destructive" },
  ]),
];

export function StaffDataTable({
  data,
}: {
  data: z.infer<typeof staffSchema>[];
}) {
  const tabs = [
    {
      value: "all-staff",
      label: "All Staff",
    },
    {
      value: "administration",
      label: "Administration",
      badge: 3,
      content: (
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      ),
    },
    {
      value: "maintenance",
      label: "Maintenance",
      badge: 2,
      content: (
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      ),
    },
    {
      value: "support",
      label: "Support Services",
      badge: 5,
      content: (
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      ),
    },
  ];

  return (
    <GenericDataTable<z.infer<typeof staffSchema>>
      data={data}
      columns={columns}
      tabs={tabs}
      defaultTab="all-staff"
      config={{
        enableDragDrop: true,
        enableSelection: true,
        enableColumnVisibility: true,
        enablePagination: true,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30, 40, 50],
      }}
      addButtonLabel="Add Staff Member"
      columnVisibilityLabel="Customize Columns"
    />
  );
}

function StaffDetailViewer({ item }: { item: z.infer<typeof staffSchema> }) {
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
            Staff member profile and employment information
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {/* Basic Information Section */}
          <div className="flex flex-col gap-4">
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
                <Label className="text-xs text-muted-foreground">Position</Label>
                <p className="font-medium">{item.position}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Department</Label>
                <p className="font-medium">{item.department}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Employment Type
                </Label>
                <p className="font-medium">{item.employmentType}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Shift</Label>
                <p className="font-medium">{item.shift}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Hire Date</Label>
                <div className="flex items-center gap-1">
                  <IconCalendar className="h-3 w-3" />
                  <p className="font-medium">
                    {new Date(item.hireDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Salary</Label>
                <div className="flex items-center gap-1">
                  <IconCurrencyDollar className="h-3 w-3" />
                  <p className="font-medium">{item.salary}</p>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="mt-1">
                <Badge
                  variant={item.status === "Active" ? "default" : "secondary"}
                >
                  {item.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Edit Form */}
          <form className="flex flex-col gap-4">
            <h3 className="font-semibold">Edit Staff Information</h3>
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
                <Label htmlFor="position">Position</Label>
                <Input id="position" defaultValue={item.position} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="department">Department</Label>
                <Select defaultValue={item.department}>
                  <SelectTrigger id="department" className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="IT Support">IT Support</SelectItem>
                    <SelectItem value="Health Services">
                      Health Services
                    </SelectItem>
                    <SelectItem value="Library">Library</SelectItem>
                    <SelectItem value="Student Services">
                      Student Services
                    </SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Food Services">Food Services</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Human Resources">
                      Human Resources
                    </SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Science Lab">Science Lab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select defaultValue={item.employmentType}>
                  <SelectTrigger id="employmentType" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="shift">Shift</Label>
                <Select defaultValue={item.shift}>
                  <SelectTrigger id="shift" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                    <SelectItem value="Morning/Afternoon">
                      Morning/Afternoon
                    </SelectItem>
                    <SelectItem value="Rotating">Rotating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="salary">Salary</Label>
                <Input id="salary" defaultValue={item.salary} />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="hireDate">Hire Date</Label>
              <Input id="hireDate" type="date" defaultValue={item.hireDate} />
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
