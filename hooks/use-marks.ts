"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  BulkEnterMarksDto,
  BulkEnterMarksResult,
  EnterMarkDto,
  MarkRecord,
  UpdateMarkDto,
  marksApi,
} from "@/lib/api/marks";

const marksKeyRoot = ["marks"] as const;

export const marksKeys = {
  all: marksKeyRoot,
  list: () => [...marksKeyRoot, "list"] as const,
  assessment: (assessmentId: string) =>
    [...marksKeyRoot, "assessment", assessmentId] as const,
  detail: (id: string) => [...marksKeyRoot, "detail", id] as const,
};

export const useMarks = () =>
  useQuery({
    queryKey: marksKeys.list(),
    queryFn: () => marksApi.listMarks(),
  });

export const useEnterMark = () => {
  const queryClient = useQueryClient();

  return useMutation<MarkRecord, any, EnterMarkDto>({
    mutationFn: (payload) => marksApi.enterMark(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marksKeys.list() });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to record mark. Please try again."
      );
    },
  });
};

export const useAssessmentMarks = (assessmentId?: string) =>
  useQuery<MarkRecord[]>({
    queryKey: assessmentId ? marksKeys.assessment(assessmentId) : marksKeys.assessment("unknown"),
    queryFn: () => marksApi.getAssessmentMarks(assessmentId as string),
    enabled: !!assessmentId,
  });

export const useBulkEnterMarks = () => {
  const queryClient = useQueryClient();

  return useMutation<BulkEnterMarksResult, any, BulkEnterMarksDto>({
    mutationFn: (payload) => marksApi.enterMarksBulk(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marksKeys.list() });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to submit marks in bulk."
      );
    },
  });
};

export const useUpdateMark = () => {
  const queryClient = useQueryClient();

  return useMutation<
    MarkRecord,
    any,
    {
      id: string;
      payload: UpdateMarkDto;
    }
  >({
    mutationFn: ({ id, payload }) => marksApi.updateMark({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marksKeys.list() });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to update mark. Please try again."
      );
    },
  });
};

