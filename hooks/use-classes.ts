import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  classesApi, 
  CreateClassData, 
  UpdateClassData, 
  ClassQueryParams 
} from '@/lib/api/classes';
import { toast } from 'react-toastify';

// Query keys
export const classesKeys = {
  all: ['classes'] as const,
  lists: () => [...classesKeys.all, 'list'] as const,
  list: (params?: ClassQueryParams) => [...classesKeys.lists(), params] as const,
  details: () => [...classesKeys.all, 'detail'] as const,
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
        refetchType: 'all'
      });
      toast.success('Class created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create class';
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
        refetchType: 'all'
      });
      toast.success('Class updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update class';
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
        refetchType: 'all'
      });
      toast.success('Class moved to trash.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to move class to trash';
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
        refetchType: 'all',
      });
      toast.success('Class restored successfully.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to restore class';
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
        refetchType: 'all',
      });
      toast.success('Class permanently deleted.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to permanently delete class';
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
        refetchType: 'all',
      });
      toast.success(
        modifiedCount
          ? `${modifiedCount} class${modifiedCount > 1 ? 'es' : ''} moved to trash.`
          : 'No classes were moved to trash.'
      );
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to move classes to trash';
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
        refetchType: 'all',
      });
      toast.success(
        modifiedCount
          ? `${modifiedCount} class${modifiedCount > 1 ? 'es' : ''} restored.`
          : 'No classes were restored.'
      );
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to restore classes';
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
        refetchType: 'all',
      });
      toast.success(
        deletedCount
          ? `${deletedCount} class${deletedCount > 1 ? 'es' : ''} permanently deleted.`
          : 'No classes were permanently deleted.'
      );
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to permanently delete classes';
      toast.error(message);
    },
  });
}

