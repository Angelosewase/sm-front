import {
  AcademicYear,
  Term,
  fetchActiveAcademicYear,
  fetchAcademicYears,
  fetchTerms,
} from "@/lib/api/academic-terms";
import { useQuery } from "@tanstack/react-query";

export const useAcademicYears = () => {
  return useQuery<AcademicYear[], Error>({
    queryKey: ["academic-years"],
    queryFn: fetchAcademicYears,
  });
};

export const useActiveAcademicYear = () => {
  return useQuery<AcademicYear | null, Error>({
    queryKey: ["academic-year", "active"],
    queryFn: fetchActiveAcademicYear,
  });
};

export const useTerms = () => {
  return useQuery<Term[], Error>({
    queryKey: ["terms"],
    queryFn: fetchTerms,
  });
};
