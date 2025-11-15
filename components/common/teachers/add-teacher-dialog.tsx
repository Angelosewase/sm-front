"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateTeacher } from "@/hooks/use-teachers";
import { useSubjects } from "@/hooks/use-subjects";
import { useSchool } from "@/contexts/school-context";
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
import { PlusIcon } from "lucide-react";

const departments = [
  "Mathematics",
  "Science",
  "English",
  "Social Studies",
  "Languages",
  "Technology",
  "Arts",
  "Physical Education",
];

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(7, "Invalid phone")
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  department: z.string().min(1, "Select department"),
  status: z.enum(["Active", "On Leave", "Inactive"]),
  subjectId: z.string().optional(),
  experience: z
    .string()
    .optional()
    .or(z.literal("")),
  emergencyContact: z
    .string()
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export function AddTeacherDialog() {
  const [open, setOpen] = React.useState(false);
  const { school } = useSchool();
  const { mutateAsync, isPending } = useCreateTeacher();
  const { data: subjectsData, isLoading: subjectsLoading } = useSubjects(
    school?.id ? { school: school.id } : {}
  );

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "Active",
      department: "",
    },
  });

  const closeDialog = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (values: FormValues) => {
    if (!school?.id) {
      setError("root", {
        message: "No school selected in session",
      });
      return;
    }

    const generatedPassword =
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
        : Math.random().toString(36).slice(-10)) || "TempPass123";

    const payload = {
      email: values.email.trim(),
      password: generatedPassword,
      name: values.name.trim(),
      phone: values.phone?.trim() || undefined,
      experience: values.experience?.trim() || undefined,
      school: school.id,
      subjectsCanTeach: values.subjectId ? [values.subjectId] : [],
      assignedClasses: [],
      qualification: values.department,
      department: values.department,
      status: values.status,
      emergencyContact: values.emergencyContact?.trim() || undefined,
      notes: values.notes?.trim() || undefined,
    };

    try {
      await mutateAsync(payload);
      closeDialog();
    } catch (error: any) {
      setError("root", {
        message:
          error?.response?.data?.message ?? "Failed to add teacher. Try again.",
      });
    }
  };

  const subjectItems = subjectsData?.items ?? [];

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
        <Button variant="default" className="mr-4">
          <PlusIcon className="size-4" /> Add Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Provide the teacher&apos;s core information. You can assign classes
            and additional details later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g., John Smith"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.smith@school.edu"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.department && (
                      <p className="text-sm text-destructive">
                        {errors.department.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-destructive">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <Controller
              name="subjectId"
              control={control}
              render={({ field }) => (
                <div className="grid gap-2">
                  <Label htmlFor="subject">
                    Primary Subject (optional)
                  </Label>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={subjectsLoading}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue
                        placeholder={
                          subjectsLoading
                            ? "Loading subjects..."
                            : subjectItems.length
                              ? "Select subject"
                              : "No subjects available"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectItems.length ? (
                        subjectItems.map((subject) => (
                          <SelectItem key={subject._id} value={subject._id}>
                            {subject.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="__none__">
                          No subjects available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input
                  id="experience"
                  inputMode="numeric"
                  placeholder="e.g., 5"
                  {...register("experience")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Name and phone number"
                  {...register("emergencyContact")}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Any additional information..."
                {...register("notes")}
              />
            </div>
          </div>

          {"root" in errors && errors.root?.message && (
            <div className="text-sm text-destructive">
              {errors.root.message}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Teacher"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
