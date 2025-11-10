import { Status, UserLite } from "./users.dto";

// types/head-teacher.ts
export interface HeadTeacher {
  _id: string;
  user: UserLite;
  headTeacherId?: string;
  department: string;
  subjects?: string[];
  phone?: string;
  qualification?: string;
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
  temporaryPassword?: string;
}

export interface CreateHeadTeacherDto {
  // User fields
  email: string;
  password: string;
  name: string;
  phone?: string;
  experience?: string;
  school: string;

  // HeadTeacher-specific
  headTeacherId?: string;
  department: string;
  subjects?: string[];
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

export interface UpdateHeadTeacherDto {
  headTeacherId?: string;
  department?: string;
  subjects?: string[];
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


export interface DeleteHeadTeacherResponse {
  deleted: boolean;
}


export interface HeadTeacherQueryParams {
  q?: string;          // Search across name and email
  email?: string;      // Filter by exact email
  school?: string;     // Filter by school ObjectId
  page?: number;       // Page number (1-based)
  limit?: number;      // Page size (1-100)
  sortBy?: string;     // Field to sort by
  order?: 'asc' | 'desc'; // Sort order
}



// Delete response

export interface HeadTeacherListResponse {
  items: HeadTeacher[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
// Delete response

