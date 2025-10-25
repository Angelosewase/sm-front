import React from "react";
import { AdminStatCards } from "@/components/admin/admin-stat-cards";
import { UserRegistrationBarChart } from "@/components/admin/user-regsitration-graph";
import StudentGenderChart from "@/components/admin/student-gender-graph";
import { StudentPerformanceChart } from "@/components/admin/student-performance";
import { RecentActivity } from "@/components/admin/recent-activity";

export default function AdminHomePage() {
  return (
    <div className=" mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your school management system
        </p>
      </div>

      {/* Top Section - Stat Cards */}
      <section>
        <AdminStatCards />
      </section>

      {/* Registration & Gender Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-full max-h-[500px]">
          <UserRegistrationBarChart />
        </div>
        <div className="lg:col-span-1 h-full max-h-[500px]">
          <StudentGenderChart />
        </div>
      </section>

      {/* Performance & Recent Activity Section */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 h-full max-h-[500px]">
          <StudentPerformanceChart />
        </div>
        <div className="lg:col-span-2 h-full max-h-[500px]">
          <RecentActivity />
        </div>
      </section>
    </div>
  );
}
