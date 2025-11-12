import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { teachersApi } from "@/lib/api/teachers";
import {
  AssignClassesDto,
  AssignSubjectsDto,
  BulkTeacherActionResponse,
  CreateTeacherDto,
  RemoveSubjectsDto,
  TeacherQueryParams,
  UpdateTeacherDto,
  UnassignClassesDto,
} from "@/types/teachers.dto";

export const teachersKeys = {
  all: ["teachers"] as const,
  lists: () => [...teachersKeys.all, "list"] as const,
  list: (params?: TeacherQueryParams) =>
    [...teachersKeys.lists(), params] as const,
  details: () => [...teachersKeys.all, "detail"] as const,
  detail: (id: string) => [...teachersKeys.details(), id] as const,
};

export function useTeachers(params?: TeacherQueryParams) {
  return useQuery({
    queryKey: teachersKeys.list(params),
    queryFn: () => teachersApi.getTeachers(params),
  });
}

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

export function useAssignSubjectsToTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AssignSubjectsDto;
    }) => teachersApi.assignSubjects(id, payload),
    onSuccess: (teacher) => {
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });
      toast.success(
        teacher?.user?.name
          ? `Subjects updated for ${teacher.user.name}`
          : "Subjects assigned successfully"
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to assign subjects"
      );
    },
  });
}

export function useRemoveSubjectsFromTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: RemoveSubjectsDto;
    }) => teachersApi.removeSubjects(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });
      toast.success("Subject removed from teacher");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove subject"
      );
    },
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: teachersKeys.detail(id),
    queryFn: () => teachersApi.getTeacherById(id),
    enabled: !!id,
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeacherDto) => teachersApi.createTeacher(data),
    onSuccess: (teacher) => {
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });

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

export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherDto }) =>
      teachersApi.updateTeacher(id, data),
    onSuccess: () => {
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

export function useTrashTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teachersApi.trashTeacher(id),
    onSuccess: (teacher) => {
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });
      const name = teacher?.user?.name ?? "Teacher";
      toast.success(`${name} moved to trash.`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to move teacher to trash";
      toast.error(message);
    },
  });
}

export function useRestoreTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teachersApi.restoreTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });
      toast.success("Teacher restored successfully.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to restore teacher";
      toast.error(message);
    },
  });
}

export function usePermanentlyDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teachersApi.permanentlyDeleteTeacher(id),
    onSuccess: (response: BulkTeacherActionResponse) => {
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });
      const deletedCount = response?.deletedCount ?? 1;
      toast.success(
        deletedCount > 1
          ? `${deletedCount} teachers permanently deleted.`
          : "Teacher permanently deleted."
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to permanently delete teacher";
      toast.error(message);
    },
  });
}

export function useBulkTrashTeachers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => teachersApi.bulkTrashTeachers(ids),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });
      const count = response?.modifiedCount ?? 0;
      toast.success(
        count
          ? `${count} teacher${count > 1 ? "s" : ""} moved to trash.`
          : "No teachers moved to trash."
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to move teachers to trash";
      toast.error(message);
    },
  });
}

export function useBulkRestoreTeachers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => teachersApi.bulkRestoreTeachers(ids),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });
      const count = response?.modifiedCount ?? 0;
      toast.success(
        count
          ? `${count} teacher${count > 1 ? "s" : ""} restored.`
          : "No teachers restored."
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to restore teachers";
      toast.error(message);
    },
  });
}

export function useBulkPermanentlyDeleteTeachers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      teachersApi.bulkPermanentlyDeleteTeachers(ids),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: teachersKeys.all,
        refetchType: "all",
      });
      const count = response?.deletedCount ?? 0;
      toast.success(
        count
          ? `${count} teacher${count > 1 ? "s" : ""} permanently deleted.`
          : "No teachers permanently deleted."
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Failed to permanently delete teachers";
      toast.error(message);
    },
  });
}

// Backwards compatibility export
export const useDeleteTeacher = useTrashTeacher;
