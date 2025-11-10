import { useQuery } from '@tanstack/react-query';
import { teachersApi } from '@/lib/api/teachers';
import { headTeachersApi } from '@/lib/api/head-teachers';

// Query keys
export const headTeachersKeys = {
  all: ['head-teachers'] as const,
  lists: () => [...headTeachersKeys.all, 'list'] as const,
  list: (params?: { page?: number; limit?: number }) => [...headTeachersKeys.lists(), params] as const,
};

/**
 * Hook to fetch list of teachers
 */
export function useHeadTeachers(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: headTeachersKeys.list(params),
    queryFn: () => headTeachersApi.getHeadTeachers(params),
  });
}

