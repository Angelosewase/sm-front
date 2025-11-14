"use client";

import React from "react";
import { ResetPasswordPageComponent } from "@/components/auth/reset";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  return (
    <ResetPasswordPageComponent
      heroImageSrc="/auth-main-image.webp"
      onBack={() => router.push("/login")}
      onResetComplete={() => router.push("/login")}
    />
  );
}
