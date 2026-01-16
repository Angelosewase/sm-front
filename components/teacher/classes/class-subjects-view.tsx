"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BookOpen,
  AlertCircle,
  ChevronRight,
  Search,
  LayoutGrid,
  TableIcon,
} from "lucide-react";

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

const ITEMS_PER_PAGE = 10;

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

  const { subjects } = safeClassData;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

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

  const renderGridView = () => (
    <div className="bg-card rounded-lg border">
      {paginatedSubjects.map((subject, index) => {
        const hasValidId = !!subject.id;
        const subjectId = subject.id || `subject-${index}`;
        const subjectName = subject.name || "Unnamed Subject";
        const assessmentCount = typeof subject.assessmentCount === "number" 
          ? subject.assessmentCount 
          : 0;

        const handleClick = () => {
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
            className={`flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
              !hasValidId ? "opacity-60 cursor-not-allowed" : ""
            } ${
              index !== paginatedSubjects.length - 1 ? 'border-b' : ''
            }`}
            onClick={handleClick}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-foreground">{subjectName}</div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {assessmentCount} assessment{assessmentCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View details</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderTableView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject Name</TableHead>
          <TableHead>Assessments</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedSubjects.map((subject) => {
          const hasValidId = !!subject.id;
          const subjectId = subject.id || `subject-${Math.random()}`;
          const subjectName = subject.name || "Unnamed Subject";
          const assessmentCount = typeof subject.assessmentCount === "number" 
            ? subject.assessmentCount 
            : 0;

          const handleClick = () => {
            if (hasValidId && subject.id) {
              try {
                onSubjectClick(subject.id);
              } catch (err) {
                console.error("Error handling subject click:", err);
              }
            }
          };

          return (
            <TableRow
              key={subjectId}
              className={`${hasValidId ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
              onClick={handleClick}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{subjectName}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {assessmentCount} assessment{assessmentCount !== 1 ? 's' : ''}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className="h-8 px-3" disabled={!hasValidId}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  if (safeSubjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No subjects found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          This class doesn't have any subjects assigned yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mx-auto">
      {/* Search Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="subject-search" className="text-sm font-medium text-foreground">
            Search subjects
          </label>
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value: "grid" | "table") => value && setViewMode(value)}
            variant="outline"
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <TableIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="subject-search"
            type="search"
            placeholder="Type subject name to search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            Found {filteredSubjects.length} subject{filteredSubjects.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Subjects List Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">
          {searchQuery ? 'Search Results' : 'All Subjects'}
        </h3>
        {filteredSubjects.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {searchQuery 
                ? `No subjects found matching "${searchQuery}". Try a different search term.`
                : 'No subjects available.'
              }
            </p>
          </div>
        ) : (
          viewMode === "grid" ? renderGridView() : renderTableView()
        )}
      </div>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredSubjects.length)} of {filteredSubjects.length} subjects
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </Button>
            <span className="text-sm px-3 py-1 bg-muted rounded">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
