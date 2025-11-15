import React from "react";
import { IconPlus, IconSchool, IconX } from "@tabler/icons-react";
import { toast } from "react-toastify";

import { Teacher } from "@/types/teachers.dto";
import { useClasses } from "@/hooks/use-classes";
import {
  useAssignClassesToTeacher,
  useUnassignClassesFromTeacher,
} from "@/hooks/use-teachers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssignedClassesSectionProps {
  teacher: Teacher;
}

export default function AssignedClassesSection({
  teacher,
}: AssignedClassesSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedClassId, setSelectedClassId] = React.useState("");

  const { data: classesResp, isLoading: classesLoading } = useClasses({
    limit: 100,
  });
  const assignMutation = useAssignClassesToTeacher();
  const unassignMutation = useUnassignClassesFromTeacher();

  const assignedIds = React.useMemo(
    () => new Set((teacher.assignedClasses ?? []).map((cls) => cls._id)),
    [teacher.assignedClasses]
  );

  const availableClasses = React.useMemo(() => {
    const list = classesResp?.data ?? [];
    return list.filter((cls) => !assignedIds.has(cls._id));
  }, [classesResp?.data, assignedIds]);

  const isTrashed = teacher.isTrashed;

  const handleAddClass = () => {
    if (!selectedClassId) return;

    if (assignedIds.has(selectedClassId)) {
      toast.info("Teacher already assigned to this class.");
      return;
    }

    assignMutation.mutate(
      {
        id: teacher._id,
        payload: { classIds: [selectedClassId] },
      },
      {
        onSuccess: () => {
          setSelectedClassId("");
          setIsDialogOpen(false);
        },
      }
    );
  };

  const handleRemoveClass = (classId: string) => {
    unassignMutation.mutate(
      {
        id: teacher._id,
        payload: { classIds: [classId] },
      },
      {
        onSuccess: () => {
          if (selectedClassId === classId) {
            setSelectedClassId("");
          }
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconSchool className="h-4 w-4" />
          <h3 className="font-semibold">Assigned Classes</h3>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="default"
              disabled={isTrashed}
            >
              <IconPlus className="mr-1 h-4 w-4" />
              Assign Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Class</DialogTitle>
              <DialogDescription>
                Choose a class to assign to {teacher.user?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="class-select">Select Class</Label>
                <Select
                  value={selectedClassId}
                  onValueChange={setSelectedClassId}
                  disabled={classesLoading || !availableClasses.length}
                >
                  <SelectTrigger id="class-select">
                    <SelectValue
                      placeholder={
                        classesLoading
                          ? "Loading classes..."
                          : availableClasses.length
                          ? "Choose a class"
                          : "No classes available"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClasses.map((cls) => (
                      <SelectItem key={cls._id} value={cls._id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleAddClass}
                disabled={
                  !selectedClassId ||
                  assignMutation.isPending ||
                  isTrashed ||
                  classesLoading
                }
              >
                {assignMutation.isPending ? "Assigning..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-1">
        {(teacher.assignedClasses?.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">
            No classes assigned yet.
          </p>
        ) : (
          teacher.assignedClasses!.map((cls) => (
            <div
              key={cls._id}
              className="flex items-center justify-between rounded-lg border p-2"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{cls.name}</span>
                <Badge variant="outline" className="text-xs">
                  {cls.gradeLevel}
                </Badge>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={unassignMutation.isPending || isTrashed}
                onClick={() => handleRemoveClass(cls._id)}
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}