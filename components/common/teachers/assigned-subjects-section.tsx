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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  IconBook,
  IconPlus,
  IconSchool,
  IconTag,
  IconUserCheck,
} from "@tabler/icons-react";
import React from "react";
import { toast } from "react-toastify";
import { Teacher } from "@/types/teachers.dto";
import { useSubjects } from "@/hooks/use-subjects";
import { useAssignSubjectToTeacher } from "@/hooks/use-subjects";
import { cn } from "@/lib/utils";
import { useAssignSubjectsToTeacher } from "@/hooks/use-teachers";

export default function AssignedSubjectsSection({
  teacher,
}: {
  teacher: Teacher;
}) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const { data: subjectsResp } = useSubjects();
  const subjects = subjectsResp?.items ?? [];
  const assignToTeacher = useAssignSubjectsToTeacher();

  const handleAddSubject = () => {
    if (!selectedSubject) return;

      assignToTeacher.mutate(
        {
          id: teacher._id,
          payload: {
            subjectIds: [selectedSubject],
          },
        },
        {
          onSuccess: () => {
            toast.success("Subject assigned successfully");
            setSelectedSubject("");
            setIsDialogOpen(false);
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message || "Failed to assign subject"
            );
          },
        }
    );
  };

  const assignedSubjects = teacher.subjectsCanTeach ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <IconBook className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Teaching Subjects</h3>
            <p className="text-sm text-muted-foreground">
              {assignedSubjects.length}{" "}
              {assignedSubjects.length === 1 ? "subject" : "subjects"} assigned
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <IconPlus className="h-4 w-4" />
              Assign Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Assign New Subject</DialogTitle>
              <DialogDescription>
                Choose a subject to assign to{" "}
                <strong>{teacher.user?.name}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a subject..." />
                </SelectTrigger>
                <SelectContent>
                  {subjects
                    .filter(
                      (s: any) =>
                        !assignedSubjects.some(
                          (as: any) =>
                            (as._id || as.id)?.toString() ===
                            (s._id || s.id)?.toString()
                        )
                    )
                    .map((s: any) => (
                      <SelectItem
                        key={s._id || s.id}
                        value={(s._id || s.id) as string}
                      >
                        <div className="flex items-center gap-2">
                          <IconBook className="h-3.5 w-3.5" />
                          <span>{s.name}</span>
                          {s.shortName && (
                            <span className="text-muted-foreground text-xs">
                              ({s.shortName})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleAddSubject}
                disabled={!selectedSubject || assignToTeacher.isPending}
              >
                {assignToTeacher.isPending ? "Assigning..." : "Assign Subject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subjects Grid */}
      {assignedSubjects.length === 0 ? (
        <Card className="border-dashed border-2">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-muted rounded-full mb-4">
              <IconBook className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No subjects assigned yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Click the button above to assign subjects this teacher can teach.
            </p>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {assignedSubjects.map((subject: any) => (
            <Card
              key={subject._id || subject.id}
              className={cn(
                "group relative flex flex-row items-stretch overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border",
                "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800"
              )}
            >

              {/* Content Side */}
              <div className="flex-1 flex flex-col justify-between px-5">
                {/* Top: Header & Code */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-base">{subject.name}</h4>
                    {subject.shortName && (
                      <p className="text-sm text-muted-foreground font-medium">
                        {subject.shortName}
                      </p>
                    )}
                  </div>
                  {subject.code && (
                    <Badge variant="secondary" className="font-mono text-xs">
                      {subject.code}
                    </Badge>
                  )}
                </div>

                {/* Meta Info */}
                <div className="space-y-2 text-sm">
                  {subject.department && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IconSchool className="h-3.5 w-3.5" />
                      <span>{subject.department}</span>
                    </div>
                  )}

                  {(subject.subjectType || subject.level) && (
                    <div className="flex items-center gap-4 text-muted-foreground">
                      {subject.subjectType && (
                        <div className="flex items-center gap-1.5">
                          <IconTag className="h-3.5 w-3.5" />
                          <span className="capitalize">
                            {subject.subjectType}
                          </span>
                        </div>
                      )}
                      {subject.level && (
                        <Badge variant="outline" className="text-xs py-0">
                          {subject.level}
                        </Badge>
                      )}
                    </div>
                  )}

                  {subject.gradeLevels && subject.gradeLevels.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-xs text-muted-foreground">
                        Grades:
                      </span>
                      {subject.gradeLevels.map((g: string) => (
                        <Badge
                          key={g}
                          variant="secondary"
                          className="text-xs py-0 px-2"
                        >
                          {g}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status */}
                {subject.status && (
                  <div className="mt-3 flex items-center gap-2">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        subject.status === "active"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      )}
                    />
                    <span className="text-xs font-medium capitalize text-muted-foreground">
                      {subject.status}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
