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
  order?: 'asc' | 'desc';
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

export interface Subject extends CreateSubjectDto {
  id: string;
  createdAt?: string; // If your API returns timestamps
  updatedAt?: string;
}

export interface ListSubjectsFilter {
  school?: string;
}
