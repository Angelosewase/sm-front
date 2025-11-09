import { axiosInstance } from '../axios';

export interface Teacher {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface TeacherListResponse {
  items: Teacher[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const teachersApi = {
  /**
   * Get list of teachers (for dropdowns, etc.)
   */
  getTeachers: async (params?: { page?: number; limit?: number; role?: string }): Promise<TeacherListResponse> => {
    const { data } = await axiosInstance.get<TeacherListResponse>('/api/teachers', {
      params: {
        ...params,
        // role: 'teacher', // Filter by teacher role
      },
    });
    return data;
  },
};

