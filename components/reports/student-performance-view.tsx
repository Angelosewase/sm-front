"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
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
import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";

// Assessment data structure
interface Assessment {
  id: string;
  type: "quiz" | "homework" | "exam" | "project" | "test";
  name: string;
  date: string;
  maxScore: number;
  term: "1" | "2" | "3";
  year: string;
}

// Subject performance data
interface SubjectPerformance {
  subject: string;
  scores: { [assessmentId: string]: number | null }; // null means not taken
}

// Mock assessments data
const assessments: Assessment[] = [
  {
    id: "q1",
    type: "quiz",
    name: "Algebra Quiz",
    date: "2024-10-20",
    maxScore: 100,
    term: "1",
    year: "2024",
  },
  {
    id: "h1",
    type: "homework",
    name: "Chapter 5 HW",
    date: "2024-10-18",
    maxScore: 50,
    term: "1",
    year: "2024",
  },
  {
    id: "e1",
    type: "exam",
    name: "Midterm",
    date: "2024-10-15",
    maxScore: 200,
    term: "1",
    year: "2024",
  },
  {
    id: "q2",
    type: "quiz",
    name: "History Quiz",
    date: "2024-10-12",
    maxScore: 75,
    term: "1",
    year: "2024",
  },
  {
    id: "h2",
    type: "homework",
    name: "Lab Report",
    date: "2024-10-10",
    maxScore: 100,
    term: "1",
    year: "2024",
  },
  {
    id: "e2",
    type: "exam",
    name: "Geography Test",
    date: "2024-10-08",
    maxScore: 150,
    term: "2",
    year: "2024",
  },
  {
    id: "p1",
    type: "project",
    name: "Science Project",
    date: "2024-10-05",
    maxScore: 100,
    term: "2",
    year: "2024",
  },
  {
    id: "t1",
    type: "test",
    name: "Chemistry Test",
    date: "2024-10-03",
    maxScore: 80,
    term: "2",
    year: "2024",
  },
  {
    id: "h3",
    type: "homework",
    name: "Math Problems",
    date: "2024-10-01",
    maxScore: 60,
    term: "2",
    year: "2024",
  },
  {
    id: "q3",
    type: "quiz",
    name: "Biology Quiz",
    date: "2024-09-28",
    maxScore: 90,
    term: "3",
    year: "2024",
  },
  {
    id: "q4",
    type: "quiz",
    name: "Physics Quiz",
    date: "2024-09-25",
    maxScore: 85,
    term: "3",
    year: "2024",
  },
  {
    id: "h4",
    type: "homework",
    name: "English Essay",
    date: "2024-09-20",
    maxScore: 75,
    term: "3",
    year: "2024",
  },
  {
    id: "e3",
    type: "exam",
    name: "Final Exam",
    date: "2024-09-15",
    maxScore: 250,
    term: "3",
    year: "2024",
  },
  {
    id: "p2",
    type: "project",
    name: "Art Project",
    date: "2024-09-10",
    maxScore: 120,
    term: "3",
    year: "2024",
  },
  {
    id: "t2",
    type: "test",
    name: "Math Test",
    date: "2024-09-05",
    maxScore: 95,
    term: "3",
    year: "2024",
  },
  // Previous year data
  {
    id: "q5",
    type: "quiz",
    name: "Literature Quiz",
    date: "2023-12-20",
    maxScore: 100,
    term: "1",
    year: "2023",
  },
  {
    id: "h5",
    type: "homework",
    name: "History Assignment",
    date: "2023-12-15",
    maxScore: 80,
    term: "1",
    year: "2023",
  },
  {
    id: "e4",
    type: "exam",
    name: "Year End Exam",
    date: "2023-12-10",
    maxScore: 300,
    term: "1",
    year: "2023",
  },
];

