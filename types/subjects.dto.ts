// types/subject.types.ts
export interface CreateSubjectDto {
  subjectName: string;
  subjectCode?: string;
  shortName?: string;
  maxScore?: number;
  category?: string;
  minPassingScore?: number;
  school?: string;
  department?: string;
  creditHours?: number;
  level?: string;
  gradeLevel?: string;
  status?: string;
  prerequisites?: string;
}

export interface PaginatedSubjectsResponse {
  items: Subject[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ListSubjectsFilter {
  q?: string; // Search term
  school?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  subjectType?: string;
  gradeLevel?: string;
}

export interface UpdateSubjectDto {
  subjectName?: string;
  subjectCode?: string;
  shortName?: string;
  maxScore?: number;
  category?: string;
  minPassingScore?: number;
  school?: string;
  department?: string;
  creditHours?: number;
  level?: string;
  gradeLevel?: string;
  status?: string;
  prerequisites?: string;
}

export interface Subject {
  _id: string;
  name: string;
  subjectCode: string;
  shortName: string;
  maxScore: number;
  category: string;
  minPassingScore: number;
  school: string;
  department: string;
  creditHours: number;
  level: string;
  gradeLevel: string;
  status: string;
  prerequisites: string;
  createdAt?: string; // If your API returns timestamps
  updatedAt?: string;
}

export interface ListSubjectsFilter {
  school?: string;
}

export type AssignTeacherDto = {
  subjectIds: string[];
  teacherId: string;
};

export type AssignClassDto = {
  classId: string;
  subjectIds: string[];
};

export type RemoveFromClassDto = {
  subjectId: string;
  classId: string;
  academicYear: string;
  term?: string;
};

// ---------------- Assessments DTOs & Types ----------------
export type AssessmentStatus = "active" | "pending" | "completed" | "trashed";

export interface CreateAssessmentDto {
  academicYear: string; // MongoId
  term: string; // MongoId
  subject: string; // MongoId
  class: string; // MongoId
  title: string;
  description?: string;
  weight?: number;
  AssessmentType: string; // enum AssessmentType in backend
  deadline: string | Date; // ISO string
  maxScore?: number;
}

export type UpdateAssessmentDto = Partial<CreateAssessmentDto>;

export interface AssessmentDetail {
  _id: string;
  title: string;
  description?: string;
  subject: string;
  class: string;
  term: string;
  academicYear: string;
  AssessmentType: string;
  weight?: number;
  maxScore?: number;
  deadline: string;
  status: AssessmentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentFilterDto {
  academicYear?: string;
  term?: string;
  teacher?: string;
  subject?: string;
  class?: string;
  status?: AssessmentStatus;
  assessmentType?: string;
  deadlineStart?: string;
  deadlineEnd?: string;
  page?: number;
  pageSize?: number;
}

export interface AssessmentListItem {
  _id: string;
  title: string;
  classId: string;
  className?: string;
  subjectId: string;
  subjectName?: string;
  status: AssessmentStatus;
  assessmentType?: string;
  weight?: number;
  maxScore?: number;
  deadline?: string;
  createdAt?: string;
}

export interface AssessmentListResponse {
  items: AssessmentListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AssessmentPerformance {
  completedCount: number;
  availableCount?: number;
  averageScore?: number;
  maxScore?: number;
}
