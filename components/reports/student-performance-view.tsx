"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconInfoCircle,
  IconAdjustmentsHorizontal,
  IconArrowBarToLeft,
  IconArrowBarToRight,
  IconTable,
  IconCards,
} from "@tabler/icons-react";
import {
  studentPerformanceApi,
  type SubjectAssessmentPerformance,
  type StudentAssessmentRecord,
} from "@/lib/api/student-performance";
import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";

type StudentPerformanceViewProps = {
  studentId: string;
};

type AssessmentColumn = {
  id: string;
  name: string;
  type: string;
  maxScore: number;
  deadline: string | null;
  term: string | null;
  academicYear: string | null;
};

type SubjectStatsEntry = {
  assessment: AssessmentColumn;
  score: number | null;
  percentage: number | null;
};

type SubjectStats = {
  entries: SubjectStatsEntry[];
  average: number | null;
  completedCount: number;
  totalCount: number;
  highest: SubjectStatsEntry | null;
  lowest: SubjectStatsEntry | null;
  missingCount: number;
};

const ALL_FILTER = "all";

const getSubjectColor = () => "bg-sidebar";

const getAssessmentTypeBadge = (type: string) => {
  const normalized = type?.toLowerCase?.();
  switch (normalized) {
    case "quiz":
      return "bg-blue-500 text-white";
    case "homework":
      return "bg-green-500 text-white";
    case "exam":
      return "bg-red-500 text-white";
    case "project":
      return "bg-purple-500 text-white";
    case "test":
      return "bg-orange-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getLocalizedDate = (
  value?: string | null,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleDateString("en-US", options);
};

const formatTermLabel = (term?: string | null) => {
  if (!term) {
    return "Unknown";
  }
  const trimmed = term.trim();
  if (!trimmed) {
    return "Unknown";
  }
  if (/^\d+$/.test(trimmed)) {
    return `Term ${trimmed}`;
  }
  return trimmed;
};

export default function StudentPerformanceView({
  studentId,
}: StudentPerformanceViewProps) {
  const { open: isSidebarOpen } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<string>(ALL_FILTER);
  const [selectedYear, setSelectedYear] = useState<string>(ALL_FILTER);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeSubject, setActiveSubject] =
    useState<SubjectAssessmentPerformance | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"table" | "summary">("table");
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const activeTerm = selectedTerm !== ALL_FILTER ? selectedTerm : undefined;
  const activeYear = selectedYear !== ALL_FILTER ? selectedYear : undefined;

  const {
    data: assessmentsData = [],
    isLoading: isAssessmentsLoading,
    isError: isAssessmentsError,
  } = useQuery({
    queryKey: [
      "student-assessments",
      studentId,
      activeTerm ?? ALL_FILTER,
      activeYear ?? ALL_FILTER,
    ],
    queryFn: () =>
      studentPerformanceApi.getStudentAssessments(studentId, {
        term: activeTerm,
        year: activeYear,
      }),
    enabled: Boolean(studentId),
  });

  const {
    data: subjectPerformancesData = [],
    isLoading: isSubjectPerformanceLoading,
    isError: isSubjectPerformanceError,
  } = useQuery({
    queryKey: [
      "student-subject-performance",
      studentId,
      activeTerm ?? ALL_FILTER,
      activeYear ?? ALL_FILTER,
    ],
    queryFn: () =>
      studentPerformanceApi.getSubjectAssessmentPerformances(studentId, {
        term: activeTerm,
        year: activeYear,
      }),
    enabled: Boolean(studentId),
  });

  const assessmentColumns = useMemo<AssessmentColumn[]>(() => {
    const unique = new Map<string, AssessmentColumn>();
    assessmentsData.forEach((assessment: StudentAssessmentRecord) => {
      const maxScore =
        typeof assessment.maxScore === "number" &&
        !Number.isNaN(assessment.maxScore)
          ? assessment.maxScore
          : 100;
      unique.set(assessment.assessmentId, {
        id: assessment.assessmentId,
        name: assessment.assessmentTitle,
        type: assessment.assessmentType,
        maxScore,
        deadline: assessment.deadline ?? null,
        term: assessment.term ?? null,
        academicYear: assessment.academicYear ?? null,
      });
    });
    return Array.from(unique.values());
  }, [assessmentsData]);

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    assessmentsData.forEach((assessment) => {
      if (assessment.academicYear) {
        years.add(assessment.academicYear);
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [assessmentsData]);

  const availableTerms = useMemo(() => {
    const terms = new Set<string>();
    assessmentsData.forEach((assessment) => {
      if (assessment.term) {
        terms.add(assessment.term);
      }
    });
    return Array.from(terms).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
  }, [assessmentsData]);

  useEffect(() => {
    if (
      selectedYear !== ALL_FILTER &&
      availableYears.length > 0 &&
      !availableYears.includes(selectedYear)
    ) {
      setSelectedYear(ALL_FILTER);
    }
  }, [availableYears, selectedYear]);

  useEffect(() => {
    if (
      selectedTerm !== ALL_FILTER &&
      availableTerms.length > 0 &&
      !availableTerms.includes(selectedTerm)
    ) {
      setSelectedTerm(ALL_FILTER);
    }
  }, [availableTerms, selectedTerm]);

  const subjectPerformances = subjectPerformancesData;

  const filteredSubjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return subjectPerformances;
    }
    return subjectPerformances.filter((subject) =>
      (subject.subject ?? "").toLowerCase().includes(normalizedSearch)
    );
  }, [subjectPerformances, searchTerm]);

  const paginatedSubjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSubjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSubjects, currentPage, itemsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubjects.length / itemsPerPage)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const computeSubjectStats = useCallback(
    (subjectPerf: SubjectAssessmentPerformance): SubjectStats => {
      const entries: SubjectStatsEntry[] = assessmentColumns.map(
        (assessment) => {
          const rawScore = subjectPerf.scores?.[assessment.id];
          const score =
            rawScore === null || rawScore === undefined
              ? null
              : Number(rawScore);
          const maxScore = assessment.maxScore;
          const percentage =
            score !== null && maxScore > 0
              ? Math.round((score / maxScore) * 100)
              : null;

          return {
            assessment,
            score,
            percentage,
          };
        }
      );

      let completedCount = 0;
      let totalPercentage = 0;
      let highest: SubjectStatsEntry | null = null;
      let lowest: SubjectStatsEntry | null = null;

      entries.forEach((entry) => {
        if (entry.percentage !== null) {
          completedCount += 1;
          totalPercentage += entry.percentage;
          if (!highest || entry.percentage > (highest.percentage ?? -Infinity)) {
            highest = entry;
          }
          if (!lowest || entry.percentage < (lowest.percentage ?? Infinity)) {
            lowest = entry;
          }
        }
      });

      const average =
        completedCount > 0
          ? Math.round(totalPercentage / completedCount)
          : null;

      return {
        entries,
        average,
        completedCount,
        totalCount: entries.length,
        highest,
        lowest,
        missingCount: entries.filter((entry) => entry.score === null).length,
      };
    },
    [assessmentColumns]
  );

  const subjectSummaries = useMemo<
    { subjectPerf: SubjectAssessmentPerformance; stats: SubjectStats }[]
  >(() => {
    return filteredSubjects.map((subjectPerf) => ({
      subjectPerf,
      stats: computeSubjectStats(subjectPerf),
    }));
  }, [filteredSubjects, computeSubjectStats]);

  const activeSubjectStats = useMemo(() => {
    if (!activeSubject) {
      return null;
    }
    return computeSubjectStats(activeSubject);
  }, [activeSubject, computeSubjectStats]);

  useEffect(() => {
    if (!activeSubject) {
      return;
    }
    const stillExists = subjectPerformances.some(
      (subject) => subject.subject === activeSubject.subject
    );
    if (!stillExists) {
      setActiveSubject(null);
      setIsDialogOpen(false);
    }
  }, [activeSubject, subjectPerformances]);

  const updateScrollState = useCallback(() => {
    const container = tableScrollRef.current;
    if (!container) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    const container = tableScrollRef.current;
    if (!container) {
      return;
    }
    updateScrollState();
    const handleScroll = () => updateScrollState();
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [updateScrollState]);

  useEffect(() => {
    updateScrollState();
  }, [assessmentColumns, paginatedSubjects, updateScrollState]);

  const handleSubjectDialog = (
    subject: SubjectAssessmentPerformance | null
  ) => {
    setActiveSubject(subject);
    setIsDialogOpen(Boolean(subject));
  };

  const handleTermChange = (term: string) => {
    setSelectedTerm(term);
    setCurrentPage(1);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleHorizontalScroll = useCallback(
    (direction: "left" | "right") => {
      const container = tableScrollRef.current;
      if (!container) {
        return;
      }
      const scrollAmount = direction === "left" ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      requestAnimationFrame(updateScrollState);
    },
    [updateScrollState]
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedYear(ALL_FILTER);
    setSelectedTerm(ALL_FILTER);
    setItemsPerPage(10);
    setCurrentPage(1);
    setActiveTab("table");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const showingFrom =
    filteredSubjects.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingTo =
    filteredSubjects.length === 0
      ? 0
      : Math.min(currentPage * itemsPerPage, filteredSubjects.length);

  const isLoading = isAssessmentsLoading || isSubjectPerformanceLoading;
  const isError = isAssessmentsError || isSubjectPerformanceError;

  if (!studentId) {
    return null;
  }

  return (
    <div
      className={cn(
        "mx-auto  transition-all duration-200 ease-linear ",
        isSidebarOpen ? "max-w-[80vw]" : "max-w-[92vw]"
      )}
    >
      <Card className="border-none shadow-none p-0">
        <CardHeader className="space-y-3 border-b border-border/40 pb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                Performance Overview
              </CardTitle>
              <CardDescription className="text-sm">
                Explore student performance by subject, filter assessments, and
                open detailed dialogs for deeper insights.
              </CardDescription>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded">
                  <IconInfoCircle className="h-5 w-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs leading-relaxed">
                Adjust filters to focus on a term or year, navigate horizontally
                with the arrows, and click any subject or summary card to view
                assessment details in a dialog.
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 min-w-[220px]">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded border-border/60 bg-background/90 pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={selectedYear} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-28 rounded border-border/60 bg-background/90 sm:w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_FILTER}>All Years</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedTerm} onValueChange={handleTermChange}>
                  <SelectTrigger className="w-28 rounded border-border/60 bg-background/90 sm:w-32">
                    <SelectValue placeholder="Term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_FILTER}>All Terms</SelectItem>
                    {availableTerms.map((term) => (
                      <SelectItem key={term} value={term}>
                        {formatTermLabel(term)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-28 rounded border-border/60 bg-background/90 sm:w-32">
                    <SelectValue placeholder="Rows" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20].map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value} / page
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="gap-2 rounded border-border/60"
              >
                <IconAdjustmentsHorizontal className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded border-dashed">
              {assessmentColumns.length} assessments
            </Badge>
            {selectedYear !== ALL_FILTER && (
              <Badge variant="secondary" className="rounded">
                Year: {selectedYear}
              </Badge>
            )}
            {selectedTerm !== ALL_FILTER && (
              <Badge variant="secondary" className="rounded">
                Term: {formatTermLabel(selectedTerm)}
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="rounded">
                Search: {searchTerm}
              </Badge>
            )}
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "table" | "summary")
            }
            className="space-y-6"
          >
            <TabsList className="flex p-0 rounded-none">
              <TabsTrigger
                value="table"
                className="rounded data-[state=active]:bg-primary  data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                <IconTable className="h-4 w-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger
                value="summary"
                className="rounded data-[state=active]:bg-primary  data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                <IconCards className="h-4 w-4" />
                Summary Cards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-6">
              <div className="relative">
                <div
                  ref={tableScrollRef}
                  className="overflow-x-auto overflow-y-hidden rounded-2xl border border-border/40 bg-card/80"
                >
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="sticky left-0 w-[140px] max-w-[140px] min-w-[140px] border-r border-border/40 bg-card/90 font-semibold uppercase tracking-wide text-xs">
                          Subject
                        </TableHead>
                        {assessmentColumns.map((assessment) => {
                          const deadlineLabel = getLocalizedDate(
                            assessment.deadline
                          );
                          const deadlineWithYear = getLocalizedDate(
                            assessment.deadline,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          );
                          return (
                            <TableHead
                              key={assessment.id}
                              className="min-w-[140px] max-w-[140px] border-border/40 p-3 text-center text-xs uppercase tracking-wide text-muted-foreground"
                            >
                              <div className="flex flex-col items-center gap-1 text-center">
                                <span
                                  className={cn(
                                    "rounded px-2 py-0.5 text-[10px] font-semibold uppercase",
                                    getAssessmentTypeBadge(assessment.type)
                                  )}
                                >
                                  {assessment.type}
                                </span>
                                <span
                                  className="line-clamp-1 text-[11px] font-medium text-foreground"
                                  title={assessment.name}
                                >
                                  {assessment.name}
                                </span>
                                <div>

                                <span className="text-[10px] text-muted-foreground mr-1">
                                  {deadlineLabel ?? "—"}
                                </span>
                                {assessment.term && (
                                  <span className="text-[10px] text-muted-foreground mr-1">
                                    {formatTermLabel(assessment.term)}
                                  </span>
                                )}
                                {assessment.academicYear && (
                                  <span className="text-[10px] text-muted-foreground">
                                    {assessment.academicYear}
                                  </span>
                                )}
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                  Max {assessment.maxScore}
                                </span>
                                <span className="sr-only">
                                  {deadlineWithYear ?? ""}
                                </span>
                              </div>
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell
                            colSpan={assessmentColumns.length + 1}
                            className="py-10 text-center text-sm text-muted-foreground"
                          >
                            Loading student performance…
                          </TableCell>
                        </TableRow>
                      ) : isError ? (
                        <TableRow>
                          <TableCell
                            colSpan={assessmentColumns.length + 1}
                            className="py-10 text-center text-sm text-muted-foreground"
                          >
                            Unable to load performance data right now.
                          </TableCell>
                        </TableRow>
                      ) : paginatedSubjects.length > 0 ? (
                        paginatedSubjects.map((subjectPerf, index) => {
                          const stats = computeSubjectStats(subjectPerf);
                          return (
                            <TableRow
                              key={`${subjectPerf.subject}-${index}`}
                              onClick={() => handleSubjectDialog(subjectPerf)}
                              className={cn(
                                "cursor-pointer transition-colors hover:bg-muted/50",
                                index % 2 === 0
                                  ? "bg-background/80"
                                  : "bg-muted/20"
                              )}
                            >
                              <TableCell
                                className={cn(
                                  "sticky left-0 w-[140px] max-w-[140px] min-w-[140px] border-r border-border/40 bg-card/90 py-4 text-center font-semibold",
                                  getSubjectColor()
                                )}
                              >
                                <div className="flex flex-col items-center gap-1">
                                  <span
                                    className="line-clamp-1"
                                    title={subjectPerf.subject}
                                  >
                                    {subjectPerf.subject}
                                  </span>
                                  {stats.average !== null && (
                                    <Badge
                                      variant="secondary"
                                      className="rounded px-2 py-0.5 text-[10px]"
                                    >
                                      Avg {stats.average}%
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              {stats.entries.map((entry) => (
                                <TableCell
                                  key={entry.assessment.id}
                                  className="min-w-[140px] max-w-[140px] p-3 text-center"
                                >
                                  {entry.score !== null ? (
                                    <div className="flex flex-col items-center gap-1">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span
                                            className={cn(
                                              "text-sm font-semibold",
                                              entry.percentage !== null &&
                                                entry.percentage >= 85
                                                ? "text-emerald-600"
                                                : entry.percentage !== null &&
                                                    entry.percentage <= 60
                                                ? "text-red-500"
                                                : "text-foreground"
                                            )}
                                          >
                                            {entry.score}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="text-xs">
                                          {entry.score} /{" "}
                                          {entry.assessment.maxScore}
                                          {entry.percentage !== null
                                            ? ` (${entry.percentage}%)`
                                            : ""}
                                        </TooltipContent>
                                      </Tooltip>
                                      <span className="text-[11px] text-muted-foreground">
                                        {entry.percentage !== null
                                          ? `${entry.percentage}%`
                                          : "—"}
                                      </span>
                                    </div>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="rounded px-3 py-0.5 text-[11px]"
                                    >
                                      Not taken
                                    </Badge>
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={assessmentColumns.length + 1}
                            className="py-10 text-center text-sm text-muted-foreground"
                          >
                            No subjects match your current filters or search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {(canScrollLeft || canScrollRight) && (
                  <>
                    {canScrollLeft && (
                      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="pointer-events-auto rounded shadow-md"
                          onClick={() => handleHorizontalScroll("left")}
                        >
                          <IconArrowBarToLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {canScrollRight && (
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="pointer-events-auto rounded shadow-md"
                          onClick={() => handleHorizontalScroll("right")}
                        >
                          <IconArrowBarToRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-col gap-4 border-t border-border/30 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {showingFrom} to {showingTo} of{" "}
                  {filteredSubjects.length} subjects
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded"
                  >
                    <IconChevronLeft className="h-3 w-3" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <span className="text-sm whitespace-nowrap">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 rounded"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <IconChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/40 p-10 text-center text-sm text-muted-foreground">
                  <IconInfoCircle className="h-6 w-6" />
                  <span>Loading summary…</span>
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/40 p-10 text-center text-sm text-muted-foreground">
                  <IconInfoCircle className="h-6 w-6" />
                  <span>Unable to load summary for the selected filters.</span>
                </div>
              ) : subjectSummaries.length > 0 ? (
                <div className="grid gap-3 max-w-7xl mx-auto">
                  {subjectSummaries.map(({ subjectPerf, stats }) => {
                    const highest: SubjectStatsEntry | null = stats.highest;
                    const lowest: SubjectStatsEntry | null = stats.lowest;
                    return (
                      <div
                        key={subjectPerf.subject}
                        className="flex flex-row items-center gap-5 rounded border bg-sidebar/50 px-4 py-3"
                      >
                        <div className="flex-1 min-w-0 flex flex-row items-center gap-6">
                          <div className="flex flex-col justify-center min-w-0">
                            <p className="text-lg font-bold text-foreground truncate">
                              {subjectPerf.subject}
                            </p>
                            <p className="text-base text-muted-foreground truncate">
                              {stats.completedCount} / {stats.totalCount} assessments
                            </p>
                          </div>
                          <Badge
                            variant={
                              stats.average !== null && stats.average >= 85
                                ? "default"
                                : "secondary"
                            }
                            className="rounded px-4 py-1 text-base"
                          >
                            {stats.average !== null
                              ? `${stats.average}% avg`
                              : "Not taken"}
                          </Badge>
                        </div>
                        <div className="flex flex-row flex-wrap items-center gap-5">
                          {highest && (
                            <div className="flex flex-col items-center min-w-[6.2rem] text-center">
                              <span className="font-semibold text-xs text-muted-foreground">
                                Best
                              </span>
                              <span className="font-bold text-emerald-600 text-base leading-tight">
                                {highest.assessment.name}
                              </span>
                              <span className="font-bold text-emerald-600 text-base">
                                {highest.percentage}%
                              </span>
                            </div>
                          )}
                          {lowest && (
                            <div className="flex flex-col items-center min-w-[6.2rem] text-center">
                              <span className="font-semibold text-xs text-muted-foreground">
                                Needs focus
                              </span>
                              <span className="font-bold text-amber-600 text-base leading-tight">
                                {lowest.assessment.name}
                              </span>
                              <span className="font-bold text-amber-600 text-base">
                                {lowest.percentage}%
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col items-center min-w-[6.2rem] text-center">
                            <span className="font-semibold text-xs text-muted-foreground">
                              Missing
                            </span>
                            <span className="font-bold text-foreground text-base">
                              {stats.missingCount}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex flex-col justify-center min-w-fit">
                          <Button
                            variant="ghost"
                            size="lg"
                            className="rounded text-base font-semibold min-h-[2.5rem] px-4 py-1"
                            onClick={() => handleSubjectDialog(subjectPerf)}
                          >
                            View details
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/40 p-10 text-center text-sm text-muted-foreground">
                  <IconInfoCircle className="h-6 w-6" />
                  <span>No subjects available for the current filters.</span>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleSubjectDialog(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl  max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {activeSubject?.subject}
            </DialogTitle>
            <DialogDescription className="text-sm">
              Detailed assessment breakdown for the selected filters.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto pr-1">
            {activeSubjectStats?.entries &&
            activeSubjectStats.entries.length > 0 ? (
              activeSubjectStats.entries.map((entry) => (
                <div
                  key={entry.assessment.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border/40 bg-card/70 p-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={cn(
                          "rounded px-3 py-0.5 text-[11px] uppercase",
                          getAssessmentTypeBadge(entry.assessment.type)
                        )}
                      >
                        {entry.assessment.type}
                      </Badge>
                      <span className="text-sm font-semibold">
                        {entry.assessment.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getLocalizedDate(entry.assessment.deadline, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }) ?? "Date TBC"}{" "}
                      · Max score {entry.assessment.maxScore}
                    </p>
                  </div>
                  <div className="text-right">
                    {entry.score !== null ? (
                      <>
                        <span
                          className={cn(
                            "text-base font-semibold",
                            entry.percentage !== null && entry.percentage >= 85
                              ? "text-emerald-600"
                              : entry.percentage !== null &&
                                entry.percentage <= 60
                              ? "text-red-500"
                              : "text-foreground"
                          )}
                        >
                          {entry.score}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {entry.percentage !== null
                            ? `${entry.percentage}% achieved`
                            : "No percentage available"}
                        </p>
                      </>
                    ) : (
                      <Badge
                        variant="outline"
                        className="rounded px-3 py-0.5 text-[11px]"
                      >
                        Not completed
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No assessments available for this subject with the current
                filters.
              </p>
            )}
          </div>
          <DialogFooter className="flex justify-end">
            <Button
              variant="secondary"
              className="rounded"
              onClick={() => handleSubjectDialog(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
