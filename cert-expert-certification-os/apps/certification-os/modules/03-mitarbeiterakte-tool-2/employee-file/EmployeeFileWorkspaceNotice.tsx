"use client";

import React from "react";
import { Shield } from "lucide-react";

export const EmployeeFileWorkspaceNotice: React.FC = () => {
  return (
    <div
      className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-3 py-2.5 sm:px-4"
      role="note"
    >
      <div className="flex gap-2.5">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-xs leading-relaxed text-amber-900/85 sm:text-sm">
          <span className="font-semibold text-amber-950">
            Transitional workspace.
          </span>{" "}
          Generator und Speicher wie bisher — kein automatischer Freigabe- oder
          Zertifizierungsstatus.
        </p>
      </div>
    </div>
  );
};

EmployeeFileWorkspaceNotice.displayName = "EmployeeFileWorkspaceNotice";
