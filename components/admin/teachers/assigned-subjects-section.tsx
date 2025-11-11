import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { toast } from "react-toastify";
import { IconBook, IconPlus } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Teacher } from "@/types/teachers.dto";
import { useSubjects } from "@/features/subjects.api";
import { useAssignSubjectToTeacher } from "@/features/subjects.api";

export default function AssignedSubjectsSection({ teacher }: { teacher: Teacher }) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedSubject, setSelectedSubject] = React.useState("");
    const { data: subjectsResp } = useSubjects();
    const subjects = subjectsResp?.items ?? [];

    const assignToTeacher = useAssignSubjectToTeacher();

    const handleAddSubject = () => {
        if (!selectedSubject) return;
        // We don't collect year/term here; if needed, extend dialog.
        assignToTeacher.mutate(
            { subjectId: String(selectedSubject), teacherId: teacher._id, academicYear: new Date().getFullYear().toString() },
            {
                onSuccess: () => {
                    toast.success("Subject assigned to teacher");
                    setSelectedSubject("");
                    setIsDialogOpen(false);
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
                        <Button type="button" size="sm" variant="outline">
                            <IconPlus className="h-4 w-4 mr-1" /> Assign Subject
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assign Subject</DialogTitle>
                            <DialogDescription>Select a subject to assign to {teacher.user?.name}</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 py-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="subject-select">Select Subject</Label>
                                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                    <SelectTrigger id="subject-select" className="w-full">
                                        <SelectValue placeholder="Choose a subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((s: any) => (
                                            <SelectItem key={s._id || s.id} value={(s._id || s.id) as string}>
                                                {s.name}
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
                            <Button type="button" onClick={handleAddSubject} disabled={!selectedSubject || assignToTeacher.isPending}>
                                Save
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col gap-2">
                {(teacher.subjectsCanTeach?.length || 0) === 0 ? (
                    <p className="text-sm text-muted-foreground">No subjects assigned yet</p>
                ) : (
                    teacher.subjectsCanTeach!.map((subject) => (
                        <div key={(subject as any)._id || (subject as any).id} className="flex items-center justify-between p-2 border rounded-lg">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{(subject as any).name}</span>
                                <Badge variant="outline" className="text-xs">{(subject as any).gradeLevel || ""}</Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
