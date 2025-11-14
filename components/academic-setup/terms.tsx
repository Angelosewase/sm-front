"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Clock, Calendar } from "lucide-react";
import { useTerms } from "@/hooks/use-academic-terms";
import { useActiveAcademicYear } from "@/hooks/use-academic-terms";
import { activateTerm, updateTerm } from "@/lib/api/academic-terms";
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
import { Term } from "@/lib/api/academic-terms";

// Standard term names - always First, Second, Third
const TERM_NAMES = ["First Term", "Second Term", "Third Term"];

export function Terms() {
  const queryClient = useQueryClient();
  const { data: activeAcademicYear, isLoading: isLoadingActiveYear } = useActiveAcademicYear();
  const { data: terms = [], isLoading: isLoadingTerms } = useTerms(activeAcademicYear?._id);
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [termToActivate, setTermToActivate] = useState<{ id: string; name: string } | null>(null);

  // Normalize terms to always show First, Second, Third terms
  // If a term doesn't exist for an order, we'll still show it but disabled
  const normalizedTerms = useMemo(() => {
    const termMap = new Map(terms.map(term => [term.order, term]));
    return TERM_NAMES.map((name, index) => {
      const order = index + 1;
      const existingTerm = termMap.get(order);
      // If term exists, use it; otherwise create a placeholder for display
      return existingTerm || {
        _id: `placeholder-${order}`,
        name,
        order,
        startDate: undefined,
        endDate: undefined,
        isActive: false,
      };
    });
  }, [terms]);

  const activateTermMutation = useMutation({
    mutationFn: activateTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms"] });
      toast.success("Term activated successfully");
      setIsActivateDialogOpen(false);
      setTermToActivate(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to activate term");
    },
  });

  const closeTermMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => updateTerm(id, { isActive: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms"] });
      toast.success("Term closed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to close term");
    },
  });

  const handleActivateTerm = (term: Term) => {
    setTermToActivate({ id: term._id, name: term.name });
    setIsActivateDialogOpen(true);
  };

  const confirmActivateTerm = () => {
    if (termToActivate) {
      activateTermMutation.mutate(termToActivate.id);
    }
  };

  const handleCloseTerm = (term: Term) => {
    closeTermMutation.mutate({ id: term._id });
  };

  // Check if term is active
  const isTermActive = (term: Term) => {
    if (term._id.startsWith("placeholder-")) return false;
    const existingTerm = terms.find(t => t._id === term._id);
    return existingTerm?.isActive === true;
  };

  if (isLoadingActiveYear || isLoadingTerms) {
    return (
      <Card className="shadow-none border-none bg-transparent p-0">
        <CardHeader>
          <CardTitle>Term Management</CardTitle>
          <CardDescription>Loading terms...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!activeAcademicYear) {
    return (
      <Card className="shadow-none border-none bg-transparent p-0">
        <CardHeader>
          <CardTitle>Term Management</CardTitle>
          <CardDescription>
            No active academic year found. Please activate an academic year first.
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
              Manage academic terms for <strong>{activeAcademicYear.label}</strong>
            </CardDescription>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Calendar className="h-4 w-4" />
              <span>Current Academic Year: {activeAcademicYear.label}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {normalizedTerms.map((term) => {
              const isActive = isTermActive(term);
              const isPlaceholder = term._id.startsWith("placeholder-");
              const existingTerm = terms.find(t => t._id === term._id);

              return (
                <div key={term._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{term.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {isPlaceholder ? "Not yet created" : "Academic Term"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {isActive ? "Open" : "Closed"}
                    </Badge>
                    {isActive ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCloseTerm(existingTerm || term)}
                        disabled={closeTermMutation.isPending || activateTermMutation.isPending}
                      >
                        Close Term
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          if (existingTerm) {
                            handleActivateTerm(existingTerm);
                          } else {
                            toast.error("Term not found. Please ensure terms are created for this academic year.");
                          }
                        }}
                        disabled={activateTermMutation.isPending || closeTermMutation.isPending || isPlaceholder}
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

      {/* Activate Term Confirmation Dialog */}
      <AlertDialog 
        open={isActivateDialogOpen} 
        onOpenChange={(open) => {
          setIsActivateDialogOpen(open);
          if (!open) {
            setTermToActivate(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Open Term</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to open <strong>{termToActivate?.name}</strong> for the academic year <strong>{activeAcademicYear?.label}</strong>? 
              This will make this term active and available for new activities. 
              {terms.some(t => t.isActive && t._id !== termToActivate?.id) && (
                " Any other currently open term will be closed."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={activateTermMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmActivateTerm}
              disabled={activateTermMutation.isPending}
            >
              {activateTermMutation.isPending ? "Opening..." : "Open Term"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
