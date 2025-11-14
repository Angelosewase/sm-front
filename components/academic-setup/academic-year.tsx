"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Plus, CheckCircle2, Star } from "lucide-react";
import { useAcademicYears, useActiveAcademicYear } from "@/hooks/use-academic-terms";
import { createAcademicYear, endAcademicYear, activateAcademicYear } from "@/lib/api/academic-terms";
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
  const { data: academicYears = [], isLoading } = useAcademicYears();
  const { data: activeAcademicYear, isLoading: isLoadingActive } = useActiveAcademicYear();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEndYearDialogOpen, setIsEndYearDialogOpen] = useState(false);
  const [isActivateYearDialogOpen, setIsActivateYearDialogOpen] = useState(false);
  const [yearToEnd, setYearToEnd] = useState<{ id: string; label: string } | null>(null);
  const [yearToActivate, setYearToActivate] = useState<{ id: string; label: string } | null>(null);
  const [newAcademicYear, setNewAcademicYear] = useState({
    label: "",
    startDate: "",
    endDate: "",
  });

  const createMutation = useMutation({
    mutationFn: createAcademicYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      queryClient.invalidateQueries({ queryKey: ["academic-year", "active"] });
      toast.success("Academic year created successfully");
      setIsCreateDialogOpen(false);
      setNewAcademicYear({ label: "", startDate: "", endDate: "" });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create academic year");
    },
  });

  const endYearMutation = useMutation({
    mutationFn: endAcademicYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      queryClient.invalidateQueries({ queryKey: ["academic-year", "active"] });
      toast.success("Academic year marked as ended");
      setIsEndYearDialogOpen(false);
      setYearToEnd(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to end academic year");
    },
  });

  const activateYearMutation = useMutation({
    mutationFn: activateAcademicYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      queryClient.invalidateQueries({ queryKey: ["academic-year", "active"] });
      toast.success("Academic year activated successfully");
      setIsActivateYearDialogOpen(false);
      setYearToActivate(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to activate academic year");
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

    createMutation.mutate({
      label: newAcademicYear.label,
      startDate: newAcademicYear.startDate,
      endDate: newAcademicYear.endDate,
      isActive: true,
    });
  };

  const handleEndAcademicYear = (id: string, label: string) => {
    setYearToEnd({ id, label });
    setIsEndYearDialogOpen(true);
  };

  const confirmEndAcademicYear = () => {
    if (yearToEnd) {
      endYearMutation.mutate(yearToEnd.id);
    }
  };

  const handleActivateAcademicYear = (id: string, label: string) => {
    setYearToActivate({ id, label });
    setIsActivateYearDialogOpen(true);
  };

  const confirmActivateAcademicYear = () => {
    if (yearToActivate) {
      activateYearMutation.mutate(yearToActivate.id);
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
        {/* Current Academic Year Section */}
        {!isLoadingActive && activeAcademicYear && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Current Academic Year</h3>
            <div className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 rounded-full bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <p className="text-xl font-semibold">{activeAcademicYear.label}</p>
                      <Badge variant="default" className="text-sm">
                        Currently Active
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Start Date</p>
                        <p className="font-medium text-base">{formatDate(activeAcademicYear.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">End Date</p>
                        <p className="font-medium text-base">{formatDate(activeAcademicYear.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Duration</p>
                        <p className="font-medium text-base">
                          {calculateDays(activeAcademicYear.startDate, activeAcademicYear.endDate)} days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleEndAcademicYear(activeAcademicYear._id, activeAcademicYear.label)}
                    disabled={endYearMutation.isPending}
                  >
                    Mark as Ended
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Academic Years Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {activeAcademicYear ? "All Academic Years" : "Academic Years"}
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
                .filter((year) => !activeAcademicYear || year._id !== activeAcademicYear._id)
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
                          <Badge variant={year.isActive ? "default" : "secondary"}>
                            {year.isActive ? "Active" : "Ended"}
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
                      {!year.isActive && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleActivateAcademicYear(year._id, year.label)}
                          disabled={activateYearMutation.isPending || endYearMutation.isPending}
                          className="flex items-center gap-2"
                        >
                          <Star className="h-4 w-4" />
                          Mark as Active
                        </Button>
                      )}
                      {year.isActive && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleEndAcademicYear(year._id, year.label)}
                          disabled={endYearMutation.isPending || activateYearMutation.isPending}
                        >
                          Mark as Ended
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* End Academic Year Confirmation Dialog */}
      <AlertDialog 
        open={isEndYearDialogOpen} 
        onOpenChange={(open) => {
          setIsEndYearDialogOpen(open);
          if (!open) {
            setYearToEnd(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Academic Year</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark <strong>{yearToEnd?.label}</strong> as ended? 
              This action will deactivate the academic year and it will no longer be available 
              for new activities. You can still view historical data for this academic year.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={endYearMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmEndAcademicYear}
              disabled={endYearMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {endYearMutation.isPending ? "Ending..." : "Mark as Ended"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Academic Year Confirmation Dialog */}
      <AlertDialog 
        open={isActivateYearDialogOpen} 
        onOpenChange={(open) => {
          setIsActivateYearDialogOpen(open);
          if (!open) {
            setYearToActivate(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Academic Year</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark <strong>{yearToActivate?.label}</strong> as the current active academic year? 
              {activeAcademicYear && (
                <>
                  {" "}This will deactivate <strong>{activeAcademicYear.label}</strong> and make it no longer active.
                </>
              )}
              {" "}The newly activated academic year will become the default for all new activities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={activateYearMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmActivateAcademicYear}
              disabled={activateYearMutation.isPending}
            >
              {activateYearMutation.isPending ? "Activating..." : "Mark as Active"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

