"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Settings, BookOpen, Clock, Save, Plus, Trash2 } from "lucide-react";

// Available subjects based on the existing data structure
const availableSubjects = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "English" },
  { id: 3, name: "Physics" },
  { id: 4, name: "Chemistry" },
  { id: 5, name: "Biology" },
  { id: 6, name: "History" },
  { id: 7, name: "Geography" },
  { id: 8, name: "Computer Science" },
  { id: 9, name: "Art" },
  { id: 10, name: "Music" },
  { id: 11, name: "Physical Education" },
  { id: 12, name: "Spanish" },
  { id: 13, name: "French" },
];

// Default grading system
const defaultGrades = [
  { grade: "A+", minScore: 90, maxScore: 100, description: "Excellent" },
  { grade: "A", minScore: 80, maxScore: 89, description: "Very Good" },
  { grade: "B+", minScore: 75, maxScore: 79, description: "Good" },
  { grade: "B", minScore: 70, maxScore: 74, description: "Above Average" },
  { grade: "C+", minScore: 65, maxScore: 69, description: "Average" },
  { grade: "C", minScore: 60, maxScore: 64, description: "Below Average" },
  { grade: "D", minScore: 50, maxScore: 59, description: "Poor" },
  { grade: "F", minScore: 0, maxScore: 49, description: "Fail" },
];

// Terms configuration
const terms = [
  { id: 1, name: "First Term", isActive: true },
  { id: 2, name: "Second Term", isActive: false },
  { id: 3, name: "Third Term", isActive: false },
];

export default function AcademicSettingsPage() {
  const [gradingSystem, setGradingSystem] = useState(defaultGrades);
  const [subjectPassMarks, setSubjectPassMarks] = useState(
    availableSubjects.map(subject => ({ ...subject, passMark: 50 }))
  );
  const [termSettings, setTermSettings] = useState(terms);
  const [academicYear, setAcademicYear] = useState({
    startDate: "2024-01-15",
    endDate: "2024-12-15",
    currentYear: "2024"
  });
  const [activeTab, setActiveTab] = useState("grading");

  const handleSaveGradingSystem = () => {
    // Validate grading system
    const isValid = gradingSystem.every((grade, index) => {
      if (index === 0) return true;
      return grade.maxScore === gradingSystem[index - 1].minScore - 1;
    });

    if (!isValid) {
      toast.error("Grade ranges must be continuous without gaps or overlaps");
      return;
    }

    toast.success("Grading system updated successfully");
  };

  const handleSavePassMarks = () => {
    toast.success("Subject pass marks updated successfully");
  };

  const handleToggleTerm = (termId: number) => {
    setTermSettings(prev => 
      prev.map(term => 
        term.id === termId 
          ? { ...term, isActive: !term.isActive }
          : term
      )
    );
    
    const term = termSettings.find(t => t.id === termId);
    toast.success(`${term?.name} ${term?.isActive ? 'closed' : 'opened'} successfully`);
  };

  const handleSaveAcademicYear = () => {
    if (new Date(academicYear.startDate) >= new Date(academicYear.endDate)) {
      toast.error("Start date must be before end date");
      return;
    }
    toast.success("Academic year settings updated successfully");
  };

  const updateGrade = (index: number, field: string, value: string | number) => {
    setGradingSystem(prev => 
      prev.map((grade, i) => 
        i === index ? { ...grade, [field]: value } : grade
      )
    );
  };

  const updatePassMark = (subjectId: number, passMark: number) => {
    setSubjectPassMarks(prev => 
      prev.map(subject => 
        subject.id === subjectId ? { ...subject, passMark } : subject
      )
    );
  };

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Settings</h1>
          <p className="text-muted-foreground">
            Configure grading system, pass marks, and academic schedule
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex gap-8">
          {[
            { id: "grading", label: "Grading System", icon: Settings },
            { id: "passmarks", label: "Pass Marks", icon: BookOpen },
            { id: "terms", label: "Terms", icon: Clock },
            { id: "academic-year", label: "Academic Year", icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">

        {activeTab === "grading" && (
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
                        onChange={(e) => updateGrade(index, 'minScore', parseInt(e.target.value))}
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
                        onChange={(e) => updateGrade(index, 'maxScore', parseInt(e.target.value))}
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
                <Button onClick={handleSaveGradingSystem} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Grading System
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "passmarks" && (
          <Card className="shadow-none border-none bg-transparent p-0">
            <CardHeader>
              <CardTitle>Subject Pass Marks</CardTitle>
              <CardDescription>
                Set minimum passing scores for each subject
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {subjectPassMarks.map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-muted-foreground">Subject</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`pass-${subject.id}`}>Pass Mark:</Label>
                        <Input
                          id={`pass-${subject.id}`}
                          type="number"
                          value={subject.passMark}
                          onChange={(e) => updatePassMark(subject.id, parseInt(e.target.value))}
                          min="0"
                          max="100"
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                      <Badge variant={subject.passMark >= 50 ? "default" : "destructive"}>
                        {subject.passMark >= 50 ? "Standard" : "Low"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSavePassMarks} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Pass Marks
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "terms" && (
          <Card className="shadow-none border-none bg-transparent p-0">
            <CardHeader>
              <CardTitle>Term Management</CardTitle>
              <CardDescription>
                Open and close academic terms as needed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {termSettings.map((term) => (
                  <div key={term.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{term.name}</p>
                        <p className="text-sm text-muted-foreground">Academic Term</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={term.isActive ? "default" : "secondary"}>
                        {term.isActive ? "Open" : "Closed"}
                      </Badge>
                      <Button
                        variant={term.isActive ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleTerm(term.id)}
                      >
                        {term.isActive ? "Close Term" : "Open Term"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "academic-year" && (
          <Card className="shadow-none border-none bg-transparent p-0">
            <CardHeader>
              <CardTitle>Academic Year Configuration</CardTitle>
              <CardDescription>
                Set the academic year dates and current year
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="current-year">Current Academic Year</Label>
                  <Input
                    id="current-year"
                    value={academicYear.currentYear}
                    onChange={(e) => setAcademicYear(prev => ({ ...prev, currentYear: e.target.value }))}
                    placeholder="2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Academic Year Start</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={academicYear.startDate}
                    onChange={(e) => setAcademicYear(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Academic Year End</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={academicYear.endDate}
                    onChange={(e) => setAcademicYear(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Academic Year Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Year</p>
                    <p className="font-medium">{academicYear.currentYear}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {new Date(academicYear.startDate).toLocaleDateString()} - {new Date(academicYear.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Days</p>
                    <p className="font-medium">
                      {Math.ceil((new Date(academicYear.endDate).getTime() - new Date(academicYear.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAcademicYear} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Academic Year
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
