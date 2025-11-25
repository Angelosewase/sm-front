"use client";

import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Logo } from "../logo";
import { useValidateToken, useRegisterWithToken } from "@/hooks/use-registration-tokens";
import { useRouter } from "next/navigation";
import type { RegistrationTokenRole } from "@/lib/api/registration-tokens";

// Base schema for all roles
const baseSchema = z.object({
  token: z.string().min(1, "Token is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
  phone: z.string().optional(),
  yearsOfExperience: z.coerce.number().min(0).optional(),
  qualifications: z.array(z.string()).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  emergencyContact: z.string().optional(),
  additionalNotes: z.string().optional(),
});

// School owner specific schema
const schoolOwnerSchema = baseSchema.extend({
  schoolName: z.string().min(1, "School name is required"),
  schoolCity: z.string().min(1, "School city is required"),
  schoolDistrict: z.string().min(1, "School district is required"),
  schoolPhoneNumber: z.string().min(1, "School phone number is required"),
  schoolEmail: z.string().email("Invalid school email address"),
  schoolWebsite: z.string().url("Invalid website URL"),
  schoolType: z.string().optional(),
  establishedYear: z.coerce.number().optional(),
  studentCapacity: z.coerce.number().min(0).optional(),
  schoolDescription: z.string().optional(),
  schoolAddress: z.string().optional(),
});

interface TokenValidationResult {
  valid: boolean;
  role: RegistrationTokenRole;
  schoolId: string | null;
  expiresAt: string;
}

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-primary/10">
    {children}
  </div>
);


