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
import { ListUsersFilter, PaginatedUsersResponse } from "@/types/users.dto";
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
