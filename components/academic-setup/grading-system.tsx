"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface Grade {
  grade: string;
  minScore: number;
  maxScore: number;
  description: string;
}

interface GradingSystemProps {
  defaultGrades?: Grade[];
  onSave?: (grades: Grade[]) => void;
}

const defaultGrades: Grade[] = [
  { grade: "A+", minScore: 90, maxScore: 100, description: "Excellent" },
  { grade: "A", minScore: 80, maxScore: 89, description: "Very Good" },
  { grade: "B+", minScore: 75, maxScore: 79, description: "Good" },
  { grade: "B", minScore: 70, maxScore: 74, description: "Above Average" },
  { grade: "C+", minScore: 65, maxScore: 69, description: "Average" },
  { grade: "C", minScore: 60, maxScore: 64, description: "Below Average" },
  { grade: "D", minScore: 50, maxScore: 59, description: "Poor" },
  { grade: "F", minScore: 0, maxScore: 49, description: "Fail" },
];

export function GradingSystem({ defaultGrades: initialGrades, onSave }: GradingSystemProps) {
  const [gradingSystem, setGradingSystem] = useState<Grade[]>(initialGrades || defaultGrades);

  const handleSave = () => {
    // Validate grading system
    const isValid = gradingSystem.every((grade, index) => {
      if (index === 0) return true;
      return grade.maxScore === gradingSystem[index - 1].minScore - 1;
    });

    if (!isValid) {
      toast.error("Grade ranges must be continuous without gaps or overlaps");
      return;
    }

    if (onSave) {
      onSave(gradingSystem);
    } else {
      toast.success("Grading system updated successfully");
    }
  };

  const updateGrade = (index: number, field: string, value: string | number) => {
    setGradingSystem(prev => 
      prev.map((grade, i) => 
        i === index ? { ...grade, [field]: value } : grade
      )
    );
  };

  return (
    <Card className="shadow-none border-none bg-transparent p-0">
      <CardHeader>
        <CardTitle>Grading System Configuration</CardTitle>
        <CardDescription>
          Define grade ranges and descriptions for student assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {gradingSystem.map((grade, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center p-4 border rounded-lg">
              <div>
                <Label htmlFor={`grade-${index}`}>Grade</Label>
                <Input
                  id={`grade-${index}`}
                  value={grade.grade}
                  onChange={(e) => updateGrade(index, 'grade', e.target.value)}
                  className="font-semibold"
                />
              </div>
              <div>
                <Label htmlFor={`min-${index}`}>Min Score</Label>
                <Input
                  id={`min-${index}`}
                  type="number"
                  value={grade.minScore}
                  onChange={(e) => updateGrade(index, 'minScore', parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor={`max-${index}`}>Max Score</Label>
                <Input
                  id={`max-${index}`}
                  type="number"
                  value={grade.maxScore}
                  onChange={(e) => updateGrade(index, 'maxScore', parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor={`desc-${index}`}>Description</Label>
                <Input
                  id={`desc-${index}`}
                  value={grade.description}
                  onChange={(e) => updateGrade(index, 'description', e.target.value)}
                />
              </div>
              <div className="text-center">
                <Badge variant="outline" className="text-sm">
                  {grade.minScore}-{grade.maxScore}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Grading System
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