export default function RegisterWithToken() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [tokenValidation, setTokenValidation] = useState<TokenValidationResult | null>(null);
  const [qualificationInput, setQualificationInput] = useState("");
  const [qualifications, setQualifications] = useState<string[]>([]);

  const validateTokenMutation = useValidateToken();
  const registerMutation = useRegisterWithToken();

  const isSchoolOwner = tokenValidation?.role === "school owner";
  const schema = isSchoolOwner ? schoolOwnerSchema : baseSchema;

  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors },
    setError,
    setValue,
    trigger,
  } = useForm<any>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      token: "",
      email: "",
      password: "",
      name: "",
      phone: "",
      yearsOfExperience: undefined,
      qualifications: [],
      address: "",
      city: "",
      state: "",
      zipCode: "",
      emergencyContact: "",
      additionalNotes: "",
    },
  });

  const tokenValue = watch("token");

  // Define steps with titles and subtitles
  const steps = [
    { 
      id: 0, 
      title: "Registration Token", 
      subtitle: "Enter your unique registration token to begin",
      fields: ["token"] 
    },
    { 
      id: 1, 
      title: "Personal Information", 
      subtitle: "Tell us about yourself and your credentials",
      fields: ["name", "email", "password", "phone", "yearsOfExperience"] 
    },
    { 
      id: 2, 
      title: "Contact & Location", 
      subtitle: "Where are you located and how can we reach you?",
      fields: ["address", "city", "state", "zipCode", "emergencyContact"] 
    },
    ...(isSchoolOwner ? [{ 
      id: 3, 
      title: "School Details", 
      subtitle: "Information about your educational institution",
      fields: ["schoolName", "schoolCity", "schoolDistrict", "schoolPhoneNumber", "schoolEmail", "schoolWebsite"] 
    }] : []),
  ];

  // Validate token when it changes
  useEffect(() => {
    const validateToken = async () => {
      if (!tokenValue || tokenValue.trim().length < 10) {
        setTokenValidation(null);
        return;
      }

      try {
        const result = await validateTokenMutation.mutateAsync({
          token: tokenValue.trim(),
        });
        setTokenValidation(result);
      } catch (error) {
        setTokenValidation(null);
      }
    };

    const timeoutId = setTimeout(validateToken, 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenValue]);

  const addQualification = () => {
    if (qualificationInput.trim()) {
      const newQuals = [...qualifications, qualificationInput.trim()];
      setQualifications(newQuals);
      setValue("qualifications", newQuals);
      setQualificationInput("");
    }
  };

  const removeQualification = (index: number) => {
    const newQuals = qualifications.filter((_, i) => i !== index);
    setQualifications(newQuals);
    setValue("qualifications", newQuals);
  };

  const nextStep = async () => {
    const fieldsToValidate = steps[currentStep].fields;
    const isValid = await trigger(fieldsToValidate as any);
    
    if (currentStep === 0 && !tokenValidation?.valid) {
      setError("token", { message: "Please enter a valid token" });
      return;
    }
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (values: any) => {
    if (!tokenValidation || !tokenValidation.valid) {
      setError("token", { message: "Please enter a valid token" });
      return;
    }

    try {
      await registerMutation.mutateAsync(values);
      // Redirect to login page after successful registration
      router.push("/login");
    } catch (error: any) {
      // Error is already handled by the hook's onError callback
      const message = error?.response?.data?.message || "Registration failed";
      setError("root", { message });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full  flex flex-col lg:flex-row gap-6">
        {/* Vertical Tabs Sidebar */}
        <div className="w-full lg:w-1/4 flex-shrink-0 ">
          <div className="bg-white dark:bg-card rounded-lg  p-4 lg:p-6 lg:sticky lg:top-4">
            {/* Logo */}
            <div className="flex justify-start mb-4 lg:mb-6 max-w-32 max-h-32 mx-auto">
              <Logo />
            </div>

            {/* Vertical Tabs - Horizontal on mobile, vertical on desktop */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    // Only allow clicking if step is completed or current
                    if (index <= currentStep || index === 0) {
                      setCurrentStep(index);
                    }
                  }}
                  className={`flex-shrink-0 lg:w-full text-left p-3 lg:p-4 rounded-xl transition-all ${
                    index === currentStep
                      ? "border-2 border-primary text-primary shadow-md"
                      : index < currentStep
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-2 border-green-200 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  } ${index > currentStep ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                  disabled={index > currentStep}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${
                        index === currentStep
                          ? "bg-primary/20 text-primary"
                          : index < currentStep
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm ${index === currentStep ? "text-primary" : ""}`}>
                        {step.title}
                      </div>
                      <div className={`text-xs mt-0.5 hidden lg:block ${index === currentStep ? "text-primary/80" : "text-gray-500 dark:text-gray-400"}`}>
                        {step.subtitle}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 bg-white dark:bg-card rounded-none border-l  p-8  ">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {steps[currentStep].subtitle}
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {/* Step 0: Token */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Registration Token
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Enter the registration token provided to you. This token determines your role and access level.
                  </p>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Registration Token *
                  </label>
                  <GlassInputWrapper>
                    <div className="relative">
                      <input
                        {...register("token")}
                        type="text"
                        placeholder="Enter your registration token"
                        className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                      />
                      {validateTokenMutation.isPending && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                        </div>
                      )}
                      {!validateTokenMutation.isPending && tokenValidation && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          {tokenValidation.valid ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </GlassInputWrapper>
                  {errors.token && (
                    <p className="text-sm text-red-500 mt-1">
                      {String(errors.token.message)}
                    </p>
                  )}
                  {tokenValidation && tokenValidation.valid && (
                    <p className="text-sm text-green-500 mt-1">
                      Valid token for {tokenValidation.role}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Basic Information
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Provide your personal details and account credentials.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <GlassInputWrapper>
                      <input
                        {...register("name")}
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                    <GlassInputWrapper>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {String(errors.email.message)}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 mt-6">
                    Account Credentials
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Create a secure password for your account.
                  </p>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password *</label>
                  <GlassInputWrapper>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password (min 8 characters)"
                        className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </GlassInputWrapper>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {String(errors.password.message)}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 mt-6">
                    Contact Information
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    How can we reach you?
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <GlassInputWrapper>
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="Enter your phone number"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Years of Experience</label>
                    <GlassInputWrapper>
                      <input
                        {...register("yearsOfExperience")}
                        type="number"
                        min="0"
                        placeholder="Years of experience"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 mt-6">
                    Professional Qualifications
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Add your educational qualifications and certifications.
                  </p>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Qualifications</label>
                  <div className="flex gap-2 mb-2">
                    <div className="flex-1">
                      <GlassInputWrapper>
                        <input
                          type="text"
                          value={qualificationInput}
                          onChange={(e) => setQualificationInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addQualification();
                            }
                          }}
                          placeholder="Add qualification (press Enter)"
                          className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                        />
                      </GlassInputWrapper>
                    </div>
                    <button
                      type="button"
                      onClick={addQualification}
                      className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {qualifications.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {qualifications.map((qual, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                        >
                          {qual}
                          <button
                            type="button"
                            onClick={() => removeQualification(index)}
                            className="hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Residential Address
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Provide your home address and location details.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Street Address</label>
                  <GlassInputWrapper>
                    <input
                      {...register("address")}
                      type="text"
                      placeholder="Enter your address"
                      className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    />
                  </GlassInputWrapper>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                    <GlassInputWrapper>
                      <input
                        {...register("city")}
                        type="text"
                        placeholder="City"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State/Province</label>
                    <GlassInputWrapper>
                      <input
                        {...register("state")}
                        type="text"
                        placeholder="State"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ZIP/Postal Code</label>
                    <GlassInputWrapper>
                      <input
                        {...register("zipCode")}
                        type="text"
                        placeholder="ZIP Code"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 mt-6">
                    Emergency Contact
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Provide contact information for emergency situations.
                  </p>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emergency Contact</label>
                  <GlassInputWrapper>
                    <input
                      {...register("emergencyContact")}
                      type="text"
                      placeholder="Emergency contact information"
                      className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    />
                  </GlassInputWrapper>
                </div>
              </div>
            )}

            {/* Step 3: School Info (only for school owner) */}
            {currentStep === 3 && isSchoolOwner && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    School Information
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Provide details about your educational institution.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School Name *</label>
                  <GlassInputWrapper>
                    <input
                      {...register("schoolName")}
                      type="text"
                      placeholder="Enter school name"
                      className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    />
                  </GlassInputWrapper>
                  {(errors as any).schoolName && (
                    <p className="text-sm text-red-500 mt-1">
                      {(errors as any).schoolName.message}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 mt-6">
                    School Location
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Where is your school located?
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School City *</label>
                    <GlassInputWrapper>
                      <input
                        {...register("schoolCity")}
                        type="text"
                        placeholder="School city"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                    {(errors as any).schoolCity && (
                      <p className="text-sm text-red-500 mt-1">
                        {(errors as any).schoolCity.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School District *</label>
                    <GlassInputWrapper>
                      <input
                        {...register("schoolDistrict")}
                        type="text"
                        placeholder="School district"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                    {(errors as any).schoolDistrict && (
                      <p className="text-sm text-red-500 mt-1">
                        {(errors as any).schoolDistrict.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 mt-6">
                    School Contact Information
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    How can people contact your school?
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School Phone *</label>
                    <GlassInputWrapper>
                      <input
                        {...register("schoolPhoneNumber")}
                        type="tel"
                        placeholder="School phone number"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                    {(errors as any).schoolPhoneNumber && (
                      <p className="text-sm text-red-500 mt-1">
                        {(errors as any).schoolPhoneNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School Email *</label>
                    <GlassInputWrapper>
                      <input
                        {...register("schoolEmail")}
                        type="email"
                        placeholder="School email address"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                    {(errors as any).schoolEmail && (
                      <p className="text-sm text-red-500 mt-1">
                        {(errors as any).schoolEmail.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School Website *</label>
                  <GlassInputWrapper>
                    <input
                      {...register("schoolWebsite")}
                      type="url"
                      placeholder="https://www.school.com"
                      className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    />
                  </GlassInputWrapper>
                  {(errors as any).schoolWebsite && (
                    <p className="text-sm text-red-500 mt-1">
                      {(errors as any).schoolWebsite.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.root && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 rounded-2xl border-2 border-primary py-4 font-medium text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 rounded-2xl bg-primary py-4 font-medium text-white hover:bg-primary/80 transition-colors flex items-center justify-center gap-2"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={registerMutation.isPending}
                  className="flex-1 rounded-2xl bg-primary py-4 font-medium text-white hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {registerMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {registerMutation.isPending ? "Registering..." : "Create Account"}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline transition-colors">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
