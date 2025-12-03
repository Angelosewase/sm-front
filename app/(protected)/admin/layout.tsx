import { AdminProtector } from "@/components/auth/role-protector";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProtector>{children}</AdminProtector>;
}

