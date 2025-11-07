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
import { toast } from "react-toastify";

export function AddClassDialog() {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const className = formData.get("className");

    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      pending: `Creating class: ${className}`,
      success: "Class created successfully!",
      error: "Failed to create class",
    });

    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-4">
          Add Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Create a new class by filling in the details below. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="className">Class Name</Label>
              <Input
                id="className"
                name="className"
                placeholder="e.g., Mathematics 101"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Select name="gradeLevel" required>
                  <SelectTrigger id="gradeLevel" className="w-full">
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
                <Label htmlFor="teacher">Teacher</Label>
                <Select name="teacher" required>
                  <SelectTrigger id="teacher" className="w-full">
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                    <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                    <SelectItem value="David Kim">David Kim</SelectItem>
                    <SelectItem value="Lisa Wong">Lisa Wong</SelectItem>
                    <SelectItem value="James Wilson">James Wilson</SelectItem>
                    <SelectItem value="Nina Patel">Nina Patel</SelectItem>
                    <SelectItem value="Carlos Rodriguez">
                      Carlos Rodriguez
                    </SelectItem>
                    <SelectItem value="Maria Garcia">Maria Garcia</SelectItem>
                    <SelectItem value="Alex Thompson">Alex Thompson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="capacity">Class Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  placeholder="30"
                  min="1"
                  max="50"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="Active" required>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Input
                id="schedule"
                name="schedule"
                placeholder="e.g., Mon/Wed/Fri 9:00-10:30"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="room">Room Number</Label>
              <Input id="room" name="room" placeholder="e.g., Room 101" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                name="description"
                placeholder="Brief description of the class"
              />
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
            <Button type="submit">Create Class</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

