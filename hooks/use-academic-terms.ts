import {
  AcademicYear,
  Term,
  fetchActiveAcademicYear,
  fetchAcademicYears,
  fetchTerms,
  fetchTermsByAcademicYear,
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

export const useTerms = (academicYearId?: string) => {
  return useQuery<Term[], Error>({
    queryKey: ["terms", academicYearId],
    queryFn: () => academicYearId 
      ? fetchTermsByAcademicYear(academicYearId)
      : fetchTerms(),
    enabled: true, // Always enabled, but will use different fetch function based on academicYearId
  });
};
