import { axiosInstance } from "../axios";

// Types based on documentation API specification
export interface Assessment {
  _id: string;
  academicYear: string;
  term: string;
  subject: string;
  class: string;
  title: string;
  description?: string;
  weight?: number;
  assessmentType: AssessmentType;
  deadline: string;
  maxScore?: number;
  status: AssessmentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export enum AssessmentType {
  QUIZ = "Quiz",
  TEST = "Test", 
  EXAM = "Exam",
  ASSIGNMENT = "Assignment",
  PROJECT = "Project",
  PRACTICAL = "Practical",
  HOMEWORK = "Homework"
}

export enum AssessmentStatus {
  ACTIVE = "active",
  TRASHED = "trashed",
  DELETED = "deleted",
  LOCKED = "locked"
}

// DTOs
export interface CreateAssessmentDto {
  academicYear: string;
  term: string;
  subject: string;
  class: string;
  title: string;
  description?: string;
  weight?: number;
  assessmentType: AssessmentType;
  deadline: string;
  maxScore?: number;
}

export interface UpdateAssessmentDto {
  title?: string;
  description?: string;
  weight?: number;
  assessmentType?: AssessmentType;
  deadline?: string;
  maxScore?: number;
}

// Assessment API
const baseAssessmentsPath = "/api/assessments";

export const assessmentsApi = {
  /**
   * Update an existing assessment by ID
   */
  update: async (id: string, payload: UpdateAssessmentDto): Promise<Assessment> => {
    const { data } = await axiosInstance.put<Assessment>(`${baseAssessmentsPath}/${id}`, payload);
    return data;
  },

  /**
   * Soft delete an assessment (move to trash)
   */
  softDelete: async (id: string): Promise<Assessment> => {
    const { data } = await axiosInstance.put<Assessment>(`${baseAssessmentsPath}/${id}/soft-delete`);
    return data;
  },

  /**
   * Permanently delete an assessment
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${baseAssessmentsPath}/${id}`);
  },
};