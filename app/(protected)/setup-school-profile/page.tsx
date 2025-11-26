"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CreateSchoolDialog,
} from "@/components/school-profile/create-school-dialog";
import { SchoolProfile as SchoolProfileView } from "@/components/school-profile/school-profile-view";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useSchool as useSchoolContext} from "@/contexts/school-context";
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
    logoUrl: school.logoUrl
  };
};

const toCreatePayload = (data: FormData): CreateSchoolPayload => ({
  name: data.get("name")?.toString() as string,
  schoolType: data.get("type")?.toString() as string,
  address: data.get("address")?.toString() as string,
  city: data.get("city")?.toString() as string,
  district: data.get("district")?.toString() as string,
  phoneNumber: data.get("phone")?.toString() as string,
  email: data.get("email")?.toString() as string,
  website: data.get("website")?.toString() || undefined,
  description: data.get("description")?.toString() || undefined,
  establishedYear: data.get("establishedYear")
    ? Number(data.get("establishedYear"))
    : undefined,
  studentCapacity: data.get("studentCapacity")
    ? Number(data.get("studentCapacity"))
    : undefined,
  logo: data.get("logo") as File,
});

const toUpdatePayload = (data: FormData): UpdateSchoolPayload => {
  const payload: UpdateSchoolPayload = {};
  if (data.get("name") !== undefined) payload.name = data.get("name") as string;
  if (data.get("type") !== undefined) payload.schoolType = data.get("type") as string;
  if (data.get("description") !== undefined) payload.description = data.get("description") as string;
  if (data.get("address") !== undefined) payload.address = data.get("address") as string;
  if (data.get("city") !== undefined) payload.city = data.get("city") as string;
  if (data.get("district") !== undefined) payload.district = data.get("district") as string;
  if (data.get("phone") !== undefined) payload.phoneNumber = data.get("phone") as string;
  if (data.get("email") !== undefined) payload.email = data.get("email") as string;
  if (data.get("website") !== undefined) payload.website = data.get("website") as string;
  if (data.get("establishedYear") !== undefined && data.get("establishedYear") !== "") {
    payload.establishedYear = Number(data.get("establishedYear"));
  }
  if (data.get("studentCapacity") !== undefined && data.get("studentCapacity") !== "") {
    payload.studentCapacity = Number(data.get("studentCapacity"));
  }
  if (data.get("logo") !== undefined) payload.logo = data.get("logo") as File | undefined;
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
  const {
    school,
    setSchool,
    isLoading: isContextSchoolLoading,
  } = useSchoolContext();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [fetchErrorNotified, setFetchErrorNotified] = useState(false);

  const {
    data: fetchedSchool,
    isPending: isSchoolLoading,
    isFetching: isSchoolFetching,
    error: fetchError,
    refetch,
  } = useSchool<SchoolType>(school?.id, {
    enabled: !!school?.id,
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
    if (isContextSchoolLoading) {
      return;
    }
    if (!school?.id) {
      setCreateDialogOpen(true);
      return;
    }
    setCreateDialogOpen(false);
    refetch();
  }, [isContextSchoolLoading, refetch, school?.id]);

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
      setSchool({ id: school.id, name: school.name });
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

  const handleCreateSchool = async (data: FormData) => {
    await createSchoolMutation.mutateAsync(toCreatePayload(data));
  };

  const handleUpdateSchool = async (data: FormData) => {
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
        preventClose={!school}
      />
    </div>
  );
}
