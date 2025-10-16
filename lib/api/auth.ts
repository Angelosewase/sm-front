import { axiosInstance } from '../axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
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

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  getProfile: async () => {
    const { data } = await axiosInstance.get('/auth/profile');
    return data;
  },

  requestPasswordReset: async (resetData: RequestResetData): Promise<ApiResponse> => {
    const { data } = await axiosInstance.post<ApiResponse>('/auth/password-reset/request', resetData);
    return data;
  },

  verifyOtp: async (otpData: VerifyOtpData): Promise<VerifyOtpResponse> => {
    const { data } = await axiosInstance.post<VerifyOtpResponse>('/auth/password-reset/verify', otpData);
    return data;
  },

  resetPassword: async (resetData: ResetPasswordData): Promise<ApiResponse> => {
    const { data } = await axiosInstance.post<ApiResponse>('/auth/password-reset/reset', resetData);
    return data;
  },
};
