"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/types/super-admin.dto";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  Briefcase,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface UserDetailViewerProps {
  user: User;
}

export default function UserDetailViewer({ user }: UserDetailViewerProps) {
  const [open, setOpen] = React.useState(false);

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const roleColors: Record<string, string> = {
    "super admin": "bg-purple-500",
    admin: "bg-blue-500",
    "school owner": "bg-indigo-500",
    teacher: "bg-green-500",
    "head teacher": "bg-teal-500",
    student: "bg-yellow-500",
    staff: "bg-orange-500",
    parent: "bg-pink-500",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-left hover:underline font-medium">
          {user.name || user.email}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            {user.name || "User Details"}
          </DialogTitle>
          <DialogDescription>
            Detailed information about the user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.name || "Unknown"}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge
                variant="default"
                className={`mt-2 ${roleColors[user.role] || "bg-gray-500"}`}
              >
                {user.role}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
                <p className="font-medium">{user.email}</p>
              </div>

              {user.phone && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>Phone</span>
                  </div>
                  <p className="font-medium">{user.phone}</p>
                </div>
              )}

              {user.school && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>School ID</span>
                  </div>
                  <p className="font-medium font-mono text-sm">{user.school}</p>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          {(user.address || user.city || user.state || user.zipCode) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Address</h3>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    {user.address && <p>{user.address}</p>}
                    <p className="text-muted-foreground">
                      {user.city}
                      {user.state && `, ${user.state}`}
                      {user.zipCode && ` ${user.zipCode}`}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Professional Information */}
          {(user.experience ||
            user.yearsOfExperience ||
            user.qualifications?.length ||
            user.assignedClasses?.length ||
            user.subjectsCanTeach?.length) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.yearsOfExperience !== undefined && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        <span>Years of Experience</span>
                      </div>
                      <p className="font-medium">{user.yearsOfExperience} years</p>
                    </div>
                  )}

                  {user.assignedClasses && user.assignedClasses.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span>Assigned Classes</span>
                      </div>
                      <p className="font-medium">{user.assignedClasses.length}</p>
                    </div>
                  )}

                  {user.subjectsCanTeach &&
                    user.subjectsCanTeach.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <GraduationCap className="h-4 w-4" />
                          <span>Subjects</span>
                        </div>
                        <p className="font-medium">
                          {user.subjectsCanTeach.length} subject
                          {user.subjectsCanTeach.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                </div>

                {user.experience && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Experience</div>
                    <p className="text-sm">{user.experience}</p>
                  </div>
                )}

                {user.qualifications && user.qualifications.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Qualifications
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.qualifications.map((qual, index) => (
                        <Badge key={index} variant="outline">
                          {qual}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Additional Information */}
          {(user.emergencyContact || user.additionalNotes) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Additional Information</h3>
                {user.emergencyContact && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Emergency Contact
                    </div>
                    <p className="font-medium">{user.emergencyContact}</p>
                  </div>
                )}
                {user.additionalNotes && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Notes</div>
                    <p className="text-sm">{user.additionalNotes}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Timestamps */}
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <div>
                <span className="font-medium">Created:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <div>
                <span className="font-medium">Updated:</span>{" "}
                {new Date(user.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

