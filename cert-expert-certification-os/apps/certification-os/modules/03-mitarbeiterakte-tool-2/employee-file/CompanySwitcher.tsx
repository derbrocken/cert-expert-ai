"use client";

import React from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CompanyOption {
  slug: string;
  displayName: string;
}

export interface CompanySwitcherProps {
  companies: CompanyOption[];
  value: string;
  onChange: (slug: string) => void;
  className?: string;
}

export const CompanySwitcher: React.FC<CompanySwitcherProps> = ({
  companies,
  value,
  onChange,
  className,
}) => {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm shadow-sm",
        className,
      )}
    >
      <Building2 className="h-4 w-4 shrink-0 text-[#e30613]" aria-hidden />
      <span className="sr-only">Kunde</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[10rem] border-0 bg-transparent py-0 pr-6 text-sm font-medium text-[#111827] focus:outline-none focus:ring-0"
        aria-label="Kunde auswählen"
      >
        {companies.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.displayName}
          </option>
        ))}
      </select>
    </label>
  );
};

CompanySwitcher.displayName = "CompanySwitcher";
