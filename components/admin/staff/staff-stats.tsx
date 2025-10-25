"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";

// Sample staff metrics data over time
const staffMetricsData = [
  {
    date: "Week 1",
    "Total Staff": 14,
    "Full-time": 11,
    "Part-time": 3,
    "Attendance Rate": 96,
  },
  {
    date: "Week 2",
    "Total Staff": 14,
    "Full-time": 11,
    "Part-time": 3,
    "Attendance Rate": 97,
  },
  {
    date: "Week 3",
    "Total Staff": 15,
    "Full-time": 12,
    "Part-time": 3,
    "Attendance Rate": 95,
  },
  {
    date: "Week 4",
    "Total Staff": 15,
    "Full-time": 12,
    "Part-time": 3,
    "Attendance Rate": 98,
  },
  {
    date: "Week 5",
    "Total Staff": 15,
    "Full-time": 12,
    "Part-time": 3,
    "Attendance Rate": 97,
  },
  {
    date: "Week 6",
    "Total Staff": 15,
    "Full-time": 12,
    "Part-time": 3,
    "Attendance Rate": 99,
  },
  {
    date: "Week 7",
    "Total Staff": 15,
    "Full-time": 12,
    "Part-time": 3,
    "Attendance Rate": 98,
  },
  {
    date: "Week 8",
    "Total Staff": 15,
    "Full-time": 12,
    "Part-time": 3,
    "Attendance Rate": 98,
  },
];

const staffStats = [
  {
    name: "Total Staff",
    value: "15",
    change: "+1",
    percentageChange: "+7.1%",
    changeType: "positive",
    dataKey: "Total Staff",
  },
  {
    name: "Full-time",
    value: "12",
    change: "+1",
    percentageChange: "+9.1%",
    changeType: "positive",
    dataKey: "Full-time",
  },
  {
    name: "Part-time",
    value: "3",
    change: "0",
    percentageChange: "0%",
    changeType: "neutral",
    dataKey: "Part-time",
  },
  {
    name: "Attendance Rate",
    value: "98%",
    change: "+2%",
    percentageChange: "+2.1%",
    changeType: "positive",
    dataKey: "Attendance Rate",
  },
];

const sanitizeName = (name: string) => {
  return name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "_")
    .toLowerCase();
};

export function StaffStats() {
  return (
    <div className="flex items-center justify-center p-4 w-full">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {staffStats.map((item) => {
          const sanitizedName = sanitizeName(item.name);
          const gradientId = `gradient-${sanitizedName}`;

          const color =
            item.changeType === "positive"
              ? "hsl(142.1 76.2% 36.3%)"
              : item.changeType === "neutral"
              ? "hsl(215 20.2% 65.1%)"
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
                          : item.changeType === "neutral"
                          ? "text-muted-foreground"
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
                          : item.changeType === "neutral"
                          ? "text-muted-foreground"
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
                    <RechartsPrimitive.AreaChart data={staffMetricsData}>
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
