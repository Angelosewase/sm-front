"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";
import { Class } from "@/lib/api/classes";

interface ClassStatsProps {
  data: Class[];
}

const sanitizeName = (name: string) => {
  return name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "_")
    .toLowerCase();
};

export function ClassStats({ data }: ClassStatsProps) {
  // Calculate statistics from real data
  const stats = React.useMemo(() => {
    const totalEnrollment = data.reduce((sum, cls) => sum + cls.studentCount, 0);
    const activeClasses = data.filter(cls => cls.status === "active").length;
    const totalCapacity = data.reduce((sum, cls) => sum + cls.capacity, 0);
    const averageCapacity = data.length > 0 ? Math.round(totalCapacity / data.length) : 0;
    const utilizationRate = totalCapacity > 0 ? Math.round((totalEnrollment / totalCapacity) * 100) : 0;

    return {
      totalEnrollment,
      activeClasses,
      averageCapacity,
      utilizationRate,
    };
  }, [data]);

  // Sample performance data for charts (in a real app, this would come from API)
  const performanceData = React.useMemo(() => {
    return [
      { date: "Week 1", "Total Enrollment": Math.max(0, stats.totalEnrollment - 22), "Active Classes": Math.max(0, stats.activeClasses - 1), "Average Capacity": stats.averageCapacity, "Utilization Rate": Math.max(0, stats.utilizationRate - 7) },
      { date: "Week 2", "Total Enrollment": Math.max(0, stats.totalEnrollment - 19), "Active Classes": Math.max(0, stats.activeClasses - 1), "Average Capacity": stats.averageCapacity, "Utilization Rate": Math.max(0, stats.utilizationRate - 6) },
      { date: "Week 3", "Total Enrollment": Math.max(0, stats.totalEnrollment - 15), "Active Classes": stats.activeClasses, "Average Capacity": stats.averageCapacity, "Utilization Rate": Math.max(0, stats.utilizationRate - 5) },
      { date: "Week 4", "Total Enrollment": Math.max(0, stats.totalEnrollment - 12), "Active Classes": stats.activeClasses, "Average Capacity": stats.averageCapacity, "Utilization Rate": Math.max(0, stats.utilizationRate - 4) },
      { date: "Week 5", "Total Enrollment": Math.max(0, stats.totalEnrollment - 9), "Active Classes": stats.activeClasses, "Average Capacity": stats.averageCapacity, "Utilization Rate": Math.max(0, stats.utilizationRate - 3) },
      { date: "Week 6", "Total Enrollment": Math.max(0, stats.totalEnrollment - 5), "Active Classes": stats.activeClasses, "Average Capacity": stats.averageCapacity, "Utilization Rate": Math.max(0, stats.utilizationRate - 2) },
      { date: "Week 7", "Total Enrollment": Math.max(0, stats.totalEnrollment - 2), "Active Classes": stats.activeClasses, "Average Capacity": stats.averageCapacity, "Utilization Rate": Math.max(0, stats.utilizationRate - 1) },
      { date: "Week 8", "Total Enrollment": stats.totalEnrollment, "Active Classes": stats.activeClasses, "Average Capacity": stats.averageCapacity, "Utilization Rate": stats.utilizationRate },
    ];
  }, [stats]);

  const classStats = [
    {
      name: "Total Enrollment",
      value: stats.totalEnrollment.toString(),
      change: "+22",
      percentageChange: "+9.0%",
      changeType: "positive",
      dataKey: "Total Enrollment",
    },
    {
      name: "Active Classes",
      value: stats.activeClasses.toString(),
      change: "+1",
      percentageChange: "+11.1%",
      changeType: "positive",
      dataKey: "Active Classes",
    },
    {
      name: "Average Capacity",
      value: stats.averageCapacity.toString(),
      change: "+2",
      percentageChange: "+5.0%",
      changeType: "positive",
      dataKey: "Average Capacity",
    },
    {
      name: "Utilization Rate",
      value: `${stats.utilizationRate}%`,
      change: "+7%",
      percentageChange: "+8.0%",
      changeType: stats.utilizationRate >= 80 ? "positive" : "negative",
      dataKey: "Utilization Rate",
    },
  ];
  return (
    <div className="flex items-center justify-center p-4 w-full">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {classStats.map((item) => {
          const sanitizedName = sanitizeName(item.name);
          const gradientId = `gradient-${sanitizedName}`;

          const color =
            item.changeType === "positive"
              ? "hsl(142.1 76.2% 36.3%)"
              : "hsl(0 72.2% 50.6%)";

          return (
            <Card key={item.name} className="p-0">
              <CardContent className="p-4 pb-0 flex h-32">
                <div className="w-[60%] h-full flex flex-col justify-evenly">
                  <dt className="text-sm font-medium text-foreground capitalize">
                    {item.name}
                  </dt>
                  <div className="flex items-baseline justify-between">
                    <dd
                      className={cn(
                        item.changeType === "positive"
                          ? "text-green-600 dark:text-green-500"
                          : "text-red-600 dark:text-red-500",
                        "text-2xl font-semibold"
                      )}
                    >
                      {item.value}
                    </dd>
                  </div>
                  <dd className="flex items-center space-x-1 text-sm">
                    <span className="font-medium text-foreground">
                      {item.change}
                    </span>
                    <span
                      className={cn(
                        item.changeType === "positive"
                          ? "text-green-600 dark:text-green-500"
                          : "text-red-600 dark:text-red-500"
                      )}
                    >
                      ({item.percentageChange})
                    </span>
                  </dd>
                </div>

                <div className="overflow-hidden flex-1 h-full">
                  <ChartContainer
                    className="w-full h-full"
                    config={{
                      [item.dataKey]: {
                        label: item.name,
                        color: color,
                      },
                    }}
                  >
                    <RechartsPrimitive.AreaChart data={performanceData}>
                      <defs>
                        <linearGradient
                          id={gradientId}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={color}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={color}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <RechartsPrimitive.XAxis dataKey="date" hide={true} />
                      <RechartsPrimitive.Area
                        dataKey={item.dataKey}
                        stroke={color}
                        fill={`url(#${gradientId})`}
                        fillOpacity={0.4}
                        strokeWidth={1.5}
                        type="monotone"
                      />
                    </RechartsPrimitive.AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </dl>
    </div>
  );
}
