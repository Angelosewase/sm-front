"use client";

import React, { useState } from "react";
import { Plus, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CreateSchoolDialog,
  SchoolFormData,
} from "@/components/school-profile/create-school-dialog";
import { SchoolProfile } from "@/components/school-profile/school-profile-view";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function SetupSchoolProfilePage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(
    null
  );

  // Example: Handle creating a new school
  const handleCreateSchool = async (data: SchoolFormData) => {
    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create school profile from form data
      const newSchool: SchoolProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        type: data.type,
        address: data.address,
        city: data.city,
        district: data.district,
        phone: data.phone,
        email: data.email,
        website: data.website,
        description: data.description,
        establishedYear: data.establishedYear,
        studentCapacity: data.studentCapacity,
        status: "active",
        currentStudents: "0",
      };

      setSchoolProfile(newSchool);
      setCreateDialogOpen(false);
      toast.success("School created successfully!");
    } catch (error) {
      toast.error("Failed to create school");
    } finally {
      setIsCreating(false);
    }
  };

  // Example: Handle updating school profile
  const handleUpdateSchool = async (data: Partial<SchoolProfile>) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (schoolProfile) {
        setSchoolProfile({ ...schoolProfile, ...data });
        toast.success("School profile updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update school profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className=" mx-auto p-4">
        <div className=" mx-auto space-y-4">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            {!schoolProfile && (
              <Button onClick={() => setCreateDialogOpen(true)} size="lg">
                <Plus className="h-5 w-5" />
                Create School Profile
              </Button>
            )}
          </div>

          {/* Content Area */}
          {schoolProfile ? (
            <SchoolProfile
              school={schoolProfile}
              onUpdate={handleUpdateSchool}
            />
          ) : (
            <Card className="border-dashed">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <School className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  No School Profile Yet
                </CardTitle>
                <CardDescription className="text-base">
                  Get started by creating your school profile. This will help
                  you manage your institution's information and settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <Button onClick={() => setCreateDialogOpen(true)} size="lg">
                  <Plus className="h-5 w-5" />
                  Create School Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create School Dialog */}
      <CreateSchoolDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateSchool}
        isLoading={isCreating}
      />
    </div>
  );
}
