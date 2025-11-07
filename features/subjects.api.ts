// api/subject.mutations.ts
'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CreateSubjectDto, UpdateSubjectDto, Subject, ListSubjectsFilter, PaginatedSubjectsResponse } from '@/types/subjects.dto'
import { getAuthToken } from '@/lib/actions/auth';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:3000/api/subjects'; // Adjust based on your API base URL


// Create a new subject
const createSubject = async (dto: CreateSubjectDto): Promise<Subject> => {
  const response = await axios.post<Subject>(API_BASE_URL, dto, {
    headers: { Authorization: `Bearer ${ await getAuthToken()}` },
  });
  return response.data;
};

const updateSubject = async (id: string, dto: UpdateSubjectDto): Promise<Subject> => {
  const response = await axios.patch<Subject>(`${API_BASE_URL}/${id}`, dto, {
    headers: { Authorization: `Bearer ${ await getAuthToken()}` },
  });
  return response.data;
};

const fetchSubjects = async (filter: ListSubjectsFilter = {}): Promise<PaginatedSubjectsResponse> => {
  const response = await axios.get<PaginatedSubjectsResponse>(API_BASE_URL, {
    params: filter,
    headers: { Authorization: `Bearer ${ await getAuthToken()}` },
  });
  return response.data;
};

const fetchSubjectById = async (id: string): Promise<Subject> => {
  const response = await axios.get<Subject>(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${ await getAuthToken()}` },
  });
  return response.data;
};


// Delete a subject
const deleteSubject = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${await getAuthToken()}` },
  });
};

// Mutation hooks
export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<Subject, Error, CreateSubjectDto>({
    mutationFn: createSubject,
    onSuccess: () => {
      // Invalidate all subjects queries
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};


export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<Subject, Error, { id: string; dto: UpdateSubjectDto }>({
    mutationFn: ({id, dto}) => updateSubject(id, dto),
    onSuccess: (_, variables) => {
      // Invalidate the specific subject and all subjects queries
      queryClient.invalidateQueries({ queryKey: ['subject', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

export const useToggleSubjectStatus = () => {
  const updateSubjectMutation = useUpdateSubject();

  return (id: string, nextStatus: string) => {
  
    updateSubjectMutation.mutate(
      { id, dto: { status: nextStatus } },
      {
        onSuccess: () => toast.success(`Subject ${nextStatus.toLowerCase() == 'active' ? 'Activated' : 'Deactivated'} successfully.`),
        onError: (err) => toast.error(err.message || 'Failed to update subject status'),
      }
    );
  };
};
// Query hooks
export const useSubjects = (filter: ListSubjectsFilter = {}) => {
  return useQuery<PaginatedSubjectsResponse, Error>({
    queryKey: ['subjects', filter],
    queryFn: () => fetchSubjects(filter),
    // staleTime: 1 * 30 * 1000,
  });
};

export const useSubjectById = (id: string) => {
  return useQuery<Subject, Error>({
    queryKey: ['subject', id],
    queryFn: () => fetchSubjectById(id),
    enabled: !!id,
    staleTime: 1 * 30 * 1000,
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteSubject(id),
    onSuccess: (_, id) => {
      toast.success(`Subject deleted successfully.`);
      // Invalidate the specific subject and all subjects queries
      queryClient.invalidateQueries({ queryKey: ['subject', id] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
    onError: (err) => toast.error(err.message || 'Failed to delete subject'),
  });
};


