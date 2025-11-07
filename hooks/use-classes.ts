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
      toast.success('Class deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete class';
      toast.error(message);
    },
  });
}

