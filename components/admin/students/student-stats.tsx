"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";
import StatCard, { IStatCardDataItem } from "@/components/stat-card";

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

const studentStats: Array<Omit<IStatCardDataItem, "data">> = [
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
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {studentStats.map((item, idx) => (
          <StatCard key={idx} data={studentMetricsData} {...item} />
        ))}
      </dl>
    </div>
  );
}
