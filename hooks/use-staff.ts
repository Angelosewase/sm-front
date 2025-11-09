import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  staffApi, 
  CreateStaffData, 
  UpdateStaffData, 
  StaffQueryParams 
} from '@/lib/api/staff';
import { toast } from 'react-toastify';

// Query keys
export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (params?: StaffQueryParams) => [...staffKeys.lists(), params] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated list of staff members
 */
export function useStaff(params?: StaffQueryParams) {
  return useQuery({
    queryKey: staffKeys.list(params),
    queryFn: () => staffApi.getStaff(params),
  });
}

/**
 * Hook to fetch a single staff member by ID
 */
export function useStaffMember(id: string) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffApi.getStaffById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new staff member
 * Password is generated automatically by the system and sent via email
 */
export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStaffData) => staffApi.createStaff(data),
    onSuccess: (staff) => {
      // Invalidate and refetch all staff queries
      queryClient.invalidateQueries({ 
        queryKey: staffKeys.all,
        refetchType: 'all'
      });
      
      // Show success message with temporary password info
      if (staff.temporaryPassword) {
        toast.success(
          `Staff member created successfully! Temporary password: ${staff.temporaryPassword}. A welcome email has been sent.`,
          { autoClose: 8000 }
        );
      } else {
        toast.success('Staff member created successfully! A welcome email has been sent with login credentials.');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create staff member';
      toast.error(message);
    },
  });
}

/**
 * Hook to update an existing staff member
 */
export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffData }) => 
      staffApi.updateStaff(id, data),
    onSuccess: () => {
      // Invalidate and refetch all staff queries
      queryClient.invalidateQueries({ 
        queryKey: staffKeys.all,
        refetchType: 'all'
      });
      toast.success('Staff member updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update staff member';
      toast.error(message);
    },
  });
}

/**
 * Hook to delete a staff member
 */
export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffApi.deleteStaff(id),
    onSuccess: () => {
      // Invalidate and refetch all staff queries
      queryClient.invalidateQueries({ 
        queryKey: staffKeys.all,
        refetchType: 'all'
      });
      toast.success('Staff member deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete staff member';
      toast.error(message);
    },
  });
}

