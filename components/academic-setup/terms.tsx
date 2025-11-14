"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Clock, Calendar } from "lucide-react";
import { useTermsByAcademicYear } from "@/hooks/use-academic-terms";
import { useOpenAcademicYear } from "@/hooks/use-academic-terms";
import { termsApi, Term } from "@/lib/api/academic-terms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Standard term names based on order (1, 2, 3)
const TERM_NAMES = ["Term 1", "Term 2", "Term 3"];

export function Terms() {
  const queryClient = useQueryClient();
  const { data: openAcademicYear, isLoading: isLoadingOpenYear } = useOpenAcademicYear();
  const { data: terms = [], isLoading: isLoadingTerms } = useTermsByAcademicYear(openAcademicYear?._id);
  const [isOpenTermDialogOpen, setIsOpenTermDialogOpen] = useState(false);
  const [isCloseTermDialogOpen, setIsCloseTermDialogOpen] = useState(false);
  const [termToOpen, setTermToOpen] = useState<{ order: number; name: string } | null>(null);
  const [termToClose, setTermToClose] = useState<{ order: number; name: string } | null>(null);

  // Normalize terms to always show Term 1, Term 2, Term 3
  // Terms should always exist (created when academic year is created)
  const normalizedTerms = useMemo(() => {
    const termMap = new Map(terms.map(term => [term.order, term]));
    return TERM_NAMES.map((name, index) => {
      const order = index + 1;
      const existingTerm = termMap.get(order);
      // Terms should always exist, but handle missing gracefully
      return existingTerm || {
        _id: `placeholder-${order}`,
        academicYear: openAcademicYear?._id || "",
        order,
        isOpen: false,
        isClosed: false,
        startDate: null,
        endDate: null,
      };
    });
  }, [terms, openAcademicYear]);

  const openTermMutation = useMutation({
    mutationFn: ({ academicYearId, order }: { academicYearId: string; order: number }) =>
      termsApi.open(academicYearId, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms"] });
      queryClient.invalidateQueries({ queryKey: ["terms", "academic-year", openAcademicYear?._id] });
      toast.success("Term opened successfully");
      setIsOpenTermDialogOpen(false);
      setTermToOpen(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to open term");
    },
  });

  const closeTermMutation = useMutation({
    mutationFn: ({ academicYearId, order }: { academicYearId: string; order: number }) =>
      termsApi.close(academicYearId, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms"] });
      queryClient.invalidateQueries({ queryKey: ["terms", "academic-year", openAcademicYear?._id] });
      toast.success("Term closed successfully");
      setIsCloseTermDialogOpen(false);
      setTermToClose(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to close term");
    },
  });

  const handleOpenTerm = (order: number, name: string) => {
    if (!openAcademicYear) {
      toast.error("No open academic year found");
      return;
    }
    setTermToOpen({ order, name });
    setIsOpenTermDialogOpen(true);
  };

  const confirmOpenTerm = () => {
    if (termToOpen && openAcademicYear) {
      openTermMutation.mutate({
        academicYearId: openAcademicYear._id,
        order: termToOpen.order,
      });
    }
  };

  const handleCloseTerm = (order: number, name: string) => {
    if (!openAcademicYear) {
      toast.error("No open academic year found");
      return;
    }
    setTermToClose({ order, name });
    setIsCloseTermDialogOpen(true);
  };

  const confirmCloseTerm = () => {
    if (termToClose && openAcademicYear) {
      closeTermMutation.mutate({
        academicYearId: openAcademicYear._id,
        order: termToClose.order,
      });
    }
  };

  // Check if term can be opened (all previous terms must be closed)
  const canOpenTerm = (term: Term | typeof normalizedTerms[0]) => {
    if (!openAcademicYear || term._id.startsWith("placeholder-")) return false;
    if (term.isOpen) return false; // Already open
    if (term.isClosed) return false; // Cannot reopen closed terms
    
    // Check if all previous terms are closed
    for (let i = 1; i < term.order; i++) {
      const prevTerm = terms.find(t => t.order === i);
      if (!prevTerm || !prevTerm.isClosed) {
        return false;
      }
    }
    return true;
  };

  if (isLoadingOpenYear || isLoadingTerms) {
    return (
      <Card className="shadow-none border-none bg-transparent p-0">
        <CardHeader>
          <CardTitle>Term Management</CardTitle>
          <CardDescription>Loading terms...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!openAcademicYear) {
    return (
      <Card className="shadow-none border-none bg-transparent p-0">
        <CardHeader>
          <CardTitle>Term Management</CardTitle>
          <CardDescription>
            No open academic year found. Please open an academic year first.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-none border-none bg-transparent p-0">
        <CardHeader>
          <div className="space-y-1">
            <CardTitle>Term Management</CardTitle>
            <CardDescription>
              Manage academic terms for <strong>{openAcademicYear.label}</strong>
            </CardDescription>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Calendar className="h-4 w-4" />
              <span>Current Academic Year: {openAcademicYear.label}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {normalizedTerms.map((term) => {
              const isPlaceholder = term._id.startsWith("placeholder-");
              const termName = TERM_NAMES[term.order - 1];
              const canOpen = canOpenTerm(term);

              return (
                <div key={term._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{termName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={term.isOpen ? "default" : term.isClosed ? "secondary" : "outline"}>
                          {term.isOpen ? "Open" : term.isClosed ? "Closed" : "Not Started"}
                        </Badge>
                        {term.startDate && (
                          <span className="text-xs text-muted-foreground">
                            Started: {new Date(term.startDate).toLocaleDateString()}
                          </span>
                        )}
                        {term.endDate && (
                          <span className="text-xs text-muted-foreground">
                            Ended: {new Date(term.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {term.isOpen ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCloseTerm(term.order, termName)}
                        disabled={closeTermMutation.isPending || openTermMutation.isPending}
                      >
                        Close Term
                      </Button>
                    ) : term.isClosed ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        title="Closed terms cannot be reopened"
                      >
                        Closed
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleOpenTerm(term.order, termName)}
                        disabled={
                          openTermMutation.isPending || 
                          closeTermMutation.isPending || 
                          isPlaceholder ||
                          !canOpen
                        }
                        title={
                          !canOpen 
                            ? "Previous terms must be opened and closed first" 
                            : "Open term"
                        }
                      >
                        Open Term
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Open Term Confirmation Dialog */}
      <AlertDialog 
        open={isOpenTermDialogOpen} 
        onOpenChange={(open) => {
          setIsOpenTermDialogOpen(open);
          if (!open) {
            setTermToOpen(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Open Term</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to open <strong>{termToOpen?.name}</strong> for the academic year <strong>{openAcademicYear?.label}</strong>? 
              This will make this term open and available for new activities. 
              {terms.some(t => t.isOpen && t.order !== termToOpen?.order) && (
                " Any other currently open term will be closed automatically."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={openTermMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmOpenTerm}
              disabled={openTermMutation.isPending}
            >
              {openTermMutation.isPending ? "Opening..." : "Open Term"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Close Term Confirmation Dialog */}
      <AlertDialog 
        open={isCloseTermDialogOpen} 
        onOpenChange={(open) => {
          setIsCloseTermDialogOpen(open);
          if (!open) {
            setTermToClose(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Term</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close <strong>{termToClose?.name}</strong> for the academic year <strong>{openAcademicYear?.label}</strong>? 
              Once closed, this term cannot be reopened. All term activities will be finalized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={closeTermMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCloseTerm}
              disabled={closeTermMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {closeTermMutation.isPending ? "Closing..." : "Close Term"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
