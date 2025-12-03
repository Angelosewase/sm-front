import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PassMarks,
  CreatePassMarksDto,
  UpdatePassMarksDto,
  passMarksApi,
} from "@/lib/api/pass-marks";

/**
 * Get pass marks configuration for a specific school
 */
export const usePassMarksBySchool = (schoolId: string | undefined) => {
  return useQuery<PassMarks, Error>({
    queryKey: ["pass-marks", "school", schoolId],
    queryFn: () => passMarksApi.getBySchool(schoolId!),
    enabled: !!schoolId,
  });
};

/**
 * Get all pass marks configurations (admin/head teacher only)
 */
export const usePassMarks = () => {
  return useQuery<PassMarks[], Error>({
    queryKey: ["pass-marks"],
    queryFn: () => passMarksApi.getAll(),
  });
};

/**
 * Create pass marks configuration mutation
 */
export const useCreatePassMarks = () => {
  const queryClient = useQueryClient();

  return useMutation<PassMarks, Error, CreatePassMarksDto>({
    mutationFn: (payload) => passMarksApi.create(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pass-marks"] });
      queryClient.invalidateQueries({ queryKey: ["pass-marks", "school", data.school] });
    },
  });
};

/**
 * Update pass marks configuration mutation
 */
export const useUpdatePassMarks = () => {
  const queryClient = useQueryClient();

  return useMutation<PassMarks, Error, { schoolId: string; payload: UpdatePassMarksDto }>({
    mutationFn: ({ schoolId, payload }) => passMarksApi.update(schoolId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pass-marks"] });
      const schoolId = typeof data.school === "string" ? data.school : data.school._id;
      queryClient.invalidateQueries({ queryKey: ["pass-marks", "school", schoolId] });
    },
  });
};

/**
 * Delete pass marks configuration mutation
 */
export const useDeletePassMarks = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (schoolId) => passMarksApi.delete(schoolId),
    onSuccess: (_, schoolId) => {
      queryClient.invalidateQueries({ queryKey: ["pass-marks"] });
      queryClient.invalidateQueries({ queryKey: ["pass-marks", "school", schoolId] });
    },
  });
};

