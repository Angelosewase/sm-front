"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { Calendar, Plus, CheckCircle2, Star } from "lucide-react";
import { useAcademicYears, useOpenAcademicYear } from "@/hooks/use-academic-terms";
import { academicYearsApi } from "@/lib/api/academic-terms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export function AcademicYear() {
  const queryClient = useQueryClient();
  const { data: academicYears = [], isLoading, error: academicYearsError } = useAcademicYears();
  const { data: openAcademicYear, isLoading: isLoadingOpen, error: openYearError } = useOpenAcademicYear();
  
  // Handle query errors
  useEffect(() => {
    if (academicYearsError) {
      toast.error(
        (academicYearsError as any)?.response?.data?.message || 
        "Failed to load academic years. Please refresh the page."
      );
    }
  }, [academicYearsError]);
  
  useEffect(() => {
    if (openYearError) {
      toast.error(
        (openYearError as any)?.response?.data?.message || 
        "Failed to load open academic year. Please refresh the page."
      );
    }
  }, [openYearError]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCloseYearDialogOpen, setIsCloseYearDialogOpen] = useState(false);
  const [isOpenYearDialogOpen, setIsOpenYearDialogOpen] = useState(false);
  const [yearToClose, setYearToClose] = useState<{ id: string; label: string } | null>(null);
  const [yearToOpen, setYearToOpen] = useState<{ id: string; label: string } | null>(null);
  const [newAcademicYear, setNewAcademicYear] = useState({
    label: "",
    startDate: "",
    endDate: "",
  });

  const createMutation = useMutation({
    mutationFn: academicYearsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      queryClient.invalidateQueries({ queryKey: ["academic-year", "open"] });
      toast.success("Academic year created successfully");
      setIsCreateDialogOpen(false);
      setNewAcademicYear({ label: "", startDate: "", endDate: "" });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create academic year";
      toast.error(errorMessage);
      console.error("Create academic year error:", error);
    },
  });

  const closeYearMutation = useMutation({
    mutationFn: (id: string) => academicYearsApi.close(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      queryClient.invalidateQueries({ queryKey: ["academic-year", "open"] });
      toast.success("Academic year closed successfully");
      setIsCloseYearDialogOpen(false);
      setYearToClose(null);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to close academic year";
      toast.error(errorMessage);
      console.error("Close academic year error:", error);
    },
  });

  const openYearMutation = useMutation({
    mutationFn: (id: string) => academicYearsApi.open(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      queryClient.invalidateQueries({ queryKey: ["academic-year", "open"] });
      toast.success("Academic year opened successfully");
      setIsOpenYearDialogOpen(false);
      setYearToOpen(null);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to open academic year";
      toast.error(errorMessage);
      console.error("Open academic year error:", error);
    },
  });

  const handleCreateAcademicYear = () => {
    if (!newAcademicYear.label.trim()) {
      toast.error("Please enter an academic year label");
      return;
    }

    if (!newAcademicYear.startDate || !newAcademicYear.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(newAcademicYear.startDate) >= new Date(newAcademicYear.endDate)) {
      toast.error("Start date must be before end date");
      return;
    }

    try {
      createMutation.mutate({
        label: newAcademicYear.label,
        startDate: newAcademicYear.startDate || undefined,
        endDate: newAcademicYear.endDate || undefined,
      });
    } catch (error: any) {
      toast.error(error?.message || "Failed to create academic year. Please try again.");
    }
  };

  const handleCloseAcademicYear = (id: string, label: string) => {
    setYearToClose({ id, label });
    setIsCloseYearDialogOpen(true);
  };

  const confirmCloseAcademicYear = () => {
    if (yearToClose) {
      try {
        closeYearMutation.mutate(yearToClose.id);
      } catch (error: any) {
        toast.error(error?.message || "Failed to close academic year. Please try again.");
      }
    } else {
      toast.error("No academic year selected to close");
    }
  };

  const handleOpenAcademicYear = (id: string, label: string) => {
    if (!id) {
      toast.error("Invalid academic year. Please try again.");
      return;
    }
    setYearToOpen({ id, label });
    setIsOpenYearDialogOpen(true);
  };

  const confirmOpenAcademicYear = () => {
    if (yearToOpen) {
      try {
        openYearMutation.mutate(yearToOpen.id);
      } catch (error: any) {
        toast.error(error?.message || "Failed to open academic year. Please try again.");
      }
    } else {
      toast.error("No academic year selected to open");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDays = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return 0;
    return Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <Card className="shadow-none border-none bg-transparent p-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Academic Year Management</CardTitle>
            <CardDescription>
              Create and manage academic years for your institution
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Academic Year
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Academic Year</DialogTitle>
                <DialogDescription>
                  Enter the details for the new academic year
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Academic Year Label</Label>
                  <Input
                    id="label"
                    value={newAcademicYear.label}
                    onChange={(e) =>
                      setNewAcademicYear((prev) => ({ ...prev, label: e.target.value }))
                    }
                    placeholder="e.g., 2024/2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newAcademicYear.startDate}
                    onChange={(e) =>
                      setNewAcademicYear((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newAcademicYear.endDate}
                    onChange={(e) =>
                      setNewAcademicYear((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAcademicYear}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Currently Open Academic Year Section */}
        {!isLoadingOpen && openAcademicYear && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Currently Open Academic Year</h3>
            <div className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 rounded-full bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <p className="text-xl font-semibold">{openAcademicYear.label}</p>
                      <Badge variant="default" className="text-sm">
                        Currently Open
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Start Date</p>
                        <p className="font-medium text-base">{formatDate(openAcademicYear.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">End Date</p>
                        <p className="font-medium text-base">{formatDate(openAcademicYear.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Duration</p>
                        <p className="font-medium text-base">
                          {calculateDays(openAcademicYear.startDate, openAcademicYear.endDate)} days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCloseAcademicYear(openAcademicYear._id, openAcademicYear.label)}
                    disabled={closeYearMutation.isPending}
                  >
                    Close Academic Year
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Academic Years Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {openAcademicYear ? "All Academic Years" : "Academic Years"}
          </h3>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading academic years...</div>
          ) : academicYears.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No academic years found. Create your first academic year to get started.
            </div>
          ) : (
            <div className="grid gap-4">
              {academicYears
                .filter((year) => !openAcademicYear || year._id !== openAcademicYear._id)
                .map((year) => (
                  <div
                    key={year._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{year.label}</p>
                          <Badge variant={year.isOpen ? "default" : "secondary"}>
                            {year.isOpen ? "Open" : "Closed"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Start Date</p>
                            <p className="font-medium">{formatDate(year.startDate)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">End Date</p>
                            <p className="font-medium">{formatDate(year.endDate)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">
                              {calculateDays(year.startDate, year.endDate)} days
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!year.isOpen && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleOpenAcademicYear(year._id, year.label)}
                          disabled={openYearMutation.isPending || closeYearMutation.isPending}
                          className="flex items-center gap-2"
                        >
                          <Star className="h-4 w-4" />
                          Open Academic Year
                        </Button>
                      )}
                      {year.isOpen && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCloseAcademicYear(year._id, year.label)}
                          disabled={closeYearMutation.isPending || openYearMutation.isPending}
                        >
                          Close Academic Year
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Close Academic Year Confirmation Dialog */}
      <AlertDialog 
        open={isCloseYearDialogOpen} 
        onOpenChange={(open) => {
          setIsCloseYearDialogOpen(open);
          if (!open) {
            setYearToClose(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Academic Year</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close <strong>{yearToClose?.label}</strong>? 
              This action will close the academic year and it will no longer be available 
              for new activities. You cannot close an academic year if any of its terms are currently open.
              You can still view historical data for this academic year.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={closeYearMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCloseAcademicYear}
              disabled={closeYearMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {closeYearMutation.isPending ? "Closing..." : "Close Academic Year"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Open Academic Year Confirmation Dialog */}
      <AlertDialog 
        open={isOpenYearDialogOpen} 
        onOpenChange={(open) => {
          setIsOpenYearDialogOpen(open);
          if (!open) {
            setYearToOpen(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Open Academic Year</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to open <strong>{yearToOpen?.label}</strong>? 
              {openAcademicYear && (
                <>
                  {" "}This will close <strong>{openAcademicYear.label}</strong> and make it no longer open.
                </>
              )}
              {" "}The newly opened academic year will become the default for all new activities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={openYearMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmOpenAcademicYear}
              disabled={openYearMutation.isPending}
            >
              {openYearMutation.isPending ? "Opening..." : "Open Academic Year"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

