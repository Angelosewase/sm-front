import { axiosInstance } from '../axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface AuthUserSchool {
  id: string;
  name: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
  school: AuthUserSchool | null;
}

export interface ProfileResponse {
  user: AuthUser;
  school: AuthUserSchool | null;
}

export interface RequestResetData {
  email: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  resetToken: string;
  message: string;
}

export interface ResetPasswordData {
  resetToken: string;
  newPassword: string;
}

export interface ApiResponse {
  message: string;
}

const baseAuthPath='/api/auth';

// Auth API client - now using Next.js API routes for authentication
export const authApi = {
  // Note: Login is now handled by the Next.js API route at /api/auth/login
  // and logout is handled by /api/auth/logout
  
  getProfile: async (): Promise<ProfileResponse> => {
    const { data } = await axiosInstance.get<ProfileResponse>(`${baseAuthPath}/profile`);
    return data;
  },

  requestPasswordReset: async (resetData: RequestResetData): Promise<ApiResponse> => {
    const { data } = await axiosInstance.post<ApiResponse>(`${baseAuthPath}/password-reset/request`, resetData);
    return data;
  },

  verifyOtp: async (otpData: VerifyOtpData): Promise<VerifyOtpResponse> => {
    const { data } = await axiosInstance.post<VerifyOtpResponse>(`${baseAuthPath}/password-reset/verify`, otpData);
    return data;
  },

  resetPassword: async (resetData: ResetPasswordData): Promise<ApiResponse> => {
    const { data } = await axiosInstance.post<ApiResponse>(`${baseAuthPath}/password-reset/reset`, resetData);
    return data;
  },
};
