import type { Class } from "@/lib/api/classes";

export type StudentStatus =
  | "active"
  | "graduated"
  | "transferred"
  | "suspended";

export type GuardianRelationship = "father" | "mother" | "guardian" | "other";

export interface Student {
  id?: string;
  _id?: string;
  studentId: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  guardianName?: string;
  guardianPhoneNumber?: string;
  guardianEmergencyContact?: string;
  guardianRelationShip?: GuardianRelationship;
  guardianEmail?: string;
  gender?: string;
  address?: string;
  province?: string;
  district?: string;
  previousSchool?: string;
  medicalInformation?: string;
  additionalNotes?: string;
  dob?: string;
  enrollmentDate?: string;
  status: StudentStatus;
  classId?: string | null;
  class?: Class | null;
  gradeLevel?: string | null;
  schoolId?: string | null;
  academicScore?: number | null;
  isTrashed?: boolean;
  trashedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentListResponse {
  data: Student[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: StudentStatus;
  guardianRelationShip?: GuardianRelationship;
  classId?: string | null;
  schoolId?: string;
  gradeLevel?: string;
  includeTrashed?: boolean;
  onlyTrashed?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "name" | "studentId" | "status";
  sortOrder?: "asc" | "desc";

  teacher?: string;
}

export interface CreateStudentDto {
  studentId: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  guardianName?: string;
  guardianPhoneNumber?: string;
  guardianEmergencyContact?: string;
  guardianRelationShip?: GuardianRelationship;
  guardianEmail?: string;
  gender?: string;
  address?: string;
  province?: string;
  district?: string;
  previousSchool?: string;
  medicalInformation?: string;
  additionalNotes?: string;
  dob?: string;
  enrollmentDate?: string;
  status?: StudentStatus;
  classId?: string | null;
  gradeLevel?: string;
  schoolId?: string;
  isTrashed?: boolean;
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> {
  studentId?: string;
}

export interface ChangeStudentClassDto {
  classId: string | null;
}

export interface BulkStudentActionDto {
  ids: string[];
}

export interface StatTrendPoint {
  date: string; // e.g., W1, W2, etc. or '2025-11-01'
  value: number;
}
export interface StudentStatCard {
  name: string;
  value: number | string;
  change: number | string;
  percentageChange: number | string;
  changeType: "neutral" | "positive" | "negative";
  dataKey: string;
  data: StatTrendPoint[];
}
export interface StudentStatsResponse {
  cards: StudentStatCard[];
}
