import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teachersApi } from "@/lib/api/teachers";
import { toast } from "react-toastify";
import {
  CreateTeacherDto,
  TeacherQueryParams,
  UpdateTeacherDto,
  AssignClassesDto,
  UnassignClassesDto,
} from "@/types/teachers.dto";

// Query keys
export const teachersKeys = {
  all: ["teachers"] as const,
  lists: () => [...teachersKeys.all, "list"] as const,
  list: (params?: TeacherQueryParams) =>
    [...teachersKeys.lists(), params] as const,
  details: () => [...teachersKeys.all, "detail"] as const,
  detail: (id: string) => [...teachersKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated list of teachers
 */
export function useTeachers(params?: TeacherQueryParams) {
  return useQuery({
    queryKey: teachersKeys.list(params),
    queryFn: () => teachersApi.getTeachers(params),
  });
}

/**
 * Hook to assign classes to a teacher
 */
export function useAssignClassesToTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AssignClassesDto }) =>
      teachersApi.assignClasses(id, payload),
    onSuccess: (teacher) => {
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });
      if (teacher?.user?.name) {
        toast.success(
          `Assigned ${teacher.assignedClasses?.length || 0} classes to ${
            teacher.user.name
          }`
        );
      } else {
        toast.success("Classes assigned successfully");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to assign classes");
    },
  });
}

/**
 * Hook to unassign classes from a teacher
 */
export function useUnassignClassesFromTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UnassignClassesDto;
    }) => teachersApi.unassignClasses(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });
      toast.success("Classes unassigned successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to unassign classes"
      );
    },
  });
}

/**
 * Hook to fetch a single teacher by ID
 */
export function useTeacher(id: string) {
  return useQuery({
    queryKey: teachersKeys.detail(id),
    queryFn: () => teachersApi.getTeacherById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new teacher
 * Password is generated automatically by the system and sent via email
 */
export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeacherDto) => teachersApi.createTeacher(data),
    onSuccess: (teacher) => {
      // Invalidate and refetch all teachers queries
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });

      // Show success message with temporary password info
      if (teacher.temporaryPassword) {
        toast.success(
          `Teacher created successfully! Temporary password: ${teacher.temporaryPassword}. A welcome email has been sent.`,
          { autoClose: 8000 }
        );
      } else {
        toast.success(
          "Teacher created successfully! A welcome email has been sent with login credentials."
        );
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create teacher";
      toast.error(message);
    },
  });
}

/**
 * Hook to update an existing teacher
 */
export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherDto }) =>
      teachersApi.updateTeacher(id, data),
    onSuccess: () => {
      // Invalidate and refetch all teachers queries
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });
      toast.success("Teacher updated successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update teacher";
      toast.error(message);
    },
  });
}

/**
 * Hook to delete a teacher
 */
export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teachersApi.deleteTeacher(id),
    onSuccess: () => {
      // Invalidate and refetch all teachers queries
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });
      toast.success("Teacher deleted successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete teacher";
      toast.error(message);
    },
  });
}
