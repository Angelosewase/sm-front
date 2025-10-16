import { useMutation } from '@tanstack/react-query';
import { authApi, LoginCredentials, RequestResetData, VerifyOtpData, ResetPasswordData } from '@/lib/api/auth';
import { useAuth } from '@/contexts/auth-context';

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: RequestResetData) => authApi.requestPasswordReset(data),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (data: VerifyOtpData) => authApi.verifyOtp(data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordData) => authApi.resetPassword(data),
  });
}
