"use client";

import React, { useState } from "react";
import {
  Building2,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  ChevronRight,
  ChevronLeft,
  Check,
  CircleCheckBig,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CreateSchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: SchoolFormData) => void | Promise<void>;
  isLoading?: boolean;
}

export interface SchoolFormData {
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
  { id: 1, title: "Basic Info", description: "School details" },
  { id: 2, title: "Location", description: "Address information" },
  { id: 3, title: "Contact", description: "Contact details" },
];

export function CreateSchoolDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateSchoolDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SchoolFormData>({
    name: "",
    type: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    establishedYear: "",
    studentCapacity: "",
  });

  const handleChange = (field: keyof SchoolFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (currentStep === 3 && onSubmit) {
      await onSubmit(formData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phone: "",
      email: "",
      website: "",
      description: "",
      establishedYear: "",
      studentCapacity: "",
    });
    setCurrentStep(1);
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.name && formData.type;
    }
    if (currentStep === 2) {
      return (
        formData.address &&
        formData.city &&
        formData.state &&
        formData.zipCode &&
        formData.country
      );
    }
    if (currentStep === 3) {
      return formData.phone && formData.email;
    }
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:min-w-[70vw] max-h-[95vh] overflow-hidden p-0 shadow-xl flex"
        showCloseButton={false}
      >
        {/* Step Indicator Sidebar */}
        <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <h3 className="text-sidebar-foreground text-lg  font-serif font-semibold">
                School Account Setup
              </h3>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-start gap-3 transition-all ${
                  currentStep >= step.id ? "opacity-100" : "opacity-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all ${
                    currentStep > step.id
                      ? "bg-green-500 text-white"
                      : currentStep === step.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground ring-2 ring-sidebar-primary/20"
                      : "bg-sidebar-accent text-sidebar-accent-foreground"
                  }`}
                >
                  {currentStep > step.id ? <CircleCheckBig /> : step.id}
                </div>
                <div className="flex-1 pt-0.5">
                  <div
                    className={`text-sm font-medium ${
                      currentStep >= step.id
                        ? "text-sidebar-foreground"
                        : "text-sidebar-foreground/60"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-sidebar-foreground/60 mt-0.5">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col max-h-[95vh]">
          <div className="flex-1 overflow-y-auto px-8 py-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Building2 className="h-6 w-6 text-blue-600" />
                Welcome! Let's Set Up Your School
              </DialogTitle>
              <DialogDescription>
                Step {currentStep} of 3 - {steps[currentStep - 1].description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      School Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter school name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">
                      School Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleChange("type", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select school type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Select school type</SelectItem>
                        {schoolTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="establishedYear">Established Year</Label>
                      <Input
                        id="establishedYear"
                        type="number"
                        placeholder="e.g., 1990"
                        value={formData.establishedYear}
                        onChange={(e) =>
                          handleChange("establishedYear", e.target.value)
                        }
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="studentCapacity"
                        className="flex items-center gap-2"
                      >
                        <Users className="h-4 w-4" />
                        Student Capacity
                      </Label>
                      <Input
                        id="studentCapacity"
                        type="number"
                        placeholder="e.g., 500"
                        value={formData.studentCapacity}
                        onChange={(e) =>
                          handleChange("studentCapacity", e.target.value)
                        }
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the school..."
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      disabled={isLoading}
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Location Information */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Street Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="Enter street address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">
                        State/Province <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="state"
                        placeholder="Enter state"
                        value={formData.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">
                        ZIP/Postal Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="zipCode"
                        placeholder="Enter ZIP code"
                        value={formData.zipCode}
                        onChange={(e) =>
                          handleChange("zipCode", e.target.value)
                        }
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">
                        Country <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="country"
                        placeholder="Enter country"
                        value={formData.country}
                        onChange={(e) =>
                          handleChange("country", e.target.value)
                        }
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      disabled={isLoading}
                      className="h-11"
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
                      placeholder="contact@school.edu"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="website"
                      className="flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.school.edu"
                      value={formData.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="px-8 py-6 border-t">
            <div className="flex justify-between w-full">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isLoading}
                className="h-11 px-6"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid() || isLoading}
                  className="h-11 px-6"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isLoading}
                  className="h-11 px-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
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
