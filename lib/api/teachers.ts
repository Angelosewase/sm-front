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
  TeacherDashboardStats,
  TeacherClassesResponse,
  TeacherSubjectsResponse,
  TeacherStudentsQuery,
  TeacherStudentsResponse,
  TeacherAssessmentsQuery,
  TeacherAssessmentsResponse,
  TeacherAssignmentsQuery,
  TeacherAssignmentsResponse,
} from "@/types/teachers.dto";
import { axiosInstance } from "../axios";

const baseTeachersPath = "/api/teachers";

export const teachersApi = {
  getTeachers: async (
    params?: TeacherQueryParams
  ): Promise<TeacherListResponse> => {
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

  // ===== Teacher analytics & relations =====
  getDashboardStats: async (id: string): Promise<TeacherDashboardStats> => {
    const { data } = await axiosInstance.get<TeacherDashboardStats>(
      `${baseTeachersPath}/${id}/dashboard-stats`
    );
    return data;
  },

  getTeacherStudents: async (
    id: string,
    params?: TeacherStudentsQuery
  ): Promise<TeacherStudentsResponse> => {
    const { data } = await axiosInstance.get<TeacherStudentsResponse>(
      `${baseTeachersPath}/${id}/students`,
      { params }
    );
    return data;
  },

  getTeacherSubjects: async (id: string): Promise<TeacherSubjectsResponse> => {
    const { data } = await axiosInstance.get<TeacherSubjectsResponse>(
      `${baseTeachersPath}/${id}/subjects-taught`
    );
    return data;
  },

  getTeacherClasses: async (id: string): Promise<TeacherClassesResponse> => {
    const { data } = await axiosInstance.get<TeacherClassesResponse>(
      `${baseTeachersPath}/${id}/classes-assigned`
    );
    return data;
  },

  getTeacherAssessments: async (
    id: string,
    params?: TeacherAssessmentsQuery
  ): Promise<TeacherAssessmentsResponse> => {
    const { data } = await axiosInstance.get<TeacherAssessmentsResponse>(
      `${baseTeachersPath}/${id}/assessments`,
      { params }
    );
    return data;
  },

  getTeacherAssignments: async (
    id: string,
    params?: TeacherAssignmentsQuery
  ): Promise<TeacherAssignmentsResponse> => {
    const { data } = await axiosInstance.get<TeacherAssignmentsResponse>(
      `${baseTeachersPath}/${id}/assignments`,
      { params }
    );
    return data;
  },

  // ===== CRUD & bulk actions =====
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

  permanentlyDeleteTeacher: async (
    id: string
  ): Promise<BulkTeacherActionResponse> => {
    const { data } = await axiosInstance.delete<BulkTeacherActionResponse>(
      `${baseTeachersPath}/${id}/permanent`
    );
    return data;
  },

  bulkTrashTeachers: async (
    ids: string[]
  ): Promise<BulkTeacherActionResponse> => {
    const { data } = await axiosInstance.post<BulkTeacherActionResponse>(
      `${baseTeachersPath}/bulk/trash`,
      { ids }
    );
    return data;
  },

  bulkRestoreTeachers: async (
    ids: string[]
  ): Promise<BulkTeacherActionResponse> => {
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

  assignSubjects: async (
    id: string,
    payload: AssignSubjectsDto
  ): Promise<Teacher> => {
    const { data } = await axiosInstance.post<Teacher>(
      `${baseTeachersPath}/${id}/subjects`,
      payload
    );
    return data;
  },

  removeSubjects: async (
    id: string,
    payload: RemoveSubjectsDto
  ): Promise<Teacher> => {
    const { data } = await axiosInstance.delete<Teacher>(
      `${baseTeachersPath}/${id}/subjects`,
      { data: payload }
    );
    return data;
  },

  getTeacherByUserId: async (userId: string): Promise<Teacher> => {
    const { data } = await axiosInstance.get<Teacher>(
      `${baseTeachersPath}/user/${userId}`
    );
    return data;
  },
};
