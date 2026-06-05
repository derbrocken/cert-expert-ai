"use client";

import React from "react";
import { Shield } from "lucide-react";

export const EmployeeFileWorkspaceNotice: React.FC = () => {
  return (
    <div
      className="mb-6 rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 sm:px-5"
      role="note"
    >
      <div className="flex gap-3">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="text-sm text-amber-950/90">
          <p className="font-semibold">Transitional employee file workspace (B5.7)</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-900/80 sm:text-sm">
            This page frames the existing generator queue as an employee file
            workspace. Document generation, template selection, and local storage
            behave as before. This is not automatic release, DIN compliance, or
            certification readiness.
          </p>
        </div>
      </div>
    </div>
  );
};

EmployeeFileWorkspaceNotice.displayName = "EmployeeFileWorkspaceNotice";
