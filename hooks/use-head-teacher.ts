import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { headTeachersApi } from '@/lib/api/head-teachers';
import { CreateHeadTeacherDto, UpdateHeadTeacherDto } from '@/types/head-teacher.dto';
import { toast } from 'react-toastify';

// Query keys
export const headTeachersKeys = {
  all: ['head-teachers'] as const,
  lists: () => [...headTeachersKeys.all, 'list'] as const,
  details: () => [...headTeachersKeys.all, "detail"] as const,
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


export function useHeadTeacher(id: string) {
  return useQuery({
    queryKey: headTeachersKeys.details(),
    queryFn: () => headTeachersApi.getHeadTeacherById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new teacher
 * Password is generated automatically by the system and sent via email
 */
export function useCreateHeadTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHeadTeacherDto) => headTeachersApi.createHeadTeacher(data),
    onSuccess: (teacher) => {
      // Invalidate and refetch all teachers queries
      queryClient.invalidateQueries({
        queryKey: headTeachersKeys.all,
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
export function useUpdateHeadTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHeadTeacherDto }) =>
      headTeachersApi.updateHeadTeacher(id, data),
    onSuccess: () => {
      // Invalidate and refetch all teachers queries
      queryClient.invalidateQueries({
        queryKey: headTeachersKeys.all,
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
export function useDeleteHeadTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => headTeachersApi.deleteHeadTeacher(id),
    onSuccess: () => {
      // Invalidate and refetch all teachers queries
      queryClient.invalidateQueries({
        queryKey: headTeachersKeys.all,
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


