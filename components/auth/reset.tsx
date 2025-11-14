"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Logo } from "@/components/logo";
import {
  useRequestPasswordReset,
  useVerifyOtp,
  useResetPassword,
} from "@/hooks/use-auth-mutations";
import { toast } from "react-toastify";

const GlassInputWrapper = ({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: boolean;
}) => (
  <div
    className={`rounded-2xl border ${
      error ? "border-red-500" : "border-border"
    } bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10`}
  >
    {children}
  </div>
);

interface ResetPasswordPageProps {
  heroImageSrc?: string;
  onBack?: () => void;
  onResetComplete?: () => void;
}

type Step = "email" | "otp" | "password" | "success";

export const ResetPasswordPageComponent: React.FC<ResetPasswordPageProps> = ({
  heroImageSrc,
  onBack,
  onResetComplete,
}) => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const requestResetMutation = useRequestPasswordReset();
  const verifyOtpMutation = useVerifyOtp();
  const resetPasswordMutation = useResetPassword();

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validateOtp = (otp: string): boolean => {
    if (!otp) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      return false;
    }
    if (otp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "OTP must be 6 digits" }));
      return false;
    }
    if (!/^\d+$/.test(otp)) {
      setErrors((prev) => ({ ...prev, otp: "OTP must contain only numbers" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, otp: "" }));
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setErrors((prev) => ({ ...prev, newPassword: "Password is required" }));
      return false;
    }
    if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Password must be at least 6 characters",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, newPassword: "" }));
    return true;
  };

  const validateConfirmPassword = (confirm: string): boolean => {
    if (!confirm) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Please confirm your password",
      }));
      return false;
    }
    if (confirm !== newPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    return true;
  };

  // Handle form submissions
  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) return;

    try {
      await requestResetMutation.mutateAsync({ email });
      toast.success("OTP sent successfully");
      setStep("otp");
      setErrors({});
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      setErrors({
        email: error.response?.data?.message || "Failed to send OTP",
      });
    }
  };

  const handleOtpSubmit = async () => {
    if (!validateOtp(otp)) return;

    try {
      const response = await verifyOtpMutation.mutateAsync({ email, otp });
      toast.success("OTP verified successfully");
      setResetToken(response.resetToken);
      setStep("password");
      setErrors({});
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
      setErrors({
        otp: error.response?.data?.message || "Invalid or expired OTP",
      });
    }
  };

  const handlePasswordSubmit = async () => {
    const isPasswordValid = validatePassword(newPassword);
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (!isPasswordValid || !isConfirmValid) return;

    try {
      await resetPasswordMutation.mutateAsync({ resetToken, newPassword });
      toast.success("Password reset successfully");
      setStep("success");
      setErrors({});
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      setErrors({
        newPassword:
          error.response?.data?.message || "Failed to reset password",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      await requestResetMutation.mutateAsync({ email });
      toast.success("OTP sent successfully");
      setErrors({ otp: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      setErrors({
        otp: error.response?.data?.message || "Failed to resend OTP",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, submitFn: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitFn();
    }
  };

  const isLoading =
    requestResetMutation.isPending ||
    verifyOtpMutation.isPending ||
    resetPasswordMutation.isPending;

  // Render different steps
  const renderEmailStep = () => (
    <div className="space-y-5">
      <div className="animate-element animate-delay-300">
        <label className="text-sm font-medium text-muted-foreground">
          Email Address
        </label>
        <GlassInputWrapper error={!!errors.email}>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) validateEmail(e.target.value);
            }}
            onKeyPress={(e) => handleKeyPress(e, handleEmailSubmit)}
            placeholder="Enter your email address"
            className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
          />
        </GlassInputWrapper>
        {errors.email && (
          <p className="text-xs text-red-500 mt-2">{errors.email}</p>
        )}
      </div>

      <button
        onClick={handleEmailSubmit}
        disabled={isLoading}
        className="animate-element animate-delay-400 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? "Sending OTP..." : "Send Reset Code"}
      </button>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-5">
      <Alert className="animate-element animate-delay-300">
        <AlertDescription>
          We've sent a 6-digit verification code to <strong>{email}</strong>
        </AlertDescription>
      </Alert>

      <div className="animate-element animate-delay-400">
        <label className="text-sm font-medium text-muted-foreground">
          Verification Code
        </label>
        <GlassInputWrapper error={!!errors.otp}>
          <input
            name="otp"
            type="text"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(value);
              if (errors.otp) validateOtp(value);
            }}
            onKeyPress={(e) => handleKeyPress(e, handleOtpSubmit)}
            placeholder="Enter 6-digit code"
            className="w-full bg-transparent p-4 rounded-2xl focus:outline-none text-center text-2xl tracking-widest"
            maxLength={6}
          />
        </GlassInputWrapper>
        {errors.otp && (
          <p className="text-xs text-red-500 mt-2">{errors.otp}</p>
        )}
      </div>

      <div className="animate-element animate-delay-500 flex items-center justify-center text-sm">
        <span className="text-muted-foreground">Didn't receive the code?</span>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isLoading}
          className="ml-2 hover:underline text-violet-400 transition-colors disabled:opacity-50"
        >
          Resend
        </button>
      </div>

      <button
        onClick={handleOtpSubmit}
        disabled={isLoading}
        className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? "Verifying..." : "Verify Code"}
      </button>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="space-y-5">
      <div className="animate-element animate-delay-300">
        <label className="text-sm font-medium text-muted-foreground">
          New Password
        </label>
        <GlassInputWrapper error={!!errors.newPassword}>
          <div className="relative">
            <input
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword) validatePassword(e.target.value);
                if (confirmPassword) validateConfirmPassword(confirmPassword);
              }}
              placeholder="Enter new password"
              className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              ) : (
                <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              )}
            </button>
          </div>
        </GlassInputWrapper>
        {errors.newPassword && (
          <p className="text-xs text-red-500 mt-2">{errors.newPassword}</p>
        )}
      </div>

      <div className="animate-element animate-delay-400">
        <label className="text-sm font-medium text-muted-foreground">
          Confirm Password
        </label>
        <GlassInputWrapper error={!!errors.confirmPassword}>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  validateConfirmPassword(e.target.value);
              }}
              onKeyPress={(e) => handleKeyPress(e, handlePasswordSubmit)}
              placeholder="Confirm new password"
              className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              ) : (
                <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              )}
            </button>
          </div>
        </GlassInputWrapper>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-2">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        onClick={handlePasswordSubmit}
        disabled={isLoading}
        className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="animate-element animate-delay-300 flex justify-center">
        <CheckCircle2 className="w-20 h-20 text-green-500" />
      </div>
      <h2 className="animate-element animate-delay-400 text-2xl font-semibold">
        Password Reset Successful!
      </h2>
      <p className="animate-element animate-delay-500 text-muted-foreground">
        Your password has been successfully reset. You can now sign in with your
        new password.
      </p>
      <button
        onClick={() => {
          onResetComplete?.();
          onBack?.();
        }}
        className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Back to Sign In
      </button>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case "email":
        return "Reset Password";
      case "otp":
        return "Verify Your Identity";
      case "password":
        return "Create New Password";
      case "success":
        return "All Set!";
      default:
        return "Reset Password";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "email":
        return "Enter your email address and we'll send you a verification code";
      case "otp":
        return "Enter the verification code sent to your email";
      case "password":
        return "Choose a strong password for your account";
      case "success":
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw]">
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-4">
            <div className="animate-element animate-delay-50 flex justify-center mb-4">
              <Logo className="h-32 w-32" />
            </div>
            {step !== "success" && onBack && (
              <button
                onClick={onBack}
                className="animate-element animate-delay-100 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            )}

            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
              {getStepTitle()}
            </h1>
            {getStepDescription() && (
              <p className="animate-element animate-delay-200 text-muted-foreground">
                {getStepDescription()}
              </p>
            )}

            {step === "email" && renderEmailStep()}
            {step === "otp" && renderOtpStep()}
            {step === "password" && renderPasswordStep()}
            {step === "success" && renderSuccessStep()}
          </div>
        </div>
      </section>

      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4">
          <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl shadow overflow-hidden">
            <img
              src={heroImageSrc}
              alt="Authentication background"
              className="w-full h-full object-cover object-center"
              style={{ display: "block" }}
            />
          </div>
        </section>
      )}
    </div>
  );
};
