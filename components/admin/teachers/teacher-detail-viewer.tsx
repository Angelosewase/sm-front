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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { IconMail, IconPhone } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { Teacher } from "@/types/teachers.dto";
import AssignedClassesSection from "./assigned-class-section";
import AssignedSubjectsSection from "./assigned-subjects-section";

export default function TeacherDetailViewer({
    item,
}: {
    item: Teacher;
}) {
    const isMobile = useIsMobile();

    return (
        <Drawer direction={isMobile ? "bottom" : "right"} >
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">
                    {item.user.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="rounded-lg  m-1 min-w-[50vw]">
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.user.name}</DrawerTitle>
                    <DrawerDescription>
                        Teacher profile, assigned classes, and subject assignments
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    {/* Basic Information Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <IconMail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{item.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconPhone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{item.phone}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {/* <div>
                <Label className="text-xs text-muted-foreground">Department</Label>
                <p className="font-medium">{item.user.department}</p>
              </div> */}
                            <div>
                                <Label className="text-xs text-muted-foreground">Experience</Label>
                                <p className="font-medium">{item.user.experience}</p>
                            </div>
                        </div>
                        {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Classes Assigned</Label>
                <p className="font-medium">{item.classesAssigned}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Total Students</Label>
                <p className="font-medium">{item.totalStudents}</p>
              </div>
            </div> */}
                    </div>

                    <Separator />

                    {/* Assigned Classes Section */}
                    <AssignedClassesSection teacher={item} />

                    <Separator />

                    {/* Assigned Subjects Section */}
                    <AssignedSubjectsSection teacher={item} />

                    <Separator />

                    {/* Edit Form */}
                    <form className="flex flex-col gap-4">
                        <h3 className="font-semibold">Edit Teacher Information</h3>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={item.user.name} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={item.user.email} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" type="tel" defaultValue={item.user.phone} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="department">Department</Label>
                                <Select defaultValue={item.user.department}>
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
                                <Label htmlFor="status">Status</Label>
                                <Select defaultValue={item.status}>
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="On Leave">On Leave</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="experience">Experience</Label>
                                <Input id="experience" defaultValue={item.user.experience} />
                            </div>
                            {/* <div className="flex flex-col gap-3">
                <Label htmlFor="classesAssigned">Classes Assigned</Label>
                <Input
                  id="classesAssigned"
                  type="number"
                  defaultValue={item.classesAssigned}
                />
              </div> */}
                        </div>

                        {/* <div className="flex flex-col gap-3">
              <Label htmlFor="totalStudents">Total Students</Label>
              <Input
                id="totalStudents"
                type="number"
                defaultValue={item.totalStudents}
                disabled
              />
            </div> */}
                    </form>
                </div>
                <DrawerFooter>
                    <Button>Save Changes</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

