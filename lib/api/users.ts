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
import { axiosInstance } from "../axios";

const API_BASE_URL = "/api/users";


export const usersApi = {
  getUsers : async (
    filter: ListUsersFilter = {}
  ): Promise<PaginatedUsersResponse> => {
    const { data } = await axiosInstance.get<PaginatedUsersResponse>(API_BASE_URL, {
      params: filter,
    });
      return data;
    },
};
