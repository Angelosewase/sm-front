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
import { School } from "@/types/super-admin.dto";
import { useSchool } from "@/hooks/use-super-admin";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Users,
  Calendar,
  GraduationCap,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface SchoolDetailViewerProps {
  school: School;
}

export default function SchoolDetailViewer({
  school,
}: SchoolDetailViewerProps) {
  const [open, setOpen] = React.useState(false);
  const { data: schoolDetails, isLoading } = useSchool(school._id, {
    enabled: open,
  });

  const displaySchool = schoolDetails || school;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-left hover:underline font-medium">
          {school.name}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {displaySchool.name}
          </DialogTitle>
          <DialogDescription>
            Detailed information about the school
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <Badge
                variant={displaySchool.isActive ? "default" : "secondary"}
                className={
                  displaySchool.isActive
                    ? "bg-green-500"
                    : "bg-gray-500"
                }
              >
                {displaySchool.isActive ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {displaySchool.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>School Type</span>
                </div>
                <p className="font-medium">
                  {displaySchool.schoolType || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Established Year</span>
                </div>
                <p className="font-medium">
                  {displaySchool.establishedYear || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>Student Capacity</span>
                </div>
                <p className="font-medium">
                  {displaySchool.studentCapacity.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Total Users</span>
                </div>
                <p className="font-medium">
                  {displaySchool.users?.length || 0}
                </p>
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
                  <p className="font-medium">{displaySchool.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>Phone</span>
                  </div>
                  <p className="font-medium">
                    {displaySchool.phoneNumber || "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span>Website</span>
                  </div>
                  <a
                    href={displaySchool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {displaySchool.website}
                  </a>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </div>
                  <p className="font-medium">
                    {displaySchool.address && (
                      <span>{displaySchool.address}, </span>
                    )}
                    {displaySchool.city}, {displaySchool.district}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {displaySchool.description && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {displaySchool.description}
                  </p>
                </div>
              </>
            )}

            {/* Users */}
            {displaySchool.users && displaySchool.users.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    Users ({displaySchool.users.length})
                  </h3>
                  <div className="space-y-2">
                    {displaySchool.users.map((user) => {
                      const initials = user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U";
                      return (
                        <div
                          key={user._id}
                          className="flex items-center gap-3 p-2 rounded-lg border"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {user.name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Timestamps */}
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Created:</span>{" "}
                {new Date(displaySchool.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{" "}
                {new Date(displaySchool.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

