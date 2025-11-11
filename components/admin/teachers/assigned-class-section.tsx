import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconPlus, IconSchool, IconX } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { toast } from "react-toastify";
import { Teacher } from "@/types/teachers.dto";
import { useClasses } from "@/hooks/use-classes";
import { useAssignClassesToTeacher, useUnassignClassesFromTeacher } from "@/hooks/use-teachers";

export default function AssignedClassesSection({ teacher }: { teacher: Teacher }) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedClass, setSelectedClass] = React.useState("");

    const { data: classesResp } = useClasses();
    const availableClasses = classesResp?.data || [];

    const assignMutation = useAssignClassesToTeacher();
    const unassignMutation = useUnassignClassesFromTeacher();

    const handleAddClass = () => {
        if (!selectedClass) return;
        const current = (teacher.assignedClasses || []).map((c) => c._id);
        if (current.includes(selectedClass)) {
            toast.info("Teacher already assigned to this class");
            return;
        }
        const classIds = Array.from(new Set([...current, selectedClass]));
        assignMutation.mutate(
            { id: teacher.user._id, payload: { classIds } },
            {
                onSuccess: () => {
                    toast.success("Class assigned");
                    setSelectedClass("");
                    setIsDialogOpen(false);
                },
            }
        );
    };

    const handleRemoveClass = (classId: string) => {
        unassignMutation.mutate(
            { id: teacher._id, payload: { classIds: [classId] } },
            { onSuccess: () => toast.success("Class unassigned") }
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
                        <Button type="button" size="sm" variant="outline">
                            <IconPlus className="h-4 w-4 mr-1" /> Assign Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assign Class</DialogTitle>
                            <DialogDescription>Select a class to assign to {teacher.user?.name}</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 py-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="class-select">Select Class</Label>
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger id="class-select" className="w-full">
                                        <SelectValue placeholder="Choose a class" />
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
                            <Button type="button" onClick={handleAddClass} disabled={!selectedClass || assignMutation.isPending}>
                                Save
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col gap-2">
                {(teacher.assignedClasses?.length || 0) === 0 ? (
                    <p className="text-sm text-muted-foreground">No classes assigned yet</p>
                ) : (
                    teacher.assignedClasses!.map((cls) => (
                        <div key={cls._id} className="flex items-center justify-between p-2 border rounded-lg">
                            <div className="flex flex-col">
                                <span className="font-medium text-sm">{cls.name}</span>
                                <Badge variant="outline" className="text-xs">{cls.gradeLevel}</Badge>
                            </div>
                            <Button type="button" size="sm" variant="ghost" onClick={() => handleRemoveClass(cls._id)} disabled={unassignMutation.isPending}>
                                <IconX className="h-4 w-4" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}