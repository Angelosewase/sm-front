"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Plus, 
  Target, 
  ChevronRight, 
  Search, 
  LayoutGrid, 
  TableIcon,
  AlertCircle,
  Info,
  Calendar,
  Lock,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CreateAssessmentDialog } from "./create-assessment-dialog"
import { EditAssessmentDialog } from "./edit-assessment-dialog"
import { useUpdateAssessment, useDeleteAssessment } from "@/hooks/use-assessments"

interface Assessment {
  id: string
  title: string
  category: string
  date: string
  weight: number
  maxScore: number
  studentsCompleted: number
  averageScore: number
  status: 'pending' | 'in_progress' | 'completed'
}

interface Term {
  id: string
  name: string
  isActive: boolean
}

interface SubjectData {
  id: string
  name: string
  className: string
  studentCount: number
  currentTerm?: string
  terms: Term[]
  assessments: Assessment[]
}

interface AssessementManagementViewProps {
  subjectData: SubjectData
  onAssessmentClick: (assessmentId: string) => void
  onBackClick: () => void
  onTermChange: (termId: string | undefined) => void
  context?: { subjectId: string; classId: string; termId?: string; academicYearId?: string }
}

const ITEMS_PER_PAGE = 10

export function AssessementManagementView({
  subjectData,
  onAssessmentClick,
  onBackClick,
  onTermChange,
  context,
}: AssessementManagementViewProps) {
  const [selectedTerm, setSelectedTerm] = useState(subjectData.currentTerm ?? "all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [disabledTermDialog, setDisabledTermDialog] = useState<{ isOpen: boolean; termName: string }>({ isOpen: false, termName: "" })
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; assessment: Assessment | null }>({ isOpen: false, assessment: null })
  const [editDialog, setEditDialog] = useState<{ isOpen: boolean; assessment: Assessment | null }>({ isOpen: false, assessment: null })

  const { name, className, studentCount, terms, assessments } = subjectData

  // Mutations
  const updateAssessmentMutation = useUpdateAssessment()
  const deleteAssessmentMutation = useDeleteAssessment()

  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment =>
      assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [assessments, searchQuery])

  const totalPages = Math.ceil(filteredAssessments.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedAssessments = filteredAssessments.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const getStatusBadge = (status: Assessment['status']) => {
    switch (status) {
      case 'completed':
        return { variant: "default" as const, text: "Completed", color: "bg-green-100 text-green-800" }
      case 'in_progress':
        return { variant: "secondary" as const, text: "In Progress", color: "bg-blue-100 text-blue-800" }
      case 'pending':
        return { variant: "outline" as const, text: "Pending", color: "bg-gray-100 text-gray-800" }
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'quiz': return "bg-purple-100 text-purple-800"
      case 'homework': return "bg-blue-100 text-blue-800"
      case 'test': return "bg-orange-100 text-orange-800"
      case 'exam': return "bg-red-100 text-red-800"
      case 'classwork': return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleTermSelect = (termOrAll: string) => {
    setSelectedTerm(termOrAll)
    onTermChange(termOrAll === "all" ? undefined : termOrAll)
    setSearchQuery("") // Clear search when changing terms
    setCurrentPage(1) // Reset pagination
  }

  const handleDisabledTermClick = (termName: string) => {
    setDisabledTermDialog({ isOpen: true, termName })
  }

  const handleDeleteClick = (assessment: Assessment, event: React.MouseEvent) => {
    event.stopPropagation()
    setDeleteDialog({ isOpen: true, assessment })
  }

  const handleEditClick = (assessment: Assessment, event: React.MouseEvent) => {
    event.stopPropagation()
    setEditDialog({ isOpen: true, assessment })
  }

  const handleConfirmDelete = () => {
    if (deleteDialog.assessment) {
      deleteAssessmentMutation.mutate(deleteDialog.assessment.id)
      setDeleteDialog({ isOpen: false, assessment: null })
    }
  }

  const handleViewClick = (assessment: Assessment, event: React.MouseEvent) => {
    event.stopPropagation()
    onAssessmentClick(assessment.id)
  }

  const renderGridView = () => (
    <div className="bg-card rounded-lg border">
      {paginatedAssessments.map((assessment, index) => {
        const statusBadge = getStatusBadge(assessment.status)
        const categoryColor = getCategoryColor(assessment.category)

        return (
          <div
            key={assessment.id}
            className={`flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
              index !== paginatedAssessments.length - 1 ? 'border-b' : ''
            }`}
            onClick={() => onAssessmentClick(assessment.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-foreground">{assessment.title}</div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {assessment.weight}% weight
                  </span>
                  <span className="flex items-center gap-1">
                    Max: {assessment.maxScore}
                  </span>
                  <span className="flex items-center gap-1">
                    {assessment.studentsCompleted}/{studentCount} completed
                  </span>
                  {assessment.averageScore > 0 && (
                    <span className="flex items-center gap-1">
                      Avg: {assessment.averageScore}/{assessment.maxScore}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* <Badge className={categoryColor}>
                {assessment.category}
              </Badge>
              <Badge className={statusBadge.color}>
                {statusBadge.text}
              </Badge> */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => handleViewClick(assessment, e)}
                  title="View details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => handleEditClick(assessment, e)}
                  title="Edit assessment"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => handleDeleteClick(assessment, e)}
                  title="Delete assessment"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );

  const renderTableView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Assessment Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Max Score</TableHead>
          <TableHead>Completion</TableHead>
          <TableHead>Average Score</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedAssessments.map((assessment) => {
          const statusBadge = getStatusBadge(assessment.status)
          const categoryColor = getCategoryColor(assessment.category)

          return (
            <TableRow
              key={assessment.id}
              className="cursor-pointer"
              onClick={() => onAssessmentClick(assessment.id)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{assessment.title}</span>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(assessment.date)}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={categoryColor}>
                  {assessment.category}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {assessment.weight}%
              </TableCell>
              <TableCell className="text-muted-foreground">
                {assessment.maxScore}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {assessment.studentsCompleted}/{studentCount}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {assessment.averageScore > 0 
                  ? `${assessment.averageScore}/${assessment.maxScore}`
                  : 'N/A'
                }
              </TableCell>
              <TableCell>
                <Badge className={statusBadge.color}>
                  {statusBadge.text}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3"
                    onClick={(e) => handleViewClick(assessment, e)}
                    title="View details"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3"
                    onClick={(e) => handleEditClick(assessment, e)}
                    title="Edit assessment"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleDeleteClick(assessment, e)}
                    title="Delete assessment"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );

  const weightCalculations = useMemo(() => {
    const totalWeight = assessments.reduce((sum, assessment) => sum + assessment.weight, 0)
    const remainingWeight = Math.max(0, 100 - totalWeight)
    const completedAssessments = assessments.filter(a => a.status === 'completed').length
    const averageScore = assessments.length > 0
      ? assessments.reduce((sum, a) => sum + (a.averageScore / a.maxScore) * 100, 0) / assessments.length
      : 0
    
    return { totalWeight, remainingWeight, completedAssessments, averageScore }
  }, [assessments])

  const { totalWeight, remainingWeight, completedAssessments, averageScore } = weightCalculations

  // Only allow creating assessments in an open term
  const selectedTermObj = terms.find(t => t.id === selectedTerm)
  const canCreateAssessment = useMemo(() => {
    return selectedTerm !== "all" && !!selectedTermObj?.isActive && remainingWeight > 0
  }, [selectedTerm, selectedTermObj, remainingWeight])

  if (assessments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Target className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No assessments yet</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Create your first assessment to start recording marks and tracking student progress.
        </p>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          disabled={!canCreateAssessment}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Assessment
        </Button>
        {!canCreateAssessment && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg max-w-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                {selectedTerm === "all" || !selectedTermObj?.isActive
                  ? "Select an open term to create assessments."
                  : "Total assessment weight has reached 100%. You cannot add more assessments."}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 mx-auto">
      {/* Term Selector and Controls */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Select Term
            </label>
            <ToggleGroup
              type="single"
              value={selectedTerm}
              onValueChange={handleTermSelect}
              variant="outline"
              className="flex-wrap"
            >
              <ToggleGroupItem value="all" aria-label="All terms" className="px-4 py-2">
                All Terms
              </ToggleGroupItem>
              {terms.map((term) => (
                <ToggleGroupItem 
                  key={term.id} 
                  value={term.id}
                  disabled={!term.isActive}
                  aria-label={`${term.name} ${term.isActive ? '(active)' : '(closed)'}`}
                  title={term.isActive ? term.name : `${term.name} - This term is closed and cannot be selected`}
                  className={cn(
                    "relative px-4 py-2",
                    !term.isActive && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => !term.isActive && handleDisabledTermClick(term.name)}
                >
                  <div className="flex items-center gap-2">
                    {term.name}
                    {term.isActive && (
                      <Badge variant="default" className="text-xs px-1 py-0 bg-green-500">
                        Active
                      </Badge>
                    )}
                    {!term.isActive && (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            disabled={!canCreateAssessment}
            size="sm"
            title={
              !canCreateAssessment
                ? selectedTerm === "all" || !selectedTermObj?.isActive
                  ? "Select an active term to create assessments"
                  : "Total assessment weight has reached 100%"
                : undefined
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>

        {/* Term Selection Info */}
        <div className="text-sm text-muted-foreground">
          {selectedTerm === "all" 
            ? "Showing assessments from all terms. Select a specific term to filter by term."
            : selectedTermObj?.isActive
              ? `Showing assessments for ${selectedTermObj.name}. This term is active for creating assessments.`
              : `Showing assessments for ${selectedTermObj?.name || 'selected term'}. This term is closed.`
          }
        </div>
      </div>

      {/* Create Assessment Restrictions Info */}
      {!canCreateAssessment && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              {selectedTerm === "all" || !selectedTermObj?.isActive
                ? "You can only create assessments in an active term. Please select an active term (highlighted with 'Active' badge) from the term selector above."
                : `Total assessment weight has reached 100% (${totalWeight}%). You cannot add more assessments until you reduce the weight of existing assessments.`}
            </div>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="assessment-search" className="text-sm font-medium text-foreground">
            Search assessments
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
            id="assessment-search"
            type="search"
            placeholder="Type assessment name or category to search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            Found {filteredAssessments.length} assessment{filteredAssessments.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Assessments List Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">
          {searchQuery ? 'Search Results' : 'All Assessments'}
        </h3>
        {filteredAssessments.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {searchQuery 
                ? `No assessments found matching "${searchQuery}". Try a different search term.`
                : 'No assessments available.'
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
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredAssessments.length)} of {filteredAssessments.length} assessments
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

      <CreateAssessmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        subjectId={context?.subjectId ?? subjectData.id}
        classId={context?.classId ?? ''}
        termId={selectedTerm !== "all" ? selectedTerm : undefined}
        academicYearId={context?.academicYearId}
        remainingWeight={remainingWeight}
        onAssessmentCreated={() => {
          setIsCreateDialogOpen(false)
        }}
      />

      {/* Disabled Term Dialog */}
      <Dialog open={disabledTermDialog.isOpen} onOpenChange={(open) => setDisabledTermDialog({ ...disabledTermDialog, isOpen: open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-600" />
              Term Not Available
            </DialogTitle>
            <DialogDescription>
              The term <span className="font-semibold">{disabledTermDialog.termName}</span> is currently closed and not available for new assessments.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-amber-800">Why can't I select this term?</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• This term is no longer active for assessment creation</li>
                    <li>• Only active terms (marked with "Active" badge) can be selected</li>
                    <li>• You can still view assessments from this term in "All Terms" view</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">What can I do?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Select an active term from the toggle group above</li>
                <li>• Choose "All Terms" to view assessments from all terms</li>
                <li>• Contact your administrator if you believe this term should be active</li>
              </ul>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setDisabledTermDialog({ isOpen: false, termName: "" })}>
                I Understand
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, isOpen: open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Assessment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this assessment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteDialog.assessment && (
            <div className="space-y-4">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Assessment to be deleted:</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Title:</strong> {deleteDialog.assessment.title}</p>
                    <p><strong>Category:</strong> {deleteDialog.assessment.category}</p>
                    <p><strong>Weight:</strong> {deleteDialog.assessment.weight}%</p>
                    <p><strong>Max Score:</strong> {deleteDialog.assessment.maxScore}</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>Warning:</strong> Deleting this assessment will permanently remove all associated data including student marks and performance records.
                  </div>
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialog({ isOpen: false, assessment: null })}
                  disabled={deleteAssessmentMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={deleteAssessmentMutation.isPending}
                >
                  {deleteAssessmentMutation.isPending ? "Deleting..." : "Delete Permanently"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Assessment Dialog */}
      <EditAssessmentDialog
        open={editDialog.isOpen}
        onOpenChange={(open) => setEditDialog({ ...editDialog, isOpen: open })}
        assessment={editDialog.assessment}
        onAssessmentUpdated={() => {
          setEditDialog({ isOpen: false, assessment: null })
        }}
      />
    </div>
  )
}
