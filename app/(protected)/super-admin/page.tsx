"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, CheckCircle, XCircle } from "lucide-react";
import { useSchools, useUsers } from "@/hooks/use-super-admin";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TokenManagement } from "@/components/super-admin/tokens/token-management";

export default function SuperAdminHomePage() {
  const { data: schoolsData, isLoading: schoolsLoading } = useSchools({
    limit: 1,
  });
  const { data: usersData, isLoading: usersLoading } = useUsers({
    limit: 1,
  });

  const totalSchools = schoolsData?.total || 0;
  const activeSchools =
    schoolsData?.items.filter((s) => s.isActive !== false).length || 0;
  const inactiveSchools = totalSchools - activeSchools;
  const totalUsers = usersData?.total || 0;

  return (
    <div className="mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Super Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage schools and users across the entire system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Schools */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {schoolsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalSchools}</div>
                <p className="text-xs text-muted-foreground">
                  Schools in the system
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Active Schools */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schools</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {schoolsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{activeSchools}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Inactive Schools */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Schools
            </CardTitle>
            <XCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {schoolsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{inactiveSchools}</div>
                <p className="text-xs text-muted-foreground">
                  Currently inactive
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Users across all schools
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Manage Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View, search, and manage all schools in the system. Activate or
              deactivate schools as needed.
            </p>
            <Link href="/super-admin/schools">
              <Button>Go to Schools</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View and filter all users across the system. Search by role,
              school, email, or name.
            </p>
            <Link href="/super-admin/users">
              <Button>Go to Users</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Registration Tokens */}
      <div className="mt-6">
        <TokenManagement />
      </div>
    </div>
  );
}

