"use client"

import { useState, useMemo } from "react"
import { BookOpen, Users, AlertCircle, ChevronRight, Search, LayoutGrid, TableIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ClassData {
  id: string
  name: string
  subjectCount: number
  studentCount: number
  pendingAssessments: number
}

interface ClassesGridProps {
  classes: ClassData[]
  onClassClick: (classId: string) => void
}

const ITEMS_PER_PAGE = 10

export function ClassesGrid({ classes, onClassClick }: ClassesGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  const filteredClasses = useMemo(() => {
    return classes.filter(classData =>
      classData.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [classes, searchQuery])

  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedClasses = filteredClasses.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const renderGridView = () => (
    <div className="bg-card rounded-lg border">
      {paginatedClasses.map((classData, index) => (
        <div
          key={classData.id}
          className={`flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
            index !== paginatedClasses.length - 1 ? 'border-b' : ''
          }`}
          onClick={() => onClassClick(classData.id)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-foreground">{classData.name}</div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {classData.subjectCount} subject{classData.subjectCount !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {classData.studentCount} student{classData.studentCount !== 1 ? 's' : ''}
                </span>
                {classData.pendingAssessments > 0 && (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <AlertCircle className="h-3 w-3" />
                    {classData.pendingAssessments} pending assessment{classData.pendingAssessments !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View details</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      ))}
    </div>
  )

  const renderTableView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class Name</TableHead>
          <TableHead>Subjects</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Pending Assessments</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedClasses.map((classData) => (
          <TableRow
            key={classData.id}
            className="cursor-pointer"
            onClick={() => onClassClick(classData.id)}
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">{classData.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {classData.subjectCount} subject{classData.subjectCount !== 1 ? 's' : ''}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {classData.studentCount} student{classData.studentCount !== 1 ? 's' : ''}
            </TableCell>
            <TableCell>
              {classData.pendingAssessments > 0 ? (
                <span className="flex items-center gap-1 text-sm text-amber-600 font-medium">
                  <AlertCircle className="h-3 w-3" />
                  {classData.pendingAssessments}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">None</span>
              )}
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" className="h-8 px-3">
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No classes assigned yet</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          You don't have any classes assigned to you. Contact your school administrator to get assigned to classes.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4  mx-auto">
      {/* Search Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="class-search" className="text-sm font-medium text-foreground">
            Search your classes
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
            id="class-search"
            type="search"
            placeholder="Type class name to search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            Found {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''} matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Classes List Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">
          {searchQuery ? 'Search Results' : 'All Your Classes'}
        </h3>
        {filteredClasses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {searchQuery 
                ? `No classes found matching "${searchQuery}". Try a different search term.`
                : 'No classes available.'
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
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredClasses.length)} of {filteredClasses.length} classes
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
  )
}
