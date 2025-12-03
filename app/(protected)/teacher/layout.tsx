import { TeacherProtector } from "@/components/auth/role-protector";
import React from "react";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherProtector>{children}</TeacherProtector>;
}

