// api/subject.mutations.ts
"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  CreateSubjectDto,
  UpdateSubjectDto,
  Subject,
  ListSubjectsFilter,
  PaginatedSubjectsResponse,
  AssignTeacherDto,
  AssignClassDto,
  RemoveFromClassDto,
  AssessmentDetail,
  AssessmentFilterDto,
  CreateAssessmentDto,
  UpdateAssessmentDto,
  AssessmentPerformance,
} from "@/types/subjects.dto";
import {
  subjectsApi,
  SubjectAssessmentSummary,
  SubjectStats,
} from "@/lib/api/subjects";
// Mutation hooks
export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<Subject, Error, CreateSubjectDto>({
    mutationFn: subjectsApi.createSubject,
    onSuccess: () => {
      // Invalidate all subjects queries
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to create subject";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<Subject, Error, { id: string; dto: UpdateSubjectDto }>({
    mutationFn: ({ id, dto }) => subjectsApi.updateSubject(id, dto),
    onSuccess: (_, variables) => {
      // Invalidate the specific subject and all subjects queries
      queryClient.invalidateQueries({ queryKey: ["subject", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update subject";
      toast.error(errorMessage);
    },
  });
};

export const useToggleSubjectStatus = () => {
  const updateSubjectMutation = useUpdateSubject();

  return (id: string, nextStatus: string) => {
    updateSubjectMutation.mutate(
      { id, dto: { status: nextStatus } },
      {
        onSuccess: () =>
          toast.success(
            `Subject ${
              nextStatus.toLowerCase() == "active" ? "Activated" : "Deactivated"
            } successfully.`
          ),
        onError: (err: any) => {
          const errorMessage = err?.response?.data?.message || err?.message || "Failed to update subject status";
          toast.error(errorMessage);
        },
      }
    );
  };
};
// Query hooks
export const useSubjects = (filter: ListSubjectsFilter = {}) => {
  return useQuery<PaginatedSubjectsResponse, Error>({
    queryKey: ["subjects", filter],
    queryFn: () => subjectsApi.fetchSubjects(filter),
    // staleTime: 1 * 30 * 1000,
  });
};

export const useSubjectById = (id: string) => {
  return useQuery<Subject, Error>({
    queryKey: ["subject", id],
    queryFn: () => subjectsApi.fetchSubjectById(id),
    enabled: !!id,
    staleTime: 1 * 30 * 1000,
  });
};

export const useSubjectStats = (
  subjectId: string,
  opts?: { classId?: string; term?: string }
) => {
  return useQuery<SubjectStats, Error>({
    queryKey: ["subject-stats", subjectId, opts?.classId, opts?.term],
    queryFn: () => subjectsApi.fetchSubjectStats(subjectId, opts),
    enabled: !!subjectId,
    staleTime: 30_000,
  });
};

export const useSubjectAssessments = (
  subjectId: string,
  opts?: { classId?: string; term?: string }
) => {
  return useQuery<SubjectAssessmentSummary[], Error>({
    queryKey: ["subject-assessments", subjectId, opts?.classId, opts?.term],
    queryFn: () => subjectsApi.fetchSubjectAssessments(subjectId, opts),
    enabled: !!subjectId,
    staleTime: 30_000,
  });
};

// ---- Assessments hooks ----
export const assessmentsKeys = {
  all: ["assessments"] as const,
  list: (params?: AssessmentFilterDto) =>
    [...assessmentsKeys.all, "list", params] as const,
  detail: (id: string) => [...assessmentsKeys.all, "detail", id] as const,
  performance: (id: string) =>
    [...assessmentsKeys.all, "performance", id] as const,
  subjectPerformance: (
    subjectId: string,
    params?: { academicYear?: string; term?: string; classId?: string }
  ) =>
    [...assessmentsKeys.all, "subject-performance", subjectId, params] as const,
  classPerformance: (
    classId: string,
    params?: { academicYear?: string; term?: string }
  ) => [...assessmentsKeys.all, "class-performance", classId, params] as const,
};

export function useAssessments(params?: AssessmentFilterDto) {
  return useQuery({
    queryKey: assessmentsKeys.list(params),
    queryFn: () => subjectsApi.fetchAssessments(params),
  });
}

export function useAssessment(id?: string) {
  return useQuery<AssessmentDetail>({
    queryKey: assessmentsKeys.detail(id ?? "unknown"),
    queryFn: () => subjectsApi.getAssessmentById(id as string),
    enabled: !!id,
  });
}

export function useCreateAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAssessmentDto) =>
      subjectsApi.createAssessment(payload),
    onSuccess: (_res, variables) => {
      toast.success("Assessment created.");
      // Invalidate relevant lists
      qc.invalidateQueries({ queryKey: assessmentsKeys.all });
      
      // Invalidate subject-assessments queries for reactive UI updates
      qc.invalidateQueries({ queryKey: ["subject-assessments"] });
      
      // Also invalidate subject stats since new assessment affects totals
      qc.invalidateQueries({ queryKey: ["subject-stats"] });
      
      if (variables?.subject && variables?.class) {
        qc.invalidateQueries({
          queryKey: [
            "subject-assessments",
            variables.subject,
            variables.class,
            variables.term as any,
          ],
        });
        qc.invalidateQueries({
          queryKey: ["subject-stats", variables.subject, variables.class, variables.term],
        });
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to create assessment"
      );
    },
  });
}

