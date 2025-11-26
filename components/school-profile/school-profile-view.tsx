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
  Edit3,
  Loader2,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import Image from "next/image";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  logoUrl?: string;
}

interface SchoolProfileProps {
  school: SchoolProfile;
  onUpdate?: (data: FormData) => void | Promise<void>;
  isLoading?: boolean;
}

type EditSection = "info" | "location" | "contact" | null;

const schoolTypeLabels: Record<string, string> = {
  elementary: "Elementary School",
  middle: "Middle School",
  high: "High School",
  college: "College",
  university: "University",
  vocational: "Vocational School",
  other: "Other",
};

const statusBadge: Record<string, { color: string; label: string }> = {
  active: { color: "bg-green-500/10 text-green-700 border-green-500/20", label: "Active" },
  inactive: { color: "bg-gray-500/10 text-gray-700 border-gray-500/20", label: "Inactive" },
  pending: { color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20", label: "Pending" },
};

export function SchoolProfile({ school, onUpdate, isLoading = false }: SchoolProfileProps) {
  console.log("the school is : ", school)
  const [activeTab, setActiveTab] = useState<"info" | "contact">("info");
  const [editing, setEditing] = useState<EditSection>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<SchoolProfile> & { logoFile?: File }>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const openEdit = (section: EditSection) => {
    setEditing(section);
    setLogoPreview(school.logoUrl || null);

    if (section === "info") {
      setFormData({
        name: school.name,
        type: school.type,
        description: school.description,
        establishedYear: school.establishedYear,
        studentCapacity: school.studentCapacity,
      });
    } else if (section === "location") {
      setFormData({
        address: school.address,
        city: school.city,
        district: school.district,
      });
    } else if (section === "contact") {
      setFormData({
        phone: school.phone,
        email: school.email,
        website: school.website,
      });
    }
  };

  const closeEdit = () => {
    setEditing(null);
    setFormData({});
    setLogoPreview(null);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logoFile: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!onUpdate) return;

    setIsSaving(true);
    const { logoFile, ...data } = formData;
    const payload = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        payload.append(key, value as string);
      }
    });

    if (logoFile) payload.append("logo", logoFile);

    try {
      await onUpdate(payload);
      closeEdit();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Profile Header */}
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-border bg-muted flex-shrink-0">
              {school.logoUrl ? (
                <Image
                  src={school.logoUrl}
                  alt={school.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Building2 className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{school.name}</h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-muted-foreground">
                  {schoolTypeLabels[school.type] || school.type}
                </span>
                {school.status && (
                  <Badge variant="secondary" className={statusBadge[school.status].color}>
                    {statusBadge[school.status].label}
                  </Badge>
                )}
              </div>
              {school.description && (
                <p className="mt-3 text-muted-foreground max-w-2xl">{school.description}</p>
              )}
            </div>
          </div>

          <Button onClick={() => openEdit("info")} size="sm" className="gap-2">
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-8">
            {(["info", "contact"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${activeTab === tab
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab === "info" ? "School Information" : "Contact & Location"}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "info" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">About</h3>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Established {school.establishedYear || "—"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Capacity: {school.studentCapacity || "—"} students</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Location</h3>
                    <Button variant="ghost" size="sm" onClick={() => openEdit("location")}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{school.address}</p>
                      <p>
                        {school.city}, {school.district}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Contact</h3>
                    <Button variant="ghost" size="sm" onClick={() => openEdit("contact")}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{school.phone || "—"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${school.email}`} className="text-foreground hover:underline">
                        {school.email}
                      </a>
                    </div>
                    {school.website && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">
                          {school.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit School Info Dialog */}
      <Dialog open={editing === "info"} onOpenChange={(o) => !o && closeEdit()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Building2 className="h-6 w-6" />
              Edit School Information
            </DialogTitle>
            <DialogDescription>
              Update your school name, type, logo, and description.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Logo */}
            <div className="space-y-3">
              <Label>School Logo</Label>
              <div className="flex items-center gap-4">
                <div className="  relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-muted">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="School Logo"
                      fill
                      className="object-contain p-2"
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <input type="file" id="logo" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  <Label
                    htmlFor="logo"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-accent"
                  >
                    <Upload className="h-4 w-4" />
                    {logoPreview ? "Change" : "Upload"} Logo
                  </Label>
                  {logoPreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-3"
                      onClick={() => {
                        setLogoPreview(null);
                        setFormData(prev => ({ ...prev, logoFile: undefined }));
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>School Name</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>School Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(schoolTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Established Year</Label>
                <Input
                  type="number"
                  placeholder="1990"
                  value={formData.establishedYear || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Student Capacity</Label>
                <Input
                  type="number"
                  placeholder="1200"
                  value={formData.studentCapacity || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentCapacity: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={formData.description || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What makes your school special?"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeEdit} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={editing === "location"} onOpenChange={(o) => !o && closeEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <MapPin className="h-6 w-6" />
              Edit Location
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input value={formData.address || ""} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={formData.city || ""} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input value={formData.district || ""} onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEdit}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={editing === "contact"} onOpenChange={(o) => !o && closeEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Phone className="h-6 w-6" />
              Edit Contact Information
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" value={formData.phone || ""} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email || ""} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input type="url" value={formData.website || ""} onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))} placeholder="https://" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEdit}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}