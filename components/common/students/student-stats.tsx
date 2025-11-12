"use client";

import * as React from "react";
import StatCard, { IChangeType } from "@/components/stat-card";
import { useStudents } from "@/hooks/use-students";

interface StudentStatsProps {
  schoolId?: string;
}

const buildTrend = (value: number, key: string) =>
  Array.from({ length: 6 }, (_, index) => ({
    date: `W${index + 1}`,
    [key]: Math.max(value - (5 - index), 0),
  }));

export function StudentStats({ schoolId }: StudentStatsProps) {
  const enabled = Boolean(schoolId);
  const baseOptions = React.useMemo(
    () => ({
      enabled,
      staleTime: 60_000,
    }),
    [enabled]
  );

  const totalQuery = useStudents(
    { schoolId: schoolId ?? undefined, limit: 1, includeTrashed: true },
    baseOptions
  );
  const activeQuery = useStudents(
    { schoolId: schoolId ?? undefined, status: "active", limit: 1 },
    baseOptions
  );
  const suspendedQuery = useStudents(
    { schoolId: schoolId ?? undefined, status: "suspended", limit: 1 },
    baseOptions
  );
  const trashedQuery = useStudents(
    { schoolId: schoolId ?? undefined, onlyTrashed: true, limit: 1 },
    baseOptions
  );

  const total = totalQuery.data?.meta.total ?? 0;
  const active = activeQuery.data?.meta.total ?? 0;
  const suspended = suspendedQuery.data?.meta.total ?? 0;
  const trashed = trashedQuery.data?.meta.total ?? 0;

  const isLoading =
    totalQuery.isLoading ||
    activeQuery.isLoading ||
    suspendedQuery.isLoading ||
    trashedQuery.isLoading;

  const cards = [
    {
      name: "Total Students",
      value: isLoading ? "…" : total.toLocaleString(),
      change: "—",
      percentageChange: "—",
      changeType: "neutral" as const,
      dataKey: "Total",
      data: buildTrend(total, "Total"),
    },
    {
      name: "Active Students",
      value: isLoading ? "…" : active.toLocaleString(),
      change: "—",
      percentageChange: "—",
      changeType: "neutral" as const,
      dataKey: "Active",
      data: buildTrend(active, "Active"),
    },
    {
      name: "Suspended",
      value: isLoading ? "…" : suspended.toLocaleString(),
      change: "—",
      percentageChange: "—",
      changeType: "neutral" as const,
      dataKey: "Suspended",
      data: buildTrend(suspended, "Suspended"),
    },
    {
      name: "In Trash",
      value: isLoading ? "…" : trashed.toLocaleString(),
      change: "—",
      percentageChange: "—",
      changeType: trashed > 0 ? "negative" : "neutral" as IChangeType,
      dataKey: "Trashed",
      data: buildTrend(trashed, "Trashed"),
    },
  ];

  return (
    <div className="flex w-full items-center justify-center p-4">
      <dl className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.name} {...card} />
        ))}
      </dl>
    </div>
  );
}
