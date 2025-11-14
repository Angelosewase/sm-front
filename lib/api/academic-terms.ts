import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
// Types
export interface AcademicYear {
  _id: string;
  label: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface Term {
  _id: string;
  name: string;
  order: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  academicYear?: string;
}

export const fetchAcademicYears = async (): Promise<AcademicYear[]> => {
  const { data } = await axiosInstance.get(`/academic-years`);
  return data;
};

// Fetch active academic year
export const fetchActiveAcademicYear =
  async (): Promise<AcademicYear | null> => {
    const { data } = await axiosInstance.get(`/academic-years/active`);
    return data;
  };

// Fetch all terms
export const fetchTerms = async (): Promise<Term[]> => {
  const { data } = await axiosInstance.get(`/terms`);
  return data;
};

// Fetch terms for a specific academic year
export const fetchTermsByAcademicYear = async (academicYearId: string): Promise<Term[]> => {
  const { data } = await axiosInstance.get(`/terms`, {
    params: { academicYear: academicYearId },
  });
  return data;
};

// Update term
export interface UpdateTermDto {
  name?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export const updateTerm = async (
  id: string,
  payload: UpdateTermDto
): Promise<Term> => {
  const { data } = await axiosInstance.patch(`/terms/${id}`, payload);
  return data;
};

// Activate term (set isActive to true, typically deactivates other terms)
export const activateTerm = async (id: string): Promise<Term> => {
  const { data } = await axiosInstance.patch(`/terms/${id}/activate`);
  return data;
};

// Create academic year
export interface CreateAcademicYearDto {
  label: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export const createAcademicYear = async (payload: CreateAcademicYearDto): Promise<AcademicYear> => {
  const { data } = await axiosInstance.post(`/academic-years`, payload);
  return data;
};

// Update academic year
export interface UpdateAcademicYearDto {
  label?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export const updateAcademicYear = async (
  id: string,
  payload: UpdateAcademicYearDto
): Promise<AcademicYear> => {
  const { data } = await axiosInstance.patch(`/academic-years/${id}`, payload);
  return data;
};

// Mark academic year as ended (set isActive to false)
export const endAcademicYear = async (id: string): Promise<AcademicYear> => {
  const { data } = await axiosInstance.patch(`/academic-years/${id}`, { isActive: false });
  return data;
};

// Activate academic year (set isActive to true and deactivate others)
export const activateAcademicYear = async (id: string): Promise<AcademicYear> => {
  const { data } = await axiosInstance.patch(`/academic-years/${id}/activate`);
  return data;
};

