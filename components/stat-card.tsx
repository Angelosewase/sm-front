"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const sanitizeName = (name: string) => {
  return name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "_")
    .toLowerCase();
};

export type IChangeType = "positive" | "negative" | "neutral";


export interface IStatCardDataItem {
  name: string;
  icon?: React.ReactNode;
  changeType: IChangeType;
  value: number | string;
  change: number | string;
  percentageChange: number | string;
  dataKey: string;
  data: Array<any>;
}

export default function StatCard(item: IStatCardDataItem) {
  const sanitizedName = sanitizeName(item.name);
  const gradientId = `gradient-${sanitizedName}`;
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null);

  const colorSchemes = {
    positive: {
      stroke: "hsl(142.1 76.2% 36.3%)",
      gradient: "hsl(142.1 76.2% 36.3%)",
      bg: "bg-green-50 dark:bg-green-950/20",
      text: "text-green-600 dark:text-green-500",
      border: "border-l-4 border-l-green-200 dark:border-l-green-900",
    },
    negative: {
      stroke: "hsl(0 72.2% 50.6%)",
      gradient: "hsl(0 72.2% 50.6%)",
      bg: "bg-red-50 dark:bg-red-950/20",
      text: "text-red-600 dark:text-red-500",
      border: "border-l-4 border-l-red-200 dark:border-l-red-900",
    },
    neutral: {
      stroke: "hsl(215 20.2% 65.1%)",
      gradient: "hsl(215 20.2% 65.1%)",
      bg: "bg-slate-50 dark:bg-slate-950/20",
      text: "text-slate-600 dark:text-slate-500",
      border: "border-l-4 border-l-slate-200 dark:border-l-slate-900",
    },
  };

  const scheme = colorSchemes[item.changeType];
  const TrendIcon =
    item.changeType === "positive"
      ? TrendingUp
      : item.changeType === "negative"
      ? TrendingDown
      : Minus;

  // Calculate min and max for better chart scaling
  const values = item.data.map((d) => d[item.dataKey]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.1;

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        "border-l-4",
        scheme.border
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-center h-full">
          {/* Left Section - Stats */}
          <div className="flex-1 px-4 py-1">
            <div className="flex items-center gap-2 mb-2">
              {item.icon && (
                <div className={cn("p-1.5 rounded-md", scheme.bg)}>
                  <span className="text-base">{item.icon}</span>
                </div>
              )}
              <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {item.name}
              </dt>
            </div>

            {/* Value Section */}
            <dd className="text-2xl font-bold text-foreground tracking-tight mb-1">
              {hoveredValue ? hoveredValue.toLocaleString() : item.value}
            </dd>

            {/* Change Indicator */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
                  scheme.bg,
                  scheme.text
                )}
              >
                <TrendIcon className="w-3 h-3" />
                <span>{item.change}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {item.percentageChange} MoM
              </span>
            </div>
          </div>

          {/* Right Section - Chart */}
          <div className="w-[45%] h-20 pr-2">
          <ChartContainer
            className="w-full h-full"
            config={{
              [item.dataKey]: {
                label: item.name,
                color: scheme.stroke,
              },
            }}
          >
            <RechartsPrimitive.AreaChart 
              data={item.data}
              onMouseMove={(e) => {
                if (e.activePayload && e.activePayload[0]) {
                  setHoveredValue(e.activePayload[0].value);
                }
              }}
              onMouseLeave={() => setHoveredValue(null)}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={scheme.gradient} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={scheme.gradient} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              
              <RechartsPrimitive.XAxis 
                dataKey="date" 
                hide={true} 
              />
              
              <RechartsPrimitive.YAxis 
                hide={true}
                domain={[minValue - padding, maxValue + padding]}
              />

              <RechartsPrimitive.Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border rounded-lg shadow-lg p-2 text-xs">
                        <p className="font-semibold">{payload[0].payload.date}</p>
                        <p className={scheme.text}>
                          {payload[0].value?.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <RechartsPrimitive.Area
                dataKey={item.dataKey}
                stroke={scheme.stroke}
                fill={`url(#${gradientId})`}
                strokeWidth={2}
                type="monotone"
                animationDuration={300}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: scheme.stroke,
                  strokeWidth: 2,
                  stroke: "hsl(var(--background))",
                }}
              />
            </RechartsPrimitive.AreaChart>
          </ChartContainer>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}

// Demo Component