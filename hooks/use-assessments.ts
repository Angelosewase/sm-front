"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Assessment,
  UpdateAssessmentDto,
  assessmentsApi,
} from "@/lib/api/assessments";

/**
 * Mutation hook for updating an assessment
 */
export const useUpdateAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation<Assessment, Error, { id: string; dto: UpdateAssessmentDto }>({
    mutationFn: ({ id, dto }) => assessmentsApi.update(id, dto),
    onSuccess: (_, variables) => {
      // Invalidate the specific assessment and all assessments queries
      queryClient.invalidateQueries({ queryKey: ["assessment", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      
      // Invalidate subject-assessments queries to trigger reactivity in the UI
      queryClient.invalidateQueries({ queryKey: ["subject-assessments"] });
      
      // Also invalidate subject stats since weight changes affect totals
      queryClient.invalidateQueries({ queryKey: ["subject-stats"] });
      
      toast.success("Assessment updated successfully");
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update assessment";
      toast.error(errorMessage);
    },
  });
};

/**
 * Mutation hook for soft deleting an assessment (move to trash)
 */
export const useSoftDeleteAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation<Assessment, Error, string>({
    mutationFn: (id: string) => assessmentsApi.softDelete(id),
    onSuccess: (_, assessmentId) => {
      // Invalidate the specific assessment and all assessments queries
      queryClient.invalidateQueries({ queryKey: ["assessment", assessmentId] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      
      // Invalidate subject-assessments queries to trigger reactivity in the UI
      queryClient.invalidateQueries({ queryKey: ["subject-assessments"] });
      
      // Also invalidate subject stats since deletion affects totals
      queryClient.invalidateQueries({ queryKey: ["subject-stats"] });
      
      toast.success("Assessment moved to trash");
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete assessment";
      toast.error(errorMessage);
    },
  });
};

/**
 * Mutation hook for permanently deleting an assessment
 */
export const useDeleteAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => assessmentsApi.delete(id),
    onSuccess: (_, assessmentId) => {
      // Invalidate the specific assessment and all assessments queries
      queryClient.invalidateQueries({ queryKey: ["assessment", assessmentId] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });

      queryClient.invalidateQueries({ queryKey: ["subject-assessments"] });
      queryClient.invalidateQueries({ queryKey: ["subject-stats"] });
      
      toast.success("Assessment deleted permanently");
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete assessment";
      toast.error(errorMessage);
    },
  });
};