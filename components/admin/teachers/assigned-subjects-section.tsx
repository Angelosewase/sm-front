import React from "react";
import { IconBook, IconPlus, IconX } from "@tabler/icons-react";

import { Teacher } from "@/types/teachers.dto";
import { useSubjects } from "@/hooks/use-subjects";
import {
  useAssignSubjectsToTeacher,
  useRemoveSubjectsFromTeacher,
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

interface AssignedSubjectsSectionProps {
  teacher: Teacher;
}

export default function AssignedSubjectsSection({
  teacher,
}: AssignedSubjectsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = React.useState("");

  const { data: subjectsResp, isLoading: subjectsLoading } = useSubjects();
  const assignSubjectsMutation = useAssignSubjectsToTeacher();
  const removeSubjectsMutation = useRemoveSubjectsFromTeacher();

  const isTrashed = teacher.isTrashed;

  const subjects = subjectsResp?.items ?? [];
  const assignedSubjectIds = React.useMemo(
    () =>
      new Set(
        (teacher.subjectsCanTeach ?? []).map((subject: any) =>
          typeof subject === "string" ? subject : subject._id ?? subject.id
        )
      ),
    [teacher.subjectsCanTeach]
  );

  const availableSubjects = React.useMemo(() => {
    return subjects.filter((subject) => !assignedSubjectIds.has(subject._id));
  }, [subjects, assignedSubjectIds]);

  const handleAssign = () => {
    if (!selectedSubjectId) return;
    if (assignedSubjectIds.has(selectedSubjectId)) {
      setSelectedSubjectId("");
      setIsDialogOpen(false);
      return;
    }

    assignSubjectsMutation.mutate(
      {
        id: teacher._id,
        payload: { subjectIds: [selectedSubjectId] },
      },
      {
        onSuccess: () => {
          setSelectedSubjectId("");
          setIsDialogOpen(false);
        },
      }
    );
  };

  const handleRemove = (subjectId: string) => {
    removeSubjectsMutation.mutate(
      {
        id: teacher._id,
        payload: { subjectIds: [subjectId] },
      },
      {
        onSuccess: () => {
          if (selectedSubjectId === subjectId) {
            setSelectedSubjectId("");
          }
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconBook className="h-4 w-4" />
          <h3 className="font-semibold">Assigned Subjects</h3>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isTrashed}
            >
              <IconPlus className="mr-1 h-4 w-4" />
              Assign Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Subject</DialogTitle>
              <DialogDescription>
                Select a subject to assign to {teacher.user?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="subject-select">Select Subject</Label>
                <Select
                  value={selectedSubjectId}
                  onValueChange={setSelectedSubjectId}
                  disabled={subjectsLoading || !availableSubjects.length}
                >
                  <SelectTrigger id="subject-select">
                    <SelectValue
                      placeholder={
                        subjectsLoading
                          ? "Loading subjects..."
                          : availableSubjects.length
                          ? "Choose a subject"
                          : "No subjects available"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject._id} value={subject._id}>
                        {subject.name}
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
                onClick={handleAssign}
                disabled={
                  !selectedSubjectId ||
                  assignSubjectsMutation.isPending ||
                  isTrashed ||
                  subjectsLoading
                }
              >
                {assignSubjectsMutation.isPending ? "Assigning..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-2">
        {(teacher.subjectsCanTeach?.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">
            No subjects assigned yet.
          </p>
        ) : (
          teacher.subjectsCanTeach!.map((subject: any) => {
            const id = typeof subject === "string" ? subject : subject._id ?? subject.id;
            const name = typeof subject === "string" ? subject : subject.name;
            const gradeLevel =
              typeof subject === "string" ? undefined : subject.gradeLevel;

            return (
              <div
                key={id}
                className="flex items-center justify-between rounded-lg border p-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{name}</span>
                  {gradeLevel ? (
                    <Badge variant="outline" className="text-xs">
                      {gradeLevel}
                    </Badge>
                  ) : null}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={removeSubjectsMutation.isPending || isTrashed}
                  onClick={() => handleRemove(id as string)}
                >
                  <IconX className="h-4 w-4" />
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
