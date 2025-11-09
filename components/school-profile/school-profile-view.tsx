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

export interface SchoolProfile {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  district: string;
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

type EditSection = "schoolInfo" | "location" | "contact" | null;

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
  active:
    "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  inactive:
    "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  pending:
    "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
};

export function SchoolProfile({
  school,
  onUpdate,
  isLoading = false,
}: SchoolProfileDialogProps) {
  const [activeTab, setActiveTab] = useState<"schoolInfo" | "contact">(
    "schoolInfo"
  );
  const [editingSection, setEditingSection] = useState<EditSection>(null);
  const [editFormData, setEditFormData] = useState<Partial<SchoolProfile>>({});
  const [isSaving, setIsSaving] = useState(false);

  const openEditDialog = (section: EditSection) => {
    setEditingSection(section);
    // Pre-populate form with current data
    if (section === "schoolInfo") {
      setEditFormData({
        name: school.name,
        type: school.type,
        description: school.description,
        establishedYear: school.establishedYear,
        studentCapacity: school.studentCapacity,
        address: school.address,
        city: school.city,
        district: school.district,
      });
    } else if (section === "location") {
      setEditFormData({
        address: school.address,
        city: school.city,
        district: school.district,
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
    { id: "schoolInfo" as const, label: "School Info", icon: Building2 },
    { id: "contact" as const, label: "Contact Information", icon: Phone },
  ];

  return (
    <>
      <div className="space-y-8 mx-auto">
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
            <Badge variant="outline" className={statusColors[school.status]}>
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
        {activeTab === "schoolInfo" && (
          <>
            {(school.establishedYear ||
              school.currentStudents ||
              school.studentCapacity) && (
              <div className="rounded-3xl border border-border/60 bg-background/40 backdrop-blur p-2">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60">
                  {school.establishedYear && (
                    <div className="flex items-center gap-4 p-6">
                      <span className="rounded-full bg-primary/10 text-primary p-3">
                        <Calendar className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Established
                        </p>
                        <p className="text-2xl font-semibold tracking-tight">
                          {school.establishedYear}
                        </p>
                      </div>
                    </div>
                  )}
                  {(school.currentStudents || school.studentCapacity) && (
                    <div className="flex items-center gap-4 p-6">
                      <span className="rounded-full bg-primary/10 text-primary p-3">
                        <Users className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Students
                        </p>
                        <p className="text-2xl font-semibold tracking-tight">
                          {school.currentStudents || "0"}
                          {school.studentCapacity && (
                            <span className="text-sm text-muted-foreground font-normal">
                              {" "}
                              / {school.studentCapacity}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <section className="rounded-3xl border border-border/60 bg-background/40 backdrop-blur p-8">
              <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    <Building2 className="h-4 w-4" />
                    Basic Information
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    General details and location for your school
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => openEditDialog("schoolInfo")}
                  disabled={isLoading}
                  className="rounded-full border border-border/60"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </header>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                    School Name
                  </p>
                  <p className="mt-1 text-base font-medium text-foreground">
                    {school.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                    Type
                  </p>
                  <p className="mt-1 text-base font-medium text-foreground">
                    {schoolTypeLabels[school.type] || school.type}
                  </p>
                </div>
                {school.establishedYear && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                      Established Year
                    </p>
                    <p className="mt-1 text-base font-medium text-foreground">
                      {school.establishedYear}
                    </p>
                  </div>
                )}
                {school.studentCapacity && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                      Student Capacity
                    </p>
                    <p className="mt-1 text-base font-medium text-foreground">
                      {school.studentCapacity}
                    </p>
                  </div>
                )}
              </div>

              {school.description && (
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                    Description
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {school.description}
                  </p>
                </div>
              )}

              <div className="mt-8 rounded-2xl border border-dashed border-border/60 bg-background/60 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-primary/10 text-primary p-3">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                        Location
                      </p>
                      <p className="mt-2 text-base font-medium text-foreground">
                        {school.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {school.city}, {school.district}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openEditDialog("location")}
                    disabled={isLoading}
                    className="rounded-full border border-border/60"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "contact" && (
          <section className="rounded-3xl border border-border/60 bg-background/40 backdrop-blur p-8">
            <header className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  <Phone className="h-4 w-4" />
                  Contact Information
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Ways for families and staff to reach the school
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => openEditDialog("contact")}
                disabled={isLoading}
                className="rounded-full border border-border/60"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </header>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <span className="rounded-full bg-primary/10 text-primary p-3">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                    Phone
                  </p>
                  <p className="mt-2 text-base font-medium text-foreground">
                    {school.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="rounded-full bg-primary/10 text-primary p-3">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                    Email
                  </p>
                  <a
                    href={`mailto:${school.email}`}
                    className="mt-2 inline-flex text-base font-medium text-primary hover:underline"
                  >
                    {school.email}
                  </a>
                </div>
              </div>

              {school.website && (
                <div className="flex items-start gap-4">
                  <span className="rounded-full bg-primary/10 text-primary p-3">
                    <Globe className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                      Website
                    </p>
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex text-base font-medium text-primary hover:underline"
                    >
                      {school.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Edit School Information Dialog */}
      <Dialog
        open={editingSection === "schoolInfo"}
        onOpenChange={(open) => !open && handleCancelEdit()}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-x-hidden border border-border/60 rounded-3xl p-0">
          <DialogHeader className="px-6 py-5 border-b border-border/60 bg-muted/60">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </span>
                  Edit School Information
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Keep your school's general details up to date so staff and
                  families always have the right information.
                </DialogDescription>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleCancelEdit}
              ></button>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-6 space-y-8">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                Core details
              </p>

              <div className="space-y-2">
                <Label htmlFor="edit-name">School Name</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name || ""}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  disabled={isSaving}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-type">School Type</Label>
                <select
                  id="edit-type"
                  value={editFormData.type || ""}
                  onChange={(e) => handleEditChange("type", e.target.value)}
                  disabled={isSaving}
                  className="w-full h-11 rounded-xl border border-border/70 bg-background/80 px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">Select type</option>
                  <option value="elementary">Elementary School</option>
                  <option value="middle">Middle School</option>
                  <option value="high">High School</option>
                  <option value="college">College</option>
                  <option value="university">University</option>
                  <option value="vocational">Vocational School</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-year">Established Year</Label>
                  <Input
                    id="edit-year"
                    type="number"
                    value={editFormData.establishedYear || ""}
                    onChange={(e) =>
                      handleEditChange("establishedYear", e.target.value)
                    }
                    disabled={isSaving}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">Student Capacity</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    value={editFormData.studentCapacity || ""}
                    onChange={(e) =>
                      handleEditChange("studentCapacity", e.target.value)
                    }
                    disabled={isSaving}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                Story
              </p>
              <Label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={editFormData.description || ""}
                onChange={(e) =>
                  handleEditChange("description", e.target.value)
                }
                disabled={isSaving}
                rows={4}
                className="mt-3 rounded-xl border-border/70"
                placeholder="Share what makes this school unique..."
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-5 gap-3 border-t border-border/60 bg-muted/40">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="h-11 rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="h-11 rounded-full px-6"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              <span className="ml-2">
                {isSaving ? "Saving..." : "Save Changes"}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog
        open={editingSection === "location"}
        onOpenChange={(open) => !open && handleCancelEdit()}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden border border-border/60 rounded-3xl p-0">
          <DialogHeader className="px-6 py-5 border-b border-border/60 bg-muted/60">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </span>
                  Edit Location
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Update the address information used across communications and
                  directories.
                </DialogDescription>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleCancelEdit}
              ></button>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="edit-address">Street Address</Label>
              <Input
                id="edit-address"
                value={editFormData.address || ""}
                onChange={(e) => handleEditChange("address", e.target.value)}
                disabled={isSaving}
                className="h-11"
                placeholder="123 School Lane"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={editFormData.city || ""}
                  onChange={(e) => handleEditChange("city", e.target.value)}
                  disabled={isSaving}
                  className="h-11"
                  placeholder="Springfield"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-district">District</Label>
                <Input
                  id="edit-district"
                  value={editFormData.district || ""}
                  onChange={(e) => handleEditChange("district", e.target.value)}
                  disabled={isSaving}
                  className="h-11"
                  placeholder="Jefferson District"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-5 gap-3 border-t border-border/60 bg-muted/40">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="h-11 rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="h-11 rounded-full px-6"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              <span className="ml-2">
                {isSaving ? "Saving..." : "Save Changes"}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog
        open={editingSection === "contact"}
        onOpenChange={(open) => !open && handleCancelEdit()}
      >
        <DialogContent className=" max-h-[90vh] overflow-hidden border border-border/60 rounded-3xl p-0">
          <DialogHeader className="px-6 py-5 border-b border-border/60 bg-muted/60">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </span>
                  Edit Contact Information
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Make sure the community can reach the right people quickly and
                  easily.
                </DialogDescription>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleCancelEdit}
              ></button>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Number
              </Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editFormData.phone || ""}
                onChange={(e) => handleEditChange("phone", e.target.value)}
                disabled={isSaving}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email || ""}
                onChange={(e) => handleEditChange("email", e.target.value)}
                disabled={isSaving}
                className="h-11"
                placeholder="name@school.org"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-website" className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Website
              </Label>
              <Input
                id="edit-website"
                type="url"
                value={editFormData.website || ""}
                onChange={(e) => handleEditChange("website", e.target.value)}
                disabled={isSaving}
                className="h-11"
                placeholder="https://"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-5 gap-3 border-t border-border/60 bg-muted/40">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="h-11 rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="h-11 rounded-full px-6"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              <span className="ml-2">
                {isSaving ? "Saving..." : "Save Changes"}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
