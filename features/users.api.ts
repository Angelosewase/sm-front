"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  CreateSubjectDto,
  UpdateSubjectDto,
  Subject,
  ListSubjectsFilter,
  PaginatedSubjectsResponse,
} from "@/types/subjects.dto";
import { getAuthToken } from "@/lib/actions/auth";
import { AssignTeacherDto, ListUsersFilter, PaginatedUsersResponse } from "@/types/users.dto";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:3000/api/users";

// Create a new user
const createUser = async (dto: CreateSubjectDto): Promise<Subject> => {
  const response = await axios.post<Subject>(API_BASE_URL, dto, {
    headers: { Authorization: `Bearer ${await getAuthToken()}` },
  });
  return response.data;
};

const fetchUsers = async (
  filter: ListUsersFilter = {}
): Promise<PaginatedUsersResponse> => {
  const response = await axios.get<PaginatedUsersResponse>(API_BASE_URL, {
    params: filter,
    headers: { Authorization: `Bearer ${await getAuthToken()}` },
  });
  return response.data;
};


export const useUsers = (filter: ListUsersFilter = {}) => {
  return useQuery<PaginatedUsersResponse, Error>({
    queryKey: ["users", filter],
    queryFn: () => fetchUsers(filter),
  });
};

// Assign subject to teacher
const assignSubjectToTeacher = async (dto: AssignTeacherDto): Promise<void> => {
  const token = await getAuthToken();
  await axios.post(
    `${API_BASE_URL}/${dto.subjectId}/assign-teacher`,
    {
      teacherId: dto.teacherId,
      academicYear: dto.academicYear,
      term: dto.term,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const useAssignSubjectToTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, AssignTeacherDto>({
    mutationFn: assignSubjectToTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subject assigned to teacher");
    },
    onError: (err) => toast.error(err.message || "Failed to assign subject"),
  });
};
