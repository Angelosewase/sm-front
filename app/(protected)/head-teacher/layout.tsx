import { HeadTeacherProtector } from "@/components/auth/role-protector";
import React from "react";

export default function HeaderTeacherLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HeadTeacherProtector>{children}</HeadTeacherProtector>;
}
