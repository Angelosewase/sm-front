import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  schoolApi,
  type CreateSchoolPayload,
  type School,
  type UpdateSchoolPayload,
} from "@/lib/api/school";
import { toast } from "react-toastify";

export const schoolKeys = {
  all: ["school"] as const,
  lists: () => [...schoolKeys.all, "list"] as const,
  list: () => [...schoolKeys.lists(), "all"] as const,
  details: () => [...schoolKeys.all, "detail"] as const,
  detail: (id?: string) => [...schoolKeys.details(), id ?? "unknown"] as const,
};

type SchoolDetailKey = ReturnType<typeof schoolKeys.detail>;

export function useSchool<TData = School>(
  id: string | undefined,
  options?: Omit<
    UseQueryOptions<School, unknown, TData, SchoolDetailKey>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: schoolKeys.detail(id),
    queryFn: () => {
      if (!id) {
        throw new Error("School id is required");
      }
      return schoolApi.getSchool(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
    // onError: (error: any) => {
    //   const message = error.response?.data?.message || "Failed to fetch school";
    //   toast.error(message);
    // },
  });
}

type CreateOptions = Omit<
  UseMutationOptions<School, unknown, CreateSchoolPayload>,
  "mutationFn"
>;

export function useCreateSchool(options?: CreateOptions) {
  const queryClient = useQueryClient();
  const userOnSuccess = options?.onSuccess as
    | ((...args: any[]) => unknown)
    | undefined;

  return useMutation({
    mutationFn: (payload: CreateSchoolPayload) =>
      schoolApi.createSchool(payload),
    ...options,
    onSuccess: async (data, variables, context, mutation) => {
      toast.success("School created successfully!");
      try {
        if (userOnSuccess) {
          await userOnSuccess(data, variables, context, mutation);
        }
      } finally {
        await queryClient.invalidateQueries({ queryKey: schoolKeys.all });
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create school";
      toast.error(message);
    },
  });
}

type UpdateVariables = { id: string; payload: UpdateSchoolPayload };

type UpdateOptions = Omit<
  UseMutationOptions<School, unknown, UpdateVariables>,
  "mutationFn"
>;

export function useUpdateSchool(options?: UpdateOptions) {
  const queryClient = useQueryClient();
  const userOnSuccess = options?.onSuccess as
    | ((...args: any[]) => unknown)
    | undefined;

  return useMutation({
    mutationFn: ({ id, payload }: UpdateVariables) =>
      schoolApi.updateSchool(id, payload),
    ...options,
    onSuccess: async (data, variables, context, mutation) => {
      toast.success("School updated successfully!");
      try {
        if (userOnSuccess) {
          await userOnSuccess(data, variables, context, mutation);
        }
      } finally {
        await queryClient.invalidateQueries({
          queryKey: schoolKeys.detail(variables.id),
        });
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update school";
      toast.error(message);
    },
  });
}
