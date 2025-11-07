"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthToken } from "@/lib/actions/auth";
import {
  CreateClassDto,
  AssignTeacherToClassDto,
  AssignSubjectToClassDto,
  IQueryClasses,
  ClassLite,
  PaginatedClassesResponse,
} from "@/types/classes.types";

const API_BASE_URL = "http://localhost:3000/api/classes";

// Low-level HTTP fns

const createClass = async (dto: CreateClassDto): Promise<ClassLite> => {
  const token = await getAuthToken();
  const res = await axios.post<ClassLite>(API_BASE_URL, dto, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const listClasses = async (
  filter: IQueryClasses = {}
): Promise<PaginatedClassesResponse> => {
  const token = await getAuthToken();
  const res = await axios.get<PaginatedClassesResponse>(API_BASE_URL, {
    params: filter,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const getClassById = async (id: string): Promise<ClassLite> => {
  const token = await getAuthToken();
  const res = await axios.get<ClassLite>(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const postAssignTeacherToClass = async ({
  classId,
  teacherId,
}: AssignTeacherToClassDto): Promise<void> => {
  const token = await getAuthToken();
  await axios.post(
    `${API_BASE_URL}/${classId}/teachers`,
    { teacherId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

const postAssignSubjectToClass = async ({
  classId,
  subjectId,
  academicYear,
  teacherId,
}: AssignSubjectToClassDto): Promise<void> => {
  const token = await getAuthToken();
  await axios.post(
    `${API_BASE_URL}/${classId}/subjects`,
    {
      subjectId,
      academicYear,
      teacherId, // optional
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Hooks

export const useCreateClass = () => {
  const qc = useQueryClient();
  return useMutation<ClassLite, Error, CreateClassDto>({
    mutationFn: createClass,
    onSuccess: () => {
      toast.success("Class created");
      qc.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (err) => toast.error(err.message || "Failed to create class"),
  });
};

export const useClasses = (filter: IQueryClasses = {}) => {
  return useQuery<PaginatedClassesResponse, Error>({
    queryKey: ["classes", filter],
    queryFn: () => listClasses(filter),
  });
};

export const useClassById = (id?: string) => {
  return useQuery<ClassLite, Error>({
    queryKey: ["class", id],
    queryFn: () => getClassById(id as string),
    enabled: !!id,
  });
};

export const useAssignTeacherToClass = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, AssignTeacherToClassDto>({
    mutationFn: postAssignTeacherToClass,
    onSuccess: () => {
      toast.success("Teacher assigned to class");
      qc.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (err) =>
      toast.error(err.message || "Failed to assign teacher to class"),
  });
};

export const useAssignSubjectToClass = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, AssignSubjectToClassDto>({
    mutationFn: postAssignSubjectToClass,
    onSuccess: () => {
      toast.success("Subject assigned to class");
      qc.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (err) =>
      toast.error(err.message || "Failed to assign subject to class"),
  });
};