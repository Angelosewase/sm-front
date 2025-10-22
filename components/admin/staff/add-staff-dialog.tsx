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

export function AddStaffDialog() {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const staffName = formData.get("name");

    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      pending: `Adding staff member: ${staffName}`,
      success: "Staff member added successfully!",
      error: "Failed to add staff member",
    });

    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-4">
          Add Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Staff Member</DialogTitle>
          <DialogDescription>
            Add a new staff member to the system. Fill in all required information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Personal Information</h3>
              
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
                    placeholder="john.smith@school.edu"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" placeholder="City" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" placeholder="State" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" name="zip" placeholder="12345" />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-sm">Employment Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="position">Position/Job Title *</Label>
                  <Input
                    id="position"
                    name="position"
                    placeholder="e.g., Receptionist"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select name="department" required>
                    <SelectTrigger id="department" className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="IT Support">IT Support</SelectItem>
                      <SelectItem value="Health Services">Health Services</SelectItem>
                      <SelectItem value="Library">Library</SelectItem>
                      <SelectItem value="Student Services">Student Services</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Food Services">Food Services</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Science Lab">Science Lab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select name="employmentType" defaultValue="Full-time" required>
                    <SelectTrigger id="employmentType" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="shift">Work Shift *</Label>
                  <Select name="shift" defaultValue="Day" required>
                    <SelectTrigger id="shift" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Day">Day</SelectItem>
                      <SelectItem value="Night">Night</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                      <SelectItem value="Morning/Afternoon">Morning/Afternoon</SelectItem>
                      <SelectItem value="Rotating">Rotating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hireDate">Hire Date *</Label>
                  <Input
                    id="hireDate"
                    name="hireDate"
                    type="date"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="salary">Annual Salary *</Label>
                  <Input
                    id="salary"
                    name="salary"
                    placeholder="$45,000"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Employment Status *</Label>
                <Select name="status" defaultValue="Active" required>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-sm">Additional Information</h3>

              <div className="grid gap-2">
                <Label htmlFor="qualifications">Qualifications/Certifications</Label>
                <Input
                  id="qualifications"
                  name="qualifications"
                  placeholder="e.g., CPR Certified, Bachelor's Degree"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  placeholder="Name and phone number"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional information about the staff member..."
                  rows={3}
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
            <Button type="submit">Register Staff Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
