"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";

// Sample academic performance data over time
const performanceData = [
  { date: "Week 1", "Total Enrollment": 245, "Active Classes": 9, "average score": 80, "Pass Rate": 87 },
  { date: "Week 2", "Total Enrollment": 248, "Active Classes": 9, "average score": 50, "Pass Rate": 88 },
  { date: "Week 3", "Total Enrollment": 252, "Active Classes": 10, "average score": 60, "Pass Rate": 89 },
  { date: "Week 4", "Total Enrollment": 255, "Active Classes": 10, "average score": 40, "Pass Rate": 90 },
  { date: "Week 5", "Total Enrollment": 258, "Active Classes": 10, "average score": 70, "Pass Rate": 91 },
  { date: "Week 6", "Total Enrollment": 262, "Active Classes": 10, "average score": 60, "Pass Rate": 92 },
  { date: "Week 7", "Total Enrollment": 265, "Active Classes": 10, "average score": 50, "Pass Rate": 93 },
  { date: "Week 8", "Total Enrollment": 267, "Active Classes": 10, "average score": 40, "Pass Rate": 94 },
];

const classStats = [
  {
    name: "Total Enrollment",
    value: "267",
    change: "+22",
    percentageChange: "+9.0%",
    changeType: "positive",
    dataKey: "Total Enrollment",
  },
  {
    name: "Active Classes",
    value: "10",
    change: "+1",
    percentageChange: "+11.1%",
    changeType: "positive",
    dataKey: "Active Classes",
  },
  {
    name: "average score",
    value: "40",
    change: "+0.7",
    percentageChange: "+21.9%",
    changeType: "negative",
    dataKey: "average score",
  },
  {
    name: "Pass Rate",
    value: "94%",
    change: "+7%",
    percentageChange: "+8.0%",
    changeType: "positive",
    dataKey: "Pass Rate",
  },
];

const sanitizeName = (name: string) => {
  return name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "_")
    .toLowerCase();
};

export function ClassStats() {
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
