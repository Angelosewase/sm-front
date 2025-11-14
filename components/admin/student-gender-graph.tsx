"use client";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSchool } from "@/contexts/school-context";
import { registrationMappers, useRegistrationAnalytics } from "@/hooks/use-analytics";

const fallbackChartData = [
  { gender: "male", students: 45, fill: "var(--color-male)" },
  { gender: "female", students: 55, fill: "var(--color-female)" },
];

const chartConfig = {
  students: {
    label: "Students",
  },
  male: {
    label: "Male",
    color: "hsl(221, 83%, 53%)",
  },
  female: {
    label: "Female",
    color: "hsl(340, 82%, 52%)",
  },
} satisfies ChartConfig;

export default function StudentGenderChart() {
  const { school } = useSchool();
  const schoolId = school?.id;
  const { data } = useRegistrationAnalytics(schoolId);

  const chartData = React.useMemo(() => {
    if (!data) return fallbackChartData;
    return registrationMappers.toGenderPieData(data.genderDistribution);
  }, [data]);

  const totalStudents = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + (curr.students || 0), 0);
  }, [chartData]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle>Student Gender Distribution</CardTitle>
        <CardDescription>Current Academic Year</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 ">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="students"
              nameKey="gender"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalStudents.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Students
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