// Mock student performance data
const subjectPerformances: SubjectPerformance[] = [
  {
    subject: "Mathematics",
    scores: {
      q1: 85,
      h1: 45,
      e1: 175,
      q2: null,
      h2: null,
      e2: null,
      p1: null,
      t1: null,
      h3: 55,
      q3: null,
      q4: 78,
      h4: null,
      e3: 220,
      p2: null,
      t2: 88,
      q5: 92,
      h5: null,
      e4: 275,
    },
  },
  {
    subject: "English",
    scores: {
      q1: null,
      h1: 48,
      e1: 180,
      q2: null,
      h2: 95,
      e2: null,
      p1: null,
      t1: null,
      h3: null,
      q3: null,
      q4: null,
      h4: 68,
      e3: 195,
      p2: null,
      t2: null,
      q5: 88,
      h5: 72,
      e4: 265,
    },
  },
  {
    subject: "Science",
    scores: {
      q1: null,
      h1: null,
      e1: 165,
      q2: null,
      h2: 88,
      e2: null,
      p1: 92,
      t1: 72,
      h3: null,
      q3: 82,
      q4: 75,
      h4: null,
      e3: 205,
      p2: 105,
      t2: 85,
      q5: null,
      h5: null,
      e4: 280,
    },
  },
  {
    subject: "History",
    scores: {
      q1: null,
      h1: null,
      e1: 155,
      q2: 68,
      h2: null,
      e2: 135,
      p1: null,
      t1: null,
      h3: null,
      q3: null,
      q4: null,
      h4: 65,
      e3: 188,
      p2: null,
      t2: null,
      q5: 85,
      h5: 75,
      e4: 245,
    },
  },
  {
    subject: "Geography",
    scores: {
      q1: null,
      h1: null,
      e1: 170,
      q2: null,
      h2: null,
      e2: 128,
      p1: null,
      t1: null,
      h3: null,
      q3: null,
      q4: null,
      h4: null,
      e3: 198,
      p2: null,
      t2: null,
      q5: null,
      h5: null,
      e4: 255,
    },
  },
  {
    subject: "Physics",
    scores: {
      q1: null,
      h1: null,
      e1: 185,
      q2: null,
      h2: 92,
      e2: null,
      p1: 88,
      t1: 75,
      h3: 58,
      q3: null,
      q4: 82,
      h4: null,
      e3: 215,
      p2: 98,
      t2: 90,
      q5: null,
      h5: null,
      e4: 285,
    },
  },
  {
    subject: "Chemistry",
    scores: {
      q1: null,
      h1: null,
      e1: 160,
      q2: null,
      h2: null,
      e2: null,
      p1: 85,
      t1: 68,
      h3: null,
      q3: 78,
      q4: 72,
      h4: null,
      e3: 185,
      p2: 88,
      t2: 78,
      q5: null,
      h5: null,
      e4: 260,
    },
  },
  {
    subject: "Biology",
    scores: {
      q1: null,
      h1: null,
      e1: 172,
      q2: null,
      h2: null,
      e2: null,
      p1: 90,
      t1: null,
      h3: null,
      q3: 85,
      q4: 80,
      h4: null,
      e3: 200,
      p2: 95,
      t2: null,
      q5: null,
      h5: null,
      e4: 270,
    },
  },
];

// Helper function to get subject color
const getSubjectColor = () => {
  return "bg-sidebar";
};

type SubjectStatsEntry = {
  assessment: Assessment;
  score: number | null;
  percentage: number | null;
};

