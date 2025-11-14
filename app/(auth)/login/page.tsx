"use client";

import { SignInPage as SignIn } from "@/components/auth/sign-in";
import { useLogin } from "@/hooks/use-auth-mutations";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";


const SignInPage = () => {
  const router = useRouter();
  const loginMutation = useLogin();
  const [error, setError] = useState<string>("");

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await loginMutation.mutateAsync({ email, password });
      toast.success("Login successful");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ?? err?.message ?? "Invalid email or password";
      setError(errorMessage);
      console.error("Login error:", err);
      toast.error(errorMessage);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign-in not implemented");
    toast.error("Google sign-in not implemented");
  };

  return (
    <div className="bg-background text-foreground">
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}
      <SignIn
        heroImageSrc="/auth-main-image.webp"
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        isLoading={loginMutation.isPending}
      />
    </div>
  );
};

export default SignInPage;
