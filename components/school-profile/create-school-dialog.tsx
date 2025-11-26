"use client";

import React, { useState } from "react";
import {
  Building2,
  Loader2,
  Phone,
  Mail,
  Globe,
  Users,
  ArrowLeft,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  CircleCheckBig,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateSchoolDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: FormData) => void | Promise<void>;
  isLoading?: boolean;
  preventClose?: boolean;
}

const schoolTypes = [
  { value: "elementary", label: "Elementary School" },
  { value: "middle", label: "Middle School" },
  { value: "high", label: "High School" },
  { value: "college", label: "College" },
  { value: "university", label: "University" },
  { value: "vocational", label: "Vocational School" },
  { value: "other", label: "Other" },
];

const steps = [
  { id: 1, title: "Basic Information", description: "School name, type, and location" },
  { id: 2, title: "Contact Details", description: "Phone, email, and website" },
];

export function CreateSchoolDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  preventClose = false,
}: CreateSchoolDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    city: "",
    district: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    establishedYear: "",
    studentCapacity: "",
    logo: null as File | null,
  });

  const updateField = (field: keyof typeof formData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField("logo", file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    updateField("logo", null);
    setLogoPreview(null);
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.name && formData.type && formData.address && formData.city && formData.district;
    }
    if (currentStep === 2) {
      return formData.phone && formData.email;
    }
    return false;
  };

  const handleNext = () => {
    if (currentStep < steps.length && isStepValid()) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit || !isStepValid()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        data.append(key, value as string | Blob);
      }
    });

    onSubmit(data);
  };

  const handleClose = (open: boolean) => {
    if (preventClose && open === false) return;
    if (!open) {
      // Reset on close
      setCurrentStep(1);
      setLogoPreview(null);
      setFormData({
        name: "",
        type: "",
        address: "",
        city: "",
        district: "",
        phone: "",
        email: "",
        website: "",
        description: "",
        establishedYear: "",
        studentCapacity: "",
        logo: null,
      });
    }
    onOpenChange?.(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-hidden flex flex-col sm:flex-row" showCloseButton={!preventClose}>
        {/* Sidebar - Step Indicator */}
        <div className="w-full sm:w-80 bg-muted/50 border-b sm:border-b-0 sm:border-r flex flex-row sm:flex-col">
          <div className="p-6 border-b sm:border-b-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Setup Required
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Complete your school profile to get started.
            </p>
          </div>

          <div className="flex sm:flex-col p-6 gap-8 sm:gap-6">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center sm:items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep > step.id
                        ? "bg-green-500 text-white"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? <CircleCheckBig className="h-5 w-5" /> : step.id}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-px sm:w-[2px] h-16 sm:h-20 mt-2 transition-all ${
                        currentStep > step.id + 1 ? "bg-green-500" : "bg-border"
                      }`}
                    />
                  )}
                </div>
                <div className={`hidden sm:block ${currentStep >= step.id ? "opacity-100" : "opacity-50"}`}>
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="h-7 w-7" />
                Create Your School
              </DialogTitle>
              <DialogDescription>
                Step {currentStep} of {steps.length} — {steps[currentStep - 1].description}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                  {/* Logo Upload */}
                  <div className="space-y-3">
                    <Label>School Logo</Label>
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/25 bg-muted flex items-center justify-center">
                        {logoPreview ? (
                          <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                        ) : (
                          <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="file"
                          id="logo"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                          disabled={isLoading}
                        />
                        <Label
                          htmlFor="logo"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition"
                        >
                          <Upload className="h-4 w-4" />
                          {logoPreview ? "Change Logo" : "Upload Logo"}
                        </Label>
                        {logoPreview && (
                          <Button type="button" variant="ghost" size="sm" onClick={removeLogo}>
                            Remove
                          </Button>
                        )}
                        <p className="text-xs text-muted-foreground">JPG, PNG, WebP up to 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">School Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="e.g. Springfield High School"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">School Type <span className="text-red-500">*</span></Label>
                      <Select
                        value={formData.type}
                        onValueChange={(v) => updateField("type", v)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {schoolTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="establishedYear">Established Year</Label>
                      <Input
                        id="establishedYear"
                        type="number"
                        placeholder="1990"
                        value={formData.establishedYear}
                        onChange={(e) => updateField("establishedYear", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="studentCapacity" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Student Capacity
                      </Label>
                      <Input
                        id="studentCapacity"
                        type="number"
                        placeholder="1200"
                        value={formData.studentCapacity}
                        onChange={(e) => updateField("studentCapacity", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="123 Education Street"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        placeholder="Springfield"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District <span className="text-red-500">*</span></Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => updateField("district", e.target.value)}
                        placeholder="Central District"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Tell us about your school..."
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Contact Info */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-1234"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@school.edu"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website (Optional)
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.school.edu"
                      value={formData.website || ""}
                      onChange={(e) => updateField("website", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer with Navigation */}
          <DialogFooter className="border-t px-8 py-6 bg-muted/50">
            <div className="flex justify-between w-full items-center">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </div>

              {currentStep < steps.length ? (
                <Button onClick={handleNext} disabled={!isStepValid() || isLoading}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!isStepValid() || isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create School
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}