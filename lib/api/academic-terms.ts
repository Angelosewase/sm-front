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


