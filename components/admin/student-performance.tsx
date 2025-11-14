"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSchool } from "@/contexts/school-context"
import { useAcademicYears, useActiveAcademicYear, useTerms } from "@/hooks/use-academic-terms"
import { usePerformanceAnalytics, type PerformanceScope } from "@/hooks/use-analytics"
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

const chartConfig = {
  classAvg: {
    label: "Average Score (%)",
    color: "var(--chart-1)",
  },
  topAvg: {
    label: "Top Performer / Best (%)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface ChartPoint {
  label: string
  classAvg: number
  topAvg: number
}

// ------------------------------------------------------
// ⚙️ Component
// ------------------------------------------------------
export function StudentPerformanceChart() {
  const isMobile = useIsMobile()
  const { school } = useSchool()
  const schoolId = school?.id

  const [scope, setScope] = React.useState<PerformanceScope>("term")
  const [selectedAcademicYear, setSelectedAcademicYear] = React.useState<string | undefined>(undefined)
  const [selectedTermId, setSelectedTermId] = React.useState<string | undefined>(undefined)
  const [selectedClassId, setSelectedClassId] = React.useState<string | undefined>(undefined)

  const { data: academicYearsData } = useAcademicYears()
  const { data: activeAcademicYear } = useActiveAcademicYear()
  const { data: termsData } = useTerms()

  React.useEffect(() => {
    if (!selectedAcademicYear && (activeAcademicYear || academicYearsData?.length)) {
      setSelectedAcademicYear((activeAcademicYear ?? academicYearsData?.[0])?.label)
    }
  }, [activeAcademicYear, academicYearsData, selectedAcademicYear])

  const performanceQueryParams = React.useMemo(
    () => ({
      schoolId: schoolId,
      classId: selectedClassId || undefined,
      academicYear: selectedAcademicYear || undefined,
      termId: selectedTermId || undefined,
      scope: scope,
    }),
    [schoolId, selectedClassId, selectedAcademicYear, selectedTermId, scope]
  )

  const { data, isLoading, isError } = usePerformanceAnalytics(performanceQueryParams)

  const chartData: ChartPoint[] = React.useMemo(() => {
    if (!data || !data.academicYears.length) return []

    if (scope === "term") {
      const year = data.academicYears.find((y) => y.academicYear === selectedAcademicYear) ?? data.academicYears[0]
      if (!year || !year.terms.length) return []

      const term = year.terms.find((t) => t.termId === selectedTermId) ?? year.terms[0]
      if (!term) return []

      const classes = selectedClassId
        ? term.classes.filter((c) => c.classId === selectedClassId)
        : term.classes

      return classes.map((c) => ({
        label: c.className,
        classAvg: c.averageScore,
        topAvg: c.topStudent?.average ?? c.averageScore,
      }))
    }

    if (scope === "year") {
      const year = data.academicYears.find((y) => y.academicYear === selectedAcademicYear) ?? data.academicYears[0]
      if (!year) return []

      return year.terms.map((t) => ({
        label: t.termName,
        classAvg: t.overallAverage,
        topAvg: t.overallAverage,
      }))
    }

    return data.academicYears.map((y) => ({
      label: y.academicYear,
      classAvg: y.overallAverage,
      topAvg: y.overallAverage,
    }))
  }, [data, scope, selectedAcademicYear, selectedTermId, selectedClassId])

  const availableYears = academicYearsData ?? []
  const availableTerms = React.useMemo(() => {
    if (!termsData) return []
    return termsData
  }, [termsData])

  const noSchoolSelected = !schoolId

  return (
    <Card className="@container/card h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Student Performance Analytics</CardTitle>
        <CardDescription>
          Academic performance by class, term, and academic year
        </CardDescription>
        <CardAction className="flex flex-col gap-2 items-stretch @[767px]/card:flex-row @[767px]/card:items-center">
          <ToggleGroup
            type="single"
            value={scope}
            onValueChange={(val) => val && setScope(val as PerformanceScope)}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="term">By Class / Term</ToggleGroupItem>
            <ToggleGroupItem value="year">By Term / Year</ToggleGroupItem>
            <ToggleGroupItem value="all">All Years</ToggleGroupItem>
          </ToggleGroup>

          <Select
            value={scope}
            onValueChange={(val) => setScope(val as PerformanceScope)}
          >
            <SelectTrigger className="w-40 @[767px]/card:hidden" size="sm">
              <SelectValue placeholder="Scope" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="term">By Class / Term</SelectItem>
              <SelectItem value="year">By Term / Year</SelectItem>
              <SelectItem value="all">All Years</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedAcademicYear ?? ""}
            onValueChange={(val) => {
              setSelectedAcademicYear(val || undefined)
              setSelectedTermId(undefined)
              setSelectedClassId(undefined)
            }}
          >
            <SelectTrigger className="w-40" size="sm">
              <SelectValue placeholder="Academic year" />
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-64">
              {availableYears.map((y) => (
                <SelectItem key={y._id} value={y.label}>
                  {y.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {scope !== "all" && (
            <Select
              value={selectedTermId ?? ""}
              onValueChange={(val) => {
                setSelectedTermId(val || undefined)
                setSelectedClassId(undefined)
              }}
            >
              <SelectTrigger className="w-32" size="sm">
                <SelectValue placeholder="Term" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-64">
                {availableTerms.map((t) => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4 flex-1 flex flex-col gap-2">
        {noSchoolSelected && (
          <div className="text-sm text-muted-foreground">
            Select a school to view student performance analytics.
          </div>
        )}
        {!noSchoolSelected && isLoading && (
          <div className="text-sm text-muted-foreground">Loading performance data...</div>
        )}
        {!noSchoolSelected && isError && (
          <div className="text-sm text-destructive">Failed to load performance data.</div>
        )}
        {!noSchoolSelected && !isLoading && !isError && chartData.length === 0 && (
          <div className="text-sm text-muted-foreground">No performance data available for the selected filters.</div>
        )}

        {!noSchoolSelected && chartData.length > 0 && (
          <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                type="monotone"
                dataKey="classAvg"
                stroke="var(--color-classAvg)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="topAvg"
                stroke="var(--color-topAvg)"
                strokeWidth={2}
                strokeDasharray="4 2"
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
