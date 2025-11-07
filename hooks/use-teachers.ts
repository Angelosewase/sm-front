import { useQuery } from '@tanstack/react-query';
import { teachersApi } from '@/lib/api/teachers';

// Query keys
export const teachersKeys = {
  all: ['teachers'] as const,
  lists: () => [...teachersKeys.all, 'list'] as const,
  list: (params?: { page?: number; limit?: number }) => [...teachersKeys.lists(), params] as const,
};

/**
 * Hook to fetch list of teachers
 */
export function useTeachers(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: teachersKeys.list(params),
    queryFn: () => teachersApi.getTeachers(params),
  });
}

