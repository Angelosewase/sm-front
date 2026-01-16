export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  STUDENT = 'student',
  HEADTEACHER= 'head teacher',
  TEACHER= 'teacher',
}



// types/user.ts
export interface UserLite {
  _id: string;
  email: string;
  name?: string;
  role: Role;
  phone?: string;
  avatar?: string;
  experience?: string;
  department?:string;
  school?: string;
  createdAt: string;
  updatedAt: string;
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


export interface IPaginatedUsersResponse {
  items: UserLite[];
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


export type PaginatedUsersResponse = {
  items: UserLite[];
  total: number;
  page: number;
  limit: number;
};




// types/status.ts
export type Status = 'Active' | 'On Leave' | 'Inactive';



export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  role: Role;
  phone?: string;
  avatar?: string;
  experience?: string;
  school?: string;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  avatar?: string;
  experience?: string;
}