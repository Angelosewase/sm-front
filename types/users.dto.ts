export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  HEADTEACHER= 'head teacher',
  TEACHER= 'teacher',
}

export interface IQueryUser {
  q?: string;
  role?: Role;
  email?: string;
  school?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface IUserLite {
  _id: string;
  fullName?: string;
  name?: string;
  email?: string;
  role?: Role;
}

export interface IPaginatedUsersResponse {
  items: IUserLite[];
  total: number;
  page: number;
  limit: number;
}



export type ListUsersFilter = {
  q?: string;
  role?: string; // e.g. 'teacher'
  page?: number;
  limit?: number;
};

export type UserLite = {
  _id: string;
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
};

export type PaginatedUsersResponse = {
  items: UserLite[];
  total: number;
  page: number;
  limit: number;
};

export type AssignTeacherDto = {
  subjectId: string;
  teacherId: string;
  academicYear: string;
  term?: string;
};