"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";

// Sample student metrics data over time
const studentMetricsData = [
  {
    date: "Week 1",
    "Total Students": 18,
    "Active Students": 17,
    "Average Score": 72,
  },
  {
    date: "Week 2",
    "Total Students": 19,
    "Active Students": 18,
    "Average Score": 74,
  },
  {
    date: "Week 3",
    "Total Students": 19,
    "Active Students": 18,
    "Average Score": 76,
  },
  {
    date: "Week 4",
    "Total Students": 20,
    "Active Students": 19,
    "Average Score": 78,
  },
  {
    date: "Week 5",
    "Total Students": 20,
    "Active Students": 19,
    "Average Score": 79,
  },
  {
    date: "Week 6",
    "Total Students": 20,
    "Active Students": 19,
    "Average Score": 80,
  },
  {
    date: "Week 7",
    "Total Students": 20,
    "Active Students": 19,
    "Average Score": 79,
  },
  {
    date: "Week 8",
    "Total Students": 20,
    "Active Students": 19,
    "Average Score": 80,
  },
];

const studentStats = [
  {
    name: "Total Students",
    value: "20",
    change: "+2",
    percentageChange: "+11.1%",
    changeType: "positive",
    dataKey: "Total Students",
  },
  {
    name: "Active Students",
    value: "19",
    change: "+2",
    percentageChange: "+11.8%",
    changeType: "positive",
    dataKey: "Active Students",
  },
  {
    name: "Average Score",
    value: "80%",
    change: "+8%",
    percentageChange: "+11.1%",
    changeType: "positive",
    dataKey: "Average Score",
  },
];

const sanitizeName = (name: string) => {
  return name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "_")
    .toLowerCase();
};

export function StudentStats() {
  return (
    <div className="flex items-center justify-center p-4 w-full">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {studentStats.map((item) => {
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
                    <RechartsPrimitive.AreaChart data={studentMetricsData}>
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
