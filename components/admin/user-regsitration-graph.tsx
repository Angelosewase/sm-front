"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useMemo, useState } from "react"
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
import { useSchool } from "@/contexts/school-context"
import { registrationMappers, type RegistrationPeriod, useRegistrationAnalytics } from "@/hooks/use-analytics"
import { Skeleton } from "../ui/skeleton"


const chartConfig = {
  students: { label: "Students", color: "var(--chart-1)" },
  teachers: { label: "Teachers", color: "var(--chart-2)" },
  staff: { label: "Staff", color: "var(--chart-3)" },
} satisfies ChartConfig

// ----------------------------------------
// Component
// ----------------------------------------
export function UserRegistrationBarChart() {
  const [period, setPeriod] = useState<RegistrationPeriod>("6m")
  const { school } = useSchool()
  const schoolId = school?.id

  const { data, isLoading } = useRegistrationAnalytics(schoolId)

  const periodLabel = period === "3m" ? "Last 3 months" : period === "6m" ? "Last 6 months" : "Last 12 months"

  const chartData = useMemo(() => {
    if(!data) {
     return 
    }
    const series =  registrationMappers.selectSeriesByPeriod(data, period)
    return registrationMappers.toBarChartData(series)
  }, [data, period])

  const trendLabel = data?.trend?.label ?? "Trending up by 8.7% this period"

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <CardTitle>User Registration Trends</CardTitle>
          <CardDescription>{periodLabel}</CardDescription>
        </div>

        {/* Time Period Filter */}
        <Select value={period} onValueChange={(v) => setPeriod(v as RegistrationPeriod)}>
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

      {isLoading ? (
        <>
          <div className="flex items-center justify-center p-4 w-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
          <div className="px-4">
            <Skeleton className="h-96 w-full" />
          </div>
        </>
      ) : (
        <CardContent className="flex-1 max-h-[250px] p-0">
          <ChartContainer config={chartConfig} className="h-[250px] w-full mb-0 ">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => String(value).slice(0, 3)}
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
      )}


      <CardFooter className="flex-col items-start gap-2 text-sm mt-0 pt-0 ">
        <div className="flex gap-2 leading-none font-medium">
          {trendLabel} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total registered users by month (students, teachers, staff)
        </div>
      </CardFooter>

    </Card>
  )
}
