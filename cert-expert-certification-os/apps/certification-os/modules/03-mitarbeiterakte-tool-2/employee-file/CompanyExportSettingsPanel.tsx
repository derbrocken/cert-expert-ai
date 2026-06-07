"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Input, DatePicker, FileDropzone } from "@/components/ui";
import {
  Building2,
  Mail,
  MapPin,
  User,
  Hash,
  Building,
} from "lucide-react";
import type { GlobalProperties } from "@/lib/types/employee";
import {
  loadGlobalExportSettings,
  saveGlobalExportSettings,
} from "@/lib/employee-queue-storage";

export interface CompanyExportSettingsPanelProps {
  /** Compact layout for embedding in Upload Manager */
  compact?: boolean;
}

async function persistExportSettings(
  props: GlobalProperties,
  file: File | null,
) {
  let companyLogo = props.companyLogo;
  if (file) {
    companyLogo = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  saveGlobalExportSettings({ ...props, companyLogo });
}

export const CompanyExportSettingsPanel: React.FC<
  CompanyExportSettingsPanelProps
> = ({ compact = false }) => {
  const [value, setValue] = useState<GlobalProperties>(() =>
    loadGlobalExportSettings(),
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    void persistExportSettings(value, logoFile);
  }, [value, logoFile]);

  const handleChange = useCallback(
    (field: keyof GlobalProperties, val: string) => {
      setValue((prev) => ({ ...prev, [field]: val }));
    },
    [],
  );

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(227,6,19,0.1)] text-[#e30613]">
          <Building className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-[#111827]">
            Firmendaten für Dokument-Export
          </h3>
          <p className="mt-0.5 text-xs text-[#6b7280]">
            Eine Firma — gilt für alle Mitarbeiterakten (Tool 2) und Vorlagen
            (Tool 1). Logo, Adresse und Footer-Metadaten werden automatisch
            übernommen.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
            Firmenname
          </label>
          <Input
            value={value.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder="Acme Security GmbH"
            leftIcon={<Building2 className="h-4 w-4" />}
            className="!py-2.5 !text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
            E-Mail
          </label>
          <Input
            value={value.companyEmail}
            onChange={(e) => handleChange("companyEmail", e.target.value)}
            placeholder="info@firma.de"
            leftIcon={<Mail className="h-4 w-4" />}
            className="!py-2.5 !text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
            Adresse
          </label>
          <Input
            value={value.companyAddress}
            onChange={(e) => handleChange("companyAddress", e.target.value)}
            placeholder="Musterstraße 1, Berlin"
            leftIcon={<MapPin className="h-4 w-4" />}
            className="!py-2.5 !text-sm"
          />
        </div>
      </div>

      <div className="space-y-2 border-t border-[#e5e7eb] pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
          Firmenlogo
        </label>
        <p className="text-xs text-[#6b7280]">
          Optional — ersetzt {"{Logo}"} in generierten Dokumenten.
        </p>
        <FileDropzone
          value={logoFile}
          onFileSelect={setLogoFile}
          className="!p-4"
          placeholder="Logo hier ablegen"
        />
      </div>

      <div className="space-y-3 border-t border-[#e5e7eb] pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
          Footer-Metadaten (global)
        </p>
        <p className="text-xs text-[#6b7280]">
          Gleiche Version für alle Standarddokumente — nicht pro Mitarbeiter
          neu setzen.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#6b7280]">
              Dokumentversion
            </label>
            <Input
              value={value.documentVersion || ""}
              onChange={(e) => handleChange("documentVersion", e.target.value)}
              placeholder="v1.0"
              leftIcon={<Hash className="h-4 w-4" />}
              className="!py-2.5 !text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#6b7280]">
              Dokumentdatum
            </label>
            <DatePicker
              value={value.documentDate || ""}
              onChange={(val) => handleChange("documentDate", val)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#6b7280]">
              Erstellt von
            </label>
            <Input
              value={value.createdBy || ""}
              onChange={(e) => handleChange("createdBy", e.target.value)}
              placeholder="Name"
              leftIcon={<User className="h-4 w-4" />}
              className="!py-2.5 !text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#6b7280]">
              Freigegeben von
            </label>
            <Input
              value={value.approvedBy || ""}
              onChange={(e) => handleChange("approvedBy", e.target.value)}
              placeholder="Name"
              leftIcon={<User className="h-4 w-4" />}
              className="!py-2.5 !text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

CompanyExportSettingsPanel.displayName = "CompanyExportSettingsPanel";
