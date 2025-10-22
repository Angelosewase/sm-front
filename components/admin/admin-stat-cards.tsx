"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";

// Sample admin metrics data over time
const adminMetricsData = [
  { date: "Week 1", "Total Students": 1180, Teachers: 56, Classes: 30, "Staff Members": 15 },
  { date: "Week 2", "Total Students": 1195, Teachers: 57, Classes: 31, "Staff Members": 16 },
  { date: "Week 3", "Total Students": 1210, Teachers: 57, Classes: 31, "Staff Members": 16 },
  { date: "Week 4", "Total Students": 1225, Teachers: 58, Classes: 32, "Staff Members": 17 },
  { date: "Week 5", "Total Students": 1230, Teachers: 58, Classes: 32, "Staff Members": 17 },
  { date: "Week 6", "Total Students": 1240, Teachers: 58, Classes: 32, "Staff Members": 17 },
  { date: "Week 7", "Total Students": 1245, Teachers: 58, Classes: 32, "Staff Members": 17 },
];

const adminStats = [
  {
    name: "Total Students",
    icon: "🧍‍♂️",
    value: "1,245",
    change: "+65",
    percentageChange: "+5%",
    changeType: "positive",
    dataKey: "Total Students",
  },
  {
    name: "Teachers",
    icon: "🎓",
    value: "58",
    change: "-1",
    percentageChange: "-2%",
    changeType: "negative",
    dataKey: "Teachers",
  },
  {
    name: "Classes",
    icon: "🏫",
    value: "32",
    change: "+2",
    percentageChange: "+1%",
    changeType: "positive",
    dataKey: "Classes",
  },
  {
    name: "Staff Members",
    icon: "👨‍🔧",
    value: "17",
    change: "+2",
    percentageChange: "+3%",
    changeType: "positive",
    dataKey: "Staff Members",
  },
];

const sanitizeName = (name: string) => {
  return name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "_")
    .toLowerCase();
};

export function AdminStatCards() {
  return (
    <div className="w-full">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {adminStats.map((item) => {
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
                  <dt className="text-sm font-medium text-foreground flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </dt>
                  <div className="flex items-baseline justify-between">
                    <dd className="text-2xl font-bold text-foreground">
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
                      ({item.percentageChange} MoM)
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
                    <RechartsPrimitive.AreaChart data={adminMetricsData}>
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
