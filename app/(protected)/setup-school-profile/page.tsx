"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CreateSchoolDialog,
  SchoolFormData,
} from "@/components/school-profile/create-school-dialog";
import { SchoolProfile as SchoolProfileView } from "@/components/school-profile/school-profile-view";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import {
  CreateSchoolPayload,
  School as SchoolType,
  UpdateSchoolPayload,
} from "@/lib/api/school";
import { isAxiosError } from "axios";
import type { SchoolProfile } from "@/components/school-profile/school-profile-view";
import {
  useCreateSchool,
  useSchool,
  useUpdateSchool,
} from "@/hooks/use-school";

const toSchoolProfile = (school: SchoolType): SchoolProfile => {
  const normalizedStatus =
    school.status === "active" ||
    school.status === "inactive" ||
    school.status === "pending"
      ? school.status
      : undefined;
  const normalizedType =
    typeof school.schoolType === "string"
      ? school.schoolType.toLowerCase()
      : school.schoolType;

  return {
    id: school.id,
    name: school.name,
    type: normalizedType,
    address: school.address,
    city: school.city,
    district: school.district,
    phone: school.phoneNumber,
    email: school.email,
    website: school.website,
    description: school.description,
    establishedYear: school.establishedYear
      ? String(school.establishedYear)
      : undefined,
    studentCapacity: school.studentCapacity
      ? String(school.studentCapacity)
      : undefined,
    status: normalizedStatus,
  };
};

const toCreatePayload = (data: SchoolFormData): CreateSchoolPayload => ({
  name: data.name,
  schoolType: data.type,
  address: data.address,
  city: data.city,
  district: data.district,
  phoneNumber: data.phone,
  email: data.email,
  website: data.website || undefined,
  description: data.description || undefined,
  establishedYear: data.establishedYear
    ? Number(data.establishedYear)
    : undefined,
  studentCapacity: data.studentCapacity
    ? Number(data.studentCapacity)
    : undefined,
});

const toUpdatePayload = (data: Partial<SchoolProfile>): UpdateSchoolPayload => {
  const payload: UpdateSchoolPayload = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.type !== undefined) payload.schoolType = data.type;
  if (data.description !== undefined) payload.description = data.description;
  if (data.address !== undefined) payload.address = data.address;
  if (data.city !== undefined) payload.city = data.city;
  if (data.district !== undefined) payload.district = data.district;
  if (data.phone !== undefined) payload.phoneNumber = data.phone;
  if (data.email !== undefined) payload.email = data.email;
  if (data.website !== undefined) payload.website = data.website;
  if (data.establishedYear !== undefined && data.establishedYear !== "") {
    payload.establishedYear = Number(data.establishedYear);
  }
  if (data.studentCapacity !== undefined && data.studentCapacity !== "") {
    payload.studentCapacity = Number(data.studentCapacity);
  }
  return payload;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallback
    );
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
};

export default function SetupSchoolProfilePage() {
  const { userSchool, refreshUser } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(!userSchool);
  const [fetchErrorNotified, setFetchErrorNotified] = useState(false);

  const {
    data: fetchedSchool,
    isPending: isSchoolLoading,
    isFetching: isSchoolFetching,
    error: fetchError,
    refetch,
  } = useSchool<SchoolType>(userSchool?.id, {
    enabled: !!userSchool?.id,
  });

  const schoolProfile = useMemo<SchoolProfile | null>(() => {
    if (!fetchedSchool) return null;
    try {
      return toSchoolProfile(fetchedSchool);
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Failed to normalize school profile"
      );
      toast.error(message);
      return null;
    }
  }, [fetchedSchool]);

  useEffect(() => {
    if (!userSchool?.id) {
      setCreateDialogOpen(true);
      return;
    }
    setCreateDialogOpen(false);
    refetch();
  }, [refetch, userSchool?.id]);

  useEffect(() => {
    if (fetchError && !fetchErrorNotified) {
      const message = getErrorMessage(fetchError, "Failed to load school profile");
      toast.error(message);
      setFetchErrorNotified(true);
    }
  }, [fetchError, fetchErrorNotified]);

  useEffect(() => {
    if (!fetchError) {
      setFetchErrorNotified(false);
    }
  }, [fetchError]);

  const createSchoolMutation = useCreateSchool({
    onSuccess: async (school) => {
      toast.success("School created successfully!");
      await refreshUser();
      setCreateDialogOpen(false);
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to create school");
      toast.error(message);
    },
  });

  const updateSchoolMutation = useUpdateSchool({
    onSuccess: (updated) => {
      toast.success("School profile updated successfully!");
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to update school profile");
      toast.error(message);
    },
  });

  const isFetching = isSchoolLoading || isSchoolFetching;

  const handleCreateSchool = async (data: SchoolFormData) => {
    await createSchoolMutation.mutateAsync(toCreatePayload(data));
  };

  const handleUpdateSchool = async (data: Partial<SchoolProfile>) => {
    if (!schoolProfile) return;
    await updateSchoolMutation.mutateAsync({
      id: schoolProfile.id,
      payload: toUpdatePayload(data),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className=" mx-auto p-4">
        <div className=" mx-auto space-y-4">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            {/* {!schoolProfile && !isFetching && (
              <Button onClick={() => setCreateDialogOpen(true)} size="lg">
                <Plus className="h-5 w-5" />
                Create School Profile
              </Button>
            )} */}
          </div>

          {/* Content Area */}
          {isFetching ? (
            <Card className="border-none shadow-none">
              <CardContent className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading school profile...
                </div>
              </CardContent>
            </Card>
          ) : schoolProfile ? (
            <SchoolProfileView
              school={schoolProfile}
              onUpdate={handleUpdateSchool}
              isLoading={updateSchoolMutation.isPending}
            />
          ) : (
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <School className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  No School Profile Found
                </CardTitle>
              </CardHeader>
              {/* <CardContent className="text-center pb-8">
                <Button onClick={() => setCreateDialogOpen(true)} size="lg">
                  <Plus className="h-5 w-5" />
                  Create School Profile
                </Button>
              </CardContent> */}
            </Card>
          )}
        </div>
      </div>

      {/* Create School Dialog */}
      <CreateSchoolDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateSchool}
        isLoading={createSchoolMutation.isPending}
        preventClose={!userSchool}
      />
    </div>
  );
}
