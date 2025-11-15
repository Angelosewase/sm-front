import { StudentStatsResponse } from "@/types/students.dto";
import { axiosInstance } from "../axios";
import { ClassStatsResponse } from "@/types/classes.types";

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
  const {data} = await axiosInstance.get<ClassStatsResponse>(
    `/api/dashboard/class-stats${params}`
  );
 return data
},

}