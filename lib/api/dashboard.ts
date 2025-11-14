import { StudentStatsResponse } from "@/types/students.dto";
import { axiosInstance } from "../axios";
import { ClassStatsResponse } from "@/types/classes.types";

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
};
