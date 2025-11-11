"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateStudent } from "@/hooks/use-students";
import { useSchool } from "@/contexts/school-context";
import { useClasses } from "@/hooks/use-classes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const GRADE_LEVELS = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

const GUARDIAN_RELATIONSHIPS = ["father", "mother", "guardian", "other"] as const;

const STUDENT_STATUS_OPTIONS = [
  "active",
  "suspended",
  "transferred",
  "graduated",
] as const;

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
] as const;

const schema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phoneNumber: z
    .string()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  classId: z.string().min(1, "Class assignment is required"),
  previousSchool: z.string().optional().or(z.literal("")),
  enrollmentDate: z.string().min(1, "Enrollment date is required"),
  guardianName: z.string().min(1, "Guardian name is required"),
  guardianEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),
  guardianPhoneNumber: z.string().min(1, "Guardian phone is required"),
  guardianRelationShip: z.enum(GUARDIAN_RELATIONSHIPS, {
    message: "Guardian relationship is required",
  }),
  guardianEmergencyContact: z.string().optional().or(z.literal("")),
  medicalInformation: z.string().optional().or(z.literal("")),
  additionalNotes: z.string().optional().or(z.literal("")),
  status: z.enum(STUDENT_STATUS_OPTIONS),
});

type FormValues = z.infer<typeof schema>;

