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
  subjectIds: string[];
}

export interface IQueryClasses {
  q?: string;
  school?: string;
  academicYear?: string;
  level?: string;
  page?: number;
  limit?: number;            
  skip?: number;  
  order?: 'asc' | 'desc';
  sortBy?: 'createdAt'
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
  page?: number;            
  limit?: number;            
}


export interface StatTrendPoint {
  date: string;
  value: number;
}
export interface StatCardDataItem {
  name: string;
  value: number | string;
  change: string;
  percentageChange: string;
  changeType: "positive" | "neutral" | "negative";
  dataKey: string;
  data: StatTrendPoint[];
}

export interface ClassStatsResponse {
  cards: StatCardDataItem[];
}