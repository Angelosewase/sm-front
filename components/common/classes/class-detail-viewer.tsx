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
import { DataTable as GenericDataTable } from "@/components/datatable/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSubjects } from "@/hooks/use-subjects";
import { useAssignSubjectToClass } from "@/hooks/use-classes";
import { Class } from "@/lib/api/classes";
import {
    useUpdateClass,
    useDeleteClass,
    useClasses,
    useRestoreClass,
    usePermanentlyDeleteClass,
    useBulkTrashClasses,
    useBulkRestoreClasses,
    useBulkPermanentlyDeleteClasses,
} from "@/hooks/use-classes";
import { useTeachers } from "@/hooks/use-teachers";
import {
    useAcademicYears,
    useTermsByAcademicYear,
} from "@/hooks/use-academic-terms";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ClassData } from "./class-data-table";
import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useClassPerformance } from "@/hooks/use-classes";
import { Button } from "@/components/ui/button";
import { IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { CartesianGrid, XAxis, YAxis, Area, AreaChart } from "recharts";
import { gradeLevels } from "@/lib/constants/grade-levels";

export default function ClassDetailViewer({ item }: { item: ClassData }) {
    const isMobile = useIsMobile();
    const [isEditing, setIsEditing] = React.useState(false);

    const { data: academicYears } = useAcademicYears();
    const [selectedAcademicYearId, setSelectedAcademicYearId] = React.useState<string | undefined>(
        undefined
    );
    const { data: terms } = useTermsByAcademicYear(selectedAcademicYearId);
    const [selectedTermId, setSelectedTermId] = React.useState<string | undefined>(
        undefined
    );
    const [assessmentType, setAssessmentType] = React.useState<string | undefined>(
        undefined
    );
    const [weeks, setWeeks] = React.useState<number | undefined>(undefined);

    const selectedAcademicYearLabel = React.useMemo(() => {
        if (!selectedAcademicYearId || !academicYears) return undefined;
        return academicYears.find((y) => y._id === selectedAcademicYearId)?.label;
    }, [selectedAcademicYearId, academicYears]);

    const performanceFilters = React.useMemo(
        () => ({
            academicYear: selectedAcademicYearLabel,
            term: selectedTermId,
            assessmentType,
            weeks,
        }),
        [selectedAcademicYearLabel, selectedTermId, assessmentType, weeks]
    );

    const {
        data: performance,
        isLoading: isPerformanceLoading,
        isError: isPerformanceError,
    } = useClassPerformance(item._id, performanceFilters);
    const [selectedTeacher, setSelectedTeacher] = React.useState(
        item.classTeacher?._id || ""
    );
    const [selectedGrade, setSelectedGrade] = React.useState(
        item.gradeLevel || ""
    );
    const [selectedStatus, setSelectedStatus] = React.useState<
        "active" | "inactive"
    >(item.status || "active");

    const updateClassMutation = useUpdateClass();
    const { data: teachersData, isLoading: isLoadingTeachers } = useTeachers({
        limit: 100,
    });
    const isTrashed = !!item.isTrashed;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isTrashed) {
            return;
        }
        const formData = new FormData(e.currentTarget);

        const updateData = {
            name: formData.get("className") as string,
            gradeLevel: selectedGrade,
            capacity: Number(formData.get("capacity")),
            description: (formData.get("description") as string) || undefined,
            status: selectedStatus as "active" | "inactive",
            classTeacher: selectedTeacher,
        };

        updateClassMutation.mutate(
            { id: item._id, data: updateData },
            {
                onSuccess: () => {
                    setIsEditing(false);
                },
            }
        );
    };

    const chartConfig = {
        average: {
            label: "Average %",
            color: "hsl(217 91% 60%)",
        },
    } satisfies ChartConfig;

    console.log("the performance", performance);

    return (
        <Drawer direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">
                    {item.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.name}</DrawerTitle>
                    <DrawerDescription>
                        Class performance and attendance overview
                    </DrawerDescription>
                    {isTrashed && (
                        <Badge variant="destructive" className="w-fit">
                            Trashed
                        </Badge>
                    )}
                </DrawerHeader>

                {!isMobile && (
                    <div className="grid gap-2">
                        <div className="flex flex-col gap-2 leading-none font-medium">

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end p-4">
                                {/* Academic Year */}
                                <div className="flex flex-col gap-2">
                                    <Label>Academic Year</Label>
                                    <Select
                                        value={selectedAcademicYearId ?? ""}
                                        onValueChange={(value) => {
                                            const v = value || undefined;
                                            setSelectedAcademicYearId(v);
                                            setSelectedTermId(undefined);
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="All years" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="#">All years</SelectItem>
                                            {academicYears?.map((year) => (
                                                <SelectItem key={year._id} value={year._id}>
                                                    {year.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Term */}
                                <div className="flex flex-col gap-2">
                                    <Label>Term</Label>
                                    <Select
                                        value={selectedTermId ?? "#"}
                                        onValueChange={(value) => setSelectedTermId(value || undefined)}
                                        disabled={!selectedAcademicYearId}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="All terms" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="#">All terms</SelectItem>
                                            {terms?.map((term) => (
                                                <SelectItem key={term._id} value={term._id}>
                                                    {term.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Assessment Type */}
                                <div className="flex flex-col gap-2">
                                    <Label>Assessment Type</Label>
                                    <Select
                                        value={assessmentType ?? "#"}
                                        onValueChange={(value) => setAssessmentType(value || undefined)}
                                        disabled={!selectedTermId}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="All types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="#">All types</SelectItem>
                                            <SelectItem value="Quiz">Quiz</SelectItem>
                                            <SelectItem value="Test">Test</SelectItem>
                                            <SelectItem value="Exam">Exam</SelectItem>
                                            <SelectItem value="Homework">Homework</SelectItem>
                                            <SelectItem value="Classwork">Classwork</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Weeks */}
                                <div className="flex flex-col gap-2">
                                    <Label>Weeks (optional)</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={weeks ?? ""}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setWeeks(v ? Number(v) : undefined);
                                        }}
                                        placeholder="e.g. 6"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 px-4 py-4">
                                <div className="flex items-center gap-2 font-medium">
                                    <span>Class performance overview</span>
                                    <IconTrendingUp className="size-4" />
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                                    {performance?.groupBy === "academicYear" && (
                                        <span>Showing average performance by academic year.</span>
                                    )}
                                    {performance?.groupBy === "term" && (
                                        <span>Showing average performance by term.</span>
                                    )}
                                    {performance?.groupBy === "assessmentType" && (
                                        <span>Showing average performance by assessment type.</span>
                                    )}
                                    {isPerformanceLoading && <span>Loading performance...</span>}
                                    {isPerformanceError && (
                                        <span className="text-destructive">Failed to load performance data.</span>
                                    )}
                                    {!isPerformanceLoading &&
                                        !isPerformanceError &&
                                        !performance?.results?.length && (
                                            <span>No performance data for the selected filters.</span>
                                        )}
                                </div>
                            </div>
                            {performance?.results && !isPerformanceLoading && !isPerformanceError && performance.results.length > 0 && (
                                <div className="py-4 px-2">
                            <ChartContainer config={chartConfig} className="h-40 p-4 ">
                                <AreaChart
                                    accessibilityLayer
                                    data={
                                        performance?.results?.map((r: any) => {
                                            if (performance.groupBy === "academicYear") {
                                                return { label: r.academicYear, average: r.average };
                                            }
                                            if (performance.groupBy === "term") {
                                                return { label: r.term, average: r.average };
                                            }
                                            return {
                                                label: r.assessmentType || "Unknown",
                                                average: r.average,
                                            };
                                        }) ?? []
                                    }
                                    margin={{ left: 16, right: 24, bottom: 20 }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="label" tickLine={false} axisLine tickMargin={8} />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                indicator="dot"
                                                formatter={(value) => [`${value}%`, "Average"]}
                                            />
                                        }
                                    />
                                    <Area
                                        dataKey="average"
                                        type="natural"
                                        fill="hsl(217 91% 60% / 0.25)"
                                        fillOpacity={0.6}
                                        stroke="hsl(217 91% 60%)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ChartContainer>
                            </div>
                             )}
                            {/* <Separator /> */}
                          
                        </div>

                    </div>
                )}

                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    {isTrashed && (
                        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive">
                            This class is currently in the trash. Restore it before making
                            updates.
                        </div>
                    )}

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="className">Class Name</Label>
                            <Input
                                id="className"
                                name="className"
                                defaultValue={item.name}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="gradeLevel">Grade Level</Label>
                                <Select
                                    value={selectedGrade}
                                    onValueChange={setSelectedGrade}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger id="gradeLevel" className="w-full">
                                        <SelectValue placeholder="Select grade level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {gradeLevels.map((grade) => (
                                            <SelectItem key={grade.value} value={grade.value}>
                                                {grade.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={selectedStatus}
                                    onValueChange={(value) =>
                                        setSelectedStatus(value as "active" | "inactive")
                                    }
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="studentCount">Enrolled Students</Label>
                                <Input
                                    id="studentCount"
                                    value={item.studentCount}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="capacity">Class Capacity</Label>
                                <Input
                                    id="capacity"
                                    name="capacity"
                                    type="number"
                                    defaultValue={item.capacity}
                                    disabled={!isEditing}
                                    min={item.studentCount}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="teacher">Class Teacher</Label>
                            <Select
                                value={selectedTeacher || undefined}
                                onValueChange={setSelectedTeacher}
                                disabled={!isEditing || isLoadingTeachers}
                            >
                                <SelectTrigger id="teacher" className="w-full">
                                    <SelectValue
                                        placeholder={
                                            isLoadingTeachers
                                                ? "Loading teachers..."
                                                : "Select teacher"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachersData?.items && teachersData.items.length > 0 ? (
                                        teachersData.items.map((teacher) => (
                                            <SelectItem key={teacher._id} value={teacher._id}>
                                                {teacher.user.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                            No teachers available
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={item.description || ""}
                                disabled={!isEditing}
                                rows={3}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Assigned Subjects</Label>
                            {item.assignedSubjects && item.assignedSubjects.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {item.assignedSubjects.map((s) => (
                                        <Badge key={s._id} variant="secondary">
                                            {s.name || s.code || s._id}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted-foreground">No subjects assigned.</div>
                            )}
                        </div>
                        {isEditing && (
                            <div className="flex gap-2 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setSelectedTeacher(item.classTeacher?._id || "");
                                        setSelectedGrade(item.gradeLevel || "");
                                        setSelectedStatus(item.status || "active");
                                    }}
                                    disabled={updateClassMutation.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={updateClassMutation.isPending}>
                                    {updateClassMutation.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        )}
                    </form>
                </div>
                <DrawerFooter>
                    {!isEditing && (
                        <>
                            <Button onClick={() => setIsEditing(true)} disabled={isTrashed}>
                                Edit Class
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                            </DrawerClose>
                        </>
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
