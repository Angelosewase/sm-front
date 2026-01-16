"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { AssessementManagementView } from "@/components/teacher/marks/assesments-management-view";
import {
  useSubjectAssessments,
  useSubjectStats,
  useSubjectById,
} from "@/hooks/use-subjects";
import { useClass } from "@/hooks/use-classes";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useOpenAcademicYear,
  useTermsByAcademicYear,
} from "@/hooks/use-academic-terms";
import { ClassesOverview } from "@/components/teacher/classes/classes-overview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SubjectMarksPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  const subjectId = params.subjectId as string;

  const [term, setTerm] = React.useState<string | undefined>(undefined);

  const { data: classInfo } = useClass(classId);
  const { data: subjectInfo } = useSubjectById(subjectId);
  const { data: openAcademicYear } = useOpenAcademicYear();
  const { data: terms = [] } = useTermsByAcademicYear(openAcademicYear?._id);
  const { data: stats, isLoading: statsLoading } = useSubjectStats(subjectId, {
    classId,
    term,
  });
  const { data: assessments, isLoading: assessmentsLoading } =
    useSubjectAssessments(subjectId, { classId, term });

  // Default to the currently open term when available
  React.useEffect(() => {
    if (!term && terms.length > 0) {
      const openTerm = terms.find((t) => t.isOpen);
      if (openTerm?._id) {
        setTerm(openTerm._id);
      }
    }
  }, [terms, term]);

  const isLoading = statsLoading || assessmentsLoading;

  const handleAssessmentClick = (assessmentId: string) => {
    router.push(
      `/teacher/classes/${classId}/subjects/${subjectId}/assessments/${assessmentId}`
    );
  };

  const handleBackClick = () => {
    router.push(`/teacher/classes/${classId}`);
  };

  const handleTermChange = (termId: string) => {
    // Accept 'all' handled in child; here we receive undefined for all-terms
    setTerm(termId as any);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((k) => (
            <Skeleton key={k} className="h-24 w-full" />
          ))}
        </div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Build SubjectData for MarksManagementView
  const subjectData = {
    id: subjectId,
    name: assessments?.[0]?.class ? undefined : "", // placeholder; subject name not from this endpoint
    className: classInfo?.name ?? "Class",
    studentCount: classInfo?.studentCount ?? 0,
    currentTerm: term, // undefined means "All Terms" in the child component
    terms: (terms ?? []).map((t) => ({
      id: t._id,
      name: `Term ${t.order}`,
      isActive: !!t.isOpen,
    })),
    assessments: (assessments ?? []).map((a) => ({
      id: a.assessmentId,
      title: a.title,
      category: a.assessmentType,
      date: a.createdAt,
      weight: a.weight,
      maxScore: a.maxScore,
      studentsCompleted: a.completedCount,
      averageScore: a.averageScore,
      status: (a.status || "").toLowerCase() as
        | "pending"
        | "in_progress"
        | "completed",
    })),
  };

  // Create overview stats similar to classes page
  const overviewStats = {
    totalClasses: 1,
    totalSubjects: 1,
    totalStudents: classInfo?.studentCount ?? 0,
    completedAssessments: (assessments ?? []).filter(
      (a) => a.status === "completed"
    ).length,
    pendingAssessments: (assessments ?? []).filter(
      (a) => a.status !== "completed"
    ).length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2 max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {classInfo?.name || "Class"}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {subjectInfo?.name || "Subject"} - {classInfo?.name || "Class"}
          </h2>
          <span className="text-sm text-muted-foreground">
            {(assessments ?? []).length} assessment
            {(assessments ?? []).length !== 1 ? "s" : ""} •{" "}
            {classInfo?.studentCount ?? 0} student
            {classInfo?.studentCount !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Manage assessments, track student progress, and record marks.
        </p>

        {/* Overview Stats Section */}
        <ClassesOverview stats={overviewStats} />

        {/* Subject Marks View */}
        <AssessementManagementView
          subjectData={subjectData as any}
          onAssessmentClick={handleAssessmentClick}
          onBackClick={handleBackClick}
          onTermChange={(t) => setTerm(t)}
          context={{
            subjectId,
            classId,
            termId: term,
            academicYearId: openAcademicYear?._id,
          }}
        />
      </div>
    </div>
  );
}
