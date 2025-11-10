import { CreateHeadTeacherDto, DeleteHeadTeacherResponse, HeadTeacher, HeadTeacherListResponse, UpdateHeadTeacherDto } from '@/types/head-teacher.dto';
import { axiosInstance } from '../axios';




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



    /**
     * Get a single teacher by ID
     */
    getHeadTeacherById: async (id: string): Promise<HeadTeacher> => {
      const { data } = await axiosInstance.get<HeadTeacher>(`/head-teachers/${id}`);
      return data;
    },
  
    /**
     * Create a new teacher
     * Password is generated automatically by the system
     */
    createHeadTeacher: async (teacherData: CreateHeadTeacherDto): Promise<HeadTeacher> => {
      const { data } = await axiosInstance.post<HeadTeacher>('/head-teachers', teacherData);
      return data;
    },
  
    /**
     * Update an existing teacher
     */
    updateHeadTeacher: async (id: string, teacherData: UpdateHeadTeacherDto): Promise<HeadTeacher> => {
      const { data } = await axiosInstance.patch<HeadTeacher>(`/head-teachers/${id}`, teacherData);
      return data;
    },
  
    /**
     * Delete a teacher permanently
     */
    deleteHeadTeacher: async (id: string): Promise<DeleteHeadTeacherResponse> => {
      const { data } = await axiosInstance.delete<DeleteHeadTeacherResponse>(`/head-teachers/${id}`);
      return data;
    },
  
};

