import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  dashbaordApi,
  type AdminStatsDto,
  type RegistrationAnalyticsDto,
  type TimeSeriesItem,
  type GenderDistributionItem,
  type SchoolPerformanceAnalyticsDto,
  type HeadTeacherSubjectStatsDto,
  type TeacherStatsDto,
} from "@/lib/api/dashboard";
import type { ReactNode } from "react";

export type ChangeType = "positive" | "negative" | "neutral";

export interface StatCardItemBase {
  name: string;
  icon?: ReactNode;
  changeType: ChangeType;
  value: number | string;
  change: number | string;
  percentageChange: number | string;
  dataKey: string;
}

export interface AdminAnalyticsResult {
  cards: Array<StatCardItemBase>;
  series: AdminStatsDto["series"];
}

function toChangeType(change: string | number): ChangeType {
  const num =
    typeof change === "number"
      ? change
      : Number(String(change).replace(/[^-0-9.]/g, ""));
  if (num > 0) return "positive";
  if (num < 0) return "negative";
  return "neutral";
}

function formatValue(n: number): string {
  try {
    return n.toLocaleString();
  } catch {
    return String(n);
  }
}

function computePercentFromSeries(
  series: AdminStatsDto["series"],
  key: keyof AdminStatsDto["series"][number]
): string | null {
  if (!series || series.length < 2) return null;
  const last = series[series.length - 1][key] as unknown as number;
  const prev = series[series.length - 2][key] as unknown as number;
  if (typeof last !== "number" || typeof prev !== "number") return null;
  if (prev === 0) return null;
  const pct = ((last - prev) / prev) * 100;
  const sign = pct > 0 ? "+" : pct < 0 ? "" : "";
  return `${sign}${pct.toFixed(0)}%`;
}

function withFallbackPercent(
  provided: string | undefined,
  series: AdminStatsDto["series"],
  key: keyof AdminStatsDto["series"][number]
): string {
  if (provided && provided !== "") return provided;
  return computePercentFromSeries(series, key) ?? "0%";
}

function mapAdminStatsToCards(dto: AdminStatsDto): AdminAnalyticsResult {
  const cards: Array<StatCardItemBase> = [
    {
      name: "Total Students",
      icon: "🧍‍♂️",
      value: formatValue(dto.totalStudents),
      change: dto.studentsMoM,
      percentageChange: withFallbackPercent(
        dto.studentsMoMPercent,
        dto.series,
        "Total Students"
      ),
      changeType: toChangeType(dto.studentsMoM),
      dataKey: "Total Students",
    },
    {
      name: "Teachers",
      icon: "🎓",
      value: formatValue(dto.totalTeachers),
      change: dto.teachersMoM,
      percentageChange: withFallbackPercent(
        dto.teachersMoMPercent,
        dto.series,
        "Teachers"
      ),
      changeType: toChangeType(dto.teachersMoM),
      dataKey: "Teachers",
    },
    {
      name: "Classes",
      icon: "🏫",
      value: formatValue(dto.totalClasses),
      change: dto.classesMoM,
      percentageChange: withFallbackPercent(
        dto.classesMoMPercent,
        dto.series,
        "Classes"
      ),
      changeType: toChangeType(dto.classesMoM),
      dataKey: "Classes",
    },
    {
      name: "Staff Members",
      icon: "👨‍🔧",
      value: formatValue(dto.totalStaffMembers),
      change: dto.staffMoM,
      percentageChange: withFallbackPercent(
        dto.staffMoMPercent,
        dto.series,
        "Staff Members"
      ),
      changeType: toChangeType(dto.staffMoM),
      dataKey: "Staff Members",
    },
  ];

  return { cards, series: dto.series };
}

export const adminStatsKeys = {
  all: ["admin-stats"] as const,
  detail: (schoolId?: string) =>
    [...adminStatsKeys.all, schoolId ?? "unknown"] as const,
};

export type AdminStatsKey = ReturnType<typeof adminStatsKeys.detail>;

export function useAdminAnalytics(
  schoolId?: string,
  options?: UseQueryOptions<AdminStatsDto>
) {
  const query = useQuery<AdminStatsDto>({
    queryKey: adminStatsKeys.detail(schoolId),
    queryFn: () => {
      if (!schoolId) throw new Error("schoolId is required");
      return dashbaordApi.fetchAdminStats(schoolId);
    },
    enabled: !!schoolId,
    staleTime: 60_000,
    ...options,
  });

  const mapped: AdminAnalyticsResult | undefined = query.data
    ? mapAdminStatsToCards(query.data)
    : undefined;

  return {
    ...query,
    cards: mapped?.cards,
    series: mapped?.series,
  } as const;
}

