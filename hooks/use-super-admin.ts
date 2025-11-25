import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { superAdminApi } from "@/lib/api/super-admin";
import {
  QuerySchoolsDto,
  ActivateSchoolDto,
  QueryUserDto,
} from "@/types/super-admin.dto";

export const superAdminKeys = {
  all: ["super-admin"] as const,
  schools: () => [...superAdminKeys.all, "schools"] as const,
  schoolsList: (params?: QuerySchoolsDto) =>
    [...superAdminKeys.schools(), "list", params] as const,
  schoolDetail: (id: string) =>
    [...superAdminKeys.schools(), "detail", id] as const,
  users: () => [...superAdminKeys.all, "users"] as const,
  usersList: (params?: QueryUserDto) =>
    [...superAdminKeys.users(), "list", params] as const,
};

/**
 * Hook to fetch paginated list of schools
 */
export function useSchools(params?: QuerySchoolsDto) {
  return useQuery({
    queryKey: superAdminKeys.schoolsList(params),
    queryFn: () => superAdminApi.getSchools(params),
  });
}

/**
 * Hook to fetch a single school by ID
 */
export function useSchool(
  id: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: superAdminKeys.schoolDetail(id),
    queryFn: () => superAdminApi.getSchoolById(id),
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
  });
}

/**
 * Hook to activate a school
 */
export function useActivateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => superAdminApi.activateSchool(id),
    onSuccess: (school) => {
      queryClient.invalidateQueries({
        queryKey: superAdminKeys.schools(),
      });
      toast.success(`School "${school.name}" activated successfully.`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to activate school";
      toast.error(message);
    },
  });
}

/**
 * Hook to deactivate a school
 */
export function useDeactivateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => superAdminApi.deactivateSchool(id),
    onSuccess: (school) => {
      queryClient.invalidateQueries({
        queryKey: superAdminKeys.schools(),
      });
      toast.success(`School "${school.name}" deactivated successfully.`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to deactivate school";
      toast.error(message);
    },
  });
}

/**
 * Hook to toggle school status
 */
export function useToggleSchoolStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ActivateSchoolDto }) =>
      superAdminApi.toggleSchoolStatus(id, payload),
    onSuccess: (school) => {
      queryClient.invalidateQueries({
        queryKey: superAdminKeys.schools(),
      });
      const status = school.isActive ? "activated" : "deactivated";
      toast.success(`School "${school.name}" ${status} successfully.`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update school status";
      toast.error(message);
    },
  });
}

/**
 * Hook to fetch paginated list of users
 */
export function useUsers(params?: QueryUserDto) {
  return useQuery({
    queryKey: superAdminKeys.usersList(params),
    queryFn: () => superAdminApi.getUsers(params),
  });
}

