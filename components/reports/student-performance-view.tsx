"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

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
  const { state } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
  }, [filteredSubjects, currentPage]);

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div
      className={cn(
        "space-y-4 p-4 mx-auto transition-all duration-200 ease-linear",
        state === "expanded" ? "max-w-[1260px]" : "max-w-[calc(100vw-80px)]"
      )}
    >
      {/* Search Bar */}
      <Card className="border-none shadow-none p-0 bg-transparent">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-28 sm:w-32">
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
                <SelectTrigger className="w-28 sm:w-32">
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
            </div>
          </div>

          {/* Performance Table */}
          <div className="w-full">
            <div className="overflow-x-auto overflow-y-hidden border rounded-none">
              <div className="min-w-full">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold sticky left-0 bg-background z-20 border-r min-w-[120px] max-w-[120px] w-[120px]">
                        <div className="truncate">Subject</div>
                      </TableHead>
                      {filteredAssessments.map((assessment) => (
                        <TableHead
                          key={assessment.id}
                          className="text-center min-w-[100px] max-w-[100px] w-[100px] p-2"
                        >
                          <div className="flex flex-col items-center space-y-1">
                            <span
                              className={cn(
                                "px-1 py-0.5 rounded text-[10px] font-medium uppercase truncate max-w-full",
                                getAssessmentTypeBadge(assessment.type)
                              )}
                            >
                              {assessment.type}
                            </span>
                            <span
                              className="text-[10px] font-medium truncate max-w-full"
                              title={assessment.name}
                            >
                              {assessment.name}
                            </span>
                            <span className="text-[9px] text-muted-foreground truncate max-w-full">
                              {new Date(assessment.date).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </span>
                            <span className="text-[9px] text-muted-foreground">
                              {assessment.maxScore}
                            </span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSubjects.map((subjectPerf, index) => (
                      <TableRow key={subjectPerf.subject}>
                        <TableCell
                          className={cn(
                            "font-bold text-center py-3 px-2 sticky left-0 z-10 border-r min-w-[120px] max-w-[120px] w-[120px]",
                            getSubjectColor()
                          )}
                        >
                          <div className="truncate" title={subjectPerf.subject}>
                            {subjectPerf.subject}
                          </div>
                        </TableCell>
                        {filteredAssessments.map((assessment) => {
                          const score = subjectPerf.scores[assessment.id];
                          const percentage =
                            score !== null
                              ? Math.round((score / assessment.maxScore) * 100)
                              : null;

                          return (
                            <TableCell
                              key={assessment.id}
                              className="text-center p-2 min-w-[100px] max-w-[100px] w-[100px]"
                            >
                              {score !== null ? (
                                <div className="flex flex-col items-center space-y-0.5">
                                  <span className="font-bold text-sm">
                                    {score}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {percentage}%
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  -
                                </span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredSubjects.length)}{" "}
                of {filteredSubjects.length} subjects
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
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
                  className="flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <IconChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
