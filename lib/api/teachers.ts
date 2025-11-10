import { TeacherListResponse, Teacher, DeleteTeacherResponse, CreateTeacherDto, UpdateTeacherDto } from "@/types/teachers.dto";
import { axiosInstance } from "../axios";



export const teachersApi = {
  /**
   * Get paginated list of teachers with optional filters
   */
  getTeachers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
  }): Promise<TeacherListResponse> => {
    const { data } = await axiosInstance.get<TeacherListResponse>("/teachers", {
      params: {
        ...params,
        // role: 'teacher', // Filter by teacher role
      },
    });
    return data;
  },

  /**
   * Get a single teacher by ID
   */
  getTeacherById: async (id: string): Promise<Teacher> => {
    const { data } = await axiosInstance.get<Teacher>(`/teachers/${id}`);
    return data;
  },

  /**
   * Create a new teacher
   * Password is generated automatically by the system
   */
  createTeacher: async (teacherData: CreateTeacherDto): Promise<Teacher> => {
    const { data } = await axiosInstance.post<Teacher>('/teachers', teacherData);
    return data;
  },

  /**
   * Update an existing teacher
   */
  updateTeacher: async (id: string, teacherData: UpdateTeacherDto): Promise<Teacher> => {
    const { data } = await axiosInstance.patch<Teacher>(`/teachers/${id}`, teacherData);
    return data;
  },

  /**
   * Delete a teacher permanently
   */
  deleteTeacher: async (id: string): Promise<DeleteTeacherResponse> => {
    const { data } = await axiosInstance.delete<DeleteTeacherResponse>(`/teachers/${id}`);
    return data;
  },
};
