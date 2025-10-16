"use client";

import React from "react";
import { ResetPasswordPageComponent } from "@/components/auth/reset";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  return (
    <ResetPasswordPageComponent
      heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
      onBack={() => router.push("/login")}
      onResetComplete={() => router.push("/login")}
    />
  );
}
