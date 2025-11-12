"use client";

import * as React from "react";
import StatCard, { IChangeType } from "@/components/stat-card";
import { useStudents, useStudentStats } from "@/hooks/use-students";

interface StudentStatsProps {
  schoolId?: string;
}



export function StudentStats({ schoolId }: StudentStatsProps) {
   const { data, isLoading } = useStudentStats(schoolId);

   console.log("data are: ", data)

  return (
    <div className="flex w-full items-center justify-center p-4">
      <dl className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatCard key={i} name="..." value="…" change="…" percentageChange="…" changeType="neutral" dataKey="..." data={[]} />
            ))
          : data?.cards?.map((card) => <StatCard key={card.name} {...card} />)}
      </dl>
    </div>
  );
}
