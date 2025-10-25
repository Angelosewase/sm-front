"use client";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import React from "react";
import { useRouter } from "next/navigation";
import StudentPerformanceView from "@/components/reports/student-performance-view";

export default function PerformancePage() {
  const router = useRouter();

  return (
    <div className="py-4 w-full">
      <div className="flex items-center justify-between px-4 lg:px-4 mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back to Report
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Student Performance</h1>
          </div>
        </div>
      </div>

      <StudentPerformanceView />
    </div>
  );
}
