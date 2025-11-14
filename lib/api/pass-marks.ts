import { axiosInstance } from "../axios";

// Types based on README API specification
export interface PassMarks {
  _id: string;
  school: string | {
    _id: string;
    name: string;
  };
  passMark: number; // 0-100
  secondSittingMin: number; // 0-100
  secondSittingMax: number; // 0-100
  failMark: number; // 0-100
  updatedBy?: string | {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// DTOs
export interface CreatePassMarksDto {
  school: string; // MongoDB ObjectId
  passMark: number; // 0-100
  secondSittingMin: number; // 0-100
  secondSittingMax: number; // 0-100
  failMark: number; // 0-100
}

export interface UpdatePassMarksDto {
  passMark?: number; // 0-100
  secondSittingMin?: number; // 0-100
  secondSittingMax?: number; // 0-100
  failMark?: number; // 0-100
}

// Pass Marks API
const basePassMarksPath = "/api/pass-marks";

export const passMarksApi = {
  /**
   * Create pass marks configuration for a school
   * @param payload - Pass marks configuration data
   */
  create: async (payload: CreatePassMarksDto): Promise<PassMarks> => {
    const { data } = await axiosInstance.post<PassMarks>(basePassMarksPath, payload);
    return data;
  },

  /**
   * Update pass marks configuration for a school
   * @param schoolId - MongoDB ObjectId of the school
   * @param payload - Pass marks configuration update data
   */
  update: async (schoolId: string, payload: UpdatePassMarksDto): Promise<PassMarks> => {
    const { data } = await axiosInstance.put<PassMarks>(
      `${basePassMarksPath}/${schoolId}`,
      payload
    );
    return data;
  },

  /**
   * Get pass marks configuration for a specific school
   * @param schoolId - MongoDB ObjectId of the school
   */
  getBySchool: async (schoolId: string): Promise<PassMarks> => {
    const { data } = await axiosInstance.get<PassMarks>(
      `${basePassMarksPath}/school/${schoolId}`
    );
    return data;
  },

  /**
   * Get all pass marks configurations (admin/head teacher only)
   */
  getAll: async (): Promise<PassMarks[]> => {
    const { data } = await axiosInstance.get<PassMarks[]>(basePassMarksPath);
    return data;
  },

  /**
   * Delete pass marks configuration for a school
   * @param schoolId - MongoDB ObjectId of the school
   */
  delete: async (schoolId: string): Promise<{ message: string }> => {
    const { data } = await axiosInstance.delete<{ message: string }>(
      `${basePassMarksPath}/${schoolId}`
    );
    return data;
  },
};

