import { Status, UserLite } from "./users.dto";
import type { Subject } from "./subjects.dto";
import type { Class } from "@/lib/api/classes";

// types/teacher.ts
export interface Teacher {
  _id: string;
  user: UserLite;
  teacherId?: string;
  // Populated relations
  subjectsCanTeach?: Subject[]; // populated
  assignedClasses?: Class[]; // populated
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
  experience?: string;
}

export interface CreateTeacherDto {
  // User fields
  email: string;
  password: string;
  name: string;
  phone?: string;
  experience?: string;
  school: string;

  // Teacher-specific (IDs expected by backend)
  teacherId?: string;
  subjectsCanTeach?: string[]; // subject ObjectIds
  assignedClasses?: string[]; // class ObjectIds
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
  subjectsCanTeach?: string[]; // subject ObjectIds
  assignedClasses?: string[]; // class ObjectIds
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
  q?: string; // Search across name and email
  email?: string; // Filter by exact email
  school?: string; // Filter by school ObjectId
  page?: number; // Page number (1-based)
  limit?: number; // Page size (1-100)
  sortBy?: string; // Field to sort by
  order?: "asc" | "desc"; // Sort order
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


export interface AssignClassesDto {
  classIds: string[];
}

export interface UnassignClassesDto {
  classIds: string[];
}


export interface AssignSubjectsDto{
  subjectIds: string[]
}