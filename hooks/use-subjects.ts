// api/subject.mutations.ts
"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  CreateSubjectDto,
  UpdateSubjectDto,
  Subject,
  ListSubjectsFilter,
  PaginatedSubjectsResponse,
  AssignTeacherDto,
  AssignClassAndTeacherDto,
  RemoveFromClassDto,
} from "@/types/subjects.dto";
import { getAuthToken } from "@/lib/actions/auth";

import { toast } from "react-toastify";
import { subjectsApi } from "@/lib/api/subjects";
// Mutation hooks
export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<Subject, Error, CreateSubjectDto>({
    mutationFn: subjectsApi.createSubject,
    onSuccess: () => {
      // Invalidate all subjects queries
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
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
        onError: (err) =>
          toast.error(err.message || "Failed to update subject status"),
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

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => subjectsApi.deleteSubject(id),
    onSuccess: (_, id) => {
      toast.success(`Subject deleted successfully.`);
      // Invalidate the specific subject and all subjects queries
      queryClient.invalidateQueries({ queryKey: ["subject", id] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (err) => toast.error(err.message || "Failed to delete subject"),
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
      console.log("the error is: ", err.response.data.message);
      toast.error(err.response.data.message || "Failed to assign subject");
    },
  });
};

export const useAssignSubjectToClassAndTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, AssignClassAndTeacherDto>({
    mutationFn: subjectsApi.assignSubjectToClassAndTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subject assigned to class and teacher");
    },
    onError: (err) => toast.error(err.message || "Failed to assign subject"),
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
    queryFn: () => subjectsApi.fetchTeacherSchedule(teacherId, academicYear, term),
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
    mutationFn: (assignmentId: string) => subjectsApi.deleteAssignment(assignmentId),
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
    enabled: !!teacherId
  });
};
