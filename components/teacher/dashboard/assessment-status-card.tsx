"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface AssessmentStatusCardProps {
  stats?: {
    totalAssessmentsCompleted?: number
    totalAssessmentsActive?: number
    totalAssessmentsPending?: number
  }
}

const statusColors: Record<string, string> = {
  Completed: "hsl(142.1 70.6% 45.3%)",
  Active: "hsl(217.2 91.2% 59.8%)",
  Pending: "hsl(25 95% 53%)",
}

export function AssessmentStatusCard({ stats }: AssessmentStatusCardProps) {
  const data = [
    {
      status: "Completed",
      value: stats?.totalAssessmentsCompleted ?? 0,
    },
    {
      status: "Active",
      value: stats?.totalAssessmentsActive ?? 0,
    },
    {
      status: "Pending",
      value: stats?.totalAssessmentsPending ?? 0,
    },
  ]

  const total = data.reduce((acc, item) => acc + item.value, 0)

  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Assessment Activity</CardTitle>
        <div className="text-sm text-muted-foreground">
          {total.toLocaleString()} total
        </div>
      </CardHeader>

      <CardContent className="px-2 pb-4 sm:px-6">
        <ChartContainer
          config={{
            value: {
              label: "Assessments",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[260px] w-full"
        >
          <BarChart data={data} barSize={48}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis
              dataKey="status"
              axisLine={false}
              tickLine={false}
              tickMargin={12}
            />
            <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-muted-foreground">{name}</span>
                      <span className="font-medium">{Number(value).toLocaleString()}</span>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="value" radius={[12, 12, 0, 0]}>
              {data.map((item) => (
                <Cell key={item.status} fill={statusColors[item.status] ?? "hsl(var(--primary))"} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