// Helper function to get assessment type badge color
const getAssessmentTypeBadge = (type: string) => {
  switch (type) {
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

export default function StudentPerformanceView() {
  const { open: isSidebarOpen } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeSubject, setActiveSubject] = useState<SubjectPerformance | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"table" | "summary">("table");
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const handleSubjectDialog = (subject: SubjectPerformance | null) => {
    setActiveSubject(subject);
    setIsDialogOpen(!!subject);
  };

  // Filter assessments based on term and year
  const filteredAssessments = useMemo(() => {
    return assessments.filter((assessment) => {
      const termMatch =
        selectedTerm === "all" || assessment.term === selectedTerm;
      const yearMatch =
        selectedYear === "all" || assessment.year === selectedYear;
      return termMatch && yearMatch;
    });
  }, [selectedTerm, selectedYear]);

  // Filter subjects based on search term
  const filteredSubjects = useMemo(() => {
    return subjectPerformances.filter((subject) =>
      subject.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const computeSubjectStats = useCallback(
    (subjectPerf: SubjectPerformance) => {
      const entries: SubjectStatsEntry[] = filteredAssessments.map(
        (assessment) => {
          const rawScore =
            subjectPerf.scores[assessment.id] !== undefined
              ? subjectPerf.scores[assessment.id]
              : null;
          const score = rawScore === null ? null : rawScore;
          const percentage =
            score !== null
              ? Math.round((score / assessment.maxScore) * 100)
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
          if (
            !highest ||
            entry.percentage > (highest.percentage ?? -Infinity)
          ) {
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
    [filteredAssessments]
  );

  const subjectSummaries = useMemo(() => {
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

  // Get unique years and terms for filter options
  const availableYears = useMemo(() => {
    const years = [...new Set(assessments.map((a) => a.year))].sort().reverse();
    return years;
  }, []);

  const availableTerms = useMemo(() => {
    return ["1", "2", "3"];
  }, []);

  // Paginate filtered subjects
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
  }, [filteredAssessments, paginatedSubjects, updateScrollState]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedYear("all");
    setSelectedTerm("all");
    setItemsPerPage(10);
    setCurrentPage(1);
    setActiveTab("table");
  };

  const showingFrom =
    filteredSubjects.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingTo =
    filteredSubjects.length === 0
      ? 0
      : Math.min(currentPage * itemsPerPage, filteredSubjects.length);

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
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-28 rounded border-border/60 bg-background/90 sm:w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger className="w-28 rounded border-border/60 bg-background/90 sm:w-32">
                    <SelectValue placeholder="Term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Terms</SelectItem>
                    {availableTerms.map((term) => (
                      <SelectItem key={term} value={term}>
                        Term {term}
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
              {filteredAssessments.length} assessments
            </Badge>
            {selectedYear !== "all" && (
              <Badge variant="secondary" className="rounded">
                Year: {selectedYear}
              </Badge>
            )}
            {selectedTerm !== "all" && (
              <Badge variant="secondary" className="rounded">
                Term: {selectedTerm}
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
                        {filteredAssessments.map((assessment) => (
                          <TableHead
                            key={assessment.id}
                            className="min-w-[120px] max-w-[120px] border-border/40 p-3 text-center text-xs uppercase tracking-wide text-muted-foreground"
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
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(assessment.date).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                Max {assessment.maxScore}
                              </span>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSubjects.length > 0 ? (
                        paginatedSubjects.map((subjectPerf, index) => {
                          const stats = computeSubjectStats(subjectPerf);
                          return (
                            <TableRow
                              key={subjectPerf.subject}
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
                              {filteredAssessments.map(
                                (assessment, assessmentIndex) => {
                                  const entry = stats.entries[assessmentIndex];
                                  if (!entry) {
                                    return (
                                      <TableCell
                                        key={assessment.id}
                                        className="min-w-[120px] max-w-[120px] p-3 text-center text-sm text-muted-foreground"
                                      >
                                        -
                                      </TableCell>
                                    );
                                  }
                                  return (
                                    <TableCell
                                      key={assessment.id}
                                      className="min-w-[120px] max-w-[120px] p-3 text-center"
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
                                                    : entry.percentage !==
                                                        null &&
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
                                              {assessment.maxScore} (
                                              {entry.percentage}%)
                                            </TooltipContent>
                                          </Tooltip>
                                          <span className="text-[11px] text-muted-foreground">
                                            {entry.percentage}%
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
                                  );
                                }
                              )}
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={filteredAssessments.length + 1}
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
              {subjectSummaries.length > 0 ? (
                <div className="grid gap-3 max-w-7xl mx-auto">
                  {subjectSummaries.map(({ subjectPerf, stats }) => {
                    const highest = stats.highest as SubjectStatsEntry | null;
                    const lowest = stats.lowest as SubjectStatsEntry | null;
                    return (
                      <div
                        key={subjectPerf.subject}
                        className="flex flex-row items-center gap-5 rounded border bg-sidebar/50 px-4 py-3 min-h-0"
                        style={{ minHeight: 0 }}
                      >
                        {/* Main subject info + stats count */}
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
                        {/* Summaries grouped compact, horizontally */}
                        <div className="flex flex-row flex-wrap items-center gap-5">
                          {highest && (
                            <div className="flex flex-col items-center min-w-[6.2rem] text-center">
                              <span className="font-semibold text-xs text-muted-foreground">Best</span>
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
                              <span className="font-semibold text-xs text-muted-foreground">Needs focus</span>
                              <span className="font-bold text-amber-600 text-base leading-tight">
                                {lowest.assessment.name}
                              </span>
                              <span className="font-bold text-amber-600 text-base">
                                {lowest.percentage}%
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col items-center min-w-[6.2rem] text-center">
                            <span className="font-semibold text-xs text-muted-foreground">Outstanding</span>
                            <span className="font-bold text-foreground text-base">
                              {stats.missingCount}
                            </span>
                          </div>
                        </div>
                        {/* Button at the end, fills height */}
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
                      {new Date(entry.assessment.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}{" "}
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
                          {entry.percentage}% achieved
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
