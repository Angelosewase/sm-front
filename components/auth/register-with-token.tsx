"use client";

import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
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

type BaseFormValues = z.infer<typeof baseSchema>;
type SchoolOwnerFormValues = z.infer<typeof schoolOwnerSchema>;

interface TokenValidationResult {
  valid: boolean;
  role: RegistrationTokenRole;
  schoolId: string | null;
  expiresAt: string;
}

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

export function RegisterWithToken() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [tokenValidation, setTokenValidation] =
    useState<TokenValidationResult | null>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
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
  } = useForm<any>({
    resolver: zodResolver(schema),
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
      ...(isSchoolOwner && {
        schoolName: "",
        schoolCity: "",
        schoolDistrict: "",
        schoolPhoneNumber: "",
        schoolEmail: "",
        schoolWebsite: "",
        schoolType: "",
        establishedYear: undefined,
        studentCapacity: undefined,
        schoolDescription: "",
        schoolAddress: "",
      }),
    },
  });

  const tokenValue = watch("token");

  // Validate token when it changes
  useEffect(() => {
    const validateToken = async () => {
      if (!tokenValue || tokenValue.trim().length < 10) {
        setTokenValidation(null);
        return;
      }

      setIsValidatingToken(true);
      try {
        const result = await validateTokenMutation.mutateAsync({
          token: tokenValue.trim(),
        });
        setTokenValidation(result);
      } catch (error) {
        setTokenValidation(null);
      } finally {
        setIsValidatingToken(false);
      }
    };

    const timeoutId = setTimeout(validateToken, 500);
    return () => clearTimeout(timeoutId);
  }, [tokenValue]);

  const addQualification = () => {
    if (qualificationInput.trim()) {
      const newQuals = [...qualifications, qualificationInput.trim()];
      setQualifications(newQuals);
      setValue("qualifications" as any, newQuals);
      setQualificationInput("");
    }
  };

  const removeQualification = (index: number) => {
    const newQuals = qualifications.filter((_, i) => i !== index);
    setQualifications(newQuals);
    setValue("qualifications" as any, newQuals);
  };

  const onSubmit = async (values: any) => {
    if (!tokenValidation || !tokenValidation.valid) {
      setError("token", { message: "Please enter a valid token" });
      return;
    }

    try {
      await registerMutation.mutateAsync(values);
      // Redirect to login after successful registration
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Registration failed";
      setError("root", { message });
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw]">
      {/* Left column: registration form */}
      <section className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-2xl">
          <div className="flex flex-col gap-4">
            <div className="animate-element animate-delay-50 flex justify-center mb-4">
              <Logo className="h-32 w-32" />
            </div>
            <h1 className="animate-element animate-delay-100 text-2xl md:text-3xl font-bold leading-tight">
              Register with Token
            </h1>
            <p className="animate-element animate-delay-200 text-muted-foreground">
              Enter your registration token to create your account
            </p>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Token Input */}
              <div className="animate-element animate-delay-300">
                <Label className="text-sm font-medium text-muted-foreground">
                  Registration Token
                </Label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      {...register("token")}
                      type="text"
                      placeholder="Enter your registration token"
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                    />
                    {isValidatingToken && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                      </div>
                    )}
                    {!isValidatingToken && tokenValidation && (
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
                    {typeof errors.token === 'object' && 'message' in errors.token 
                      ? String(errors.token.message) 
                      : String(errors.token)}
                  </p>
                )}
                {tokenValidation && tokenValidation.valid && (
                  <p className="text-sm text-green-500 mt-1">
                    Valid token for {tokenValidation.role}
                  </p>
                )}
              </div>

              {/* Personal Information Section */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
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
                    <Label>Email Address *</Label>
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
                        {typeof errors.email === 'object' && 'message' in errors.email 
                          ? String(errors.email.message) 
                          : String(errors.email)}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Password *</Label>
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
                          <EyeOff className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Eye className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </GlassInputWrapper>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {typeof errors.password === 'object' && 'message' in errors.password 
                        ? String(errors.password.message) 
                        : String(errors.password)}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone Number</Label>
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
                    <Label>Years of Experience</Label>
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
                  <Label>Qualifications</Label>
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
                    <Button
                      type="button"
                      onClick={addQualification}
                      variant="outline"
                    >
                      Add
                    </Button>
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

              {/* Address Section */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Address Information</h3>
                <div>
                  <Label>Street Address</Label>
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
                    <Label>City</Label>
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
                    <Label>State/Province</Label>
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
                    <Label>ZIP/Postal Code</Label>
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
                  <Label>Emergency Contact</Label>
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

              {/* School Information Section (only for school owner) */}
              {isSchoolOwner && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">School Information</h3>

                  <div>
                    <Label>School Name *</Label>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>School City *</Label>
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
                      <Label>School District *</Label>
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
                    <Label>School Address</Label>
                    <GlassInputWrapper>
                      <input
                        {...register("schoolAddress")}
                        type="text"
                        placeholder="School address"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>School Phone Number *</Label>
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
                      <Label>School Email *</Label>
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
                    <Label>School Website *</Label>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>School Type</Label>
                      <GlassInputWrapper>
                        <input
                          {...register("schoolType")}
                          type="text"
                          placeholder="e.g., Primary, Secondary"
                          className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                        />
                      </GlassInputWrapper>
                    </div>

                    <div>
                      <Label>Established Year</Label>
                      <GlassInputWrapper>
                        <input
                          {...register("establishedYear")}
                          type="number"
                          placeholder="Year"
                          className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                        />
                      </GlassInputWrapper>
                    </div>

                    <div>
                      <Label>Student Capacity</Label>
                      <GlassInputWrapper>
                        <input
                          {...register("studentCapacity")}
                          type="number"
                          min="0"
                          placeholder="Capacity"
                          className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                        />
                      </GlassInputWrapper>
                    </div>
                  </div>

                  <div>
                    <Label>School Description</Label>
                    <GlassInputWrapper>
                      <textarea
                        {...register("schoolDescription")}
                        placeholder="Describe your school..."
                        rows={4}
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none resize-none"
                      />
                    </GlassInputWrapper>
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              <div>
                <Label>Additional Notes</Label>
                <GlassInputWrapper>
                  <textarea
                    {...register("additionalNotes")}
                    placeholder="Any additional information..."
                    rows={3}
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none resize-none"
                  />
                </GlassInputWrapper>
              </div>

              {/* Error Message */}
              {errors.root && (
                <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                  <p className="text-sm text-red-500">{errors.root.message}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={registerMutation.isPending || !tokenValidation?.valid}
                className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {registerMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {registerMutation.isPending
                  ? "Registering..."
                  : "Create Account"}
              </button>

              {/* Login Link */}
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-violet-400 hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Right column: hero image */}
      <section className="hidden md:block flex-1 relative p-4">
        <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl shadow overflow-hidden">
          <img
            src="/auth-main-image.webp"
            alt="Registration background"
            className="w-full h-full object-cover object-center"
            style={{ display: "block" }}
          />
        </div>
      </section>
    </div>
  );
}

