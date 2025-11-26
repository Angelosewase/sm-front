// Super Admin DTOs and Types

export interface School {
  _id: string;
  name: string;
  schoolType?: string;
  establishedYear?: number;
  studentCapacity: number;
  description?: string;
  address?: string;
  city: string;
  district: string;
  phoneNumber: string;
  email: string;
  website: string;
  isActive?: boolean;
  users?: SchoolUser[];
  createdAt: string;
  updatedAt: string;
}

export interface SchoolUser {
  _id: string;
  name?: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string | null;
}

export interface QuerySchoolsDto {
  q?: string;
  isActive?: boolean;
  city?: string;
  district?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface SchoolsListResponse {
  items: School[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ActivateSchoolDto {
  isActive: boolean;
}

export interface User {
  _id: string;
  email: string;
  name?: string;
  role: string;
  phone?: string;
  avatar?: string | null;
  experience?: string;
  school?: string;
  assignedClasses?: string[];
  subjectsCanTeach?: string[];
  yearsOfExperience?: number;
  qualifications?: string[];
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContact?: string;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueryUserDto {
  q?: string;
  role?: string;
  email?: string;
  school?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface UsersListResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

