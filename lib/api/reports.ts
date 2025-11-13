import { axiosInstance } from "../axios";

export type StudentReportDownloadParams = {
  studentId: string;
  academicYear: string;
  term?: string;
};

export const reportsApi = {
  downloadStudentReport: async ({
    studentId,
    academicYear,
    term,
  }: StudentReportDownloadParams) => {
    const response = await axiosInstance.get<Blob>(
      `/reports/students/${studentId}/report`,
      {
        params: {
          academicYear,
          ...(term ? { term } : {}),
        },
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
        },
      }
    );

    return response;
  },
};
