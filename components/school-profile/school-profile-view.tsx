"use client";

import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Calendar,
  Edit,
  Loader2,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface SchoolProfile {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  establishedYear?: string;
  studentCapacity?: string;
  currentStudents?: string;
  status?: "active" | "inactive" | "pending";
}

interface SchoolProfileDialogProps {
  school: SchoolProfile;
  onUpdate?: (data: Partial<SchoolProfile>) => void | Promise<void>;
  isLoading?: boolean;
}

type EditSection = "basic" | "location" | "contact" | null;

const schoolTypeLabels: Record<string, string> = {
  elementary: "Elementary School",
  middle: "Middle School",
  high: "High School",
  college: "College",
  university: "University",
  vocational: "Vocational School",
  other: "Other",
};

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  inactive: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
};

export function SchoolProfile({
  school,
  onUpdate,
  isLoading = false,
}: SchoolProfileDialogProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "location" | "contact">("basic");
  const [editingSection, setEditingSection] = useState<EditSection>(null);
  const [editFormData, setEditFormData] = useState<Partial<SchoolProfile>>({});
  const [isSaving, setIsSaving] = useState(false);

  const openEditDialog = (section: EditSection) => {
    setEditingSection(section);
    // Pre-populate form with current data
    if (section === "basic") {
      setEditFormData({
        name: school.name,
        type: school.type,
        description: school.description,
        establishedYear: school.establishedYear,
        studentCapacity: school.studentCapacity,
      });
    } else if (section === "location") {
      setEditFormData({
        address: school.address,
        city: school.city,
        state: school.state,
        zipCode: school.zipCode,
        country: school.country,
      });
    } else if (section === "contact") {
      setEditFormData({
        phone: school.phone,
        email: school.email,
        website: school.website,
      });
    }
  };

  const handleEditChange = (field: keyof SchoolProfile, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (onUpdate) {
      setIsSaving(true);
      try {
        await onUpdate(editFormData);
        setEditingSection(null);
        setEditFormData({});
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditFormData({});
  };

  const tabs = [
    { id: "basic" as const, label: "Basic Information", icon: Building2 },
    { id: "location" as const, label: "Location", icon: MapPin },
    { id: "contact" as const, label: "Contact Information", icon: Phone },
  ];

  return (
    <>
      <div className=" space-y-4 mx-auto">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {school.name}
                </h1>
                <p className="text-muted-foreground">
                  {schoolTypeLabels[school.type] || school.type}
                </p>
              </div>
            </div>
          </div>
          {school.status && (
            <Badge
              variant="outline"
              className={statusColors[school.status]}
            >
              {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
            </Badge>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border">
          <div className="flex gap-8">
            {tabs.map((tab) => {
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

        {/* Tab Content */}
        {activeTab === "basic" && (
          <>
        {/* Quick Stats */}
        {(school.establishedYear || school.currentStudents || school.studentCapacity) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {school.establishedYear && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Established</p>
                      <p className="text-2xl font-semibold">{school.establishedYear}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {(school.currentStudents || school.studentCapacity) && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <p className="text-2xl font-semibold">
                        {school.currentStudents || "0"}
                        {school.studentCapacity && (
                          <span className="text-sm text-muted-foreground font-normal">
                            {" "}/ {school.studentCapacity}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  General details about the school
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => openEditDialog("basic")}
                disabled={isLoading}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">School Name</p>
                <p className="text-base">{school.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <p className="text-base">
                  {schoolTypeLabels[school.type] || school.type}
                </p>
              </div>
              {school.establishedYear && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Established Year
                  </p>
                  <p className="text-base">{school.establishedYear}</p>
                </div>
              )}
              {school.studentCapacity && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Student Capacity
                  </p>
                  <p className="text-base">{school.studentCapacity}</p>
                </div>
              )}
            </div>
            {school.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {school.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
          </>
        )}

        {activeTab === "location" && (
          /* Location Card */
          <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
                <CardDescription>
                  Physical address and location details
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => openEditDialog("location")}
                disabled={isLoading}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-base">{school.address}</p>
              <p className="text-base">
                {school.city}, {school.state} {school.zipCode}
              </p>
              <p className="text-base">{school.country}</p>
            </div>
          </CardContent>
        </Card>
        )}

        {activeTab === "contact" && (
          /* Contact Information Card */
          <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Ways to get in touch with the school
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => openEditDialog("contact")}
                disabled={isLoading}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-base">{school.phone}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a
                  href={`mailto:${school.email}`}
                  className="text-base text-primary hover:underline"
                >
                  {school.email}
                </a>
              </div>
            </div>
            {school.website && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-primary hover:underline"
                    >
                      {school.website}
                    </a>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        )}
      </div>

      {/* Edit Basic Information Dialog */}
      <Dialog
        open={editingSection === "basic"}
        onOpenChange={(open) => !open && handleCancelEdit()}
      >
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Edit Basic Information
            </DialogTitle>
            <DialogDescription>
              Update the basic details of the school
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="edit-name">School Name</Label>
              <Input
                id="edit-name"
                value={editFormData.name || ""}
                onChange={(e) => handleEditChange("name", e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">School Type</Label>
              <select
                id="edit-type"
                value={editFormData.type || ""}
                onChange={(e) => handleEditChange("type", e.target.value)}
                disabled={isSaving}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="elementary">Elementary School</option>
                <option value="middle">Middle School</option>
                <option value="high">High School</option>
                <option value="college">College</option>
                <option value="university">University</option>
                <option value="vocational">Vocational School</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-year">Established Year</Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={editFormData.establishedYear || ""}
                  onChange={(e) => handleEditChange("establishedYear", e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Student Capacity</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={editFormData.studentCapacity || ""}
                  onChange={(e) => handleEditChange("studentCapacity", e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description || ""}
                onChange={(e) => handleEditChange("description", e.target.value)}
                disabled={isSaving}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog
        open={editingSection === "location"}
        onOpenChange={(open) => !open && handleCancelEdit()}
      >
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Edit Location
            </DialogTitle>
            <DialogDescription>
              Update the school's address and location
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="edit-address">Street Address</Label>
              <Input
                id="edit-address"
                value={editFormData.address || ""}
                onChange={(e) => handleEditChange("address", e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={editFormData.city || ""}
                  onChange={(e) => handleEditChange("city", e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-state">State/Province</Label>
                <Input
                  id="edit-state"
                  value={editFormData.state || ""}
                  onChange={(e) => handleEditChange("state", e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-zip">ZIP/Postal Code</Label>
                <Input
                  id="edit-zip"
                  value={editFormData.zipCode || ""}
                  onChange={(e) => handleEditChange("zipCode", e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-country">Country</Label>
                <Input
                  id="edit-country"
                  value={editFormData.country || ""}
                  onChange={(e) => handleEditChange("country", e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog
        open={editingSection === "contact"}
        onOpenChange={(open) => !open && handleCancelEdit()}
      >
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Edit Contact Information
            </DialogTitle>
            <DialogDescription>
              Update the school's contact details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editFormData.phone || ""}
                onChange={(e) => handleEditChange("phone", e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email || ""}
                onChange={(e) => handleEditChange("email", e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input
                id="edit-website"
                type="url"
                value={editFormData.website || ""}
                onChange={(e) => handleEditChange("website", e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
