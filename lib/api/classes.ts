import { axiosInstance } from '../axios';

export interface Class {
  _id: string;
  name: string;
  gradeLevel: string;
  capacity: number;
  description?: string;
  status: 'active' | 'inactive';
  classTeacher?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  studentCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassListResponse {
  data: Class[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateClassData {
  name: string;
  gradeLevel: string;
  capacity: number;
  description?: string;
  status?: 'active' | 'inactive';
  classTeacher: string;
}

export interface UpdateClassData {
  name?: string;
  gradeLevel?: string;
  capacity?: number;
  description?: string;
  status?: 'active' | 'inactive';
  classTeacher?: string;
}

export interface ClassQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  gradeLevel?: string;
}

const classesApiUrl = '/api/classes';

export const classesApi = {
  /**
   * Get paginated list of classes
   */
  getClasses: async (params?: ClassQueryParams): Promise<ClassListResponse> => {
    const { data } = await axiosInstance.get<ClassListResponse>(classesApiUrl, {
      params,
    });
    return data;
  },

  /**
   * Get a single class by ID
   */
  getClassById: async (id: string): Promise<Class> => {
    const { data } = await axiosInstance.get<Class>(`${classesApiUrl}/${id}`);
    return data;
  },

  /**
   * Create a new class
   */
  createClass: async (classData: CreateClassData): Promise<Class> => {
    const { data } = await axiosInstance.post<Class>(classesApiUrl, classData);
    return data;
  },

  /**
   * Update an existing class
   */
  updateClass: async (id: string, classData: UpdateClassData): Promise<Class> => {
    const { data } = await axiosInstance.patch<Class>(`${classesApiUrl}/${id}`, classData);
    return data;
  },

  /**
   * Delete a class
   */
  deleteClass: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${classesApiUrl}/${id}`);
  },
};

