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
import { toast } from "react-toastify";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateClass } from "@/features/classes.api";
import { useUsers } from "@/features/users.api";
import { useSchool } from "@/contexts/school-context";


const createClassSchema = z.object({
  name: z.string().min(1, 'Required').max(20, 'Max 20 chars'),
  code: z.string().max(30).optional(),
  // school: z.string().min(1, 'School required'), // will be a hidden/select value
  academicYear: z.string().min(1).max(15),
  level: z.string().max(50).optional(),
  program: z.string().max(50).optional(),
  capacity: z.coerce
    .number()
    .positive('Must be >0')
    .max(200, 'Max 200')
    .optional(),
  room: z.string().optional(),
  schedule: z.string().optional(),
  description: z.string().optional(),
  formTeacher: z.string().min(1, 'Select a teacher'),
  status: z.enum(['active', 'archived', 'closed']),
});
type FormValues = z.infer<typeof createClassSchema>;

export function AddClassDialog() {
  const { school } = useSchool();
  const createClassMutation = useCreateClass();
  const { data: teachers } = useUsers({ role: "teacher", limit: 50 });
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(createClassSchema) as Resolver<FormValues>,
    defaultValues: {
      status: "active",
      academicYear: new Date().getFullYear() + "/" + (new Date().getFullYear() + 1),
    },
  });


  const onSubmit = async (data: FormValues) => {
    try {
    const data_ = {
      ...data,
      school: school ? school.id : ''
    }
      await toast.promise(createClassMutation.mutateAsync(data_ as any), {
        pending: `Creating class: ${data.name}`,
        success: "Class created successfully!",
        error: "Failed to create class",
      });

      reset();
      setOpen(false);
    } catch (e) {
      // toast error already handled inside promise
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-4">
          Add Class
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[680px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Fill in the details below. All required fields are marked.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* ---------- Row 1 ---------- */}
          <div className="grid gap-2">
            <Label htmlFor="name">Class Name *</Label>
            <Input id="name" {...register("name")} placeholder="e.g., P4A" />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* ---------- Row 2 ---------- */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="level">Grade Level</Label>
              <Select onValueChange={(v) => setValue("level", v)} defaultValue={watch("level")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
                    "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="formTeacher">Teacher *</Label>
              <Select onValueChange={(v) => setValue("formTeacher", v)} defaultValue={watch("formTeacher")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers?.items?.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.formTeacher && <p className="text-sm text-red-600">{errors.formTeacher.message}</p>}
            </div>
          </div>

          {/* ---------- Row 3 ---------- */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" {...register("capacity", { valueAsNumber: true })} placeholder="30" />
              {errors.capacity && <p className="text-sm text-red-600">{errors.capacity.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(v) => setValue("status", v as any)} defaultValue={watch("status")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ---------- Row 4 ---------- */}
          <div className="grid gap-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input id="schedule" {...register("schedule")} placeholder="e.g., Mon/Wed/Fri 9:00-10:30" />
          </div>

          {/* ---------- Row 5 ---------- */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="room">Room Number</Label>
              <Input id="room" {...register("room")} placeholder="e.g., Room 101" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="code">Internal Code</Label>
              <Input id="code" {...register("code")} placeholder="e.g., CLS-P4A" />
            </div>
          </div>

          {/* ---------- Optional ---------- */}
          <div className="grid gap-2">
            <Label htmlFor="level">Grade Level</Label>
            <Input id="level" {...register("level")} placeholder="e.g., Science" />
          </div>

          {/* ---------- Optional ---------- */}
          <div className="grid gap-2">
            <Label htmlFor="program">Program / Stream</Label>
            <Input id="program" {...register("program")} placeholder="e.g., Science" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input id="description" {...register("description")} placeholder="Brief description…" />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}