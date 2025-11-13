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

const showError = (error: any, fallback: string) => {
  toast.error(error?.response?.data?.message ?? fallback);
};

const invalidateMarksList = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: marksKeys.list() });
};

export const useMarks = () =>
  useQuery({
    queryKey: marksKeys.list(),
    queryFn: () => marksApi.listMarks(),
  });

export const useAssessmentMarks = (assessmentId?: string) =>
  useQuery<MarkRecord[]>({
    queryKey: assessmentId
      ? marksKeys.assessment(assessmentId)
      : marksKeys.assessment("unknown"),
    queryFn: () => marksApi.getAssessmentMarks(assessmentId as string),
    enabled: !!assessmentId,
  });

export const useEnterMark = () => {
  const queryClient = useQueryClient();

  return useMutation<MarkRecord, any, EnterMarkDto>({
    mutationFn: (payload) => marksApi.enterMark(payload),
    onSuccess: () => {
      invalidateMarksList(queryClient);
    },
    onError: (error: any) => {
      showError(error, "Failed to record mark. Please try again.");
    },
  });
};

export const useBulkEnterMarks = () => {
  const queryClient = useQueryClient();

  return useMutation<BulkEnterMarksResult, any, BulkEnterMarksDto>({
    mutationFn: (payload) => marksApi.enterMarksBulk(payload),
    onSuccess: () => {
      invalidateMarksList(queryClient);
    },
    onError: (error: any) => {
      showError(error, "Failed to submit marks in bulk.");
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
      invalidateMarksList(queryClient);
    },
    onError: (error: any) => {
      showError(error, "Failed to update mark. Please try again.");
    },
  });
};

