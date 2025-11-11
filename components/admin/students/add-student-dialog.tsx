"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

export function AddStudentDialog() {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const studentName = formData.get("name");

    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      pending: `Enrolling student: ${studentName}`,
      success: "Student enrolled successfully!",
      error: "Failed to enroll student",
    });

    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-4">
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enroll New Student</DialogTitle>
          <DialogDescription>
            Add a new student to the school system. Fill in all required
            information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Student Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Student Information</h3>

              <div className="grid gap-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  placeholder="e.g., STU2024021"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., John Smith"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.smith@student.edu"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender">
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Street address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="province">Province *</Label>
                  <Input
                    id="province"
                    name="province"
                    placeholder="Enter province"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    name="district"
                    placeholder="Enter district"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-sm">Academic Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="grade">Grade Level *</Label>
                  <Select name="grade" required>
                    <SelectTrigger id="grade" className="w-full">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grade 9">Grade 9</SelectItem>
                      <SelectItem value="Grade 10">Grade 10</SelectItem>
                      <SelectItem value="Grade 11">Grade 11</SelectItem>
                      <SelectItem value="Grade 12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="class">Assign to Class *</Label>
                  <Select name="class" required>
                    <SelectTrigger id="class" className="w-full">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics 101">
                        Mathematics 101
                      </SelectItem>
                      <SelectItem value="English Literature">
                        English Literature
                      </SelectItem>
                      <SelectItem value="Physics Advanced">
                        Physics Advanced
                      </SelectItem>
                      <SelectItem value="Chemistry Basics">
                        Chemistry Basics
                      </SelectItem>
                      <SelectItem value="World History">
                        World History
                      </SelectItem>
                      <SelectItem value="Computer Science">
                        Computer Science
                      </SelectItem>
                      <SelectItem value="Biology Lab">Biology Lab</SelectItem>
                      <SelectItem value="Art & Design">Art & Design</SelectItem>
                      <SelectItem value="Spanish Language">
                        Spanish Language
                      </SelectItem>
                      <SelectItem value="Physical Education">
                        Physical Education
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="previousSchool">Previous School</Label>
                <Input
                  id="previousSchool"
                  name="previousSchool"
                  placeholder="Name of previous school (if applicable)"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
                <Input
                  id="enrollmentDate"
                  name="enrollmentDate"
                  type="date"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-sm">
                Parent/Guardian Information
              </h3>

              <div className="grid gap-2">
                <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                <Input
                  id="parentName"
                  name="parentName"
                  placeholder="e.g., Jane Smith"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="parentEmail">Parent Email *</Label>
                  <Input
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    placeholder="jane.smith@email.com"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="parentPhone">Parent Phone *</Label>
                  <Input
                    id="parentPhone"
                    name="parentPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="relationship">Relationship to Student *</Label>
                <Select name="relationship" required>
                  <SelectTrigger id="relationship" className="w-full">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Guardian">Legal Guardian</SelectItem>
                    <SelectItem value="Grandparent">Grandparent</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  placeholder="Name and phone number"
                />
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-sm">Additional Information</h3>

              <div className="grid gap-2">
                <Label htmlFor="medicalInfo">Medical Information</Label>
                <Textarea
                  id="medicalInfo"
                  name="medicalInfo"
                  placeholder="Any allergies, medical conditions, or special needs..."
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional information about the student..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Enroll Student</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
