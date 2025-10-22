"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";

// Sample teacher performance data over time
const performanceData = [
  { date: "Week 1", "Total Teachers": 9, "Active Teachers": 8, "Avg Student Load": 78, "Teacher Satisfaction": 85 },
  { date: "Week 2", "Total Teachers": 9, "Active Teachers": 9, "Avg Student Load": 80, "Teacher Satisfaction": 86 },
  { date: "Week 3", "Total Teachers": 10, "Active Teachers": 9, "Avg Student Load": 82, "Teacher Satisfaction": 87 },
  { date: "Week 4", "Total Teachers": 10, "Active Teachers": 9, "Avg Student Load": 81, "Teacher Satisfaction": 88 },
  { date: "Week 5", "Total Teachers": 10, "Active Teachers": 10, "Avg Student Load": 80, "Teacher Satisfaction": 89 },
  { date: "Week 6", "Total Teachers": 10, "Active Teachers": 10, "Avg Student Load": 79, "Teacher Satisfaction": 90 },
  { date: "Week 7", "Total Teachers": 10, "Active Teachers": 9, "Avg Student Load": 80, "Teacher Satisfaction": 91 },
  { date: "Week 8", "Total Teachers": 10, "Active Teachers": 9, "Avg Student Load": 80, "Teacher Satisfaction": 92 },
];

const teacherStats = [
  {
    name: "Total Teachers",
    value: "10",
    change: "+1",
    percentageChange: "+11.1%",
    changeType: "positive",
    dataKey: "Total Teachers",
  },
  {
    name: "Active Teachers",
    value: "9",
    change: "+1",
    percentageChange: "+12.5%",
    changeType: "positive",
    dataKey: "Active Teachers",
  },
  {
    name: "Avg Student Load",
    value: "80",
    change: "+2",
    percentageChange: "+2.6%",
    changeType: "positive",
    dataKey: "Avg Student Load",
  },
  {
    name: "Teacher Satisfaction",
    value: "92%",
    change: "+7%",
    percentageChange: "+8.2%",
    changeType: "positive",
    dataKey: "Teacher Satisfaction",
  },
];

const sanitizeName = (name: string) => {
  return name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "_")
    .toLowerCase();
};

export function TeacherStats() {
  return (
    <div className="flex items-center justify-center p-4 w-full">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {teacherStats.map((item) => {
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
                  <dt className="text-sm font-medium text-foreground">
                    {item.name}
                  </dt>
                  <div className="flex items-baseline justify-between">
                    <dd
                      className={cn(
                        item.changeType === "positive"
                          ? "text-green-600 dark:text-green-500"
                          : "text-red-600 dark:text-red-500",
                        "text-lg font-semibold"
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
