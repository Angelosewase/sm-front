"use client";

import React, { useState, useMemo } from "react";
import { UserDataTable } from "@/components/super-admin/users/user-data-table";
import { useUsers } from "@/hooks/use-super-admin";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function useDebouncedValue<T>(value: T, delay = 400) {
  const [state, setState] = React.useState(value);

  React.useEffect(() => {
    const handle = window.setTimeout(() => setState(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);

  return state;
}

const roles = [
  "super admin",
  "admin",
  "school owner",
  "teacher",
  "head teacher",
  "student",
  "staff",
  "parent",
];

export default function SuperAdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [emailFilter, setEmailFilter] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const debouncedSearch = useDebouncedValue(searchQuery);

  const queryParams = useMemo(() => {
    const params: any = {
      page,
      limit,
      sortBy,
      order,
    };

    if (debouncedSearch) {
      params.q = debouncedSearch;
    }

    if (roleFilter !== "all") {
      params.role = roleFilter;
    }

    if (emailFilter) {
      params.email = emailFilter;
    }

    if (schoolFilter) {
      params.school = schoolFilter;
    }

    return params;
  }, [
    debouncedSearch,
    roleFilter,
    emailFilter,
    schoolFilter,
    page,
    limit,
    sortBy,
    order,
  ]);

  const { data, isLoading, isError } = useUsers(queryParams);

  const hasActiveFilters =
    roleFilter !== "all" || emailFilter || schoolFilter;

  const clearFilters = () => {
    setRoleFilter("all");
    setEmailFilter("");
    setSchoolFilter("");
    setSearchQuery("");
    setPage(1);
  };

  return (
    <div className="py-4">
      <div className="flex flex-col gap-1 px-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-primary">Manage Users</h2>
        </div>
        <span className="text-muted-foreground text-base font-normal">
          View and filter all users across the system. Search by role, school,
          email, or name.
        </span>
      </div>

      {/* Filters */}
      <div className="px-4 mb-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Role Filter */}
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Email Filter */}
          <Input
            placeholder="Filter by email..."
            value={emailFilter}
            onChange={(e) => {
              setEmailFilter(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-[180px]"
          />

          {/* School Filter */}
          <Input
            placeholder="Filter by school ID..."
            value={schoolFilter}
            onChange={(e) => {
              setSchoolFilter(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-[180px]"
          />
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {roleFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Role: {roleFilter}
                <button
                  onClick={() => setRoleFilter("all")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {emailFilter && (
              <Badge variant="secondary" className="gap-1">
                Email: {emailFilter}
                <button
                  onClick={() => setEmailFilter("")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {schoolFilter && (
              <Badge variant="secondary" className="gap-1">
                School: {schoolFilter}
                <button
                  onClick={() => setSchoolFilter("")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Info */}
      {!isLoading && data && (
        <div className="px-4 mb-2 text-sm text-muted-foreground">
          Showing {data.items.length} of {data.total} users
        </div>
      )}

      {/* Data Table */}
      {isLoading ? (
        <div className="px-4">
          <Skeleton className="h-96 w-full" />
        </div>
      ) : isError ? (
        <div className="px-4 py-8 text-destructive">Failed to load users</div>
      ) : data ? (
        <>
          <UserDataTable data={data.items || []} />
          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="px-4 mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!data.hasPrev}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={!data.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

