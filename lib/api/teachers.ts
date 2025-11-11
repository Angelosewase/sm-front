import {
  TeacherListResponse,
  Teacher,
  DeleteTeacherResponse,
  CreateTeacherDto,
  UpdateTeacherDto,
  AssignClassesDto,
  UnassignClassesDto,
} from "@/types/teachers.dto";
import { axiosInstance } from "../axios";

const baseTeachersPath ="/api/teachers"

export const teachersApi = {
  /**
   * Get paginated list of teachers with optional filters
   */
  getTeachers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
  }): Promise<TeacherListResponse> => {
    const { data } = await axiosInstance.get<TeacherListResponse>(baseTeachersPath, {
      params: {
        ...params,
      },
    });
    return data;
  },

  /**
   * Get a single teacher by ID
   */
  getTeacherById: async (id: string): Promise<Teacher> => {
    const { data } = await axiosInstance.get<Teacher>(`${baseTeachersPath}/${id}`);
    return data;
  },

  /**
   * Create a new teacher
   * Password is generated automatically by the system
   */
  createTeacher: async (teacherData: CreateTeacherDto): Promise<Teacher> => {
    const { data } = await axiosInstance.post<Teacher>(
      baseTeachersPath,
      teacherData
    );
    return data;
  },

  /**
   * Update an existing teacher
   */
  updateTeacher: async (
    id: string,
    teacherData: UpdateTeacherDto
  ): Promise<Teacher> => {
    const { data } = await axiosInstance.patch<Teacher>(
      `${baseTeachersPath}/${id}`,
      teacherData
    );
    return data;
  },

  /**
   * Assign classes to teacher
   */
  assignClasses: async (
    id: string,
    payload: AssignClassesDto
  ): Promise<Teacher> => {
    const { data } = await axiosInstance.post<Teacher>(
      `${baseTeachersPath}/${id}/classes`,
      payload
    );
    return data;
  },

  /**
   * Unassign classes from teacher
   */
  unassignClasses: async (
    id: string,
    payload: UnassignClassesDto
  ): Promise<Teacher> => {
    const { data } = await axiosInstance.delete<Teacher>(
      `${baseTeachersPath}/${id}/classes`,
      { data: payload }
    );
    return data;
  },

  /**
   * Assign subjects to teacher
   */
  assignSubjects: async (
    id: string,
    payload: { subjectIds: string[] }
  ): Promise<Teacher> => {
    const { data } = await axiosInstance.post<Teacher>(
      `/teachers/${id}/subjects`,
      payload
    );
    return data;
  },

  /**
   * Remove a single subject from a teacher
   */
  removeSubjectFromTeacher: async (
    id: string,
    subjectId: string
  ): Promise<Teacher> => {
    const { data } = await axiosInstance.put<Teacher>(
      `/teachers/${id}/remove-subject/${subjectId}`
    );
    return data;
  },

  /**
   * Delete a teacher permanently
   */
  deleteTeacher: async (id: string): Promise<DeleteTeacherResponse> => {
    const { data } = await axiosInstance.delete<DeleteTeacherResponse>(
      `${baseTeachersPath}/${id}`
    );
    return data;
  },
};
