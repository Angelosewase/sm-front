import { axiosInstance } from "../axios";

// Teacher entity matching API response
export interface Teacher {
  _id: string;
  email: string;
  name?: string;
  role: 'teacher';
  phone?: string;
  school?: string;
  createdAt?: string;
  updatedAt?: string;
  temporaryPassword?: string; // Only present in create response
}

// Paginated list response
export interface TeacherListResponse {
  items: Teacher[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Query parameters for listing teachers
export interface TeacherQueryParams {
  q?: string;          // Search across name and email
  email?: string;      // Filter by exact email
  school?: string;     // Filter by school ObjectId
  page?: number;       // Page number (1-based)
  limit?: number;      // Page size (1-100)
  sortBy?: string;     // Field to sort by
  order?: 'asc' | 'desc'; // Sort order
}

// Data for creating a new teacher
export interface CreateTeacherData {
  email: string;       // Required: unique email
  name?: string;       // Optional: display name
  phone?: string;      // Optional: contact phone
  school?: string;     // Optional: school ObjectId
}

// Data for updating an existing teacher
export interface UpdateTeacherData {
  name?: string;       // Optional: updated display name
  email?: string;      // Optional: updated email (must be unique)
  phone?: string;      // Optional: updated contact number
  school?: string;     // Optional: new school ObjectId
}

// Delete response
export interface DeleteTeacherResponse {
  deleted: boolean;
}

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
  createTeacher: async (teacherData: CreateTeacherData): Promise<Teacher> => {
    const { data } = await axiosInstance.post<Teacher>('/teachers', teacherData);
    return data;
  },

  /**
   * Update an existing teacher
   */
  updateTeacher: async (id: string, teacherData: UpdateTeacherData): Promise<Teacher> => {
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