export function AddStudentDialog() {
  const [open, setOpen] = React.useState(false);
  const { school } = useSchool();
  const { mutateAsync, isPending } = useCreateStudent();
  const { data: classesResponse, isLoading: classesLoading } = useClasses({
    limit: 100,
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "active",
      gradeLevel: "",
      classId: "",
      guardianRelationShip: "guardian",
    },
  });

  const gradeLevel = watch("gradeLevel");

  const filteredClasses = React.useMemo(() => {
    if (!gradeLevel) {
      return [];
    }
    return (classesResponse?.data ?? []).filter(
      (cls) => cls.gradeLevel === gradeLevel
    );
  }, [classesResponse?.data, gradeLevel]);

  const closeDialog = () => {
    setOpen(false);
    reset();
  };

  const sanitize = (value?: string | null) =>
    value && value.trim().length > 0 ? value.trim() : undefined;

  const onSubmit = async (values: FormValues) => {
    if (!school?.id) {
      setError("root", {
        message: "Select a school before enrolling students.",
      });
      return;
    }

    const payload = {
      studentId: values.studentId.trim(),
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phoneNumber: sanitize(values.phoneNumber),
      dob: values.dob,
      gender: sanitize(values.gender),
      address: values.address.trim(),
      province: values.province.trim(),
      district: values.district.trim(),
      gradeLevel: values.gradeLevel,
      classId: values.classId,
      previousSchool: sanitize(values.previousSchool),
      enrollmentDate: values.enrollmentDate,
      guardianName: values.guardianName.trim(),
      guardianEmail: sanitize(values.guardianEmail),
      guardianPhoneNumber: values.guardianPhoneNumber.trim(),
      guardianRelationShip: values.guardianRelationShip,
      guardianEmergencyContact: sanitize(values.guardianEmergencyContact),
      medicalInformation: sanitize(values.medicalInformation),
      additionalNotes: sanitize(values.additionalNotes),
      status: values.status,
      schoolId: school.id,
    } as const;

    try {
      await mutateAsync(payload);
      closeDialog();
    } catch (error: any) {
      setError("root", {
        message:
          error?.response?.data?.message ??
          "Failed to enroll student. Please try again.",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-4">
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enroll New Student</DialogTitle>
          <DialogDescription>
            Add a new student to the school system. Fill in all required
            information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">
              Student Information
            </h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="e.g., STU2024021"
                  {...register("studentId")}
                />
                {errors.studentId && (
                  <p className="text-sm text-destructive">
                    {errors.studentId.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., John Smith"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.smith@student.edu"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" {...register("dob")} />
                  {errors.dob && (
                    <p className="text-sm text-destructive">
                      {errors.dob.message}
                    </p>
                  )}
                </div>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={field.value || "prefer_not_to_say"}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENDER_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Street address"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    placeholder="Enter province"
                    {...register("province")}
                  />
                  {errors.province && (
                    <p className="text-sm text-destructive">
                      {errors.province.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    placeholder="Enter district"
                    {...register("district")}
                  />
                  {errors.district && (
                    <p className="text-sm text-destructive">
                      {errors.district.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">
              Academic Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="gradeLevel"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="gradeLevel">Grade Level</Label>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setValue("classId", "");
                      }}
                    >
                      <SelectTrigger id="gradeLevel">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADE_LEVELS.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.gradeLevel && (
                      <p className="text-sm text-destructive">
                        {errors.gradeLevel.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="classId"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="classId">Assign to Class</Label>
                    <Select
                      value={field.value || "prefer_not_to_say"}
                      onValueChange={field.onChange}
                      disabled={!gradeLevel || classesLoading}
                    >
                      <SelectTrigger id="classId">
                        <SelectValue
                          placeholder={
                            !gradeLevel
                              ? "Select grade first"
                              : classesLoading
                              ? "Loading classes..."
                              : filteredClasses.length
                              ? "Select class"
                              : "No classes available"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredClasses.length ? (
                          filteredClasses.map((cls) => (
                            <SelectItem key={cls._id} value={cls._id}>
                              {cls.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="__none__" disabled>
                            {gradeLevel
                              ? "No classes available for grade"
                              : "Select grade first"}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.classId && (
                      <p className="text-sm text-destructive">
                        {errors.classId.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="previousSchool">Previous School</Label>
                <Input
                  id="previousSchool"
                  placeholder="Name of previous school (if applicable)"
                  {...register("previousSchool")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  {...register("enrollmentDate")}
                />
                {errors.enrollmentDate && (
                  <p className="text-sm text-destructive">
                    {errors.enrollmentDate.message}
                  </p>
                )}
              </div>
            </div>

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={field.value ?? "active"} onValueChange={field.onChange}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STUDENT_STATUS_OPTIONS.map((statusOption) => (
                        <SelectItem key={statusOption} value={statusOption}>
                          {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </section>

          <section className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">
              Parent / Guardian Information
            </h3>

            <div className="grid gap-2">
              <Label htmlFor="guardianName">Guardian Name</Label>
              <Input
                id="guardianName"
                placeholder="e.g., Jane Smith"
                {...register("guardianName")}
              />
              {errors.guardianName && (
                <p className="text-sm text-destructive">
                  {errors.guardianName.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="guardianEmail">Guardian Email</Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  placeholder="jane.smith@email.com"
                  {...register("guardianEmail")}
                />
                {errors.guardianEmail && (
                  <p className="text-sm text-destructive">
                    {errors.guardianEmail.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="guardianPhoneNumber">Guardian Phone</Label>
                <Input
                  id="guardianPhoneNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...register("guardianPhoneNumber")}
                />
                {errors.guardianPhoneNumber && (
                  <p className="text-sm text-destructive">
                    {errors.guardianPhoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            <Controller
              name="guardianRelationShip"
              control={control}
              render={({ field }) => (
                <div className="grid gap-2">
                  <Label htmlFor="guardianRelationShip">
                    Relationship to Student
                  </Label>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue="guardian"
                  >
                    <SelectTrigger id="guardianRelationShip">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {GUARDIAN_RELATIONSHIPS.map((relationship) => (
                        <SelectItem key={relationship} value={relationship}>
                          {relationship === "guardian"
                            ? "Legal Guardian"
                            : relationship.charAt(0).toUpperCase() +
                              relationship.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <div className="grid gap-2">
              <Label htmlFor="guardianEmergencyContact">
                Emergency Contact
              </Label>
              <Input
                id="guardianEmergencyContact"
                placeholder="Name and phone number"
                {...register("guardianEmergencyContact")}
              />
            </div>
          </section>

          <section className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">
              Additional Information
            </h3>
            <div className="grid gap-2">
              <Label htmlFor="medicalInformation">Medical Information</Label>
              <Textarea
                id="medicalInformation"
                rows={2}
                placeholder="Any allergies, medical conditions, or special needs..."
                {...register("medicalInformation")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                rows={2}
                placeholder="Any additional information about the student..."
                {...register("additionalNotes")}
              />
            </div>
          </section>

          {"root" in errors && errors.root?.message && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errors.root.message}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enrolling..." : "Enroll Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
