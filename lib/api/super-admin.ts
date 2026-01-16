import { axiosInstance } from "../axios";
import {
  School,
  SchoolsListResponse,
  QuerySchoolsDto,
  ActivateSchoolDto,
  User,
  UsersListResponse,
  QueryUserDto,
} from "@/types/super-admin.dto";

const baseSuperAdminPath = "/api/super-admin";

export const superAdminApi = {
  /**
   * Get paginated list of schools with optional filters
   */
  getSchools: async (params?: QuerySchoolsDto): Promise<SchoolsListResponse> => {
    const { data } = await axiosInstance.get<SchoolsListResponse>(
      `${baseSuperAdminPath}/schools`,
      { params }
    );
    return data;
  },

  /**
   * Get detailed information about a specific school
   */
  getSchoolById: async (id: string): Promise<School> => {
    const { data } = await axiosInstance.get<School>(
      `${baseSuperAdminPath}/schools/${id}`
    );
    return data;
  },

  /**
   * Activate a school
   */
  activateSchool: async (id: string): Promise<School> => {
    const { data } = await axiosInstance.patch<School>(
      `${baseSuperAdminPath}/schools/${id}/activate`
    );
    return data;
  },

  /**
   * Deactivate a school
   */
  deactivateSchool: async (id: string): Promise<School> => {
    const { data } = await axiosInstance.patch<School>(
      `${baseSuperAdminPath}/schools/${id}/deactivate`
    );
    return data;
  },

  /**
   * Toggle school status using request body
   */
  toggleSchoolStatus: async (
    id: string,
    payload: ActivateSchoolDto
  ): Promise<School> => {
    const { data } = await axiosInstance.patch<School>(
      `${baseSuperAdminPath}/schools/${id}/status`,
      payload
    );
    return data;
  },

  /**
   * Get paginated list of users with optional filters
   */
  getUsers: async (params?: QueryUserDto): Promise<UsersListResponse> => {
    const { data } = await axiosInstance.get<UsersListResponse>(
      `${baseSuperAdminPath}/users`,
      { params }
    );
    return data;
  },
};

