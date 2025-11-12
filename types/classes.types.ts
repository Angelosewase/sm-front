export interface CreateClassDto {
  name: string;
  code?: string;
  school: string;            // ObjectId string
  academicYear: string;      // e.g. '2024/2025'
  level?: string;
  program?: string;
  capacity?: number;
}

export interface AssignTeacherToClassDto {
  classId: string;           // path param in API
  teacherId: string;
}

export interface AssignSubjectToClassDto {
  classId: string;           // path param in API
  subjectId: string;
  academicYear: string;
  teacherId?: string;        // optional per controller (optional teacher)
}

export interface IQueryClasses {
  q?: string;
  school?: string;
  academicYear?: string;
  level?: string;
  page?: number;
  limit?: number;            // controller expects limit
  skip?: number;  
  order?: 'asc' | 'desc';
  sortBy?: 'createdAt'
             // controller expects skip
}

export interface ClassLite {
  _id: string;
  name: string;
  code?: string;
  school: string;
  academicYear: string;
  level?: string;
  program?: string;
  capacity?: number;
}

export interface PaginatedClassesResponse {
  data: ClassLite[];
  total: number;
  page?: number;             // include if your backend returns it
  limit?: number;            // include if your backend returns it
}