export function useUpdateAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssessmentDto }) =>
      subjectsApi.updateAssessment(id, data),
    onSuccess: (res, variables) => {
      toast.success("Assessment updated.");
      qc.invalidateQueries({ queryKey: assessmentsKeys.detail(res._id) });
      qc.invalidateQueries({ queryKey: assessmentsKeys.all });
      
      // Invalidate subject-assessments queries for reactive UI updates
      qc.invalidateQueries({ queryKey: ["subject-assessments"] });
      
      // Also invalidate subject stats since weight changes affect totals
      qc.invalidateQueries({ queryKey: ["subject-stats"] });
      
      // If we have subject and class info, invalidate more specific queries
      if (variables.data?.subject && variables.data?.class) {
        qc.invalidateQueries({
          queryKey: [
            "subject-assessments",
            variables.data.subject,
            variables.data.class,
            variables.data.term as any,
          ],
        });
        qc.invalidateQueries({
          queryKey: ["subject-stats", variables.data.subject, variables.data.class, variables.data.term],
        });
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to update assessment"
      );
    },
  });
}

export function useSoftDeleteAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subjectsApi.softDeleteAssessment(id),
    onSuccess: (res) => {
      toast.success("Assessment moved to trash.");
      qc.invalidateQueries({ queryKey: assessmentsKeys.detail(res._id) });
      qc.invalidateQueries({ queryKey: assessmentsKeys.all });
      
      // Invalidate subject-assessments queries for reactive UI updates
      qc.invalidateQueries({ queryKey: ["subject-assessments"] });
      
      // Also invalidate subject stats since deletion affects totals
      qc.invalidateQueries({ queryKey: ["subject-stats"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to trash assessment"
      );
    },
  });
}

export function useDeleteAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subjectsApi.permanentlyDeleteAssessment(id),
    onSuccess: () => {
      toast.success("Assessment permanently deleted.");
      qc.invalidateQueries({ queryKey: assessmentsKeys.all });
      
      // Invalidate subject-assessments queries for reactive UI updates
      qc.invalidateQueries({ queryKey: ["subject-assessments"] });
      
      // Also invalidate subject stats since deletion affects totals
      qc.invalidateQueries({ queryKey: ["subject-stats"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to delete assessment"
      );
    },
  });
}

export function useAssessmentPerformance(id?: string) {
  return useQuery<AssessmentPerformance>({
    queryKey: assessmentsKeys.performance(id ?? "unknown"),
    queryFn: () => subjectsApi.getAssessmentPerformance(id as string),
    enabled: !!id,
  });
}

export function useSubjectAssessmentsPerformance(
  subjectId?: string,
  params?: { academicYear?: string; term?: string; classId?: string }
) {
  return useQuery<AssessmentPerformance>({
    queryKey: assessmentsKeys.subjectPerformance(
      subjectId ?? "unknown",
      params
    ),
    queryFn: () =>
      subjectsApi.getSubjectAssessmentsPerformance(subjectId as string, params),
    enabled: !!subjectId,
  });
}

export function useClassAssessmentsPerformance(
  classId?: string,
  params?: { academicYear?: string; term?: string }
) {
  return useQuery<AssessmentPerformance>({
    queryKey: assessmentsKeys.classPerformance(classId ?? "unknown", params),
    queryFn: () =>
      subjectsApi.getClassAssessmentsPerformance(classId as string, params),
    enabled: !!classId,
  });
}

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => subjectsApi.deleteSubject(id),
    onSuccess: (_, id) => {
      toast.success(`Subject moved to trash.`);
      // Invalidate the specific subject and all subjects queries
      queryClient.invalidateQueries({ queryKey: ["subject", id] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to move subject to trash";
      toast.error(errorMessage);
    },
  });
};

export const useRestoreSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: (id) => subjectsApi.restoreSubject(id),
    onSuccess: (_, id) => {
      toast.success(`Subject restored successfully.`);
      queryClient.invalidateQueries({ queryKey: ["subject", id] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to restore subject";
      toast.error(errorMessage);
    },
  });
};

export const usePermanentlyDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => subjectsApi.permanentlyDeleteSubject(id),
    onSuccess: (_, id) => {
      toast.success(`Subject permanently deleted.`);
      queryClient.invalidateQueries({ queryKey: ["subject", id] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to permanently delete subject";
      toast.error(errorMessage);
    },
  });
};

export const useBulkTrashSubjects = () => {
  const queryClient = useQueryClient();
  return useMutation<{ modifiedCount: number }, Error, string[]>({
    mutationFn: (ids) => subjectsApi.bulkTrashSubjects(ids),
    onSuccess: ({ modifiedCount }) => {
      toast.success(
        modifiedCount
          ? `${modifiedCount} subject${
              modifiedCount > 1 ? "s" : ""
            } moved to trash.`
          : "No subjects were moved to trash."
      );
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to move subjects to trash";
      toast.error(errorMessage);
    },
  });
};

