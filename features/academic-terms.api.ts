import axios from "axios";
import { useQuery } from "@tanstack/react-query";
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


const API_URL = "http://localhost:3000";

export const fetchAcademicYears = async (): Promise<AcademicYear[]> => {
  const { data } = await axios.get(`${API_URL}/academic-years`);
  return data;
};

// Fetch active academic year
export const fetchActiveAcademicYear = async (): Promise<AcademicYear | null> => {
  const { data } = await axios.get(`${API_URL}/academic-years/active`);
  return data;
};

// Fetch all terms
export const fetchTerms = async (): Promise<Term[]> => {
  const { data } = await axios.get(`${API_URL}/terms`);
  return data;
};


export const useAcademicYears = () => {
  return useQuery<AcademicYear[], Error>({
    queryKey: ['academic-years'],
    queryFn: fetchAcademicYears,
  });
};

export const useActiveAcademicYear = () => {
  return useQuery<AcademicYear | null, Error>({
    queryKey: ['academic-year', 'active'],
    queryFn: fetchActiveAcademicYear,
  });
};

export const useTerms = () => {
  return useQuery<Term[], Error>({
    queryKey: ['terms'],
    queryFn: fetchTerms,
  });
};