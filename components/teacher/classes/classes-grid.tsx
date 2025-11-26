"use client"

import { useState, useMemo } from "react"
import { BookOpen, Users, AlertCircle, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground text-lg mb-2">No classes assigned</div>
        <div className="text-muted-foreground text-sm">
          Contact your administrator to get assigned to classes.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search classes..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results Info */}
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''} found
        </div>
      )}

      {/* Classes List */}
      {filteredClasses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery ? 'No classes match your search.' : 'No classes found.'}
        </div>
      ) : (
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {classData.subjectCount} subject{classData.subjectCount !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {classData.studentCount} student{classData.studentCount !== 1 ? 's' : ''}
                    </span>
                    {classData.pendingAssessments > 0 && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <AlertCircle className="h-3 w-3" />
                        {classData.pendingAssessments} pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredClasses.length)} of {filteredClasses.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
