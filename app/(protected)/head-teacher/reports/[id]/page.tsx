"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconArrowLeft,
  IconDownload,
  IconFileText,
  IconChartBar,
  IconUser,
  IconCalendar,
  IconSchool,
  IconTrophy,
  IconClipboardList,
} from "@tabler/icons-react";
import StudentResultsView from "@/components/reports/student-results-view";
import { toast } from "react-toastify";
// Mock data - in real app, this would come from API
const mockReportData = {
  id: 1,
  studentId: "STU2024001",
  studentName: "Emma Thompson",
  grade: "Grade 9",
  class: "Mathematics 101",
  submittedDate: "2024-10-15",
  status: "Approved",
  academicScore: 85,
  teacherName: "Dr. Sarah Johnson",
  description:
    "Emma has shown excellent progress in mathematics this quarter. She consistently participates in class discussions and demonstrates strong problem-solving skills. Her test scores have improved significantly, and she shows great potential in advanced topics.",

  attendance: 95,
  behavior: "Excellent",
  term: "Term 2, 2024",
};

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // In real app, fetch data based on params.id
  const report = mockReportData;

  const handleBack = () => {
    router.back();
  };

  const handleDownloadPDF = () => {
    // Generate PDF functionality would go here
    console.log("Generating PDF for report:", params.id);
    toast.success(
      "PDF generation started. The report will be downloaded shortly."
    );
  };

  const handleViewDetailedPerformance = () => {
    router.push(`/head-teacher/reports/${params.id}/performance`);
  };

  const getStatusBadge = (status: string) => {
    const variant =
      status === "Approved"
        ? "default"
        : status === "Rejected"
        ? "destructive"
        : "secondary";
    return <Badge variant={variant}>{status}</Badge>;
  };

  const initials = report.studentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-4 mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Student Report </h1>
            <p className="text-muted-foreground">
              {report.term} • Report ID: {params.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleDownloadPDF}>
            <IconDownload className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleViewDetailedPerformance}>
            <IconChartBar className="h-4 w-4 mr-2" />
            View detailed performance
          </Button>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="px-4 lg:px-4 mb-4">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl">{report.studentName}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <IconUser className="h-4 w-4" />
                    {report.studentId}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconSchool className="h-4 w-4" />
                    {report.grade} - {report.class}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconCalendar className="h-4 w-4" />
                    {new Date(report.submittedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-2">{getStatusBadge(report.status)}</div>
                <div className="text-sm text-muted-foreground">
                  Teacher: {report.teacherName}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
      <StudentResultsView studentId={report.studentId} />
    </div>
  );
}
