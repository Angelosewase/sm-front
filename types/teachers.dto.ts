import { Status, UserLite } from "./users.dto";

// types/teacher.ts
export interface Teacher {
  _id: string;
  user: UserLite ;
  teacherId?: string;
  subjectsCanTeach?: string[];
  assignedClasses?: string[];
  phone?: string;
  qualification?: string;
  department?: string;
  hireDate?: string;
  school?: string;
  status?: Status;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  emergencyContact?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  temporaryPassword?: string
}

export interface CreateTeacherDto {
  // User fields
  email: string;
  password: string;
  name: string;
  phone?: string;
  experience?: string;
  school: string;

  // Teacher-specific
  teacherId?: string;
  subjectsCanTeach?: string[];
  assignedClasses?: string[];
  qualification?: string;
  hireDate?: string;
  status?: Status;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  emergencyContact?: string;
  notes?: string;
}

export interface UpdateTeacherDto {
  teacherId?: string;
  subjectsCanTeach?: string[];
  assignedClasses?: string[];
  phone?: string;
  qualification?: string;
  hireDate?: string;
  status?: Status;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  emergencyContact?: string;
  notes?: string;
  experience?: string; // Optional: updates User
}


export interface DeleteTeacherResponse {
  deleted: boolean;
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


export interface TeacherListResponse {
  items: Teacher[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}