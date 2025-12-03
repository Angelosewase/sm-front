import {
  AcademicYear,
  Term,
  academicYearsApi,
  termsApi,
} from "@/lib/api/academic-terms";
import { useQuery } from "@tanstack/react-query";

/**
 * Get all academic years
 */
export const useAcademicYears = () => {
  return useQuery<AcademicYear[], Error>({
    queryKey: ["academic-years"],
    queryFn: () => academicYearsApi.getAll(),
  });
};

/**
 * Get currently open academic year
 */
export const useOpenAcademicYear = () => {
  return useQuery<AcademicYear | null, Error>({
    queryKey: ["academic-year", "open"],
    queryFn: () => academicYearsApi.getOpen(),
  });
};

/**
 * Get academic year by ID
 */
export const useAcademicYearById = (id: string | undefined) => {
  return useQuery<AcademicYear, Error>({
    queryKey: ["academic-year", id],
    queryFn: () => academicYearsApi.getById(id!),
    enabled: !!id,
  });
};

/**
 * Get all terms for a specific academic year
 */
export const useTermsByAcademicYear = (academicYearId: string | undefined) => {
  return useQuery<Term[], Error>({
    queryKey: ["terms", "academic-year", academicYearId],
    queryFn: () => termsApi.getByAcademicYear(academicYearId!),
    enabled: !!academicYearId,
  });
};

/**
 * Get currently open term for an academic year
 */
export const useOpenTermByAcademicYear = (academicYearId: string | undefined) => {
  return useQuery<Term | null, Error>({
    queryKey: ["terms", "academic-year", academicYearId, "open"],
    queryFn: () => termsApi.getOpenByAcademicYear(academicYearId!),
    enabled: !!academicYearId,
  });
};

/**
 * Get term by ID
 */
export const useTermById = (id: string | undefined) => {
  return useQuery<Term, Error>({
    queryKey: ["terms", id],
    queryFn: () => termsApi.getById(id!),
    enabled: !!id,
  });
};

// Legacy hooks for backward compatibility
export const useActiveAcademicYear = useOpenAcademicYear;
