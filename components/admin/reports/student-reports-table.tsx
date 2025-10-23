"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import {
  IconFileCheck,
  IconFileX,
  IconClock,
  IconEye,
  IconChartBar,
  IconDownload,
  IconUser,
  IconSchool,
  IconCalendar,
  IconFileDescription,
} from "@tabler/icons-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const studentReportSchema = z.object({
  id: z.number(),
  studentId: z.string(),
  studentName: z.string(),
  grade: z.string(),
  class: z.string(),
  reportType: z.string(),
  reportTitle: z.string(),
  submittedDate: z.string(),
  status: z.enum(["Approved", "Pending", "Rejected"]),
  academicScore: z.number(),
  teacherName: z.string(),
  description: z.string(),
});

export type StudentReport = z.infer<typeof studentReportSchema>;

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
    accessorKey: "reportTitle",
    header: "Report",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.original.reportTitle}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.reportType}
        </span>
      </div>
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
        <ViewReportDialog report={row.original} />
        <ViewPerformanceDialog report={row.original} />
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

  const customToolbarActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onApproveAll?.();
          toast.success("All pending reports approved");
        }}
      >
        <IconFileCheck className="h-4 w-4 mr-1" />
        Approve All
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onRejectAll?.();
          toast.error("All pending reports rejected");
        }}
      >
        <IconFileX className="h-4 w-4 mr-1" />
        Reject All
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onExportAll?.();
          toast.success("Exporting all reports...");
        }}
      >
        <IconDownload className="h-4 w-4 mr-1" />
        Export All
      </Button>
    </div>
  );

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
    />
  );
}

// View Report Dialog Component
function ViewReportDialog({ report }: { report: StudentReport }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState(report.status);
  const [feedback, setFeedback] = React.useState("");

  const handleUpdateStatus = () => {
    toast.success(`Report ${status.toLowerCase()} successfully`);
    setOpen(false);
  };

  const Content = (
    <>
      <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm max-h-[60vh]">
        {/* Student Information */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold flex items-center gap-2">
            <IconUser className="h-4 w-4" />
            Student Information
          </h3>
          <div className="grid grid-cols-2 gap-4 p-3 border rounded-lg bg-muted/30">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <p className="font-medium">{report.studentName}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Student ID</Label>
              <p className="font-medium">{report.studentId}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Grade</Label>
              <p className="font-medium">{report.grade}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Class</Label>
              <p className="font-medium">{report.class}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Report Details */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold flex items-center gap-2">
            <IconFileDescription className="h-4 w-4" />
            Report Details
          </h3>
          <div className="flex flex-col gap-3 p-3 border rounded-lg">
            <div>
              <Label className="text-xs text-muted-foreground">Report Title</Label>
              <p className="font-medium">{report.reportTitle}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Report Type</Label>
              <p className="font-medium">{report.reportType}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Teacher</Label>
              <p className="font-medium">{report.teacherName}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Submitted Date</Label>
              <div className="flex items-center gap-1">
                <IconCalendar className="h-3 w-3" />
                <p className="font-medium">
                  {new Date(report.submittedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Academic Score</Label>
              <div className="flex items-center gap-2 mt-1">
                <IconChartBar className="h-5 w-5 text-primary" />
                <p className="text-2xl font-bold text-primary">{report.academicScore}%</p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Current Status</Label>
              <div className="mt-1">
                <Badge
                  variant={
                    report.status === "Approved"
                      ? "default"
                      : report.status === "Rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {report.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Report Description */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Description</h3>
          <div className="p-3 border rounded-lg bg-muted/30">
            <p className="text-sm">{report.description}</p>
          </div>
        </div>

        <Separator />

        {/* Update Status */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Update Report Status</h3>
          <div className="flex flex-col gap-3">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Approved">Approve</SelectItem>
                <SelectItem value="Pending">Keep Pending</SelectItem>
                <SelectItem value="Rejected">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="feedback">Feedback (Optional)</Label>
            <Textarea
              id="feedback"
              placeholder="Add your feedback or comments..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2 px-4 py-4 border-t">
        <Button onClick={handleUpdateStatus} className="flex-1">
          Update Status
        </Button>
        <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
          Cancel
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen} direction="bottom">
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm">
            <IconEye className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="gap-1">
            <DrawerTitle>View Report</DrawerTitle>
            <DrawerDescription>
              Review and update the report status
            </DrawerDescription>
          </DrawerHeader>
          {Content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <IconEye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>View Report</DialogTitle>
          <DialogDescription>
            Review and update the report status
          </DialogDescription>
        </DialogHeader>
        {Content}
      </DialogContent>
    </Dialog>
  );
}

// View Performance Dialog Component
function ViewPerformanceDialog({ report }: { report: StudentReport }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  // Mock performance data
  const performanceData = {
    overallScore: report.academicScore,
    subjects: [
      { name: "Mathematics", score: 88, trend: "+5%" },
      { name: "English", score: 82, trend: "+3%" },
      { name: "Science", score: 90, trend: "+7%" },
      { name: "History", score: 75, trend: "-2%" },
      { name: "Physical Education", score: 85, trend: "+4%" },
    ],
    attendance: 95,
    behavior: "Excellent",
    recentActivities: [
      "Completed Math Assignment - 95%",
      "Science Project Presentation - A+",
      "English Essay Submission - 88%",
    ],
  };

  const Content = (
    <>
      <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm max-h-[60vh]">
        {/* Overall Performance */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold flex items-center gap-2">
            <IconChartBar className="h-4 w-4" />
            Overall Performance
          </h3>
          <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs text-muted-foreground">Academic Score</Label>
                <p className="text-3xl font-bold text-primary mt-1">
                  {performanceData.overallScore}%
                </p>
              </div>
              <div className="text-right">
                <Label className="text-xs text-muted-foreground">Attendance</Label>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {performanceData.attendance}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Subject Performance */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold flex items-center gap-2">
            <IconSchool className="h-4 w-4" />
            Subject Performance
          </h3>
          <div className="flex flex-col gap-2">
            {performanceData.subjects.map((subject) => (
              <div
                key={subject.name}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{subject.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium ${
                      subject.trend.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {subject.trend}
                  </span>
                  <span className="font-bold text-lg">{subject.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Behavior & Activities */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Behavior & Recent Activities</h3>
          <div className="p-3 border rounded-lg">
            <Label className="text-xs text-muted-foreground">Behavior Rating</Label>
            <Badge className="mt-1" variant="default">
              {performanceData.behavior}
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Recent Activities</Label>
            {performanceData.recentActivities.map((activity, index) => (
              <div key={index} className="p-2 border rounded-lg bg-muted/30 text-xs">
                • {activity}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 px-4 py-4 border-t">
        <Button onClick={() => setOpen(false)} className="flex-1">
          Close
        </Button>
        <Button variant="outline" className="flex-1">
          <IconDownload className="h-4 w-4 mr-1" />
          Export Report
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen} direction="bottom">
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm">
            <IconChartBar className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="gap-1">
            <DrawerTitle>Student Performance</DrawerTitle>
            <DrawerDescription>
              Detailed performance overview for {report.studentName}
            </DrawerDescription>
          </DrawerHeader>
          {Content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <IconChartBar className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Student Performance</DialogTitle>
          <DialogDescription>
            Detailed performance overview for {report.studentName}
          </DialogDescription>
        </DialogHeader>
        {Content}
      </DialogContent>
    </Dialog>
  );
}
