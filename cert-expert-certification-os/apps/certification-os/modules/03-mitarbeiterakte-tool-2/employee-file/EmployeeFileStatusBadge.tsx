"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { WorkingItemStatus } from "./employee-file-requirements";

const STATUS_STYLES: Record<WorkingItemStatus, string> = {
  vorhanden: "bg-green-50 text-green-800 border-green-200",
  fehlt: "bg-red-50 text-red-800 border-red-200",
  beantragt: "bg-blue-50 text-blue-800 border-blue-200",
  unvollständig: "bg-amber-50 text-amber-900 border-amber-200",
  "nicht lesbar": "bg-gray-100 text-gray-700 border-gray-200",
  abgelaufen: "bg-orange-50 text-orange-900 border-orange-200",
  "nicht erforderlich": "bg-gray-50 text-gray-500 border-gray-200",
  "fachlich prüfen": "bg-violet-50 text-violet-900 border-violet-200",
  vorbereitet: "bg-sky-50 text-sky-900 border-sky-200",
  offen: "bg-amber-50 text-amber-800 border-amber-200",
};

export function EmployeeFileStatusBadge({
  status,
  className,
}: {
  status: WorkingItemStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        STATUS_STYLES[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
