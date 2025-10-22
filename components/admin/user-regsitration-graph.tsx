"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// ----------------------------------------
// Chart Data (example — replace with API data later)
// ----------------------------------------
const chartData = [
  { month: "January", students: 186, teachers: 45, staff: 22 },
  { month: "February", students: 305, teachers: 60, staff: 28 },
  { month: "March", students: 237, teachers: 40, staff: 30 },
  { month: "April", students: 290, teachers: 50, staff: 25 },
  { month: "May", students: 320, teachers: 70, staff: 35 },
  { month: "June", students: 280, teachers: 55, staff: 27 },
]

const chartConfig = {
  students: { label: "Students", color: "var(--chart-1)" },
  teachers: { label: "Teachers", color: "var(--chart-2)" },
  staff: { label: "Staff", color: "var(--chart-3)" },
} satisfies ChartConfig

// ----------------------------------------
// Component
// ----------------------------------------
export function UserRegistrationBarChart() {
  const [period, setPeriod] = useState("6m")

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <CardTitle>User Registration Trends</CardTitle>
          <CardDescription>
            {period === "6m" ? "Last 6 months" : period === "12m" ? "Last 12 months" : "Custom period"}
          </CardDescription>
        </div>

        {/* Time Period Filter */}
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="12m">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex-1  max-h-[250px]  p-0">
        <ChartContainer config={chartConfig} className="h-[250px] w-full mb-0 ">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="students" fill="var(--color-students)" radius={4} />
            <Bar dataKey="teachers" fill="var(--color-teachers)" radius={4} />
            <Bar dataKey="staff" fill="var(--color-staff)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm  mt-0 pt-0 ">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 8.7% this period <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total registered users by month (students, teachers, staff)
        </div>
      </CardFooter>
    </Card>
  )
}
