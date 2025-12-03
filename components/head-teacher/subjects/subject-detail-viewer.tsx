"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import {
    IconCircleCheckFilled,
    IconCircleDashed,
    IconBook2,
    IconUsers,
    IconSchool,
    IconAward,
    IconPencil,
} from "@tabler/icons-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    createDragColumn,
    createSelectColumn,
    createActionsColumn,
} from "@/components/datatable/helpers";
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
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { Textarea } from "@/components/ui/textarea";
import { AssignSubjectDialog } from "./assign-subject-dialog";
import type { DataTableConfig } from "@/components/datatable";
import { useClassesOfSubject, useCreateSubject, useDeleteSubject, useToggleSubjectStatus, useUpdateSubject, useDeleteAssignment } from "@/hooks/use-subjects";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useOpenAcademicYear } from "@/hooks/use-academic-terms";
import { gradeLevels } from "@/lib/constants/grade-levels";
import { Subject } from "@/types/subjects.dto";
import { toast } from "react-toastify";

export default function SubjectDetailViewer({ item }: { item: Subject }) {
    const isMobile = useIsMobile();
    const { data: openAcademicYear } = useOpenAcademicYear();

    const { mutate: updateSubject } = useUpdateSubject();
    const deleteAssignment = useDeleteAssignment();

    const formRef = React.useRef<HTMLFormElement | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [errors, setErrors] = React.useState<{ maxScore?: string; minPassingScore?: string }>({});
    const [department, setDepartment] = React.useState<string>(item.department || "");
    const [category, setCategory] = React.useState<string>(item.subjectType || "");
    const [level, setLevel] = React.useState<string>(item.level || "");
    const [status, setStatus] = React.useState<string>(item.status || "Active");

    const gradeLevelLabels = item.gradeLevels
        .map((value) => gradeLevels.find((g) => g.value === value)?.label ?? value)
        .join(", ");

    // Sync state with item when editing starts or item changes
    React.useEffect(() => {
        if (isEditing) {
            setDepartment(item.department || "");
            setCategory(item.subjectType || "");
            setLevel(item.level || "");
            setStatus(item.status || "Active");
        }
    }, [isEditing, item.department, item.subjectType, item.level, item.status]);

    const handleSave = () => {
        const form = formRef.current;
        if (!form) return;

        const formData = new FormData(form);
        const selectedGradeLevels = formData.getAll("gradeLevels") as string[];

        // Reset errors
        setErrors({});

        // Validate maxScore
        const maxScoreValue = (form.querySelector("#maxScore") as HTMLInputElement)?.value;
        if (!maxScoreValue || maxScoreValue === "") {
            setErrors((prev) => ({ ...prev, maxScore: "Maximum score is required" }));
            return;
        }

        const maxScore = Number(maxScoreValue);
        if (isNaN(maxScore) || maxScore <= 0) {
            setErrors((prev) => ({ ...prev, maxScore: "Maximum score must be greater than 0" }));
            return;
        }

        // Validate minPassingScore
        const minPassingScoreValue = (form.querySelector("#minPassingScore") as HTMLInputElement)?.value;
        if (!minPassingScoreValue || minPassingScoreValue === "") {
            setErrors((prev) => ({ ...prev, minPassingScore: "Minimum passing score is required" }));
            return;
        }

        const minPassingScore = Number(minPassingScoreValue);
        if (isNaN(minPassingScore) || minPassingScore < 0) {
            setErrors((prev) => ({ ...prev, minPassingScore: "Minimum passing score must be 0 or greater" }));
            return;
        }

        // Validate that minPassingScore <= maxScore
        if (minPassingScore > maxScore) {
            setErrors((prev) => ({ ...prev, minPassingScore: "Minimum passing score cannot exceed maximum score" }));
            return;
        }

        const dto: any = {
            name:
                (form.querySelector("#subjectName") as HTMLInputElement)?.value ||
                item.name,
            code:
                (form.querySelector("#subjectCode") as HTMLInputElement)?.value ||
                item.code,
            creditHours:
                Number(
                    (form.querySelector("#creditHours") as HTMLInputElement)?.value
                ) || undefined,
            maxScore: maxScore,
            minPassingScore: minPassingScore,
            department: department || item.department,
            category: category || item.subjectType,
            // primary multi-grade field
            gradeLevels: selectedGradeLevels.length
                ? selectedGradeLevels
                : item.gradeLevels,
            // keep first selected for backward compatibility if backend still uses single grade
            gradeLevel:
                selectedGradeLevels[0] ?? item.gradeLevels[0] ?? undefined,
            level: level || item.level,
            status: status || item.status,
            prerequisites:
                (form.querySelector("#prerequisite") as HTMLTextAreaElement)?.value ||
                item.prerequisites,
        };
        updateSubject(
            { id: String(item._id), dto },
            {
                onSuccess: () => {
                    toast.success("Changes saved successfully!");
                    setIsEditing(false);
                    setErrors({});
                },
                // Error is handled by the hook's onError callback
            }
        );
    };

    const handleDeleteAssignment = (assignmentId: string) => {
        if (!assignmentId) return;
        if (window.confirm("Remove this assignment?")) {
            deleteAssignment.mutate(assignmentId);
        }
    };


    return (
        <Drawer direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">
                    {item.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <div className="flex flex-col gap-2">
                        <DrawerTitle>{item.name}</DrawerTitle>
                        <DrawerDescription>Subject details, assignments, and analytics</DrawerDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing((prev) => !prev)}
                        aria-label={isEditing ? "Close edit" : "Edit subject"}
                    >
                        <IconPencil className="h-4 w-4" />
                    </Button>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="filter-year">Academic Year</Label>
                        <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            {openAcademicYear?.label || "No academic year open"}
                        </div>
                    </div>
                    {!isMobile && (
                        <>
                            <div className="grid grid-cols-4 gap-3">
                                {/* <div className="flex flex-col gap-2 rounded-lg border p-3">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                        <IconUsers className="h-4 w-4" />
                                        <span>Teachers</span>
                                    </div>
                                    <div className="text-2xl font-bold">{subjectAnalytics?.totalTeachers ?? teachers.length}</div>
                                </div>
                                <div className="flex flex-col gap-2 rounded-lg border p-3">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                        <IconSchool className="h-4 w-4" />
                                        <span>Classes</span>
                                    </div>
                                    <div className="text-2xl font-bold">{subjectAnalytics?.totalClasses ?? classes.length}</div>
                                </div>
                                <div className="flex flex-col gap-2 rounded-lg border p-3">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                        <IconBook2 className="h-4 w-4" />
                                        <span>Assignments</span>
                                    </div>
                                    <div className="text-2xl font-bold">{assignments.length}</div>
                                </div>
                                <div className="flex flex-col gap-2 rounded-lg border p-3">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                        <IconAward className="h-4 w-4" />
                                        <span>Status</span>
                                    </div>
                                    <div className="text-2xl font-bold">{(subjectAnalytics?.subject?.status ?? item.status)?.toString()}</div>
                                </div> */}
                            </div>
                            <Separator />
                        </>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {isEditing ? (
                            <form ref={formRef} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="subjectName">Subject Name</Label>
                                    <Input id="subjectName" defaultValue={item.name} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="subjectCode">Subject Code</Label>
                                        <Input id="subjectCode" defaultValue={item.code} />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="creditHours">Credit Hours</Label>
                                        <Input id="creditHours" type="number" defaultValue={item.creditHours} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="maxScore">Maximum Score *</Label>
                                        <Input 
                                            id="maxScore" 
                                            type="number" 
                                            min="1"
                                            defaultValue={item.maxScore} 
                                            className={errors.maxScore ? "border-destructive" : ""}
                                        />
                                        {errors.maxScore && (
                                            <p className="text-sm text-destructive">{errors.maxScore}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="minPassingScore">Minimum Passing Score *</Label>
                                        <Input 
                                            id="minPassingScore" 
                                            type="number" 
                                            min="0"
                                            defaultValue={item.minPassingScore} 
                                            className={errors.minPassingScore ? "border-destructive" : ""}
                                        />
                                        {errors.minPassingScore && (
                                            <p className="text-sm text-destructive">{errors.minPassingScore}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="department">Department</Label>
                                        <Select value={department} onValueChange={setDepartment}>
                                            <SelectTrigger id="department" className="w-full">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Mathematics">Mathematics</SelectItem>
                                                <SelectItem value="Science">Science</SelectItem>
                                                <SelectItem value="English">English</SelectItem>
                                                <SelectItem value="Social Studies">
                                                    Social Studies
                                                </SelectItem>
                                                <SelectItem value="Languages">Languages</SelectItem>
                                                <SelectItem value="Technology">Technology</SelectItem>
                                                <SelectItem value="Arts">Arts</SelectItem>
                                                <SelectItem value="Physical Education">
                                                    Physical Education
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={category} onValueChange={setCategory}>
                                            <SelectTrigger id="category" className="w-full">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="core">Core</SelectItem>
                                                <SelectItem value="elective">Elective</SelectItem>
                                                <SelectItem value="vocational">Vocational</SelectItem>
                                                <SelectItem value="optional">Optional</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label>Grade Levels</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {gradeLevels.map((grade) => (
                                                <label
                                                    key={grade.value}
                                                    className="flex items-center gap-2 text-sm"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="gradeLevels"
                                                        value={grade.value}
                                                        className="h-4 w-4"
                                                        defaultChecked={item.gradeLevels.includes(
                                                            grade.value
                                                        )}
                                                    />
                                                    <span>{grade.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="level">Level</Label>
                                        <Select value={level} onValueChange={setLevel}>
                                            <SelectTrigger id="level" className="w-full">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Beginner">Beginner</SelectItem>
                                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                <SelectItem value="Advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger id="status" className="w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Brief description of the subject..."
                                        rows={3}
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="prerequisite">Prerequisite</Label>
                                    <Textarea
                                        defaultValue={item.prerequisites}
                                        id="prerequisite"
                                        placeholder="Brief description of the subject..."
                                        rows={3}
                                    />
                                </div>
                                <Separator />

                            </form>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-3">
                                    <Label>Subject Name</Label>
                                    <p>{item.name}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label>Subject Code</Label>
                                        <p>{item.code}</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label>Credit Hours</Label>
                                        <p>{item.creditHours}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label>Maximum Score</Label>
                                        <p>{item.maxScore}</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label>Minimum Passing Score</Label>
                                        <p>{item.minPassingScore}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label>Department</Label>
                                        <p>{item.department}</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label>Category</Label>
                                        <p>{item.subjectType}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label>Grade Levels</Label>
                                        <p>{gradeLevelLabels}</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label>Level</Label>
                                        <p>{item.level}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Label>Status</Label>
                                    <p>{item.status}</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Label>Description</Label>
                                    <p>{item.description}</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Label>Prerequisite</Label>
                                    <p>{item.prerequisites}</p>
                                </div>
                                <Separator />
                            </div>
                        )}
                    </div>
                    <DrawerFooter>
                        {isEditing ? (
                            <Button onClick={handleSave}>Save Changes</Button>
                        ) : (
                            <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                            </DrawerClose>
                        )}
                    </DrawerFooter>
                </div>
            </DrawerContent>

        </Drawer>
    );
}
