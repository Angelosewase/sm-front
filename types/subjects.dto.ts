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
  gradeLevels?: string[];
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
  includeTrashed?: boolean;
  onlyTrashed?: boolean;
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
  gradeLevels?: string[];
  status?: string;
  prerequisites?: string;
  description?: string;
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  shortName: string;
  maxScore: number;
  category: string;
  minPassingScore: number;
  school: string;
  department: string;
  creditHours: number;
  level: string;
  gradeLevels: string[];
  subjectType: string;
  status: string;
  description: string;
  prerequisites: string;
  createdAt?: string; // If your API returns timestamps
  updatedAt?: string;
  isTrashed?: boolean;
  trashedAt?: string | null;
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

export interface AcademicYearSummary {
  _id: string;
  label: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AssessmentSubjectSummary {
  _id: string;
  code: string;
  name: string;
  shortName: string;
  department: string;
  subjectType: "core" | "elective" | "optional";
  maxScore: number;
  minPassingScore: number;
  creditHours: number;
  level: string;
  gradeLevels: string[];
  prerequisites: string;
  status: "Active" | "Inactive" | string;
  school: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  assessments: string[];
}

export interface AssessmentStudentSummary {
  _id: string;
  studentId: string;
  name: string;
  email: string;
  phoneNumber: string;
  gradeLevel: string;
  status: "active" | "inactive" | string;
}

export interface AssessmentClassSummary {
  _id: string;
  name: string;
  gradeLevel: string;
  capacity: number;
  studentCount: number;
  description: string;
  status: "active" | "inactive" | string;
  classTeacher: string;
  isTrashed: boolean;
  trashedAt: string | null;
  assignedSubjects: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  students: AssessmentStudentSummary[];
  id: string;
}

export interface AssessmentMark {
  _id?: string;
  student: string | AssessmentStudentSummary;
  score?: number | null;
  remarks?: string;
  submittedAt?: string;
  gradedAt?: string;
  [key: string]: unknown;
}

export interface AssessmentDetail {
  _id: string;
  academicYear: AcademicYearSummary | string;
  term: string;
  subject: AssessmentSubjectSummary | string;
  class: AssessmentClassSummary | string;
  title: string;
  weight?: number;
  description?: string;
  AssessmentType: "Test" | "Exam" | "Assignment" | string;
  deadline: string;
  maxScore?: number;
  status: AssessmentStatus | "pending" | "active" | "closed" | string;
  submissionsCount?: number;
  averageScore?: number;
  marks?: AssessmentMark[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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
