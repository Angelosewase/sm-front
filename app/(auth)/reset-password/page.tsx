"use client";

import React from "react";
import { ResetPasswordPage as ResetPasswordPageComponent } from "@/components/auth/reset";

export default function ResetPasswordPage() {
  return (
    <ResetPasswordPageComponent
      heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
      onBack={() => {}}
      onResetComplete={() => {}}
    />
  );
}
