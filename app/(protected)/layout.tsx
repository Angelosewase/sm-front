import { DashboardSidebar } from "@/components/app-sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={false}>
        <div className="relative flex h-screen w-full">
          <DashboardSidebar />
          <SidebarInset className="flex flex-col">
            <div className="min-h-screen bg-background">
              <Header />
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
