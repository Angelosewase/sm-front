"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
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

interface PassMarkSettings {
  globalPassMark: number;
  secondSittingMin: number;
  secondSittingMax: number;
  failureThreshold: number;
}

export function PassMarks() {
  const [settings, setSettings] = useState<PassMarkSettings>({
    globalPassMark: 50,
    secondSittingMin: 40,
    secondSittingMax: 49,
    failureThreshold: 0,
  });

  // Local state for unsaved changes
  const [localGlobalPassMark, setLocalGlobalPassMark] = useState(50);
  const [localSecondSittingMin, setLocalSecondSittingMin] = useState(40);
  const [localSecondSittingMax, setLocalSecondSittingMax] = useState(49);
  const [localFailureThreshold, setLocalFailureThreshold] = useState(0);

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [pendingSettings, setPendingSettings] = useState<PassMarkSettings | null>(null);
  const [isGlobalPassMarkDialogOpen, setIsGlobalPassMarkDialogOpen] = useState(false);
  const [isSecondSittingDialogOpen, setIsSecondSittingDialogOpen] = useState(false);
  const [isFailureThresholdDialogOpen, setIsFailureThresholdDialogOpen] = useState(false);

  // Sync local state with saved settings
  useEffect(() => {
    setLocalGlobalPassMark(settings.globalPassMark);
    setLocalSecondSittingMin(settings.secondSittingMin);
    setLocalSecondSittingMax(settings.secondSittingMax);
    setLocalFailureThreshold(settings.failureThreshold);
  }, [settings]);

  const updateSetting = (field: keyof PassMarkSettings, value: number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const validateSettings = (): string | null => {
    if (settings.globalPassMark < 0 || settings.globalPassMark > 100) {
      return "Global pass mark must be between 0 and 100";
    }
    if (settings.secondSittingMin < 0 || settings.secondSittingMin > 100) {
      return "Second sitting minimum must be between 0 and 100";
    }
    if (settings.secondSittingMax < 0 || settings.secondSittingMax > 100) {
      return "Second sitting maximum must be between 0 and 100";
    }
    if (settings.secondSittingMin >= settings.secondSittingMax) {
      return "Second sitting minimum must be less than maximum";
    }
    if (settings.failureThreshold < 0 || settings.failureThreshold > 100) {
      return "Failure threshold must be between 0 and 100";
    }
    if (settings.secondSittingMax >= settings.globalPassMark) {
      return "Second sitting maximum must be less than global pass mark";
    }
    if (settings.failureThreshold >= settings.secondSittingMin) {
      return "Failure threshold must be less than second sitting minimum";
    }
    return null;
  };

  const handleSave = () => {
    const error = validateSettings();
    if (error) {
      toast.error(error);
      return;
    }
    setPendingSettings(settings);
    setIsSaveDialogOpen(true);
  };

  const confirmSave = () => {
    if (pendingSettings) {
      // TODO: Call API to save settings
      toast.success("Pass mark settings updated successfully");
      setIsSaveDialogOpen(false);
      setPendingSettings(null);
    }
  };

  // Save handlers that trigger dialogs
  const handleSaveGlobalPassMark = () => {
    if (localGlobalPassMark <= settings.secondSittingMax) {
      toast.error("Global pass mark must be greater than second sitting maximum");
      return;
    }
    setIsGlobalPassMarkDialogOpen(true);
  };

  const handleSaveSecondSitting = () => {
    if (localSecondSittingMin >= localSecondSittingMax) {
      toast.error("Minimum must be less than maximum");
      return;
    }
    if (localSecondSittingMax >= settings.globalPassMark) {
      toast.error("Second sitting maximum must be less than global pass mark");
      return;
    }
    if (localSecondSittingMin <= settings.failureThreshold) {
      toast.error("Second sitting minimum must be greater than failure threshold");
      return;
    }
    setIsSecondSittingDialogOpen(true);
  };

  const handleSaveFailureThreshold = () => {
    if (localFailureThreshold >= settings.secondSittingMin) {
      toast.error("Failure threshold must be less than second sitting minimum");
      return;
    }
    setIsFailureThresholdDialogOpen(true);
  };

  const confirmGlobalPassMark = () => {
    updateSetting("globalPassMark", localGlobalPassMark);
    setIsGlobalPassMarkDialogOpen(false);
    toast.success("Global pass mark updated");
  };

  const confirmSecondSitting = () => {
    updateSetting("secondSittingMin", localSecondSittingMin);
    updateSetting("secondSittingMax", localSecondSittingMax);
    setIsSecondSittingDialogOpen(false);
    toast.success("Second sitting range updated");
  };

  const confirmFailureThreshold = () => {
    updateSetting("failureThreshold", localFailureThreshold);
    setIsFailureThresholdDialogOpen(false);
    toast.success("Failure threshold updated");
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
          {/* Global Pass Mark */}
          <div className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Global Pass Mark</h3>
                <p className="text-sm text-muted-foreground">
                  Minimum percentage required for a student to be marked as passed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Label htmlFor="global-pass-mark" className="whitespace-nowrap">
                  Pass Mark:
                </Label>
                <Input
                  id="global-pass-mark"
                  type="number"
                  value={localGlobalPassMark}
                  onChange={(e) => setLocalGlobalPassMark(parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <Badge variant={localGlobalPassMark >= 50 ? "default" : "secondary"}>
                {localGlobalPassMark >= 50 ? "Standard" : "Custom"}
              </Badge>
            </div>
            <div className="p-3 bg-muted rounded-md text-sm">
              <p className="text-muted-foreground">
                Students with an average score of <strong>{localGlobalPassMark}%</strong> or higher 
                will be marked as <strong>Passed</strong>.
              </p>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveGlobalPassMark} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Global Pass Mark
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
              <Button onClick={handleSaveSecondSitting} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Second Sitting Range
              </Button>
            </div>
          </div>

          {/* Failure Threshold */}
          <div className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold text-lg">Failure Threshold</h3>
                <p className="text-sm text-muted-foreground">
                  Maximum percentage below which a student is marked as failed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Label htmlFor="failure-threshold" className="whitespace-nowrap">
                  Failure Threshold:
                </Label>
                <Input
                  id="failure-threshold"
                  type="number"
                  value={localFailureThreshold}
                  onChange={(e) => setLocalFailureThreshold(parseInt(e.target.value) || 0)}
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
                Students scoring <strong>{localFailureThreshold}%</strong> or below 
                will be marked as <strong>Failed</strong>.
              </p>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveFailureThreshold} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Failure Threshold
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
                  {localGlobalPassMark}% and above
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
                  {localFailureThreshold}% and below
                </p>
              </div>
            </div>
          </div>

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
                  <p><strong>Global Pass Mark:</strong> {pendingSettings?.globalPassMark}%</p>
                  <p><strong>Second Sitting Range:</strong> {pendingSettings?.secondSittingMin}% - {pendingSettings?.secondSittingMax}%</p>
                  <p><strong>Failure Threshold:</strong> {pendingSettings?.failureThreshold}%</p>
                </div>
                <p className="text-destructive font-medium">
                  This will affect how all students are evaluated. Make sure these values are correct.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingSettings(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>
              Confirm and Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Global Pass Mark Confirmation Dialog */}
      <AlertDialog 
        open={isGlobalPassMarkDialogOpen} 
        onOpenChange={setIsGlobalPassMarkDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Global Pass Mark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the global pass mark from <strong>{settings.globalPassMark}%</strong> to <strong>{localGlobalPassMark}%</strong>?
              <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                <p>This will affect how all students are evaluated:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Students with {localGlobalPassMark}% or above will be marked as <strong>Passed</strong></li>
                  <li>This change will apply to all future evaluations</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmGlobalPassMark}>
              Confirm Update
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSecondSitting}>
              Confirm Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Failure Threshold Confirmation Dialog */}
      <AlertDialog 
        open={isFailureThresholdDialogOpen} 
        onOpenChange={setIsFailureThresholdDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Failure Threshold</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the failure threshold from <strong>{settings.failureThreshold}%</strong> to <strong>{localFailureThreshold}%</strong>?
              <div className="mt-3 p-3 bg-destructive/10 rounded-md text-sm">
                <p className="font-medium text-destructive">Warning: This is a critical setting</p>
                <p className="mt-2">Students scoring {localFailureThreshold}% or below will be marked as <strong>Failed</strong>.</p>
                <p className="mt-2">This change will affect student evaluations and may impact their academic standing.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmFailureThreshold}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
