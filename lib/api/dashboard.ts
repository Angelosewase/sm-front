import { StudentStatsResponse } from "@/types/students.dto";
import { axiosInstance } from "../axios";
import { ClassStatsResponse } from "@/types/classes.types";

export interface StudentPerformanceDto {
  studentId: string;
  name: string;
  totalMarks: number;
  totalPossible: number;
  average: number; // 0-100
  grade?: string;
  rank?: number;
}

export interface SubjectPerformanceDto {
  subjectId: string;
  subjectName: string;
  averageScore: number;
  totalAssessments: number;
  completed: number;
}

export interface ClassPerformanceDto {
  classId: string;
  className: string;
  gradeLevel: string;
  totalStudents: number;
  averageScore: number;
  topStudent?: StudentPerformanceDto;
  lowestStudent?: StudentPerformanceDto;
  subjectBreakdown: SubjectPerformanceDto[];
}

export interface TermPerformanceDto {
  termId: string;
  termName: string;
  startDate?: string;
  endDate?: string;
  classes: ClassPerformanceDto[];
  overallAverage: number;
  totalStudents: number;
  totalAssessments: number;
}

export interface AcademicYearPerformanceDto {
  academicYear: string;
  terms: TermPerformanceDto[];
  overallAverage: number;
  totalStudents: number;
  totalAssessments: number;
}

export interface SchoolPerformanceAnalyticsDto {
  schoolId: string;
  academicYears: AcademicYearPerformanceDto[];
  allTime?: {
    overallAverage: number;
    totalStudents: number;
    totalAssessments: number;
  };
}

export interface AdminStatsDto {
  totalStudents: number;
  studentsMoM: string;
  studentsMoMPercent: string;
  totalTeachers: number;
  teachersMoM: string;
  teachersMoMPercent: string;
  totalClasses: number;
  classesMoM: string;
  classesMoMPercent: string;
  totalStaffMembers: number;
  staffMoM: string;
  staffMoMPercent: string;
  series: Array<{
    date: string;
    "Total Students": number;
    Teachers: number;
    Classes: number;
    "Staff Members": number;
  }>;
}

export interface TimeSeriesItem {
  month: string; // "Jan", "Feb", ...
  students: number;
  teachers: number;
  staff: number;
}

export interface GenderDistributionItem {
  gender: "male" | "female" | "other";
  count: number;
  percentage: string;
}

export interface HeadTeacherSubjectStatsDto {
  totalSubjects: number;
  totalTeachers: number;
  averageClassSize: number;
  averagePerformance: number; // 0-100 (percentage)
  performanceGrade: string;
  schoolId: string;
}

export interface RegistrationAnalyticsDto {
  timeSeries: {
    last3Months: TimeSeriesItem[];
    last6Months: TimeSeriesItem[];
    last12Months: TimeSeriesItem[];
  };
  trend: {
    change: string; // "+8.7%"
    label: string; // "Trending up by 8.7% this period"
  };
  genderDistribution: GenderDistributionItem[];
}

export const dashbaordApi = {
  fetchStudentStats: async (
    schoolId?: string
  ): Promise<StudentStatsResponse> => {
    const params = schoolId ? `?schoolId=${schoolId}` : "";
    const { data } = await axiosInstance.get<StudentStatsResponse>(
      `/api/dashboard/student-stats${params}`
    );

    return data;
  },

  fetchClassStats: async (schoolId?: string): Promise<ClassStatsResponse> => {
    const params = schoolId ? `?schoolId=${schoolId}` : "";
    const { data } = await axiosInstance.get<ClassStatsResponse>(
      `/api/dashboard/class-stats${params}`
    );
    return data;
  },

  fetchAdminStats: async (schoolId: string): Promise<AdminStatsDto> => {
    const { data } = await axiosInstance.get<AdminStatsDto>(
      `/api/dashboard/admin-stats/${schoolId}`
    );
    return data;
  },

  fetchRegistrationAnalytics: async (
    schoolId: string
  ): Promise<RegistrationAnalyticsDto> => {
    const { data } = await axiosInstance.get<RegistrationAnalyticsDto>(
      `/api/dashboard/registration-analytics/${schoolId}`
    );
    return data;
  },

  fetchPerformanceAnalytics: async (params: {
    schoolId?: string;
    classId?: string;
    academicYear?: string;
    termId?: string;
    scope?: "term" | "year" | "all";
  }): Promise<SchoolPerformanceAnalyticsDto> => {
    const searchParams = new URLSearchParams();
    if (params.schoolId) searchParams.set("schoolId", params.schoolId);
    if (params.classId) searchParams.set("classId", params.classId);
    if (params.academicYear)
      searchParams.set("academicYear", params.academicYear);
    if (params.termId) searchParams.set("termId", params.termId);
    if (params.scope) searchParams.set("scope", params.scope);

    const queryString = searchParams.toString();
    const url = `/api/dashboard/performance${
      queryString ? `?${queryString}` : ""
    }`;

    const { data } = await axiosInstance.get<SchoolPerformanceAnalyticsDto>(
      url
    );
    return data;
  },

  fetchHeadTeacherSubjectStats: async (
    schoolId: string
  ): Promise<HeadTeacherSubjectStatsDto> => {
    const { data } = await axiosInstance.get<HeadTeacherSubjectStatsDto>(
      `/api/dashboard/subject-stats`,
      {
        params: { schoolId },
      }
    );
    return data;
  },
};
