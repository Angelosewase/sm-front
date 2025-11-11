"use client";

import * as React from "react";
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
import { z } from "zod";
// at top with other imports
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth-context";
import { useCreateHeadTeacher } from "@/hooks/use-head-teacher";
import { useSubjects } from "@/hooks/use-subjects";


const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().min(1, "Invalid email"),
  phone: z.string().min(7, "Invalid phone"),
  department: z.string().min(1, "Select department"),
  subject: z.string().optional(),
  experience: z.string().optional(),
  status: z.enum(["Active", "On Leave", "Inactive"]).optional(),
  qualification: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;


export function AddHeadTeacherDialog() {
  const [open, setOpen] = React.useState(false);
  const { userSchool } = useAuth();
  const { mutateAsync, isPending } = useCreateHeadTeacher();
  const { data: subjectsData, isLoading: subjectsLoading } = useSubjects({ school: userSchool?.id });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "Active",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!userSchool?.id) {
      return form.setError("root", { message: "No school selected in session" });
    }

    const payload = {
      email: values.email,
      password: crypto.getRandomValues(new Uint32Array(1))[0].toString(36),
      name: values.name,
      phone: values.phone,
      experience: values.experience,
      school: userSchool.id,
      headTeacherId: undefined,
      department: values.department,
      subjects: [values.subject],
      qualification: values.qualification,
      hireDate: undefined,
      status: values.status as any,
      address: values.address,
      city: values.city,
      state: values.state,
      zip: values.zip,
      emergencyContact: values.emergencyContact,
      notes: values.notes,
    } as const;

    try {
      await mutateAsync(payload as any);
      setOpen(false);
      form.reset();
    } catch (e: any) {
      form.setError("root", { message: e?.response?.data?.message ?? "Failed to add head teacher" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) form.reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-4">
          Add Head Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Head Teacher</DialogTitle>
          <DialogDescription>
            Add a new teacher to the system by filling in their details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...form.register("name")} placeholder="e.g., John Smith" />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john.smith@school.edu" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(v) => form.setValue("department", v)}>
                  <SelectTrigger id="department" className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Social Studies">Social Studies</SelectItem>
                    <SelectItem value="Languages">Languages</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Physical Education">Physical Education</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.department && (
                  <p className="text-sm text-destructive">{form.formState.errors.department.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subject">Subject/Specialization</Label>
                <Select onValueChange={(v) => form.setValue("subject", v)}>
                  <SelectTrigger id="subject" className="w-full">
                    <SelectValue placeholder={subjectsLoading ? "Loading subjects..." : "Select subject"} />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectsData?.items?.length ? (
                      subjectsData.items.map((s) => (
                        <SelectItem key={s._id} value={s._id}>
                          {s.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="__no_subjects__">No subjects available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {form.formState.errors.subject && (
                  <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" placeholder="5" {...form.register("experience")} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="Active" onValueChange={(v) => form.setValue("status", v as any)}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Input id="qualification" placeholder="e.g., M.Ed. in Mathematics Education" {...form.register("qualification")} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Street address" {...form.register("address")} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="City" {...form.register("city")} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="State" {...form.register("state")} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" placeholder="12345" {...form.register("zip")} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input id="emergencyContact" placeholder="Name and phone number" {...form.register("emergencyContact")} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" rows={3} placeholder="Any additional information..." {...form.register("notes")} />
            </div>
          </div>

          {form.formState.errors.root?.message && (
            <div className="text-sm text-destructive">{form.formState.errors.root.message}</div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Adding..." : "Add Head Teacher"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
