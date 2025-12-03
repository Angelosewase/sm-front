import { axiosInstance } from "../axios";

// Types based on README API specification
export interface AcademicYear {
  _id: string;
  label: string;
  startDate?: string;
  endDate?: string;
  isOpen: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Term {
  _id: string;
  name: string;
  academicYear: string;
  order: number; // 1, 2, or 3
  isOpen: boolean;
  isClosed: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// DTOs
export interface CreateAcademicYearDto {
  label: string;
  startDate?: string; // ISO 8601 date string
  endDate?: string; // ISO 8601 date string
}

// Academic Year API
const baseAcademicYearsPath = "/academic-years";

export const academicYearsApi = {
  /**
   * Get all academic years sorted by label in descending order
   */
  getAll: async (): Promise<AcademicYear[]> => {
    const { data } = await axiosInstance.get<AcademicYear[]>(baseAcademicYearsPath);
    return data;
  },

  /**
   * Get currently open academic year, or null if none is open
   */
  getOpen: async (): Promise<AcademicYear | null> => {
    const { data } = await axiosInstance.get<AcademicYear | null>(`${baseAcademicYearsPath}/open`);
    return data;
  },

  /**
   * Get academic year by ID
   */
  getById: async (id: string): Promise<AcademicYear> => {
    const { data } = await axiosInstance.get<AcademicYear>(`${baseAcademicYearsPath}/${id}`);
    return data;
  },

  /**
   * Create a new academic year (automatically creates 3 terms)
   */
  create: async (payload: CreateAcademicYearDto): Promise<AcademicYear> => {
    const { data } = await axiosInstance.post<AcademicYear>(baseAcademicYearsPath, payload);
    return data;
  },

  /**
   * Open an academic year (closes any currently open year)
   */
  open: async (id: string): Promise<AcademicYear> => {
    const { data } = await axiosInstance.patch<AcademicYear>(
      `${baseAcademicYearsPath}/${id}/open`
    );
    return data;
  },

  /**
   * Close an academic year (cannot close if any term is open)
   */
  close: async (id: string): Promise<AcademicYear> => {
    const { data } = await axiosInstance.patch<AcademicYear>(
      `${baseAcademicYearsPath}/${id}/close`
    );
    return data;
  },
};

// Terms API
const baseTermsPath = "/terms";

export const termsApi = {
  /**
   * Get all terms for a specific academic year, sorted by order (1, 2, 3)
   */
  getByAcademicYear: async (academicYearId: string): Promise<Term[]> => {
    const { data } = await axiosInstance.get<Term[]>(
      `${baseTermsPath}/academic-year/${academicYearId}`
    );
    return data;
  },

  /**
   * Get currently open term for an academic year, or null if none is open
   */
  getOpenByAcademicYear: async (academicYearId: string): Promise<Term | null> => {
    const { data } = await axiosInstance.get<Term | null>(
      `${baseTermsPath}/academic-year/${academicYearId}/open`
    );
    return data;
  },

  /**
   * Get term by ID
   */
  getById: async (id: string): Promise<Term> => {
    const { data } = await axiosInstance.get<Term>(`${baseTermsPath}/id/${id}`);
    return data;
  },

  /**
   * Open a term (automatically closes any currently open term in the same academic year)
   * @param academicYearId - MongoDB ObjectId of the academic year
   * @param order - Term order (1, 2, or 3)
   */
  open: async (academicYearId: string, order: number): Promise<Term> => {
    const { data } = await axiosInstance.patch<Term>(
      `${baseTermsPath}/academic-year/${academicYearId}/term/${order}/open`
    );
    return data;
  },

  /**
   * Close a term (once closed, cannot be reopened)
   * @param academicYearId - MongoDB ObjectId of the academic year
   * @param order - Term order (1, 2, or 3)
   */
  close: async (academicYearId: string, order: number): Promise<Term> => {
    const { data } = await axiosInstance.patch<Term>(
      `${baseTermsPath}/academic-year/${academicYearId}/term/${order}/close`
    );
    return data;
  },
};

// Legacy exports for backward compatibility (can be removed after migration)
export const fetchAcademicYears = academicYearsApi.getAll;
export const fetchActiveAcademicYear = academicYearsApi.getOpen;
export const fetchTermsByAcademicYear = termsApi.getByAcademicYear;
export const createAcademicYear = academicYearsApi.create;
export const activateAcademicYear = academicYearsApi.open;
export const endAcademicYear = academicYearsApi.close;

