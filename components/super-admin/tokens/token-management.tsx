"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GenerateTokenDialog } from "./generate-token-dialog";
import { useMyTokens, useTokenStats } from "@/hooks/use-registration-tokens";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RegistrationTokenRole } from "@/lib/api/registration-tokens";

export function TokenManagement() {
  const [roleFilter, setRoleFilter] = useState<RegistrationTokenRole | "all">(
    "all"
  );
  const { data: tokens, isLoading: tokensLoading } = useMyTokens(
    roleFilter !== "all" ? roleFilter : undefined
  );
  const { data: stats, isLoading: statsLoading } = useTokenStats();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = async (token: string) => {
    await navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <GenerateTokenDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.pending || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {stats?.used || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {stats?.expired || 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tokens Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Tokens</CardTitle>
            <Select
              value={roleFilter}
              onValueChange={(value) =>
                setRoleFilter(value as RegistrationTokenRole | "all")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="school owner">School Owner</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="head teacher">Head Teacher</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {tokensLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : tokens && tokens.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires At</TableHead>
                    <TableHead>Used By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token._id}>
                      <TableCell>
                        <code className="text-xs font-mono">
                          {token.token.substring(0, 20)}...
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {token.role.charAt(0).toUpperCase() +
                            token.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {token.schoolId ? (
                          <span className="text-sm">{token.schoolId.name}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            N/A
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            token.status === "used"
                              ? "default"
                              : token.status === "expired"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {token.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(token.expiresAt)}
                      </TableCell>
                      <TableCell>
                        {token.usedBy ? (
                          <div className="text-sm">
                            <div>{token.usedBy.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {token.usedBy.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Not used
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(token.token)}
                        >
                          {copiedToken === token.token ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No tokens generated yet. Generate your first token to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
