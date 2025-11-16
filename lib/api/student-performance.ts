import { axiosInstance } from "../axios";

const getBaseUrl = (studentId: string) =>
  `api/students/${studentId}/performance`;

interface SubjectTermBreakdown {
  term: string | null;
  totalScore: number;
  totalMax: number;
  percentage: number | null;
}

export interface SubjectPerformanceSummary {
  subjectId: string | null;
  subjectName: string;
  totalScore: number;
  totalMax: number;
  percentage: number | null;
  terms: SubjectTermBreakdown[];
}

export type StudentPerformanceSummaryQuery = {
  academicYear?: string; // legacy
  term?: string; // legacy
  academicYearId?: string;
  termId?: string;
  subjectId?: string;
  classId?: string;
  assessmentId?: string;
  assessmentType?: string;
};

export type SubjectAssessmentPerformanceQuery = {
  term?: string; // legacy
  year?: string; // legacy
  termId?: string;
  academicYearId?: string;
  studentId?: string;
};

export interface SubjectAssessmentPerformance {
  subjectId?: string | null;
  subject: string;
  scores: Record<string, number | null>;
}

export interface StudentAssessmentRecord {
  assessmentId: string;
  assessmentTitle: string;
  subject: string;
  subjectId?: string | null;
  studentId: string;
  academicYear: string | null;
  term: string | null;
  score: number | null;
  maxScore: number | null;
  assessmentType: string;
  deadline: string | null;
}

export const studentPerformanceApi = {
  getStudentPerformanceSummary: async (
    studentId: string,
    params?: StudentPerformanceSummaryQuery
  ): Promise<{
    subjects: SubjectPerformanceSummary[];
    overall: {
      totalScore: number;
      totalMax: number;
      percentage: number | null;
    };
  }> => {
    const { data } = await axiosInstance.get<{
      subjects: SubjectPerformanceSummary[];
      overall: {
        totalScore: number;
        totalMax: number;
        percentage: number | null;
      };
    }>(`${getBaseUrl(studentId)}/summary`, {
      params,
    });
    return data;
  },

  getSubjectAssessmentPerformances: async (
    studentId: string,
    params?: SubjectAssessmentPerformanceQuery
  ): Promise<SubjectAssessmentPerformance[]> => {
    const { data } = await axiosInstance.get<SubjectAssessmentPerformance[]>(
      getBaseUrl(studentId),
      { params }
    );
    return data;
  },

  getStudentAssessments: async (
    studentId: string,
    params?: SubjectAssessmentPerformanceQuery
  ): Promise<StudentAssessmentRecord[]> => {
    const { data } = await axiosInstance.get<StudentAssessmentRecord[]>(
      `${getBaseUrl(studentId)}/assessments`,
      { params }
    );
    return data;
  },
};
