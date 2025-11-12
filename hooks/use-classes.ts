import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  classesApi,
  CreateClassData,
  UpdateClassData,
  ClassQueryParams,
  SubjectSummary,
} from "@/lib/api/classes";
import { toast } from "react-toastify";
import {
  AssignSubjectToClassDto,
  AssignTeacherToClassDto,
  ClassLite,
  ClassStatsResponse,
  IQueryClasses,
} from "@/types/classes.types";
import { dashbaordApi } from "@/lib/api/dashboard";

// Query keys
export const classesKeys = {
  all: ["classes"] as const,
  lists: () => [...classesKeys.all, "list"] as const,
  list: (params?: ClassQueryParams) =>
    [...classesKeys.lists(), params] as const,
  details: () => [...classesKeys.all, "detail"] as const,
  detail: (id: string) => [...classesKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated list of classes
 */
export function useClasses(params?: ClassQueryParams) {
  return useQuery({
    queryKey: classesKeys.list(params),
    queryFn: () => classesApi.getClasses(params),
  });
}

/**
 * Hook to fetch a single class by ID
 */
export function useClass(id: string) {
  return useQuery({
    queryKey: classesKeys.detail(id),
    queryFn: () => classesApi.getClassById(id),
    enabled: !!id,
  });
}

/**
 * Hook to list subjects assigned to a class
 */
export function useClassSubjects(classId: string) {
  return useQuery<SubjectSummary[]>({
    queryKey: [...classesKeys.detail(classId), "subjects"],
    queryFn: () => classesApi.listClassSubjects(classId),
    enabled: !!classId,
  });
}

/**
 * Hook to create a new class
 */
export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassData) => classesApi.createClass(data),
    onSuccess: () => {
      // Invalidate and refetch all classes queries
      queryClient.invalidateQueries({
        queryKey: classesKeys.all,
        refetchType: "all",
      });
      toast.success("Class created successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create class";
      toast.error(message);
    },
  });
}

/**
 * Hook to update an existing class
 */
export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassData }) =>
      classesApi.updateClass(id, data),
    onSuccess: () => {
      // Invalidate and refetch all classes queries
      queryClient.invalidateQueries({
        queryKey: classesKeys.all,
        refetchType: "all",
      });
      toast.success("Class updated successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update class";
      toast.error(message);
    },
  });
}

/**
 * Hook to delete a class
 */
export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classesApi.deleteClass(id),
    onSuccess: () => {
      // Invalidate and refetch all classes queries
      queryClient.invalidateQueries({
        queryKey: classesKeys.all,
        refetchType: "all",
      });
      toast.success("Class moved to trash.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to move class to trash";
      toast.error(message);
    },
  });
}

/**
 * Hook to restore a trashed class
 */
export function useRestoreClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classesApi.restoreClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: classesKeys.all,
        refetchType: "all",
      });
      toast.success("Class restored successfully.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to restore class";
      toast.error(message);
    },
  });
}

/**
 * Hook to permanently delete a trashed class
 */
export function usePermanentlyDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classesApi.permanentlyDeleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: classesKeys.all,
        refetchType: "all",
      });
      toast.success("Class permanently deleted.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to permanently delete class";
      toast.error(message);
    },
  });
}

/**
 * Hook to bulk move classes to trash
 */
export function useBulkTrashClasses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => classesApi.bulkTrashClasses(ids),
    onSuccess: ({ modifiedCount }) => {
      queryClient.invalidateQueries({
        queryKey: classesKeys.all,
        refetchType: "all",
      });
      toast.success(
        modifiedCount
          ? `${modifiedCount} class${
              modifiedCount > 1 ? "es" : ""
            } moved to trash.`
          : "No classes were moved to trash."
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to move classes to trash";
      toast.error(message);
    },
  });
}

/**
 * Hook to bulk restore trashed classes
 */
export function useBulkRestoreClasses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => classesApi.bulkRestoreClasses(ids),
    onSuccess: ({ modifiedCount }) => {
      queryClient.invalidateQueries({
        queryKey: classesKeys.all,
        refetchType: "all",
      });
      toast.success(
        modifiedCount
          ? `${modifiedCount} class${modifiedCount > 1 ? "es" : ""} restored.`
          : "No classes were restored."
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to restore classes";
      toast.error(message);
    },
  });
}

/**
 * Hook to bulk permanently delete trashed classes
 */
export function useBulkPermanentlyDeleteClasses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => classesApi.bulkPermanentlyDeleteClasses(ids),
    onSuccess: ({ deletedCount }) => {
      queryClient.invalidateQueries({
        queryKey: classesKeys.all,
        refetchType: "all",
      });
      toast.success(
        deletedCount
          ? `${deletedCount} class${
              deletedCount > 1 ? "es" : ""
            } permanently deleted.`
          : "No classes were permanently deleted."
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to permanently delete classes";
      toast.error(message);
    },
  });
}

export function useClassesForSubjects(subjectId: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: classesKeys.detail(subjectId),
    queryFn: () => classesApi.listClassesForSubjects(subjectId),
    enabled: !!subjectId,
  });
}
// export const useCreateClass = () => {
//   const qc = useQueryClient();
//   return useMutation<ClassLite, Error, CreateClassDto>({
//     mutationFn: createClass,
//     onSuccess: () => {
//       toast.success("Class created");
//       qc.invalidateQueries({ queryKey: ["classes"] });
//     },
//     onError: (err) => toast.error(err.message || "Failed to create class"),
//   });
// };

// export const useClasses = (filter: IQueryClasses = {}) => {
//   return useQuery<PaginatedClassesResponse, Error>({
//     queryKey: ["classes", filter],
//     queryFn: () => classesApi.listClasses(filter),
//   });
// };

export const useClassById = (id?: string) => {
  return useQuery<any, Error>({
    queryKey: ["class", id],
    queryFn: () => classesApi.getClassById(id as string),
    enabled: !!id,
  });
};

export const useAssignTeacherToClass = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, AssignTeacherToClassDto>({
    mutationFn: classesApi.postAssignTeacherToClass,
    onSuccess: () => {
      toast.success("Teacher assigned to class");
      qc.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (err) =>
      toast.error(err.message || "Failed to assign teacher to class"),
  });
};

export const useAssignSubjectToClass = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, AssignSubjectToClassDto>({
    mutationFn: classesApi.assignSubjectToClass,
    onSuccess: () => {
      toast.success("Subject assigned to class");
      qc.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (err) =>
      toast.error(err.message || "Failed to assign subject to class"),
  });
};

export function useClassStats(
  schoolId?: string,
  options?: UseQueryOptions<ClassStatsResponse>
) {
  return useQuery<ClassStatsResponse>({
    queryKey: ["class-stats", schoolId],
    queryFn: () => dashbaordApi.fetchClassStats(schoolId),
    enabled: !!schoolId,
    staleTime: 60_000,
    ...options,
  });
}
