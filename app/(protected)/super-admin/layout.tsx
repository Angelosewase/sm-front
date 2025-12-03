import { SuperAdminProtector } from "@/components/auth/role-protector";
import React from "react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminProtector>{children}</SuperAdminProtector>;
}

