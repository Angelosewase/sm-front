import { getAuthToken } from "@/lib/actions/auth";
import {
  CreateSubjectDto,
  Subject,
  UpdateSubjectDto,
  ListSubjectsFilter,
  PaginatedSubjectsResponse,
  AssignTeacherDto,
  AssignClassDto,
  RemoveFromClassDto,
} from "@/types/subjects.dto";
import { axiosInstance } from "@/lib/axios";
import {
  AssessmentDetail,
  AssessmentFilterDto,
  AssessmentListResponse,
  AssessmentPerformance,
  CreateAssessmentDto,
  UpdateAssessmentDto,
} from "@/types/subjects.dto";

const API_BASE_URL = "/api/subjects"; // Adjust based on your API base URL

export interface SubjectStats {
  totalAssessments: number;
  completedAssessments: number;
  totalWeight: number;
  averageScore: number;
  completionRate: number;
  latestMarkDate: string | null;
}

export interface SubjectAssessmentSummary {
  assessmentId: string;
  title: string;
  assessmentType: string;
  weight: number;
  createdAt: string;
  maxScore: number;
  class: string;
  completedCount: number;
  totalCount: number;
  completionRate: number;
  averageScore: number;
  status: string;
}

// Create a new subject
export const subjectsApi = {
  createSubject: async (dto: CreateSubjectDto): Promise<Subject> => {
    const { data } = await axiosInstance.post<Subject>(API_BASE_URL, dto);
    return data;
  },

  updateSubject: async (
    id: string,
    dto: UpdateSubjectDto
  ): Promise<Subject> => {
    const { data } = await axiosInstance.patch<Subject>(
      `${API_BASE_URL}/${id}`,
      dto
    );
    return data;
  },

  fetchSubjects: async (
    filter: ListSubjectsFilter = {}
  ): Promise<PaginatedSubjectsResponse> => {
    const { data } = await axiosInstance.get<PaginatedSubjectsResponse>(
      API_BASE_URL,
      {
        params: filter,
      }
    );
    return data;
  },

  fetchSubjectById: async (id: string): Promise<Subject> => {
    const { data } = await axiosInstance.get<Subject>(`${API_BASE_URL}/${id}`);
    return data;
  },

  // Subject dashboard stats
  fetchSubjectStats: async (
    subjectId: string,
    params?: { classId?: string; term?: string }
  ): Promise<SubjectStats> => {
    const { data } = await axiosInstance.get<SubjectStats>(
      `${API_BASE_URL}/${subjectId}/stats`,
      { params }
    );
    return data;
  },

  // Subject assessments
  fetchSubjectAssessments: async (
    subjectId: string,
    params?: { classId?: string; term?: string }
  ): Promise<SubjectAssessmentSummary[]> => {
    const { data } = await axiosInstance.get<SubjectAssessmentSummary[]>(
      `${API_BASE_URL}/${subjectId}/assessments`,
      { params }
    );
    return data;
  },

  // Move a subject to trash (soft delete)
  deleteSubject: async (id: string): Promise<void> => {
    const { data } = await axiosInstance.delete<void>(`${API_BASE_URL}/${id}`);
    return data;
  },

  // Restore a trashed subject
  restoreSubject: async (id: string): Promise<Subject> => {
    const { data } = await axiosInstance.patch<Subject>(
      `${API_BASE_URL}/${id}/restore`,
      {}
    );
    return data;
  },

  // Permanently delete a trashed subject
  permanentlyDeleteSubject: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${API_BASE_URL}/${id}/permanent`);
  },

  // Bulk move subjects to trash
  bulkTrashSubjects: async (
    ids: string[]
  ): Promise<{ modifiedCount: number }> => {
    const { data } = await axiosInstance.post<{ modifiedCount: number }>(
      `${API_BASE_URL}/bulk/trash`,
      { ids }
    );
    return data;
  },

  // Bulk restore trashed subjects
  bulkRestoreSubjects: async (
    ids: string[]
  ): Promise<{ modifiedCount: number }> => {
    const { data } = await axiosInstance.post<{ modifiedCount: number }>(
      `${API_BASE_URL}/bulk/restore`,
      { ids }
    );
    return data;
  },

  // Bulk permanently delete trashed subjects
  bulkPermanentlyDeleteSubjects: async (
    ids: string[]
  ): Promise<{ deletedCount: number }> => {
    const { data } = await axiosInstance.post<{ deletedCount: number }>(
      `${API_BASE_URL}/bulk/permanent`,
      { ids }
    );
    return data;
  },

  // Assign subject to teacher
  assignSubjectToTeacher: async (dto: AssignTeacherDto): Promise<void> => {
    const { data } = await axiosInstance.post<void>(
      `${API_BASE_URL}/${dto.teacherId}/subjects`,
      {
        subjectIds: dto.subjectIds,
      }
    );
    return data;
  },

  fetchSchoolStats: async (schoolId: string, academicYear?: string) => {
    const { data } = await axiosInstance.get<any>(
      `${API_BASE_URL}/analytics/school/${schoolId}`,
      {
        params: academicYear ? { academicYear } : undefined,
      }
    );
    return data;
  },

  // Teacher workload
  fetchTeacherWorkload: async (teacherId: string, academicYear?: string) => {
    const { data } = await axiosInstance.get<any>(
      `${API_BASE_URL}/analytics/teacher/${teacherId}/workload`,
      {
        params: academicYear ? { academicYear } : undefined,
      }
    );
    return data;
  },

  // Subject's classes
  fetchClassesOfSubject: async (subjectId: string, params = {}) => {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/${subjectId}/classes`,
      {
        params,
        headers: { Authorization: `Bearer ${await getAuthToken()}` },
      }
    );
    return response.data;
  },

  // Classes subjects
  fetchSubjectsOfClass: async (classId: string, params = {}) => {
    const { data } = await axiosInstance.get<any>(
      `${API_BASE_URL}/class/${classId}/subjects`,
      {
        params,
      }
    );
    return data;
  },

  // Teacher's classes
  fetchClassesOfTeacher: async (teacherId: string, params = {}) => {
    const { data } = await axiosInstance.get<any>(
      `${API_BASE_URL}/teacher/${teacherId}/classes`,
      {
        params,
      }
    );
    return data;
  },

  // Teacher's subjects
  fetchSubjectsOfTeacher: async (teacherId: string, params = {}) => {
    const { data } = await axiosInstance.get<any>(
      `${API_BASE_URL}/teacher/${teacherId}/subjects`,
      {
        params,
      }
    );
    return data;
  },

  // Teacher schedule
  fetchTeacherSchedule: async (
    teacherId: string,
    academicYear: string,
    term?: string
  ) => {
    const { data } = await axiosInstance.get<any>(
      `${API_BASE_URL}/teacher/${teacherId}/schedule`,
      {
        params: { academicYear, ...(term ? { term } : {}) },
      }
    );
    return data;
  },

  fetchTeacherSubjects: async (teacherId: string) => {
    const { data } = await axiosInstance.get<any>(
      `${API_BASE_URL}/teacher/${teacherId}/subjects`
    );
    return data;
  },

  assignSubjectBulk: async (subjectId: string, assignments: any) => {
    const { data } = await axiosInstance.post<void>(
      `${API_BASE_URL}/${subjectId}/assign-multiple`,
      { assignments }
    );
    return data;
  },

  /* -------------------------------------------------------------------------- */
  /*  3. Delete assignment                                                      */
  /* -------------------------------------------------------------------------- */
  deleteAssignment: async (assignmentId: string) => {
    const { data } = await axiosInstance.delete<void>(
      `${API_BASE_URL}/assignments/${assignmentId}`
    );
    return data;
  },

  /* -------------------------------------------------------------------------- */
  /*  4. Remove subject from class (DELETE /remove-from-class)                 */
  /* -------------------------------------------------------------------------- */
  removeSubjectFromClass: async (body: RemoveFromClassDto) => {
    const { data } = await axiosInstance.delete<void>(
      `${API_BASE_URL}/remove-from-class`,
      {
        data: body,
      }
    );
    return data;
  },

  // ---------------- Assessments API ----------------
  createAssessment: async (
    payload: CreateAssessmentDto
  ): Promise<AssessmentDetail> => {
    const { data } = await axiosInstance.post<AssessmentDetail>(
      `/api/assessments`,
      payload
    );
    return data;
  },

  updateAssessment: async (
    id: string,
    payload: UpdateAssessmentDto
  ): Promise<AssessmentDetail> => {
    const { data } = await axiosInstance.put<AssessmentDetail>(
      `/api/assessments/${id}`,
      payload
    );
    return data;
  },

  // list assessments with filters
  fetchAssessments: async (
    params?: AssessmentFilterDto
  ): Promise<AssessmentListResponse> => {
    const { data } = await axiosInstance.get<AssessmentListResponse>(
      `/api/assessments`,
      { params }
    );
    return data;
  },

  getAssessmentById: async (id: string): Promise<AssessmentDetail> => {
    const { data } = await axiosInstance.get<AssessmentDetail>(
      `/api/assessments/${id}`
    );
    return data;
  },

  softDeleteAssessment: async (id: string): Promise<AssessmentDetail> => {
    const { data } = await axiosInstance.put<AssessmentDetail>(
      `/api/assessments/${id}/soft-delete`
    );
    return data;
  },

  permanentlyDeleteAssessment: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/assessments/${id}`);
  },

  getAssessmentPerformance: async (
    id: string
  ): Promise<AssessmentPerformance> => {
    const { data } = await axiosInstance.get<AssessmentPerformance>(
      `/api/assessments/${id}/performance`
    );
    return data;
  },

  getSubjectAssessmentsPerformance: async (
    subjectId: string,
    params?: { academicYear?: string; term?: string; classId?: string }
  ): Promise<AssessmentPerformance> => {
    const { data } = await axiosInstance.get<AssessmentPerformance>(
      `/api/assessments/subject/${subjectId}/performance`,
      { params }
    );
    return data;
  },

  getClassAssessmentsPerformance: async (
    classId: string,
    params?: { academicYear?: string; term?: string }
  ): Promise<AssessmentPerformance> => {
    const { data } = await axiosInstance.get<AssessmentPerformance>(
      `/api/assessments/class/${classId}/performance`,
      { params }
    );
    return data;
  },
};
