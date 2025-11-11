"use client";

import React, { useMemo, useState } from "react";
import { SubjectDataTable, AddSubjectDialog } from "@/components/head-teacher/subjects";
import { useSubjects } from "@/hooks/use-subjects";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HeadTeacherSubjects() {
  const [q, setQ] = useState<string>("");
  const [page, setPage] = useState<number>(1); // 1-based
  const [limit, setLimit] = useState<number>(10);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [gradeLevel, setGradeLevel] = useState<string | undefined>(undefined);
  const sortBy = "createdAt";
  const order: "asc" | "desc" = "desc";

  const { data, isLoading, isError, refetch, isFetching } = useSubjects({ q, page, limit, sortBy, order, subjectType: category?.toLowerCase(), gradeLevel: gradeLevel !== '#' ? gradeLevel : undefined });

  const tableData = useMemo(() => {
    const items = data?.items || [];
    return items.map((s, idx) => ({
      id: (s as any)._id || idx + 1,
      subjectName: (s as any).name ?? "",
      subjectCode: (s as any).code ?? "",
      department: (s as any).department ?? "",
      category: (s as any).subjectType ?? "",
      gradeLevel: (s as any).gradeLevels ? (s as any).gradeLevels.join(", ") : "",
      teachers: "0",
      classes: "0",
      students: "0",
      status: (s as any).status ?? "Active",
      subjectType: (s as any).subjectType ?? "",
      creditHours: String((s as any).creditHours ?? ""),
      level: (s as any).level ?? "",
      prerequisites: (s as any).prerequisites ?? "",
    }));
  }, [data]);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="mx-auto py-4 space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Subject Management</h1>
        <p className="text-muted-foreground">Manage subjects, assign them to classes, and track performance</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-2 md:px-4">
        <div className="flex items-center gap-2">
          <Select
            value={gradeLevel ?? ""}
            onValueChange={(v) => {
              setGradeLevel(v || undefined);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="#">Any Grade</SelectItem>
              <SelectItem value="Grade 9">Grade 9</SelectItem>
              <SelectItem value="Grade 10">Grade 10</SelectItem>
              <SelectItem value="Grade 11">Grade 11</SelectItem>
              <SelectItem value="Grade 12">Grade 12</SelectItem>
              <SelectItem value="All Grades">All Grades</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <AddSubjectDialog />
        </div>
      </div>

      {/* Data Table Section */}
      <section className="space-y-4">
        {isError && (
          <div className="text-sm text-red-500">Failed to load subjects.</div>
        )}
        <SubjectDataTable
          data={tableData}
          // Disable internal pagination since we use server-side pagination above
          // @ts-ignore - component supports config prop
          config={{ enablePagination: false }}
          onTabChange={(value) => {
            const map: Record<string, string | undefined> = {
              "all-subjects": undefined,
              core: "Core",
              elective: "Elective",
              optional: "Optional",
            };
            setCategory(map[value]);
            setPage(1);
          }}
        />
        <div className="flex flex-row gap-4 items-center">
          <span className="text-sm text-muted-foreground">Rows per page </span>
          <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || isFetching}>Prev</Button>
            <span className="text-sm">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages || isFetching}>Next</Button>
          </div>
        </div>
        {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
      </section>
    </div>
  );
}
