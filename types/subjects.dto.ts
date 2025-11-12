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