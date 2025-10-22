"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

// ------------------------------------------------------
// 🧠 Mock Data — Replace this later with real backend API
// ------------------------------------------------------
const chartData = [
  { date: "2024-04-01", classAvg: 72, topAvg: 91 },
  { date: "2024-04-08", classAvg: 75, topAvg: 93 },
  { date: "2024-04-15", classAvg: 78, topAvg: 94 },
  { date: "2024-04-22", classAvg: 74, topAvg: 90 },
  { date: "2024-04-29", classAvg: 80, topAvg: 95 },
  { date: "2024-05-06", classAvg: 77, topAvg: 92 },
  { date: "2024-05-13", classAvg: 82, topAvg: 94 },
  { date: "2024-05-20", classAvg: 79, topAvg: 92 },
  { date: "2024-05-27", classAvg: 84, topAvg: 96 },
  { date: "2024-06-03", classAvg: 81, topAvg: 93 },
  { date: "2024-06-10", classAvg: 86, topAvg: 97 },
  { date: "2024-06-17", classAvg: 83, topAvg: 95 },
  { date: "2024-06-24", classAvg: 88, topAvg: 98 },
]

const chartConfig = {
  classAvg: {
    label: "Class Average (%)",
    color: "var(--chart-1)",
  },
  topAvg: {
    label: "Top Performers (%)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// ------------------------------------------------------
// ⚙️ Component
// ------------------------------------------------------
export function StudentPerformanceChart() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) setTimeRange("30d")
  }, [isMobile])

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return chartData.filter((item) => new Date(item.date) >= startDate)
  }, [timeRange])

  return (
    <Card className="@container/card h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Student Performance Trend</CardTitle>
        <CardDescription>
          Academic performance (marks in %) over selected period
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 @[767px]/card:hidden" size="sm">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4 flex-1">
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <LineChart data={filteredData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
              }
            />
            <Line
              type="step"
              dataKey="classAvg"
              stroke="var(--color-classAvg)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="step"
              dataKey="topAvg"
              stroke="var(--color-topAvg)"
              strokeWidth={2}
              strokeDasharray="4 2"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
