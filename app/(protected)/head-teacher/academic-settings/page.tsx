"use client";

import React, { useState } from "react";
import { Settings, BookOpen, Clock, Calendar } from "lucide-react";
import { GradingSystem } from "@/components/academic-setup/grading-system";
import { PassMarks } from "@/components/academic-setup/pass-marks";
import { Terms } from "@/components/academic-setup/terms";
import { AcademicYear } from "@/components/academic-setup/academic-year";

export default function AcademicSettingsPage() {
  const [activeTab, setActiveTab] = useState("passmarks");

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
            // { id: "grading", label: "Grading System", icon: Settings },
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
        {/* {activeTab === "grading" && <GradingSystem />} */}
        {activeTab === "passmarks" && <PassMarks />}
        {activeTab === "terms" && <Terms />}
        {activeTab === "academic-year" && <AcademicYear />}
      </div>
    </div>
  );
}
