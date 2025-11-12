import {
  TeacherListResponse,
  Teacher,
  CreateTeacherDto,
  UpdateTeacherDto,
  AssignClassesDto,
  UnassignClassesDto,
  TeacherQueryParams,
  BulkTeacherActionResponse,
  AssignSubjectsDto,
  RemoveSubjectsDto,
} from "@/types/teachers.dto";
import { axiosInstance } from "../axios";

const baseTeachersPath = "/api/teachers";

export const teachersApi = {
  getTeachers: async (params?: TeacherQueryParams): Promise<TeacherListResponse> => {
    const { data } = await axiosInstance.get<TeacherListResponse>(
      baseTeachersPath,
      { params }
    );
    return data;
  },

  getTeacherById: async (id: string): Promise<Teacher> => {
    const { data } = await axiosInstance.get<Teacher>(
      `${baseTeachersPath}/${id}`
    );
    return data;
  },

  createTeacher: async (teacherData: CreateTeacherDto): Promise<Teacher> => {
    const { data } = await axiosInstance.post<Teacher>(
      baseTeachersPath,
      teacherData
    );
    return data;
  },

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

  trashTeacher: async (id: string): Promise<Teacher> => {
    const { data } = await axiosInstance.delete<Teacher>(
      `${baseTeachersPath}/${id}`
    );
    return data;
  },

  restoreTeacher: async (id: string): Promise<Teacher> => {
    const { data } = await axiosInstance.patch<Teacher>(
      `${baseTeachersPath}/${id}/restore`,
      {}
    );
    return data;
  },

  permanentlyDeleteTeacher: async (id: string): Promise<BulkTeacherActionResponse> => {
    const { data } = await axiosInstance.delete<BulkTeacherActionResponse>(
      `${baseTeachersPath}/${id}/permanent`
    );
    return data;
  },

  bulkTrashTeachers: async (ids: string[]): Promise<BulkTeacherActionResponse> => {
    const { data } = await axiosInstance.post<BulkTeacherActionResponse>(
      `${baseTeachersPath}/bulk/trash`,
      { ids }
    );
    return data;
  },

  bulkRestoreTeachers: async (ids: string[]): Promise<BulkTeacherActionResponse> => {
    const { data } = await axiosInstance.post<BulkTeacherActionResponse>(
      `${baseTeachersPath}/bulk/restore`,
      { ids }
    );
    return data;
  },

  bulkPermanentlyDeleteTeachers: async (
    ids: string[]
  ): Promise<BulkTeacherActionResponse> => {
    const { data } = await axiosInstance.post<BulkTeacherActionResponse>(
      `${baseTeachersPath}/bulk/permanent`,
      { ids }
    );
    return data;
  },

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

  assignSubjects: async (id: string, payload: AssignSubjectsDto): Promise<Teacher> => {
    const { data } = await axiosInstance.post<Teacher>(
      `${baseTeachersPath}/${id}/subjects`,
      payload
    );
    return data;
  },

  removeSubjects: async (id: string, payload: RemoveSubjectsDto): Promise<Teacher> => {
    const { data } = await axiosInstance.delete<Teacher>(
      `${baseTeachersPath}/${id}/subjects`,
      { data: payload }
    );
    return data;
  },
};
