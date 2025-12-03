import { axiosInstance } from "../axios";

export type StudentReportDownloadParams = {
  studentId: string;
  academicYearId: string;
  termId?: string;
};

export const reportsApi = {
  downloadStudentReport: async ({
    studentId,
    academicYearId,
    termId,
  }: StudentReportDownloadParams) => {
    const response = await axiosInstance.get<Blob>(
      `/reports/students/${studentId}/report`,
      {
        params: {
          academicYearId,
          ...(termId ? { termId } : {}),
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
