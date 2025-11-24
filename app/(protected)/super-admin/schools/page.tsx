"use client";

import React, { useState, useMemo } from "react";
import { SchoolDataTable } from "@/components/super-admin/schools/school-data-table";
import { useSchools } from "@/hooks/use-super-admin";
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
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function useDebouncedValue<T>(value: T, delay = 400) {
  const [state, setState] = React.useState(value);

  React.useEffect(() => {
    const handle = window.setTimeout(() => setState(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);

  return state;
}

export default function SuperAdminSchoolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

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

    if (statusFilter !== "all") {
      params.isActive = statusFilter === "active";
    }

    if (cityFilter) {
      params.city = cityFilter;
    }

    if (districtFilter) {
      params.district = districtFilter;
    }

    return params;
  }, [debouncedSearch, statusFilter, cityFilter, districtFilter, page, limit, sortBy, order]);

  const { data, isLoading, isError } = useSchools(queryParams);

  const hasActiveFilters =
    statusFilter !== "all" || cityFilter || districtFilter;

  const clearFilters = () => {
    setStatusFilter("all");
    setCityFilter("");
    setDistrictFilter("");
    setSearchQuery("");
    setPage(1);
  };

  return (
    <div className="py-4">
      <div className="flex flex-col gap-1 px-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-primary">
            Manage Schools
          </h2>
        </div>
        <span className="text-muted-foreground text-base font-normal">
          View, search, and manage all schools in the system. Activate or
          deactivate schools as needed.
        </span>
      </div>

      {/* Filters */}
      <div className="px-4 mb-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schools by name, city, district, or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* City Filter */}
          <Input
            placeholder="Filter by city..."
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-[180px]"
          />

          {/* District Filter */}
          <Input
            placeholder="Filter by district..."
            value={districtFilter}
            onChange={(e) => {
              setDistrictFilter(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-[180px]"
          />
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {cityFilter && (
              <Badge variant="secondary" className="gap-1">
                City: {cityFilter}
                <button
                  onClick={() => setCityFilter("")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {districtFilter && (
              <Badge variant="secondary" className="gap-1">
                District: {districtFilter}
                <button
                  onClick={() => setDistrictFilter("")}
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
          Showing {data.items.length} of {data.total} schools
        </div>
      )}

      {/* Data Table */}
      {isLoading ? (
        <div className="px-4">
          <Skeleton className="h-96 w-full" />
        </div>
      ) : isError ? (
        <div className="px-4 py-8 text-destructive">
          Failed to load schools
        </div>
      ) : data ? (
        <>
          <SchoolDataTable data={data.items || []} />
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

