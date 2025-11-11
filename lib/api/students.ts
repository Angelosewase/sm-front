import {
  BulkStudentActionDto,
  ChangeStudentClassDto,
  CreateStudentDto,
  Student,
  StudentListResponse,
  StudentQueryParams,
  UpdateStudentDto,
} from "@/types/students.dto";
import { axiosInstance } from "../axios";

const baseStudentsPath = "/api/students";

export const studentsApi = {
  getStudents: async (
    params?: StudentQueryParams
  ): Promise<StudentListResponse> => {
    const { data } = await axiosInstance.get<StudentListResponse>(
      baseStudentsPath,
      { params }
    );
    return data;
  },

  getStudentById: async (id: string): Promise<Student> => {
    const { data } = await axiosInstance.get<Student>(
      `${baseStudentsPath}/${id}`
    );
    return data;
  },

  createStudent: async (payload: CreateStudentDto): Promise<Student> => {
    const { data } = await axiosInstance.post<Student>(
      baseStudentsPath,
      payload
    );
    return data;
  },

  updateStudent: async (
    id: string,
    payload: UpdateStudentDto
  ): Promise<Student> => {
    const { data } = await axiosInstance.patch<Student>(
      `${baseStudentsPath}/${id}`,
      payload
    );
    return data;
  },

  changeStudentClass: async (
    id: string,
    payload: ChangeStudentClassDto
  ): Promise<Student> => {
    const { data } = await axiosInstance.patch<Student>(
      `${baseStudentsPath}/${id}/class`,
      payload
    );
    return data;
  },

  trashStudent: async (id: string): Promise<Student> => {
    const { data } = await axiosInstance.patch<Student>(
      `${baseStudentsPath}/${id}/trash`,
      {}
    );
    return data;
  },

  restoreStudent: async (id: string): Promise<Student> => {
    const { data } = await axiosInstance.patch<Student>(
      `${baseStudentsPath}/${id}/restore`,
      {}
    );
    return data;
  },

  permanentlyDeleteStudent: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${baseStudentsPath}/${id}`);
  },

  bulkTrashStudents: async (
    payload: BulkStudentActionDto
  ): Promise<void> => {
    await axiosInstance.patch(`${baseStudentsPath}/bulk/trash`, payload);
  },

  bulkRestoreStudents: async (
    payload: BulkStudentActionDto
  ): Promise<void> => {
    await axiosInstance.patch(`${baseStudentsPath}/bulk/restore`, payload);
  },

  bulkPermanentlyDeleteStudents: async (
    payload: BulkStudentActionDto
  ): Promise<void> => {
    await axiosInstance.delete(`${baseStudentsPath}/bulk`, {
      data: payload,
    });
  },
};


