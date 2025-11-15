import { axiosInstance } from "@/lib/axios";

export interface MarkRecord {
  _id: string;
  student: string | { _id?: string; studentId?: string; name?: string };
  subject: string;
  class: string;
  assessment?: string;
  academicYear: string;
  term: string;
  assessmentType: string;
  score: number | null;
  comment?: string;
  maxScore?: number;
  weight?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EnterMarkDto {
  studentId: string;
  subjectId: string;
  classId: string;
  academicYear: string;
  term: string;
  assessmentType: string;
  score: number;
  comment?: string;
  assessmentId?: string;
}

export interface BulkEnterMarksDto {
  marks: (EnterMarkDto & { assessmentType: string })[];
}

export interface BulkEnterMarksResult {
  results: Array<{
    ok: boolean;
    id?: string;
    error?: string;
    mark?: EnterMarkDto;
  }>;
}

export interface UpdateMarkDto {
  score?: number | null;
  comment?: string;
}

const baseMarksPath = "/api/marks";

export const marksApi = {
  listMarks: async (): Promise<MarkRecord[]> => {
    const { data } = await axiosInstance.get<MarkRecord[]>(baseMarksPath);
    return data;
  },

  getAssessmentMarks: async (assessmentId: string): Promise<MarkRecord[]> => {
    const { data } = await axiosInstance.get<MarkRecord[]>(
      `${baseMarksPath}/assessments/${assessmentId}`
    );
    return data;
  },

  enterMark: async (payload: EnterMarkDto): Promise<MarkRecord> => {
    const { data } = await axiosInstance.post<MarkRecord>(
      baseMarksPath,
      payload
    );
    return data;
  },

  enterMarksBulk: async (
    payload: BulkEnterMarksDto
  ): Promise<BulkEnterMarksResult> => {
    const { data } = await axiosInstance.post<BulkEnterMarksResult>(
      `${baseMarksPath}/bulk`,
      payload
    );
    return data;
  },

  updateMark: async ({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateMarkDto;
  }): Promise<MarkRecord> => {
    const { data } = await axiosInstance.post<MarkRecord>(
      `${baseMarksPath}/update/${id}`,
      payload
    );
    return data;
  },
};

