
import { getAuthToken } from "@/lib/actions/auth";
import { CreateSubjectDto, Subject, UpdateSubjectDto, ListSubjectsFilter, PaginatedSubjectsResponse, AssignTeacherDto, AssignClassAndTeacherDto, RemoveFromClassDto } from "@/types/subjects.dto";
import { axiosInstance } from "@/lib/axios";



const API_BASE_URL = "http://localhost:3000/api/subjects"; // Adjust based on your API base URL

// Create a new subject
export const createSubject = async (dto: CreateSubjectDto): Promise<Subject> => {
  const response = await axiosInstance.post<Subject>(API_BASE_URL, dto, {
    headers: { Authorization: `Bearer ${await getAuthToken()}` },
  });
  return response.data;
};

export const updateSubject = async (
  id: string,
  dto: UpdateSubjectDto
): Promise<Subject> => {
  const response = await axiosInstance.patch<Subject>(`${API_BASE_URL}/${id}`, dto, {
    headers: { Authorization: `Bearer ${await getAuthToken()}` },
  });
  return response.data;
};

export const fetchSubjects = async (
  filter: ListSubjectsFilter = {}
): Promise<PaginatedSubjectsResponse> => {
    const response = await axiosInstance.get<PaginatedSubjectsResponse>(API_BASE_URL, {
    params: filter,
    headers: { Authorization: `Bearer ${await getAuthToken()}` },
  });
  return response.data;
};

export const fetchSubjectById = async (id: string): Promise<Subject> => {
const response = await axiosInstance.get<Subject>(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${await getAuthToken()}` },
  });
  return response.data;
};

// Delete a subject
export const deleteSubject = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${await getAuthToken()}` },
  });
};

// Assign subject to teacher
export const assignSubjectToTeacher = async (dto: AssignTeacherDto): Promise<void> => {
  const token = await getAuthToken();
  await axiosInstance.post(
    `${API_BASE_URL}/${dto.subjectId}/assign-to-teacher`,
    {
      teacherId: dto.teacherId,
      academicYear: dto.academicYear,
      term: dto.term
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const assignSubjectToClassAndTeacher = async (
  dto: AssignClassAndTeacherDto
): Promise<void> => {
  const token = await getAuthToken();
  await axiosInstance.post(
    `${API_BASE_URL}/${dto.subjectId}/assign-to-class-with-teacher`,
    {
      classId: dto.classId,
      teacherId: dto.teacherId,
      academicYear: dto.academicYear,
      term: dto.term,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const fetchSchoolStats = async (schoolId: string, academicYear?: string) => {
  const response = await axiosInstance.get(
    `${API_BASE_URL}/analytics/school/${schoolId}`,
    {
      params: academicYear ? { academicYear } : undefined,
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    }
  );
  return response.data;
};

// Teacher workload
export const fetchTeacherWorkload = async (teacherId: string, academicYear?: string) => {
  const response = await axiosInstance.get(
    `${API_BASE_URL}/analytics/teacher/${teacherId}/workload`,
    {
      params: academicYear ? { academicYear } : undefined,
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    }
  );
  return response.data;
};

// Subject's classes
export const fetchClassesOfSubject = async (subjectId: string, params = {}) => {
  const response = await axiosInstance.get(
    `${API_BASE_URL}/${subjectId}/classes`,
    {
      params,
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    }
  );
  return response.data;
};

// Classes subjects
export const fetchSubjectsOfClass = async (classId: string, params = {}) => {
  const response = await axiosInstance.get(
    `${API_BASE_URL}/class/${classId}/subjects`,
    {
      params,
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    }
  );
  return response.data;
};

// Teacher's classes
export const fetchClassesOfTeacher = async (teacherId: string, params = {}) => {
  const response = await axiosInstance.get(
    `${API_BASE_URL}/teacher/${teacherId}/classes`,
    {
      params,
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    }
  );
  return response.data;
};

// Teacher's subjects
export const fetchSubjectsOfTeacher = async (teacherId: string, params = {}) => {
  const response = await axiosInstance.get(
    `${API_BASE_URL}/teacher/${teacherId}/subjects`,
    {
      params,
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    }
  );
  return response.data;
};

// Teacher schedule
export const fetchTeacherSchedule = async (teacherId: string, academicYear: string, term?: string) => {
  const response = await axiosInstance.get(
    `${API_BASE_URL}/teacher/${teacherId}/schedule`,
    {
      params: { academicYear, ...(term ? { term } : {}) },
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    }
  );
  return response.data;
};



export const assignSubjectBulk = async (subjectId: string, assignments: any) => {
  const token = await getAuthToken();
  await axiosInstance.post(
    `${API_BASE_URL}/${subjectId}/assign-multiple`,
    { assignments },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};


/* -------------------------------------------------------------------------- */
/*  3. Delete assignment                                                      */
/* -------------------------------------------------------------------------- */
export const deleteAssignment = async (assignmentId: string) => {
  const response = await axiosInstance.delete(
    `${API_BASE_URL}/assignments/${assignmentId}`,
    { headers: { Authorization: `Bearer ${await getAuthToken()}` } }
  );
  return response.data;
};

/* -------------------------------------------------------------------------- */
/*  4. Remove subject from class (DELETE /remove-from-class)                 */
/* -------------------------------------------------------------------------- */
export const removeSubjectFromClass = async (body: RemoveFromClassDto) => {
  const response = await axiosInstance.delete(`${API_BASE_URL}/remove-from-class`, {
    data: body,
    headers: { Authorization: `Bearer ${await getAuthToken()}` },
  });
  return response.data;
};