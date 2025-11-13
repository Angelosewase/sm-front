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

export const studentPerformanceApi = {
  getStudentPerformanceSummary: async (
    studentId: string
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
    }>(getBaseUrl(studentId) + "/summary");
    return data;
  },
};
