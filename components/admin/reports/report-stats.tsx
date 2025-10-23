"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";
import { 
  IconFileCheck, 
  IconFileX, 
  IconClock, 
  IconFileDescription 
} from "@tabler/icons-react";

// Sample report metrics data over time
const reportMetricsData = [
  { date: "Week 1", Approved: 45, Rejected: 8, Pending: 12, Total: 65 },
  { date: "Week 2", Approved: 52, Rejected: 6, Pending: 15, Total: 73 },
  { date: "Week 3", Approved: 58, Rejected: 7, Pending: 10, Total: 75 },
  { date: "Week 4", Approved: 61, Rejected: 5, Pending: 18, Total: 84 },
  { date: "Week 5", Approved: 67, Rejected: 9, Pending: 14, Total: 90 },
  { date: "Week 6", Approved: 72, Rejected: 6, Pending: 16, Total: 94 },
  { date: "Week 7", Approved: 78, Rejected: 8, Pending: 20, Total: 106 },
];

export interface ReportStatsData {
  approved: number;
  rejected: number;
  pending: number;
  total: number;
}

interface ReportStatsProps {
  data?: ReportStatsData;
}

const sanitizeName = (name: string) => {
  return name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "_")
    .toLowerCase();
};

export function ReportStats({ data }: ReportStatsProps) {
  const statsData = data || {
    approved: 78,
    rejected: 8,
    pending: 20,
    total: 106,
  };

  const reportStats = [
    {
      name: "Total Reports",
      icon: IconFileDescription,
      value: statsData.total.toString(),
      change: "+12",
      percentageChange: "+12%",
      changeType: "positive",
      dataKey: "Total",
      color: "hsl(217.2 91.2% 59.8%)",
    },
    {
      name: "Approved",
      icon: IconFileCheck,
      value: statsData.approved.toString(),
      change: "+6",
      percentageChange: "+8%",
      changeType: "positive",
      dataKey: "Approved",
      color: "hsl(142.1 76.2% 36.3%)",
    },
    {
      name: "Pending",
      icon: IconClock,
      value: statsData.pending.toString(),
      change: "+4",
      percentageChange: "+25%",
      changeType: "neutral",
      dataKey: "Pending",
      color: "hsl(47.9 95.8% 53.1%)",
    },
    {
      name: "Rejected",
      icon: IconFileX,
      value: statsData.rejected.toString(),
      change: "+2",
      percentageChange: "+33%",
      changeType: "negative",
      dataKey: "Rejected",
      color: "hsl(0 72.2% 50.6%)",
    },
  ];

  return (
    <div className="w-full px-4 lg:px-6 py-4">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {reportStats.map((item) => {
          const sanitizedName = sanitizeName(item.name);
          const gradientId = `gradient-${sanitizedName}`;
          const Icon = item.icon;

          return (
            <Card key={item.name} className="p-0">
              <CardContent className="p-4 pb-0 flex h-32">
                <div className="w-[60%] h-full flex flex-col justify-evenly">
                  <dt className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Icon className="h-5 w-5" />
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
                          : item.changeType === "negative"
                          ? "text-red-600 dark:text-red-500"
                          : "text-yellow-600 dark:text-yellow-500"
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
                        color: item.color,
                      },
                    }}
                  >
                    <RechartsPrimitive.AreaChart data={reportMetricsData}>
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
                            stopColor={item.color}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={item.color}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <RechartsPrimitive.XAxis dataKey="date" hide={true} />
                      <RechartsPrimitive.Area
                        dataKey={item.dataKey}
                        stroke={item.color}
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
