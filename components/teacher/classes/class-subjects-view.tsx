"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Calendar,
  CheckCircle,
  ChevronRight,
  Search,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
  assessmentCount: number;
  // completedAssessments: number
  // averageScore: number
  // lastUpdated: string
}

interface ClassData {
  id: string;
  name: string;
  studentCount: number;
  subjects: Subject[];
}

interface ClassSubjectsViewProps {
  classData: ClassData | null | undefined;
  onSubjectClick: (subjectId: string) => void;
  onBackClick: () => void;
  error?: Error | null;
}

const ITEMS_PER_PAGE = 8;

export function ClassSubjectsView({
  classData,
  onSubjectClick,
  onBackClick,
  error,
}: ClassSubjectsViewProps) {
  // Provide safe defaults and validate classData
  const safeClassData = classData || {
    id: "",
    name: "Unknown Class",
    studentCount: 0,
    subjects: [],
  };

  const { name, studentCount, subjects } = safeClassData;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Ensure subjects is always an array
  const safeSubjects = Array.isArray(subjects) ? subjects : [];

  const filteredSubjects = useMemo(() => {
    if (!Array.isArray(safeSubjects)) return [];
    
    try {
      return safeSubjects.filter((subject) => {
        if (!subject || typeof subject !== "object") return false;
        const subjectName = subject.name;
        if (!subjectName || typeof subjectName !== "string") return false;
        
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        
        return subjectName.toLowerCase().includes(query);
      });
    } catch (err) {
      console.error("Error filtering subjects:", err);
      return [];
    }
  }, [safeSubjects, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE));
  const startIndex = Math.max(0, (currentPage - 1) * ITEMS_PER_PAGE);
  const paginatedSubjects = filteredSubjects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Reset to page 1 if current page is out of bounds or if filtered results become empty
  useEffect(() => {
    if (filteredSubjects.length === 0) {
      setCurrentPage(1);
    } else if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, filteredSubjects.length]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const getCompletionBadge = (completed: number, total: number) => {
    if (!total || total === 0) {
      return {
        variant: "outline" as const,
        text: "No Data",
        color: "bg-gray-100 text-gray-800",
      };
    }
    const percentage = (completed / total) * 100;
    if (percentage === 100)
      return {
        variant: "default" as const,
        text: "Complete",
        color: "bg-green-100 text-green-800",
      };
    if (percentage >= 75)
      return {
        variant: "secondary" as const,
        text: "Almost Done",
        color: "bg-blue-100 text-blue-800",
      };
    if (percentage >= 50)
      return {
        variant: "outline" as const,
        text: "In Progress",
        color: "bg-yellow-100 text-yellow-800",
      };
    return {
      variant: "destructive" as const,
      text: "Behind",
      color: "bg-red-100 text-red-800",
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "N/A";
    }
  };

  // Calculate total assessments safely
  const totalAssessments = useMemo(() => {
    try {
      return safeSubjects.reduce((sum, subject) => {
        const count = subject?.assessmentCount;
        return sum + (typeof count === "number" && !isNaN(count) ? count : 0);
      }, 0);
    } catch (err) {
      console.error("Error calculating total assessments:", err);
      return 0;
    }
  }, [safeSubjects]);

  // Show error state if error prop is provided
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Button>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Class Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error.message || "An error occurred while loading the class information."}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Validate that we have at least basic class data
  // Only show "No Class Data" if classData is explicitly null/undefined
  // (not just missing properties, as we have safe defaults)
  if (!classData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>No Class Data Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unable to load class information. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{name || "Unknown Class"}</h1>
        <p className="text-muted-foreground">
          {studentCount ?? 0} students • {safeSubjects.length} subject
          {safeSubjects.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Class Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assessments
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAssessments}
            </div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">0 % completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Subjects</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results Info */}
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            {filteredSubjects.length} subject
            {filteredSubjects.length !== 1 ? "s" : ""} found
          </div>
        )}

        {/* Subjects List */}
        {filteredSubjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery
              ? "No subjects match your search."
              : "No subjects found."}
          </div>
        ) : (
          <div className="bg-card rounded-lg border">
            {paginatedSubjects.map((subject, index) => {
              // Validate subject data
              if (!subject || typeof subject !== "object") {
                return null;
              }

              const subjectId = subject.id || `subject-${index}`;
              const hasValidId = !!subject.id; // Check if we have a real ID (not a fallback)
              const subjectName = subject.name || "Unnamed Subject";
              const assessmentCount = typeof subject.assessmentCount === "number" 
                ? subject.assessmentCount 
                : 0;

              // const completionBadge = getCompletionBadge(
              //   subject.completedAssessments,
              //   subject.assessmentCount
              // );

              const handleClick = () => {
                // Only allow clicking if we have a valid subject ID
                if (hasValidId && subjectId) {
                  try {
                    onSubjectClick(subjectId);
                  } catch (err) {
                    console.error("Error handling subject click:", err);
                  }
                }
              };

              return (
                <div
                  key={subjectId}
                  className={`flex items-center justify-between p-4 transition-colors ${
                    hasValidId 
                      ? "hover:bg-muted/50 cursor-pointer" 
                      : "opacity-60 cursor-not-allowed"
                  } ${
                    index !== paginatedSubjects.length - 1 ? "border-b" : ""
                  }`}
                  onClick={handleClick}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {subjectName}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {/* {subject.completedAssessments}/ */}
                        {assessmentCount} assessment{assessmentCount !== 1 ? "s" : ""}
                      </span>
                      {/* <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className={cn("font-medium", getScoreColor(subject.averageScore))}>
                          {subject.averageScore.toFixed(1)}% avg
                        </span>
                        <span>
                          Updated {formatDate(subject.lastUpdated)}
                        </span>
                      </div> */}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <Badge className={completionBadge.color}>
                      {completionBadge.text}
                    </Badge> */}
                    View Details{" "}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredSubjects.length)}{" "}
              of {filteredSubjects.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