export const registrationKeys = {
  all: ["registration-analytics"] as const,
  detail: (schoolId?: string) =>
    [...registrationKeys.all, schoolId ?? "unknown"] as const,
};

export type RegistrationAnalyticsKey = ReturnType<
  typeof registrationKeys.detail
>;

export type RegistrationPeriod = "3m" | "6m" | "12m";

function selectSeriesByPeriod(
  dto: RegistrationAnalyticsDto,
  period: RegistrationPeriod
): TimeSeriesItem[] {
  if (period === "3m") return dto.timeSeries.last3Months;
  if (period === "6m") return dto.timeSeries.last6Months;
  return dto.timeSeries.last12Months;
}

function toBarChartData(items: TimeSeriesItem[]) {
  return items.map((i) => ({
    month: i.month,
    students: i.students,
    teachers: i.teachers,
    staff: i.staff,
  }));
}

function toGenderPieData(items: GenderDistributionItem[]) {
  const colorByGender: Record<string, string> = {
    male: "var(--color-male)",
    female: "var(--color-female)",
    other: "var(--color-other, var(--color-staff))",
  };
  return items.map((g) => ({
    gender: g.gender,
    students: g.count,
    fill: colorByGender[g.gender] ?? "var(--color-students)",
  }));
}

export function useRegistrationAnalytics(
  schoolId?: string,
  options?: UseQueryOptions<RegistrationAnalyticsDto>
) {
  return useQuery<RegistrationAnalyticsDto>({
    queryKey: registrationKeys.detail(schoolId),
    queryFn: () => {
      if (!schoolId) throw new Error("schoolId is required");
      return dashbaordApi.fetchRegistrationAnalytics(schoolId);
    },
    enabled: !!schoolId,
    staleTime: 60_000,
    ...options,
  });
}

export type PerformanceScope = "term" | "year" | "all";

export interface PerformanceQueryParams {
  schoolId?: string;
  classId?: string;
  academicYear?: string;
  termId?: string;
  scope?: PerformanceScope;
}

export const performanceKeys = {
  all: ["performance-analytics"] as const,
  detail: (params: PerformanceQueryParams) =>
    [
      ...performanceKeys.all,
      params.schoolId ?? "unknown-school",
      params.classId ?? "all-classes",
      params.academicYear ?? "all-years",
      params.termId ?? "all-terms",
      params.scope ?? "all",
    ] as const,
};

export type PerformanceAnalyticsKey = ReturnType<typeof performanceKeys.detail>;

export function usePerformanceAnalytics(
  params: PerformanceQueryParams,
  options?: UseQueryOptions<SchoolPerformanceAnalyticsDto>
) {
  const hasSchool = !!params.schoolId;

  return useQuery<SchoolPerformanceAnalyticsDto>({
    queryKey: performanceKeys.detail(params),
    queryFn: () => {
      if (!params.schoolId) {
        throw new Error("schoolId is required to fetch performance analytics");
      }
      return dashbaordApi.fetchPerformanceAnalytics(params);
    },
    enabled: hasSchool,
    staleTime: 60_000,
    ...options,
  });
}

export const headTeacherSubjectStatsKeys = {
  all: ["head-teacher-subject-stats"] as const,
  detail: (schoolId?: string) =>
    [...headTeacherSubjectStatsKeys.all, schoolId ?? "unknown"] as const,
};

export type HeadTeacherSubjectStatsKey = ReturnType<
  typeof headTeacherSubjectStatsKeys.detail
>;

export function useHeadTeacherSubjectStats(
  schoolId?: string,
  options?: UseQueryOptions<HeadTeacherSubjectStatsDto>
) {
  return useQuery<HeadTeacherSubjectStatsDto>({
    queryKey: headTeacherSubjectStatsKeys.detail(schoolId),
    queryFn: () => {
      if (!schoolId) throw new Error("schoolId is required");
      return dashbaordApi.fetchHeadTeacherSubjectStats(schoolId);
    },
    enabled: !!schoolId,
    staleTime: 60_000,
    ...options,
  });
}

export function useTeacherStats(
  schoolId?: string,
  options?: UseQueryOptions<TeacherStatsDto>
) {
  return useQuery<TeacherStatsDto>({
    queryKey: ["teacher-stats", schoolId ?? "unknown"],
    queryFn: () => dashbaordApi.fetchTeacherStats(schoolId),
    enabled: true,
    staleTime: 60_000,
    ...options,
  });
}

export const registrationMappers = {
  selectSeriesByPeriod,
  toBarChartData,
  toGenderPieData,
} as const;
