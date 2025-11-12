import { Status, UserLite } from "./users.dto";
import type { Subject } from "./subjects.dto";
import type { Class } from "@/lib/api/classes";

export type TeacherStatus = Status;

export interface Teacher {
  _id: string;
  user: UserLite;
  teacherId?: string;
  subjectsCanTeach?: Subject[];
  assignedClasses?: Class[];
  phone?: string;
  qualification?: string;
  hireDate?: string;
  school?: string;
  status?: TeacherStatus;
  department?: string;
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
  isTrashed?: boolean;
  trashedAt?: string | null;
}

export interface CreateTeacherDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
  experience?: string;
  school: string;
  teacherId?: string;
  subjectsCanTeach?: string[];
  assignedClasses?: string[];
  qualification?: string;
  department?: string;
  hireDate?: string;
  status?: TeacherStatus;
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
  department?: string;
  hireDate?: string;
  status?: TeacherStatus;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  emergencyContact?: string;
  notes?: string;
  experience?: string;
}

export interface DeleteTeacherResponse {
  deleted: boolean;
}

export interface BulkTeacherActionResponse {
  modifiedCount?: number;
  deletedCount?: number;
  message?: string;
}

export interface TeacherQueryParams {
  q?: string;
  email?: string;
  school?: string;
  status?: TeacherStatus;
  department?: string;
  subjectId?: string;
  classId?: string;
  includeTrashed?: boolean;
  onlyTrashed?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
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

export interface AssignSubjectsDto {
  subjectIds: string[];
}

export interface RemoveSubjectsDto {
  subjectIds: string[];
}