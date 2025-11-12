import * as React from "react";
import StatCard from "@/components/stat-card";
import { useClassStats } from "@/hooks/use-classes";

export function ClassStats({ schoolId }: { schoolId?: string }) {
  const { data, isLoading } = useClassStats(schoolId);

  return (
    <div className="flex items-center justify-center p-4 w-full">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {(isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <StatCard
                key={idx}
                name="..."
                value="…"
                change="…"
                percentageChange="…"
                changeType="neutral"
                dataKey="..."
                data={[]}
              />
            ))
          : data?.cards?.map((item, idx) => (
              <StatCard key={idx} {...item} />
            )))
        }
      </dl>
    </div>
  );
}