export const useBulkRestoreSubjects = () => {
  const queryClient = useQueryClient();
  return useMutation<{ modifiedCount: number }, Error, string[]>({
    mutationFn: (ids) => subjectsApi.bulkRestoreSubjects(ids),
    onSuccess: ({ modifiedCount }) => {
      toast.success(
        modifiedCount
          ? `${modifiedCount} subject${modifiedCount > 1 ? "s" : ""} restored.`
          : "No subjects were restored."
      );
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to restore subjects";
      toast.error(errorMessage);
    },
  });
};

export const useBulkPermanentlyDeleteSubjects = () => {
  const queryClient = useQueryClient();
  return useMutation<{ deletedCount: number }, Error, string[]>({
    mutationFn: (ids) => subjectsApi.bulkPermanentlyDeleteSubjects(ids),
    onSuccess: ({ deletedCount }) => {
      toast.success(
        deletedCount
          ? `${deletedCount} subject${
              deletedCount > 1 ? "s" : ""
            } permanently deleted.`
          : "No subjects were permanently deleted."
      );
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to permanently delete subjects";
      toast.error(errorMessage);
    },
  });
};

export const useAssignSubjectToTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, AssignTeacherDto>({
    mutationFn: subjectsApi.assignSubjectToTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subject assigned to teacher");
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to assign subject to teacher";
      toast.error(errorMessage);
    },
  });
};

export const useSchoolStats = (schoolId: string, academicYear: string) =>
  useQuery({
    queryKey: ["schoolStats", schoolId, academicYear],
    queryFn: () => subjectsApi.fetchSchoolStats(schoolId, academicYear),
    enabled: !!schoolId,
  });

export const useTeacherWorkload = (teacherId: string, academicYear: string) =>
  useQuery({
    queryKey: ["teacherWorkload", teacherId, academicYear],
    queryFn: () => subjectsApi.fetchTeacherWorkload(teacherId, academicYear),
    enabled: !!teacherId,
  });

export const useClassesOfSubject = (subjectId: string, params = {}) =>
  useQuery({
    queryKey: ["subjectClasses", subjectId, params],
    queryFn: () => subjectsApi.fetchClassesOfSubject(subjectId, params),
    enabled: !!subjectId,
  });

export const useSubjectsOfClass = (classId: string, params = {}) =>
  useQuery({
    queryKey: ["classSubjects", classId, params],
    queryFn: () => subjectsApi.fetchSubjectsOfClass(classId, params),
    enabled: !!classId,
  });

export const useClassesOfTeacher = (teacherId: string, params = {}) =>
  useQuery({
    queryKey: ["teacherClasses", teacherId, params],
    queryFn: () => subjectsApi.fetchClassesOfTeacher(teacherId, params),
    enabled: !!teacherId,
  });

export const useSubjectsOfTeacher = (teacherId: string, params = {}) =>
  useQuery({
    queryKey: ["teacherSubjects", teacherId, params],
    queryFn: () => subjectsApi.fetchSubjectsOfTeacher(teacherId, params),
    enabled: !!teacherId,
  });

export const useTeacherSchedule = (
  teacherId: string,
  academicYear: string,
  term?: string
) =>
  useQuery({
    queryKey: ["teacherSchedule", teacherId, academicYear, term],
    queryFn: () =>
      subjectsApi.fetchTeacherSchedule(teacherId, academicYear, term),
    enabled: !!teacherId && !!academicYear,
  });

export const useAssignSubjectBulk = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { subjectId: string; assignments: any }>({
    mutationFn: ({ subjectId, assignments }) =>
      subjectsApi.assignSubjectBulk(subjectId, assignments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subjects assigned successfully");
    },
    onError: (err) => toast.error(err.message || "Failed to assign subjects"),
  });
};

export const useDeleteAssignment = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (assignmentId: string) =>
      subjectsApi.deleteAssignment(assignmentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
      qc.invalidateQueries({ queryKey: ["classSubjects"] });
      qc.invalidateQueries({ queryKey: ["teacherSubjects"] });
      toast.success("Assignment removed");
    },
    onError: (e) => toast.error(e.message ?? "Failed to delete assignment"),
  });
};

export const useRemoveSubjectFromClass = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, RemoveFromClassDto>({
    mutationFn: subjectsApi.removeSubjectFromClass,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
      qc.invalidateQueries({ queryKey: ["classSubjects"] });
      toast.success("Subject removed from class");
    },
    onError: (e) => toast.error(e.message ?? "Failed to remove"),
  });
};

export const useListSubjectsForTeacher = (teacherId: string) => {
  const qc = useQueryClient();
  useQuery({
    queryKey: ["subjectsForTeacher"],
    queryFn: () => subjectsApi.fetchTeacherSubjects(teacherId),
    enabled: !!teacherId,
  });
};
