/**
 * P1 — Tool 1 (Document Creator) ↔ zentrales Firmen-Profil (CompanyExportSettings).
 * Pure, testbare Brücke zwischen dem Tool-2-Profil (GlobalProperties) und den
 * Tool-1-Formularfeldern + die Logo-Auflösungs-Reihenfolge.
 *
 * Bewusst NICHT gemappt: Straße/PLZ/Stadt/Land — die existieren im zentralen
 * Profil nicht (nur eine `companyAddress`-Zeile) → kein erfundenes Mapping.
 */
import type { GlobalProperties } from "@/lib/types/employee";

export interface Tool1CompanyFields {
  companyName: string;
  companyAddressLine: string;
  docVersion: string;
  docDate: string;
  createdBy: string;
  approvedBy: string;
}

/** Firmen-Profil → vorausgefüllte (überschreibbare) Tool-1-Formularfelder. */
export function mapProfileToTool1Fields(
  props: GlobalProperties,
): Tool1CompanyFields {
  return {
    companyName: props.companyName ?? "",
    companyAddressLine: props.companyAddress ?? "",
    docVersion: props.documentVersion ?? "",
    docDate: props.documentDate ?? "",
    createdBy: props.createdBy ?? "",
    approvedBy: props.approvedBy ?? "",
  };
}

export type Tool1LogoSource = "manual" | "profile" | "none";

/**
 * Logo-Auflösungs-Reihenfolge:
 * manueller Upload gewinnt → sonst Profil-Logo → sonst keins.
 */
export function resolveTool1LogoSource(opts: {
  hasManualLogo: boolean;
  hasProfileLogo: boolean;
}): Tool1LogoSource {
  if (opts.hasManualLogo) return "manual";
  if (opts.hasProfileLogo) return "profile";
  return "none";
}

/**
 * Parst eine data-URL (`data:<mime>;base64,<data>`) → Buffer + mime.
 * Das zentrale Profil liefert das Logo als data-URL (getExportSettings).
 * Gibt null bei fehlender/ungültiger/leerer URL (kein Wurf).
 */
export function decodeDataUrl(
  dataUrl: string | null | undefined,
): { buffer: Buffer; mime: string } | null {
  if (!dataUrl) return null;
  const match = /^data:([^;]+);base64,([\s\S]*)$/.exec(dataUrl);
  if (!match) return null;
  const mime = match[1];
  const b64 = match[2];
  if (!mime || !b64) return null;
  try {
    const buffer = Buffer.from(b64, "base64");
    if (buffer.length === 0) return null;
    return { buffer, mime };
  } catch {
    return null;
  }
}
