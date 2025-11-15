import React from "react";
import { Controller, useForm } from "react-hook-form";
import { IconMail, IconPhone } from "@tabler/icons-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { useUpdateTeacher } from "@/hooks/use-teachers";
import { Teacher } from "@/types/teachers.dto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import AssignedClassesSection from "./assigned-class-section";
import AssignedSubjectsSection from "./assigned-subjects-section";

type TeacherFormValues = {
  phone?: string;
  department?: string;
  status: "Active" | "On Leave" | "Inactive";
  experience?: string;
  emergencyContact?: string;
  notes?: string;
};

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

interface TeacherDetailViewerProps {
  item: Teacher;
}

export default function TeacherDetailViewer({ item }: TeacherDetailViewerProps) {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = React.useState(false);

  const updateTeacher = useUpdateTeacher();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<TeacherFormValues>({
    defaultValues: {
      phone: item.phone || item.user.phone || "",
      department: item.department || item.qualification || "",
      status: item.status || "Active",
      experience: item.experience || item.user.experience || "",
      emergencyContact: item.emergencyContact || "",
      notes: item.notes || "",
    },
  });

  React.useEffect(() => {
    reset({
      phone: item.phone || item.user.phone || "",
      department: item.department || item.qualification || "",
      status: item.status || "Active",
      experience: item.experience || item.user.experience || "",
      emergencyContact: item.emergencyContact || "",
      notes: item.notes || "",
    });
  }, [item, reset]);

  const isTrashed = !!item.isTrashed;

  const onSubmit = (values: TeacherFormValues) => {
    const payload = {
      phone: values.phone?.trim() || undefined,
      department: values.department?.trim() || undefined,
      qualification: values.department?.trim() || undefined,
      status: values.status,
      experience: values.experience?.trim() || undefined,
      emergencyContact: values.emergencyContact?.trim() || undefined,
      notes: values.notes?.trim() || undefined,
    };

    updateTeacher.mutate(
      {
        id: item._id,
        data: payload,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const formattedStatus = item.status ?? "Active";

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="w-fit px-0 text-left text-foreground"
        >
          {item.user.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="m-1 min-w-[50vw] rounded-lg">
        <DrawerHeader className="gap-1">
          <DrawerTitle className="flex items-center gap-2">
            {item.user.name}
            {isTrashed && (
              <Badge variant="destructive" className="text-xs">
                Trashed
              </Badge>
            )}
          </DrawerTitle>
          <DrawerDescription>
            Teacher profile and contact details.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4 text-sm">
          {isTrashed && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-destructive">
              This teacher is currently in the trash. Restore them before making
              updates.
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <IconMail className="h-4 w-4 text-muted-foreground" />
              <span>{item.user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconPhone className="h-4 w-4 text-muted-foreground" />
              <span>{item.phone || "Not provided"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {formattedStatus}
              </Badge>
              {(item.department || item.qualification) && (
                <Badge variant="outline" className="text-xs">
                  {item.department || item.qualification}
                </Badge>
              )}
              {item.experience && (
                <Badge variant="outline" className="text-xs">
                  {item.experience} yrs experience
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          <AssignedClassesSection teacher={item} />

          <Separator />

          <AssignedSubjectsSection teacher={item} />

          <Separator />

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Teacher Information</h3>
              {!isEditing ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  disabled={isTrashed}
                >
                  Edit
                </Button>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      disabled={!isEditing}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            </div>

            <Controller
              control={control}
              name="department"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!isEditing}
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
                </div>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                control={control}
                name="experience"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="experience">Experience (years)</Label>
                    <Input
                      id="experience"
                      placeholder="e.g., 5"
                      {...field}
                      disabled={!isEditing}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="emergencyContact"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      placeholder="Name and phone number"
                      {...field}
                      disabled={!isEditing}
                    />
                  </div>
                )}
              />
            </div>

            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    placeholder="Any additional information..."
                    {...field}
                    disabled={!isEditing}
                  />
                </div>
              )}
            />

            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setIsEditing(false);
                  }}
                  disabled={updateTeacher.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateTeacher.isPending || !isDirty}
                >
                  {updateTeacher.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}