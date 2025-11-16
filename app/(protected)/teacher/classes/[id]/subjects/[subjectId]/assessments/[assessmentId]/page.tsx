"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { MarksEntryView, StudentMarkChange } from "@/components/teacher/marks/marks-entry-view";
import { useAssessment } from "@/hooks/use-subjects";
import { Skeleton } from "@/components/ui/skeleton";
import { AssessmentStudentSummary } from "@/types/subjects.dto";
import { useEnterMark, useUpdateMark, useAssessmentMarks } from "@/hooks/use-marks";
import type { MarkRecord } from "@/lib/api/marks";

export default function AssessmentMarksPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  const subjectId = params.subjectId as string;
  const assessmentId = params.assessmentId as string;

  const { data: assessment, isLoading, refetch } = useAssessment(assessmentId);
  const {
    data: assessmentMarks,
    isLoading: marksLoading,
    refetch: refetchMarks,
  } = useAssessmentMarks(assessmentId);
  const enterMarkMutation = useEnterMark();
  const updateMarkMutation = useUpdateMark();

  const handleBackClick = () => {
    router.push(`/teacher/classes/${classId}/subjects/${subjectId}`);
  };

  const handleSaveChanges = useCallback(
    async (changes: StudentMarkChange[]) => {
      if (!assessment) {
        throw new Error("Assessment data not available.");
      }

      const subjectRef = assessment.subject;
      const classRef = assessment.class;
      const academicYearRef = assessment.academicYear;

      const subjectIdValue =
        typeof subjectRef === "string" ? subjectRef : subjectRef?._id ?? "";
      const classIdValue =
        typeof classRef === "string"
          ? classRef
          : classRef?._id ?? classRef?.id ?? "";
      const academicYearValue =
        typeof academicYearRef === "string"
          ? academicYearRef
          : academicYearRef?._id ?? academicYearRef?.label ?? "";
      const termValue = assessment.term;
      const normalizedAssessmentType =
        typeof assessment.AssessmentType === "string"
          ? assessment.AssessmentType.toLowerCase()
          : "";

      if (
        !subjectIdValue ||
        !classIdValue ||
        !academicYearValue ||
        !termValue
      ) {
        throw new Error("Missing assessment context required to save marks.");
      }

      const markUpdates: Record<string, string> = {};

      for (const change of changes) {
        const backendStudentId =
          change.studentRecordId ?? change.studentId ?? change.id;

        if (!backendStudentId) {
          throw new Error("Missing student identifier for mark save.");
        }

        if (change.markId) {
          const savedMark = await updateMarkMutation.mutateAsync({
            id: change.markId,
            payload: {
              score: change.score,
              comment: change.remarks,
            },
          });
          if (savedMark?._id) {
            markUpdates[change.id] = savedMark._id;
          }
          continue;
        }

        if (change.score === null || change.score === undefined) {
          continue;
        }

        const savedMark = await enterMarkMutation.mutateAsync({
          studentId: backendStudentId,
          subjectId: subjectIdValue,
          classId: classIdValue,
          academicYear: academicYearValue,
          term: termValue,
          assessmentType: normalizedAssessmentType || "assessment",
          score: change.score,
          comment: change.remarks?.trim() ? change.remarks : undefined,
          assessmentId: assessment._id,
        });

        if (savedMark?._id) {
          markUpdates[change.id] = savedMark._id;
        }
      }

      await Promise.all([refetch(), refetchMarks()]);

      return markUpdates;
    },
    [assessment, enterMarkMutation, updateMarkMutation, refetch, refetchMarks]
  );

  // ✅ Move useMemo BEFORE any conditional returns
  const assessmentData = useMemo(() => {
    // Return early/default data if assessment is not loaded yet
    if (!assessment) {
      return {
        id: "",
        title: "",
        category: "",
        date: "",
        weight: 0,
        maxScore: 0,
        className: "",
        subjectName: "",
        students: [],
        isSubmitted: false,
        lastSaved: new Date().toISOString(),
      };
    }

    const subject =
      typeof assessment.subject === "string" ? undefined : assessment.subject;
    const classInfo =
      typeof assessment.class === "string" ? undefined : assessment.class;
    const marksArray: MarkRecord[] = Array.isArray(assessmentMarks)
      ? assessmentMarks
      : [];

    type StudentMarkSnapshot = {
      markId?: string;
      score: number | null;
      remarks: string;
      studentRecordId?: string;
      studentName?: string;
      admissionNumber?: string;
    };

    const markByStudentKey = new Map<string, StudentMarkSnapshot>();

    const registerSnapshot = (
      key: string | undefined,
      snapshot: StudentMarkSnapshot
    ) => {
      if (!key) return;
      markByStudentKey.set(key, {
        ...(markByStudentKey.get(key) ?? {}),
        ...snapshot,
      });
    };

    marksArray.forEach((mark) => {
      if (!mark) return;
      const studentRef = mark.student;
      const studentId =
        typeof studentRef === "string"
          ? studentRef
          : studentRef?._id ?? studentRef?.studentId ?? "";
      const snapshot: StudentMarkSnapshot = {
        markId: mark._id,
        score:
          typeof mark.score === "number" ? mark.score : mark.score ?? null,
        remarks: typeof mark.comment === "string" ? mark.comment : "",
        studentRecordId: studentId,
        studentName:
          typeof studentRef === "string" ? undefined : studentRef?.name ?? "",
        admissionNumber:
          typeof studentRef === "string"
            ? undefined
            : studentRef?.studentId ?? studentRef?._id,
      };

      registerSnapshot(studentId, snapshot);

      if (
        typeof studentRef !== "string" &&
        studentRef?.studentId &&
        studentRef.studentId !== studentId
      ) {
        registerSnapshot(studentRef.studentId, snapshot);
      }
    });

    const getSnapshot = (...keys: (string | undefined)[]) => {
      for (const key of keys) {
        if (key && markByStudentKey.has(key)) {
          return markByStudentKey.get(key);
        }
      }
      return undefined;
    };

    type StudentRow = {
      id: string;
      studentId?: string;
      studentRecordId?: string;
      name: string;
      admissionNumber?: string;
      score: number | null;
      remarks: string;
      markId?: string;
    };

    const classStudents: AssessmentStudentSummary[] = classInfo?.students ?? [];

    const mappedStudents: StudentRow[] = classStudents.map((student) => {
      const fallbackId =
        student._id ?? student.studentId ?? `${assessment._id}-${student.name}`;
      const snapshot = getSnapshot(student._id, student.studentId);

      return {
        id: fallbackId,
        studentId: student.studentId,
        studentRecordId: student._id ?? student.studentId ?? fallbackId,
        name: student.name,
        admissionNumber: student.studentId ?? student._id,
        score: snapshot?.score ?? null,
        remarks: snapshot?.remarks ?? "",
        markId: snapshot?.markId,
      };
    });

    const mappedStudentKeys = new Set<string>();
    mappedStudents.forEach((student) => {
      if (student.studentRecordId) mappedStudentKeys.add(student.studentRecordId);
      if (student.studentId) mappedStudentKeys.add(student.studentId);
      mappedStudentKeys.add(student.id);
    });

    const additionalStudents: StudentRow[] = marksArray.reduce(
      (acc, mark) => {
        const studentRef = mark.student;
        const keyCandidates: (string | undefined)[] =
          typeof studentRef === "string"
            ? [studentRef]
            : [studentRef?._id, studentRef?.studentId];

        const alreadyIncluded = keyCandidates.some(
          (key) => key && mappedStudentKeys.has(key)
        );
        if (alreadyIncluded) {
          return acc;
        }

        const snapshot = getSnapshot(...keyCandidates);
        const markName =
          typeof studentRef === "string" ? undefined : studentRef?.name ?? "";
        const admissionNumber =
          typeof studentRef === "string"
            ? studentRef
            : studentRef?.studentId ?? studentRef?._id;

        if (typeof studentRef === "string") {
          const fallbackId = studentRef;
          acc.push({
            id: fallbackId,
            studentId: studentRef,
            studentRecordId: studentRef,
            name: snapshot?.studentName ?? "Unknown Student",
            admissionNumber: admissionNumber,
            score: snapshot?.score ?? null,
            remarks: snapshot?.remarks ?? "",
            markId: snapshot?.markId,
          });
          mappedStudentKeys.add(studentRef);
        } else if (studentRef) {
          const fallbackId =
            studentRef._id ??
            studentRef.studentId ??
            `${assessment._id}-${studentRef.name ?? "student"}`;

          acc.push({
            id: fallbackId,
            studentId: studentRef.studentId,
            studentRecordId:
              studentRef._id ?? studentRef.studentId ?? fallbackId,
            name: markName || snapshot?.studentName || "Unknown Student",
            admissionNumber: admissionNumber ?? fallbackId,
            score: snapshot?.score ?? null,
            remarks: snapshot?.remarks ?? "",
            markId: snapshot?.markId,
          });

          if (studentRef._id) mappedStudentKeys.add(studentRef._id);
          if (studentRef.studentId) mappedStudentKeys.add(studentRef.studentId);
        }

        return acc;
      },
      [] as StudentRow[]
    );

    const combinedStudents: StudentRow[] = [
      ...mappedStudents,
      ...additionalStudents,
    ];

    return {
      id: assessment._id,
      title: assessment.title,
      category: assessment.AssessmentType,
      date: assessment.deadline,
      weight: assessment.weight ?? 0,
      maxScore: assessment.maxScore ?? 0,
      className: classInfo?.name ?? "",
      subjectName: subject?.name ?? "",
      students: combinedStudents,
      isSubmitted:
        assessment.status === "completed" || assessment.status === "closed",
      lastSaved:
        assessment.updatedAt ??
        assessment.createdAt ??
        new Date().toISOString(),
    };
  }, [assessment, assessmentMarks]);

  // NOW the conditional returns come AFTER all hooks
  if (isLoading || marksLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((k) => (
            <Skeleton key={k} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-muted-foreground">
            Assessment Not Found
          </h1>
          <p className="text-muted-foreground mt-2">
            The assessment you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-primary hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <MarksEntryView
        assessmentData={assessmentData}
        onBackClick={handleBackClick}
        onSaveChanges={handleSaveChanges}
      />
    </div>
  );
}
