"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { BookOpen, Save, AlertTriangle } from "lucide-react";
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
import { useSchool } from "@/contexts/school-context";
import { usePassMarksBySchool, useCreatePassMarks, useUpdatePassMarks } from "@/hooks/use-pass-marks";
import { CreatePassMarksDto, UpdatePassMarksDto } from "@/lib/api/pass-marks";

interface PassMarkSettings {
  passMark: number;
  secondSittingMin: number;
  secondSittingMax: number;
  failMark: number;
}

export function PassMarks() {
  const { school } = useSchool();
  const { data: passMarks, isLoading, error: passMarksError } = usePassMarksBySchool(school?.id);
  const createMutation = useCreatePassMarks();
  const updateMutation = useUpdatePassMarks();

  // Default values
  const defaultSettings: PassMarkSettings = {
    passMark: 50,
    secondSittingMin: 40,
    secondSittingMax: 49,
    failMark: 39,
  };

  // Initialize from API data or defaults
  const [settings, setSettings] = useState<PassMarkSettings>(defaultSettings);

  // Local state for unsaved changes
  const [localPassMark, setLocalPassMark] = useState(50);
  const [localSecondSittingMin, setLocalSecondSittingMin] = useState(40);
  const [localSecondSittingMax, setLocalSecondSittingMax] = useState(49);
  const [localFailMark, setLocalFailMark] = useState(39);

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [pendingSettings, setPendingSettings] = useState<PassMarkSettings | null>(null);
  const [isPassMarkDialogOpen, setIsPassMarkDialogOpen] = useState(false);
  const [isSecondSittingDialogOpen, setIsSecondSittingDialogOpen] = useState(false);
  const [isFailMarkDialogOpen, setIsFailMarkDialogOpen] = useState(false);

  // Load data from API
  useEffect(() => {
    if (passMarks) {
      const loadedSettings: PassMarkSettings = {
        passMark: passMarks.passMark,
        secondSittingMin: passMarks.secondSittingMin,
        secondSittingMax: passMarks.secondSittingMax,
        failMark: passMarks.failMark,
      };
      setSettings(loadedSettings);
      setLocalPassMark(loadedSettings.passMark);
      setLocalSecondSittingMin(loadedSettings.secondSittingMin);
      setLocalSecondSittingMax(loadedSettings.secondSittingMax);
      setLocalFailMark(loadedSettings.failMark);
    }
  }, [passMarks]);

  // Handle query errors
  useEffect(() => {
    if (passMarksError) {
      const errorMessage = (passMarksError as any)?.response?.data?.message || 
        (passMarksError as any)?.response?.status === 404
          ? "No pass marks configuration found. Create one to get started."
          : "Failed to load pass marks configuration. Please refresh the page.";
      
      // Only show error if it's not a 404 (not found is expected if not created yet)
      if ((passMarksError as any)?.response?.status !== 404) {
        toast.error(errorMessage);
        console.error("Load pass marks error:", passMarksError);
      }
    }
  }, [passMarksError]);

  // Sync local state with saved settings
  useEffect(() => {
    setLocalPassMark(settings.passMark);
    setLocalSecondSittingMin(settings.secondSittingMin);
    setLocalSecondSittingMax(settings.secondSittingMax);
    setLocalFailMark(settings.failMark);
  }, [settings]);

  const updateSetting = (field: keyof PassMarkSettings, value: number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const validateSettings = (settingsToValidate: PassMarkSettings): string | null => {
    // Validation rule: failMark < secondSittingMin < secondSittingMax < passMark
    if (settingsToValidate.passMark < 0 || settingsToValidate.passMark > 100) {
      return "Pass mark must be between 0 and 100";
    }
    if (settingsToValidate.secondSittingMin < 0 || settingsToValidate.secondSittingMin > 100) {
      return "Second sitting minimum must be between 0 and 100";
    }
    if (settingsToValidate.secondSittingMax < 0 || settingsToValidate.secondSittingMax > 100) {
      return "Second sitting maximum must be between 0 and 100";
    }
    if (settingsToValidate.failMark < 0 || settingsToValidate.failMark > 100) {
      return "Fail mark must be between 0 and 100";
    }
    if (settingsToValidate.secondSittingMin >= settingsToValidate.secondSittingMax) {
      return "Second sitting minimum must be less than second sitting maximum";
    }
    if (settingsToValidate.failMark >= settingsToValidate.secondSittingMin) {
      return "Fail mark must be less than second sitting minimum";
    }
    if (settingsToValidate.secondSittingMax >= settingsToValidate.passMark) {
      return "Second sitting maximum must be less than pass mark";
    }
    return null;
  };

  const handleSave = async () => {
    if (!school?.id) {
      toast.error("School information not found. Please refresh the page.");
      return;
    }

    const settingsToSave: PassMarkSettings = {
      passMark: localPassMark,
      secondSittingMin: localSecondSittingMin,
      secondSittingMax: localSecondSittingMax,
      failMark: localFailMark,
    };

    const error = validateSettings(settingsToSave);
    if (error) {
      toast.error(error);
      return;
    }

    setPendingSettings(settingsToSave);
    setIsSaveDialogOpen(true);
  };

  const confirmSave = async () => {
    if (!pendingSettings || !school?.id) {
      toast.error("Missing required information. Please try again.");
      return;
    }

    try {
      if (passMarks) {
        // Update existing
        const updatePayload: UpdatePassMarksDto = {
          passMark: pendingSettings.passMark,
          secondSittingMin: pendingSettings.secondSittingMin,
          secondSittingMax: pendingSettings.secondSittingMax,
          failMark: pendingSettings.failMark,
        };
        await updateMutation.mutateAsync({
          schoolId: school.id,
          payload: updatePayload,
        });
        toast.success("Pass marks configuration updated successfully");
      } else {
        // Create new
        const createPayload: CreatePassMarksDto = {
          school: school.id,
          passMark: pendingSettings.passMark,
          secondSittingMin: pendingSettings.secondSittingMin,
          secondSittingMax: pendingSettings.secondSittingMax,
          failMark: pendingSettings.failMark,
        };
        await createMutation.mutateAsync(createPayload);
        toast.success("Pass marks configuration created successfully");
      }
      setIsSaveDialogOpen(false);
      setPendingSettings(null);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 
        "Failed to save pass marks configuration. Please try again.";
      toast.error(errorMessage);
      console.error("Save pass marks error:", error);
    }
  };

  // Save handlers that trigger dialogs
  const handleSavePassMark = () => {
    if (!school?.id) {
      toast.error("School information not found. Please refresh the page.");
      return;
    }

    const testSettings: PassMarkSettings = {
      passMark: localPassMark,
      secondSittingMin: settings.secondSittingMin,
      secondSittingMax: settings.secondSittingMax,
      failMark: settings.failMark,
    };

    const error = validateSettings(testSettings);
    if (error) {
      toast.error(error);
      return;
    }

    setIsPassMarkDialogOpen(true);
  };

  const handleSaveSecondSitting = () => {
    if (!school?.id) {
      toast.error("School information not found. Please refresh the page.");
      return;
    }

    const testSettings: PassMarkSettings = {
      passMark: settings.passMark,
      secondSittingMin: localSecondSittingMin,
      secondSittingMax: localSecondSittingMax,
      failMark: settings.failMark,
    };

    const error = validateSettings(testSettings);
    if (error) {
      toast.error(error);
      return;
    }

    setIsSecondSittingDialogOpen(true);
  };

  const handleSaveFailMark = () => {
    if (!school?.id) {
      toast.error("School information not found. Please refresh the page.");
      return;
    }

    const testSettings: PassMarkSettings = {
      passMark: settings.passMark,
      secondSittingMin: settings.secondSittingMin,
      secondSittingMax: settings.secondSittingMax,
      failMark: localFailMark,
    };

    const error = validateSettings(testSettings);
    if (error) {
      toast.error(error);
      return;
    }

    setIsFailMarkDialogOpen(true);
  };

  const confirmPassMark = async () => {
    if (!school?.id) {
      toast.error("School information not found. Please refresh the page.");
      return;
    }

    try {
      const payload: UpdatePassMarksDto = { passMark: localPassMark };
      
      if (passMarks) {
        await updateMutation.mutateAsync({
          schoolId: school.id,
          payload,
        });
        toast.success("Pass mark updated successfully");
      } else {
        // Create with defaults and update pass mark
        const createPayload: CreatePassMarksDto = {
          school: school.id,
          passMark: localPassMark,
          secondSittingMin: settings.secondSittingMin,
          secondSittingMax: settings.secondSittingMax,
          failMark: settings.failMark,
        };
        await createMutation.mutateAsync(createPayload);
        toast.success("Pass mark configuration created successfully");
      }
      setIsPassMarkDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 
        "Failed to update pass mark. Please try again.";
      toast.error(errorMessage);
      console.error("Update pass mark error:", error);
    }
  };

  const confirmSecondSitting = async () => {
    if (!school?.id) {
      toast.error("School information not found. Please refresh the page.");
      return;
    }

    try {
      const payload: UpdatePassMarksDto = {
        secondSittingMin: localSecondSittingMin,
        secondSittingMax: localSecondSittingMax,
      };
      
      if (passMarks) {
        await updateMutation.mutateAsync({
          schoolId: school.id,
          payload,
        });
        toast.success("Second sitting range updated successfully");
      } else {
        // Create with defaults and update second sitting
        const createPayload: CreatePassMarksDto = {
          school: school.id,
          passMark: settings.passMark,
          secondSittingMin: localSecondSittingMin,
          secondSittingMax: localSecondSittingMax,
          failMark: settings.failMark,
        };
        await createMutation.mutateAsync(createPayload);
        toast.success("Second sitting range configuration created successfully");
      }
      setIsSecondSittingDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 
        "Failed to update second sitting range. Please try again.";
      toast.error(errorMessage);
      console.error("Update second sitting error:", error);
    }
  };

  const confirmFailMark = async () => {
    if (!school?.id) {
      toast.error("School information not found. Please refresh the page.");
      return;
    }

    try {
      const payload: UpdatePassMarksDto = { failMark: localFailMark };
      
      if (passMarks) {
        await updateMutation.mutateAsync({
          schoolId: school.id,
          payload,
        });
        toast.success("Fail mark updated successfully");
      } else {
        // Create with defaults and update fail mark
        const createPayload: CreatePassMarksDto = {
          school: school.id,
          passMark: settings.passMark,
          secondSittingMin: settings.secondSittingMin,
          secondSittingMax: settings.secondSittingMax,
          failMark: localFailMark,
        };
        await createMutation.mutateAsync(createPayload);
        toast.success("Fail mark configuration created successfully");
      }
      setIsFailMarkDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 
        "Failed to update fail mark. Please try again.";
      toast.error(errorMessage);
      console.error("Update fail mark error:", error);
    }
  };

  return (
    <>
      <Card className="shadow-none border-none bg-transparent p-0">
        <CardHeader>
          <CardTitle>Pass Mark Configuration</CardTitle>
          <CardDescription>
            Configure global pass marks, second sitting ranges, and failure thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading pass marks configuration...</div>
          ) : (
            <>
              {/* Pass Mark */}
              <div className="p-6 border rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Pass Mark</h3>
                    <p className="text-sm text-muted-foreground">
                      Minimum percentage required for a student to be marked as passed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Label htmlFor="pass-mark" className="whitespace-nowrap">
                      Pass Mark:
                    </Label>
                    <Input
                      id="pass-mark"
                      type="number"
                      value={localPassMark}
                      onChange={(e) => setLocalPassMark(parseInt(e.target.value) || 0)}
                      min="0"
                      max="100"
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <Badge variant={localPassMark >= 50 ? "default" : "secondary"}>
                    {localPassMark >= 50 ? "Standard" : "Custom"}
                  </Badge>
                </div>
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p className="text-muted-foreground">
                    Students with an average score of <strong>{localPassMark}%</strong> or higher 
                    will be marked as <strong>Passed</strong>.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSavePassMark} 
                    className="flex items-center gap-2"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <Save className="h-4 w-4" />
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Pass Mark"}
                  </Button>
                </div>
              </div>

          {/* Second Sitting Range */}
          <div className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <h3 className="font-semibold text-lg">Second Sitting Range</h3>
                <p className="text-sm text-muted-foreground">
                  Score range for students eligible for second sitting (resit/retake)
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="second-sitting-min">Minimum Score</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="second-sitting-min"
                    type="number"
                    value={localSecondSittingMin}
                    onChange={(e) => setLocalSecondSittingMin(parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className="w-full"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="second-sitting-max">Maximum Score</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="second-sitting-max"
                    type="number"
                    value={localSecondSittingMax}
                    onChange={(e) => setLocalSecondSittingMax(parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className="w-full"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-md text-sm">
              <p className="text-muted-foreground">
                Students scoring between <strong>{localSecondSittingMin}%</strong> and <strong>{localSecondSittingMax}%</strong> 
                will be eligible for <strong>Second Sitting</strong>.
              </p>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveSecondSitting} 
                className="flex items-center gap-2"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Second Sitting Range"}
              </Button>
            </div>
          </div>

          {/* Fail Mark */}
          <div className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold text-lg">Fail Mark</h3>
                <p className="text-sm text-muted-foreground">
                  Maximum percentage below which a student is marked as failed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Label htmlFor="fail-mark" className="whitespace-nowrap">
                  Fail Mark:
                </Label>
                <Input
                  id="fail-mark"
                  type="number"
                  value={localFailMark}
                  onChange={(e) => setLocalFailMark(parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <Badge variant="destructive">Critical</Badge>
            </div>
            <div className="p-3 bg-destructive/10 rounded-md text-sm">
              <p className="text-muted-foreground">
                Students scoring <strong>{localFailMark}%</strong> or below 
                will be marked as <strong>Failed</strong>.
              </p>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveFailMark} 
                className="flex items-center gap-2"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Fail Mark"}
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-3">Configuration Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Passed</p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  {localPassMark}% and above
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Second Sitting</p>
                <p className="font-medium text-orange-600 dark:text-orange-400">
                  {localSecondSittingMin}% - {localSecondSittingMax}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Failed</p>
                <p className="font-medium text-destructive">
                  {localFailMark}% and below
                </p>
              </div>
            </div>
          </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Pass Mark Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the pass mark configuration with the following settings?
              <div className="mt-4 space-y-2 text-sm">
                <div className="p-3 bg-muted rounded-md">
                  <p><strong>Pass Mark:</strong> {pendingSettings?.passMark}%</p>
                  <p><strong>Second Sitting Range:</strong> {pendingSettings?.secondSittingMin}% - {pendingSettings?.secondSittingMax}%</p>
                  <p><strong>Fail Mark:</strong> {pendingSettings?.failMark}%</p>
                </div>
                <p className="text-destructive font-medium">
                  This will affect how all students are evaluated. Make sure these values are correct.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setPendingSettings(null)}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Confirm and Save"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pass Mark Confirmation Dialog */}
      <AlertDialog 
        open={isPassMarkDialogOpen} 
        onOpenChange={setIsPassMarkDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Pass Mark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the pass mark from <strong>{settings.passMark}%</strong> to <strong>{localPassMark}%</strong>?
              <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                <p>This will affect how all students are evaluated:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Students with {localPassMark}% or above will be marked as <strong>Passed</strong></li>
                  <li>This change will apply to all future evaluations</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={createMutation.isPending || updateMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmPassMark}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Updating..." : "Confirm Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Second Sitting Range Confirmation Dialog */}
      <AlertDialog 
        open={isSecondSittingDialogOpen} 
        onOpenChange={setIsSecondSittingDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Second Sitting Range</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the second sitting range?
              <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                <p><strong>New Range:</strong> {localSecondSittingMin}% - {localSecondSittingMax}%</p>
                <p className="mt-2">Students scoring within this range will be eligible for second sitting (resit/retake).</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={createMutation.isPending || updateMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSecondSitting}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Updating..." : "Confirm Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Fail Mark Confirmation Dialog */}
      <AlertDialog 
        open={isFailMarkDialogOpen} 
        onOpenChange={setIsFailMarkDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Fail Mark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the fail mark from <strong>{settings.failMark}%</strong> to <strong>{localFailMark}%</strong>?
              <div className="mt-3 p-3 bg-destructive/10 rounded-md text-sm">
                <p className="font-medium text-destructive">Warning: This is a critical setting</p>
                <p className="mt-2">Students scoring {localFailMark}% or below will be marked as <strong>Failed</strong>.</p>
                <p className="mt-2">This change will affect student evaluations and may impact their academic standing.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={createMutation.isPending || updateMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmFailMark}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {createMutation.isPending || updateMutation.isPending ? "Updating..." : "Confirm Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
