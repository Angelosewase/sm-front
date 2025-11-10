import { axiosInstance } from '../axios';

export interface HeadTeacher {
  _id: string;
  name: string;
  email: string;
  school?: string;
  role: string;
  department?: string;
  subject?: string;
  status?: string;
  classesAssigned?: string;
  totalStudents?: string;
  experience?: string;
  phone?: string;
}

export interface HeadTeacherListResponse {
  items: HeadTeacher[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export const headTeachersApi = {
  /**
   * Get list of teachers (for dropdowns, etc.)
   */
  getHeadTeachers: async (params?: { page?: number; limit?: number; role?: string }): Promise<HeadTeacherListResponse> => {
    const { data } = await axiosInstance.get<HeadTeacherListResponse>('/head-teachers', {
      params: {
        ...params,
        // role: 'teacher', // Filter by teacher role
      },
    });
    return data;
  },
};

