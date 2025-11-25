"use client";

import React from "react";
import { TokenManagement } from "@/components/admin/tokens/token-management";

export default function HeadTeacherTokensPage() {
  return (
    <div className="py-4">
      <div className="flex flex-col gap-1 px-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-primary">
            Registration Tokens
          </h2>
        </div>
        <span className="text-muted-foreground text-base font-normal">
          Generate and manage registration tokens for teachers and head teachers to join your school.
        </span>
      </div>
      <div className="px-4">
        <TokenManagement />
      </div>
    </div>
  );
}

