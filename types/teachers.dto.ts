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

// ===== Teacher Analytics & Relations DTOs =====

export interface TeacherDashboardStats {
teacher: {
    id: string;
    name: string;
    email: string;
  };
  stats: {
    totalClasses: number;
    totalStudents: number;
    totalSubjects: number;
    totalAssessments: number;
    totalAssessmentsActive: number;
    totalAssessmentsPending: number;
    totalAssessmentsCompleted: number;
  };
}

export interface TeacherClass {
  classId: string;
  className: string;
  gradeLevel: string;
  studentCount: number;
  capacity: number;
  status: 'active' | 'inactive';
  assignedSubjects: number;
  pendingAssessments: number;
}

export interface TeacherClassAssigned {
  id: string;
  name: string;
  gradeLevel?: string;
  studentCount: number;
  subjectCount: number;
  pendingAssessments?: number;
}

export interface TeacherClassesResponse {
  teacherId: string;
  totalClasses: number;
  classes: TeacherClass[];
}
export interface TeacherClassesAssignedResponse {
  items: TeacherClassAssigned[];
}

export interface TeacherSubjectsResponse {
  items: Subject[];
}

export interface TeacherStudentsQuery {
  classId?: string;
  status?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface StudentListItem {
  _id: string;
  name: string;
  email?: string;
  studentId?: string;
  status?: string;
  classId?: string;
  className?: string;
}

export interface TeacherStudentsResponse {
  items: StudentListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AssessmentStatus = "active" | "pending" | "completed" | "trashed";

export interface TeacherAssessmentsQuery {
  subjectId?: string;
  classId?: string;
  status?: AssessmentStatus;
  page?: number;
  limit?: number;
}

export interface AssessmentListItem {
  _id: string;
  title: string;
  classId: string;
  className?: string;
  subjectId: string;
  subjectName?: string;
  status: AssessmentStatus;
  dueDate?: string;
  createdAt?: string;
}

export interface TeacherAssessmentsResponse {
  items: AssessmentListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  summary?: Record<AssessmentStatus, number> & { total: number };
}

export interface TeacherAssignmentsQuery {
  subjectId?: string;
  classId?: string;
  academicYear?: string;
  term?: string;
  page?: number;
  limit?: number;
}

export type AssignmentStatus = "pending" | "submitted" | "graded" | "late";

export interface AssignmentListItem {
  _id: string;
  title: string;
  classId: string;
  className?: string;
  subjectId: string;
  subjectName?: string;
  status?: AssignmentStatus;
  dueDate?: string;
  createdAt?: string;
}

export interface TeacherAssignmentsResponse {
  items: AssignmentListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  summary?: Record<AssignmentStatus, number> & { total: number };
}
