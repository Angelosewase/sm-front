import { getAuthToken } from "@/lib/actions/auth";
import { CreateSubjectDto, Subject, UpdateSubjectDto, ListSubjectsFilter, PaginatedSubjectsResponse, AssignTeacherDto, AssignClassAndTeacherDto, RemoveFromClassDto } from "@/types/subjects.dto";
import { axiosInstance } from "@/lib/axios";

const API_BASE_URL = "/api/subjects"; // Adjust based on your API base URL

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
    const { data } = await axiosInstance.patch<Subject>(`${API_BASE_URL}/${id}`, dto);
    return data;
  },

  fetchSubjects: async (
    filter: ListSubjectsFilter = {}
  ): Promise<PaginatedSubjectsResponse> => {
    const { data } = await axiosInstance.get<PaginatedSubjectsResponse>(API_BASE_URL, {
      params: filter,
    });
    return data;
  },

  fetchSubjectById: async (id: string): Promise<Subject> => {
    const { data } = await axiosInstance.get<Subject>(`${API_BASE_URL}/${id}`);
    return data;
  },

  // Delete a subject
  deleteSubject: async (id: string): Promise<void> => {
    const { data } = await axiosInstance.delete<void>(`${API_BASE_URL}/${id}`);
    return data;
  },

  // Assign subject to teacher
  assignSubjectToTeacher: async (dto: AssignTeacherDto): Promise<void> => {
    const token = await getAuthToken();
    const { data } = await axiosInstance.post<void>(
      `${API_BASE_URL}/${dto.subjectId}/assign-to-teacher`,
      {
        teacherId: dto.teacherId,
        academicYear: dto.academicYear,
        term: dto.term
      }
    );
    return data;
  },

  assignSubjectToClassAndTeacher: async (
    dto: AssignClassAndTeacherDto
  ): Promise<void> => {
    const { data } = await axiosInstance.post<void>(
      `${API_BASE_URL}/${dto.subjectId}/assign-to-class-with-teacher`,
      {
        classId: dto.classId,
        teacherId: dto.teacherId,
        academicYear: dto.academicYear,
        term: dto.term,
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
  fetchTeacherSchedule: async (teacherId: string, academicYear: string, term?: string) => {
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
    const { data } = await axiosInstance.delete<void>(`${API_BASE_URL}/remove-from-class`, {
      data: body,
    });
    return data;
  }
};