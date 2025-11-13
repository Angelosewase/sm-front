"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  IconArrowLeft,
  IconUser,
  IconMail,
  IconPhone,
  IconCalendar,
  IconSchool,
  IconChartBar,
  IconClipboardList,
  IconFileText,
} from "@tabler/icons-react";
import StudentPerformanceView from "@/components/reports/student-performance-view";
import StudentResultsView from "@/components/reports/student-results-view";
import {
  useGetStudentPerformanceSummaryById,
  useStudent,
} from "@/hooks/use-students";
import type { SubjectPerformanceSummary } from "@/lib/api/student-performance";
import type { Student } from "@/types/students.dto";

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const {
    data: studentData,
    isLoading: isStudentLoading,
    isError: isStudentError,
  } = useStudent(studentId);
  const {
    data: performanceSummaryData,
    isLoading: isPerformanceSummaryLoading,
    isError: isPerformanceSummaryError,
  } = useGetStudentPerformanceSummaryById(studentId);

  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case "Excellent":
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Good":
      case "graduated":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Needs Attention":
      case "transferred":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getScoreColor = (score?: number | null) => {
    if (score == null) return "text-muted-foreground";
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) {
      return "Not provided";
    }
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return "Not provided";
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const overallPercentage =
    performanceSummaryData?.overall?.percentage != null
      ? Math.round(performanceSummaryData.overall.percentage)
      : null;

  if (isStudentLoading) {
    return <div>Loading...</div>;
  }
  if (isStudentError) {
    return <div>Error loading student data</div>;
  }
  if (!studentData) {
    return <div>Student data unavailable.</div>;
  }

  const initials = studentData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusLabel =
    studentData.status.charAt(0).toUpperCase() + studentData.status.slice(1);

  const tabs = [
    { id: "overview", label: "Overview", icon: IconUser },
    { id: "performance", label: "Performance", icon: IconChartBar },
    { id: "report", label: "Report Card", icon: IconFileText },
  ];

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-4 mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/teacher/students")}
          >
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Student Profile</h1>
            <p className="text-muted-foreground flex items-center gap-4">
              <span>{studentData?.class?.name}</span>
              <span className="text-3xl leading-none font-bold text-foreground">
                ·
              </span>
              <span>{studentData?.class?.gradeLevel}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Student Info */}
      <div className="px-4 lg:px-4 mb-4">
        <div className="border-0 shadow-none">
          <div className="py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{studentData?.name}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  {/* <span className="flex items-center gap-1">
                    <IconUser className="h-4 w-4" />
                    {fakeStudentData.studentId}
                  </span> */}
                  <span className="flex items-center gap-1">
                    <IconSchool className="h-4 w-4" />
                    {studentData.class?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconCalendar className="h-4 w-4" />
                    DOB: {formatDate(studentData.dob)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(studentData.status)}>
                  {statusLabel}
                </Badge>
                <div className="mt-2 text-sm">
                  <span
                    className={`font-bold text-lg ${getScoreColor(
                      overallPercentage
                    )}`}
                  >
                    {overallPercentage != null ? `${overallPercentage}%` : "—"}
                  </span>
                  <span className="text-muted-foreground"> avg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Tab Navigation */}
      <div className="px-4 lg:px-4">
        <div className="border-b border-border">
          <div className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === "overview" && (
            <OverviewSection
              studentData={studentData}
              summary={performanceSummaryData}
              isLoading={isPerformanceSummaryLoading}
              isError={isPerformanceSummaryError}
              getScoreColor={getScoreColor}
            />
          )}

          {activeTab === "performance" && (
            <div>
              <StudentPerformanceView studentId={studentId} />
            </div>
          )}

          {activeTab === "report" && (
            <div>
              <StudentResultsView />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type StudentPerformanceSummaryResponse = {
  subjects: SubjectPerformanceSummary[];
  overall: {
    totalScore: number;
    totalMax: number;
    percentage: number | null;
  };
};

type OverviewSectionProps = {
  studentData: Student;
  summary: StudentPerformanceSummaryResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  getScoreColor: (score?: number | null) => string;
};

function OverviewSection({
  studentData,
  summary,
  isLoading,
  isError,
  getScoreColor,
}: OverviewSectionProps) {
  const contactInfo = (
    <div>
      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-3">Student</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <IconMail className="h-4 w-4 text-muted-foreground" />
              <span>{studentData.email ?? "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconPhone className="h-4 w-4 text-muted-foreground" />
              <span>{studentData.phoneNumber ?? "Not provided"}</span>
            </div>
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-3">Parent/Guardian</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <IconUser className="h-4 w-4 text-muted-foreground" />
              <span>{studentData.guardianName ?? "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconPhone className="h-4 w-4 text-muted-foreground" />
              <span>{studentData.guardianPhoneNumber ?? "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconMail className="h-4 w-4 text-muted-foreground" />
              <span>{studentData.guardianEmail ?? "Not provided"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <OverviewSkeleton />
        {contactInfo}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="border rounded-lg p-6 text-center text-sm text-muted-foreground">
          Unable to load performance summary right now.
        </div>
        {contactInfo}
      </div>
    );
  }

  const subjects = summary?.subjects ?? [];
  const overall = summary?.overall;
  const overallPercentage =
    overall?.percentage != null ? Math.round(overall.percentage) : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">
            Average Score
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(overallPercentage)}`}>
            {overallPercentage != null ? `${overallPercentage}%` : "—"}
          </div>
          {overall ? (
            <div className="text-xs text-muted-foreground mt-1">
              {overall.totalScore}/{overall.totalMax} total points
            </div>
          ) : (
            <div className="text-xs text-muted-foreground mt-1">
              No score data available
            </div>
          )}
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">
            Total Subjects
          </div>
          <div className="text-2xl font-bold">{subjects.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            With recorded assessments
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
        {subjects.length === 0 ? (
          <div className="border rounded-lg p-6 text-center text-sm text-muted-foreground">
            No subject performance data yet.
          </div>
        ) : (
          <div className="space-y-2">
            {subjects.map((subject) => {
              const percentage =
                subject.percentage != null ? Math.round(subject.percentage) : null;

              return (
                <div
                  key={subject.subjectId ?? subject.subjectName}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <IconClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <div className="font-medium">{subject.subjectName}</div>
                      <div className="text-sm text-muted-foreground">
                        {subject.totalScore}/{subject.totalMax} points ·{" "}
                        {subject.terms.length} term
                        {subject.terms.length === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${getScoreColor(percentage)}`}
                    >
                      {percentage != null ? `${percentage}%` : "—"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {subject.percentage != null ? "Overall" : "No score yet"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {contactInfo}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[0, 1].map((item) => (
          <div key={item} className="p-4 border rounded-lg space-y-3">
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-6 w-16 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="h-5 w-40 bg-muted rounded" />
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between p-4 border rounded-lg bg-background"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-40 bg-muted rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-12 bg-muted rounded" />
              <div className="h-3 w-20 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
