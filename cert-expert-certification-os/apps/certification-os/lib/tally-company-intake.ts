/**
 * P2-A — Pure Parser: Company-Tally-Payload (`Y5Zq80`) → Firmen-Profil-Daten.
 * Kein DB/IO → unit-testbar. Der Intake-Service nutzt es + lädt das Logo nach S3.
 *
 * EC-10: reine Stammdaten (Name/E-Mail/Logo) — keine Freigabe-/Auditaussage.
 */

export interface CompanyIntakeResult {
  companyName: string;
  companyEmail: string;
  /** Logo-Datei (falls hochgeladen) — URL + abgeleitete Endung für den S3-Key. */
  logo: { url: string; ext: string } | null;
}

export interface CompanyQuestionMap {
  companyName: string;
  companyEmail: string;
  logo: string;
}

function str(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return str(v[0]);
  return "";
}

/** Erste hochgeladene Datei aus einem Tally-FILE_UPLOAD-Wert (Array oder Objekt). */
export function firstUploadedFile(
  value: unknown,
): { url: string; name?: string; mimeType?: string } | null {
  const arr = Array.isArray(value) ? value : value ? [value] : [];
  for (const v of arr) {
    if (
      v &&
      typeof v === "object" &&
      "url" in v &&
      typeof (v as { url?: unknown }).url === "string"
    ) {
      const f = v as { url: string; name?: string; mimeType?: string };
      return { url: f.url, name: f.name, mimeType: f.mimeType };
    }
  }
  return null;
}

/** Logo-Endung aus Dateiname bzw. MIME ableiten; Fallback png. (jpeg → jpg) */
export function logoExt(name?: string, mimeType?: string): string {
  const fromName = name?.split(".").pop()?.toLowerCase();
  if (fromName && /^(png|jpg|jpeg|webp|gif|svg)$/.test(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  const fromMime = mimeType?.split("/").pop()?.toLowerCase();
  if (fromMime && /^(png|jpeg|webp|gif|svg\+xml)$/.test(fromMime)) {
    if (fromMime === "jpeg") return "jpg";
    if (fromMime === "svg+xml") return "svg";
    return fromMime;
  }
  return "png";
}

/** MIME für den S3-ContentType aus der Endung. */
export function logoMime(ext: string): string {
  switch (ext) {
    case "jpg":
      return "image/jpeg";
    case "svg":
      return "image/svg+xml";
    default:
      return `image/${ext}`;
  }
}

export function parseCompanyIntake(
  getValue: (questionId: string) => unknown,
  q: CompanyQuestionMap,
): CompanyIntakeResult {
  const companyName = str(getValue(q.companyName));
  const companyEmail = str(getValue(q.companyEmail));
  const file = firstUploadedFile(getValue(q.logo));
  const logo = file ? { url: file.url, ext: logoExt(file.name, file.mimeType) } : null;
  return { companyName, companyEmail, logo };
}
