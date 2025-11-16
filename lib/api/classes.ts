import {
  AssignSubjectToClassDto,
  AssignTeacherToClassDto,
  ClassLite,
  CreateClassDto,
  IQueryClasses,
  PaginatedClassesResponse,
} from "@/types/classes.types";

export interface SubjectSummary {
  _id: string;
  code?: string;
  name: string;
  shortName?: string;
  description?: string;
  department?: string;
  subjectType?: string;
  maxScore?: number;
  minPassingScore?: number;
  creditHours?: number;
  level?: string;
  gradeLevels?: string[];
  prerequisites?: string;
  status?: string;
  school?: string;
  assessments?: string[];
  assessmentsDone: number;
  totalAssessments: number;
  averageMark: number | null;
  latestMarkDate: string | null;
}
import { axiosInstance } from "../axios";

export interface Class {
  _id: string;
  name: string;
  gradeLevel: string;
  academicYear?: string;
  capacity: number;
  description?: string;
  status: "active" | "inactive";
  classTeacher?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  // When includeTeacherProfile=true, backend returns teacherProfile
  teacherProfile?: {
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
    };
  } | null;
  // When subjects are assigned, backend may return assignedSubjects
  assignedSubjects?: {
    _id: string;
    name: string;
    code: string;
  }[];
  studentCount: number;
  isTrashed?: boolean;
  trashedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassListResponse {
  data: Class[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ClassPerformanceGroupBy =
  | "academicYear"
  | "term"
  | "assessmentType";

export interface ClassPerformanceByAcademicYearRow {
  academicYear: string;
  average: number;
  marksCount: number;
  totalScore: number;
  totalPossible: number;
}

export interface ClassPerformanceByTermRow {
  term: string;
  average: number;
  marksCount: number;
  totalScore: number;
  totalPossible: number;
}

export interface ClassPerformanceWeeklyPoint {
  week: number;
  year: number;
  average: number;
  count: number;
}

export interface ClassPerformanceByAssessmentTypeRow {
  assessmentType: string;
  average: number;
  marksCount: number;
  totalScore: number;
  totalPossible: number;
  assessments: {
    assessmentId: string;
    title: string;
    date: string;
    maxScore: number;
  }[];
  weekly?: ClassPerformanceWeeklyPoint[];
}

export interface ClassPerformanceBase {
  classId: string;
  className: string;
  academicYear?: string;
  term?: string;
  groupBy: ClassPerformanceGroupBy;
}

export type ClassPerformanceResponse =
  | (ClassPerformanceBase & {
      groupBy: "academicYear";
      results: ClassPerformanceByAcademicYearRow[];
    })
  | (ClassPerformanceBase & {
      groupBy: "term";
      results: ClassPerformanceByTermRow[];
    })
  | (ClassPerformanceBase & {
      groupBy: "assessmentType";
      results: ClassPerformanceByAssessmentTypeRow[];
    });

export interface CreateClassData {
  name: string;
  gradeLevel: string;
  capacity: number;
  description?: string;
  status?: "active" | "inactive";
  school?: string;
  classTeacher?: string;
}

export interface UpdateClassData {
  name?: string;
  gradeLevel?: string;
  capacity?: number;
  description?: string;
  status?: "active" | "inactive";
  classTeacher?: string;
}

export interface ClassQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  gradeLevel?: string;
  academicYear?: string;
  includeTrashed?: boolean;
  onlyTrashed?: boolean;
}

const classesApiUrl = "/api/classes";

export const classesApi = {
  /**
   * Get paginated list of classes
   */
  getClasses: async (params?: ClassQueryParams): Promise<ClassListResponse> => {
    const { data } = await axiosInstance.get<ClassListResponse>(classesApiUrl, {
      params,
    });
    return data;
  },

  /**
   * Get a single class by ID
   */
  getClassById: async (id: string): Promise<Class> => {
    const { data } = await axiosInstance.get<Class>(`${classesApiUrl}/${id}`);
    return data;
  },

  /**
   * Create a new class
   */
  createClass: async (classData: CreateClassData): Promise<Class> => {
    const { data } = await axiosInstance.post<Class>(classesApiUrl, classData);
    return data;
  },

  /**
   * Update an existing class
   */
  updateClass: async (
    id: string,
    classData: UpdateClassData
  ): Promise<Class> => {
    const { data } = await axiosInstance.patch<Class>(
      `${classesApiUrl}/${id}`,
      classData
    );
    return data;
  },

  /**
   * Delete a class
   */
  deleteClass: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${classesApiUrl}/${id}`);
  },

  /**
   * Restore a trashed class
   */
  restoreClass: async (id: string): Promise<Class> => {
    const { data } = await axiosInstance.patch<Class>(
      `${classesApiUrl}/${id}/restore`,
      {}
    );
    return data;
  },

  /**
   * Permanently delete a trashed class
   */
  permanentlyDeleteClass: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${classesApiUrl}/${id}/permanent`);
  },

  /**
   * Bulk move classes to trash
   */
  bulkTrashClasses: async (
    ids: string[]
  ): Promise<{ modifiedCount: number }> => {
    const { data } = await axiosInstance.post<{ modifiedCount: number }>(
      `${classesApiUrl}/bulk/trash`,
      { ids }
    );
    return data;
  },

  /**
   * Bulk restore trashed classes
   */
  bulkRestoreClasses: async (
    ids: string[]
  ): Promise<{ modifiedCount: number }> => {
    const { data } = await axiosInstance.post<{ modifiedCount: number }>(
      `${classesApiUrl}/bulk/restore`,
      { ids }
    );
    return data;
  },

  /**
   * Bulk permanently delete trashed classes
   */
  bulkPermanentlyDeleteClasses: async (
    ids: string[]
  ): Promise<{ deletedCount: number }> => {
    const { data } = await axiosInstance.post<{ deletedCount: number }>(
      `${classesApiUrl}/bulk/permanent`,
      { ids }
    );
    return data;
  },

  postAssignTeacherToClass: async ({
    classId,
    teacherId,
  }: AssignTeacherToClassDto): Promise<void> => {
    const { data } = await axiosInstance.post<void>(
      `${classesApiUrl}/${classId}/teachers`,
      { teacherId }
    );
    return data;
  },

  assignSubjectToClass: async ({
    classId,
    subjectIds,
  }: AssignSubjectToClassDto): Promise<void> => {
    const { data } = await axiosInstance.post<void>(
      `${classesApiUrl}/${classId}/assign-subjects`,
      { subjectIds }
    );
    return data;
  },

  listClassesForSubjects: async (subjectId: string): Promise<Class[]> => {
    const { data } = await axiosInstance.get<Class[]>(
      `${classesApiUrl}/subject/${subjectId}/classes`
    );
    return data;
  },

  /**
   * List subjects assigned to a class
   */
  listClassSubjects: async (
    classId: string,
    params?: { teacher?: string }
  ): Promise<SubjectSummary[]> => {
    const { data } = await axiosInstance.get<SubjectSummary[]>(
      `${classesApiUrl}/${classId}/subjects`,
      { params }
    );
    return data;
  },

  getClassPerformance: async (
    classId: string,
    params?: Record<string, unknown>
  ): Promise<ClassPerformanceResponse> => {
    const { data } = await axiosInstance.get<ClassPerformanceResponse>(
      `${classesApiUrl}/${classId}/performance`,
      { params }
    );
    return data;
  },
};
