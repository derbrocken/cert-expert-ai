"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { getActiveCompanySlug } from "@/lib/company-session";
import { readFileAsDataUrl } from "./employee-evidence-storage";

export interface CompanyExportSettingsPanelProps {
  /** Compact layout for embedding in Upload Manager */
  compact?: boolean;
  companySlug?: string;
}

export const CompanyExportSettingsPanel: React.FC<
  CompanyExportSettingsPanelProps
> = ({ compact = false, companySlug: companySlugProp }) => {
  const companySlug = companySlugProp ?? getActiveCompanySlug();
  const [value, setValue] = useState<GlobalProperties>({
    companyName: "",
    companyEmail: "",
    companyAddress: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const lastSavedSnapshotRef = useRef("");
  const loadedSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (loadedSlugRef.current === companySlug && hydrated) return;
    let cancelled = false;
    loadedSlugRef.current = companySlug;
    void loadGlobalExportSettings(companySlug).then((settings) => {
      if (cancelled) return;
      setValue(settings);
      setLogoFile(null);
      lastSavedSnapshotRef.current = JSON.stringify({
        value: settings,
        hasLogo: false,
      });
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [companySlug]);

  useEffect(() => {
    if (!hydrated) return;

    const snapshot = JSON.stringify({ value, hasLogo: Boolean(logoFile) });
    if (snapshot === lastSavedSnapshotRef.current) return;

    const timer = window.setTimeout(() => {
      void (async () => {
        let logoBase64: string | null = null;
        if (logoFile) {
          logoBase64 = await readFileAsDataUrl(logoFile);
        }
        const saved = await saveGlobalExportSettings(
          companySlug,
          value,
          logoBase64,
        );
        lastSavedSnapshotRef.current = JSON.stringify({
          value: saved,
          hasLogo: false,
        });
        if (JSON.stringify(saved) !== JSON.stringify(value)) {
          setValue(saved);
        }
        setLogoFile(null);
      })();
    }, 500);
    return () => window.clearTimeout(timer);
  }, [value, logoFile, hydrated, companySlug]);

  const handleChange = useCallback(
    (field: keyof GlobalProperties, val: string) => {
      setValue((prev) => ({ ...prev, [field]: val }));
    },
    [],
  );

  if (!hydrated) {
    return (
      <p className="text-sm text-[#6b7280]">Firmendaten laden…</p>
    );
  }

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
            Pro Kunde ({companySlug}) — gilt für Tool 1 + Tool 2. Logo liegt auf
            Hetzner S3.
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
          Optional — ersetzt {"{Logo}"} in generierten Dokumenten (S3).
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
