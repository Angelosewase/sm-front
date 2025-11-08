"use client";

import React, {useMemo, useState} from "react";
import { ClassDataTable } from "@/components/head-teacher/classes/class-data-table";
import { ClassStats } from "@/components/head-teacher/classes/class-stats";
import { AddClassDialog } from "@/components/head-teacher/classes/add-class-dialog";
import { useClasses } from "@/features/classes.api";

export default function HeadTeacherClassesPage() {
   const [q, setQ] = useState<string>("");
    const [page, setPage] = useState<number>(1); // 1-based
    const [limit, setLimit] = useState<number>(10);
    const sortBy = "createdAt";
    const order: "asc" | "desc" = "desc";
  
  const { data, isLoading, isError, refetch, isFetching } = useClasses({ q, page, limit, sortBy, order });

  console.log("data is: ", data )

  const classData = useMemo(() => {
    const items = data?.items || [];
    return items.map((s, idx) => ({
      id: (s as any)._id || idx + 1,
      className: (s as any).name ?? "",
      gradeLevel: (s as any).level ?? "",
      teacher: (s as any).formTeacher ?? "",
      status: (s as any).status ?? "Active",
      enrolled: (s as any).enrolled ?? "0",
      capacity: (s as any).capacity ?? "0",
      schedule: (s as any).schedule ?? "",
    }));
  }, [data]);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-3xl font-semibold text-primary">Manage Classes</h2>
        <AddClassDialog />
      </div>
      <ClassStats />
      <ClassDataTable data={classData} />
    </div>
  );
}
