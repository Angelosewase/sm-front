import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { studentsApi } from "@/lib/api/students";
import {
  BulkStudentActionDto,
  ChangeStudentClassDto,
  CreateStudentDto,
  Student,
  StudentListResponse,
  StudentQueryParams,
  StudentStatsResponse,
  UpdateStudentDto,
} from "@/types/students.dto";
import { dashbaordApi } from "@/lib/api/dashboard";
import {
  studentPerformanceApi,
  SubjectPerformanceSummary,
} from "@/lib/api/student-performance";

export const studentsKeys = {
  all: ["students"] as const,
  lists: () => [...studentsKeys.all, "list"] as const,
  list: (params?: StudentQueryParams) =>
    [...studentsKeys.lists(), params] as const,
  details: () => [...studentsKeys.all, "detail"] as const,
  detail: (id: string) => [...studentsKeys.details(), id] as const,
};

type StudentsListKey = ReturnType<typeof studentsKeys.list>;
type StudentDetailKey = ReturnType<typeof studentsKeys.detail>;

type UseStudentsOptions = Omit<
  UseQueryOptions<
    StudentListResponse,
    unknown,
    StudentListResponse,
    StudentsListKey
  >,
  "queryKey" | "queryFn"
>;

export function useStudents(
  params?: StudentQueryParams,
  options?: UseStudentsOptions
) {
  return useQuery({
    queryKey: studentsKeys.list(params),
    queryFn: () => studentsApi.getStudents(params),
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useStudent(
  id?: string,
  options?: Omit<
    UseQueryOptions<Student, unknown, Student, StudentDetailKey>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: studentsKeys.detail(id ?? "unknown"),
    queryFn: () => {
      if (!id) {
        throw new Error("Student id is required");
      }
      return studentsApi.getStudentById(id);
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStudentDto) =>
      studentsApi.createStudent(payload),
    onSuccess: () => {
      toast.success("Student enrolled successfully!");
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? "Failed to create student";
      toast.error(message);
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentDto }) =>
      studentsApi.updateStudent(id, data),
    onSuccess: () => {
      toast.success("Student information updated.");
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? "Failed to update student";
      toast.error(message);
    },
  });
}

export function useTrashStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentsApi.trashStudent(id),
    onSuccess: () => {
      toast.success("Student moved to trash.");
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? "Failed to move student to trash";
      toast.error(message);
    },
  });
}

export function useRestoreStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentsApi.restoreStudent(id),
    onSuccess: () => {
      toast.success("Student restored successfully.");
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? "Failed to restore student";
      toast.error(message);
    },
  });
}

export function usePermanentlyDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentsApi.permanentlyDeleteStudent(id),
    onSuccess: () => {
      toast.success("Student permanently deleted.");
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ??
        "Failed to permanently delete student";
      toast.error(message);
    },
  });
}

export function useChangeStudentClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ChangeStudentClassDto;
    }) => studentsApi.changeStudentClass(id, payload),
    onSuccess: (student) => {
      toast.success("Student class assignment updated.");
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
      if (student?._id) {
        queryClient.invalidateQueries({
          queryKey: studentsKeys.detail(student._id),
        });
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? "Failed to update class assignment";
      toast.error(message);
    },
  });
}

export function useBulkTrashStudents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkStudentActionDto) =>
      studentsApi.bulkTrashStudents(payload),
    onSuccess: () => {
      toast.success("Selected students moved to trash.");
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? "Failed to move students to trash";
      toast.error(message);
    },
  });
}

export function useBulkRestoreStudents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkStudentActionDto) =>
      studentsApi.bulkRestoreStudents(payload),
    onSuccess: () => {
      toast.success("Selected students restored.");
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? "Failed to restore students";
      toast.error(message);
    },
  });
}

export function useBulkPermanentlyDeleteStudents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkStudentActionDto) =>
      studentsApi.bulkPermanentlyDeleteStudents(payload),
    onSuccess: () => {
      toast.success("Selected students permanently deleted.");
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ??
        "Failed to permanently delete students";
      toast.error(message);
    },
  });
}

export function useStudentStats(
  schoolId?: string,
  options?: UseQueryOptions<StudentStatsResponse>
) {
  return useQuery<StudentStatsResponse>({
    queryKey: ["student-stats", schoolId],
    queryFn: () => dashbaordApi.fetchStudentStats(schoolId),
    enabled: !!schoolId,
    staleTime: 60_000,
    ...options,
  });
}

export function useGetStudentPerformanceSummaryById(
  studentId: string,
  options?: UseQueryOptions<{
    subjects: SubjectPerformanceSummary[];
    overall: {
      totalScore: number;
      totalMax: number;
      percentage: number | null;
    };
  }>
) {
  return useQuery<{
    subjects: SubjectPerformanceSummary[];
    overall: {
      totalScore: number;
      totalMax: number;
      percentage: number | null;
    };
  }>({
    queryKey: ["student-performance-summary", studentId],
    queryFn: () =>
      studentPerformanceApi.getStudentPerformanceSummary(studentId),
    enabled: !!studentId,
    staleTime: 60 * 1000,
    ...options,
  });
}
