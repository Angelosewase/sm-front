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
import { useClassesOfSubject, useCreateSubject, useDeleteSubject, useToggleSubjectStatus, useUpdateSubject, useDeleteAssignment } from "@/features/subjects.api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAcademicYears, useTerms } from "@/features/academic-terms.api";

export const subjectSchema = z.object({
    id: z.number(),
    subjectName: z.string(),
    subjectCode: z.string(),
    department: z.string(),
    category: z.string(),
    gradeLevel: z.string(),
    teachers: z.any(),
    classes: z.any(),
    students: z.string(),
    status: z.string(),
    subjectType: z.string(),
    creditHours: z.string(),
    level: z.string(),
    prerequisites: z.string(),
});

export default function SubjectDetailViewer({ item }: { item: z.infer<typeof subjectSchema> }) {
    const isMobile = useIsMobile();

    const { data: years } = useAcademicYears();
    const { data: terms } = useTerms();

    const computeYearLabel = () => {
        const now = new Date();
        const startMonth = 8;
        const y = now.getFullYear();
        const m = now.getMonth();
        const from = m >= startMonth ? y : y - 1;
        const to = from + 1;
        return `${from}/${to}`;
    };

    const [academicYear, setAcademicYear] = React.useState<string | undefined>(undefined);
    const [term, setTerm] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        if (!academicYear) {
            setAcademicYear(computeYearLabel());
        }
    }, [academicYear]);

    const { mutate: updateSubject } = useUpdateSubject();
    const deleteAssignment = useDeleteAssignment();

    const formRef = React.useRef<HTMLFormElement | null>(null);

    const handleSave = () => {
        const form = formRef.current;
        if (!form) return;
        const dto: any = {
            subjectName: (form.querySelector("#subjectName") as HTMLInputElement)?.value || item.subjectName,
            subjectCode: (form.querySelector("#subjectCode") as HTMLInputElement)?.value || item.subjectCode,
            creditHours: Number((form.querySelector("#creditHours") as HTMLInputElement)?.value) || undefined,
            // These selects are uncontrolled; read their current text content via value attribute if present
            // For robustness we fallback to existing values
            department: item.department,
            category: item.category,
            gradeLevel: item.gradeLevel,
            level: item.level,
            status: item.status,
            prerequisites: (form.querySelector("#prerequisite") as HTMLTextAreaElement)?.value || item.prerequisites,
        };

        updateSubject({ id: String(item.id), dto });
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
                    {item.subjectName}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.subjectName}</DrawerTitle>
                    <DrawerDescription>Subject details, assignments, and analytics</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="filter-year">Academic Year</Label>
                            <Select value={academicYear} onValueChange={setAcademicYear}>
                                <SelectTrigger id="filter-year">
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(years ?? []).map((y: any) => (
                                        <SelectItem key={y._id ?? y.label} value={y.label}>
                                            {y.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="filter-term">Term (optional)</Label>
                            <Select defaultValue={"Term 1"} value={term} onValueChange={setTerm}>
                                <SelectTrigger id="filter-term">
                                    <SelectValue placeholder="All terms" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(terms ?? []).map((t: any) => (
                                        <SelectItem key={t._id ?? t.name} value={t.name}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="#">All terms</SelectItem>
                                </SelectContent>
                            </Select>
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

                        <form className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="subjectName">Subject Name</Label>
                                <Input id="subjectName" defaultValue={item.subjectName} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="subjectCode">Subject Code</Label>
                                    <Input id="subjectCode" defaultValue={item.subjectCode} />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="creditHours">Credit Hours</Label>
                                    <Input id="creditHours" defaultValue={item.creditHours} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="department">Department</Label>
                                    <Select defaultValue={item.department}>
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
                                    <Select defaultValue={item.category}>
                                        <SelectTrigger id="category" className="w-full">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Core">Core</SelectItem>
                                            <SelectItem value="Elective">Elective</SelectItem>
                                            <SelectItem value="Optional">Optional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="gradeLevel">Grade Level</Label>
                                    <Select defaultValue={item.gradeLevel}>
                                        <SelectTrigger id="gradeLevel" className="w-full">
                                            <SelectValue placeholder="Select grade level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Grade 9">Grade 9</SelectItem>
                                            <SelectItem value="Grade 10">Grade 10</SelectItem>
                                            <SelectItem value="Grade 11">Grade 11</SelectItem>
                                            <SelectItem value="Grade 12">Grade 12</SelectItem>
                                            <SelectItem value="All Grades">All Grades</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="level">Level</Label>
                                    <Select defaultValue={item.level}>
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
                                <Select defaultValue={item.status}>
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue defaultValue={item.status} placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
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
                    </div>

                </div>
                <DrawerFooter>
                    <Button onClick={handleSave}>Save Changes</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}


