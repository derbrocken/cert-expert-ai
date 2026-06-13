/**
 * P2-B — Katalog der firmen-ebenen Dokumente (Company-Tally `Y5Zq80`).
 *
 * `documentId` = stabile interne ID (S3-Key + `@@unique`-Slot je Firma).
 * `questionId` = Tally-Frage-Id (via REST API verifiziert, 2026-06-12,
 * `GET /forms/Y5Zq80/questions`).
 * `label`      = reine Anzeige — KEINE Normpflicht-/Auditaussage (EC-10).
 *
 * Reine Daten, kein IO → unit-testbar.
 */
export interface CompanyDocumentDef {
  documentId: string;
  label: string;
  questionId: string;
}

export const COMPANY_DOCUMENT_CATALOG: readonly CompanyDocumentDef[] = [
  {
    documentId: "unbedenklichkeit-1",
    label: "Unbedenklichkeitsbescheinigung (1)",
    questionId: "AlyLkk",
  },
  {
    documentId: "unbedenklichkeit-2",
    label: "Unbedenklichkeitsbescheinigung (2)",
    questionId: "BG0kvN",
  },
  {
    documentId: "gewerbezentralregister",
    label: "Gewerbezentralregister-Auszug",
    questionId: "kYv6LM",
  },
  {
    documentId: "handelsregister",
    label: "Handelsregister-Auszug",
    questionId: "vNKyRQ",
  },
  {
    documentId: "bewachungserlaubnis",
    label: "Bewachungserlaubnis (§ 34a GewO)",
    questionId: "KMklX7",
  },
  {
    documentId: "versicherung",
    label: "Versicherungsnachweis (Betriebshaftpflicht)",
    questionId: "LdkWl1",
  },
  {
    documentId: "datenschutz",
    label: "Datenschutz-Nachweis",
    questionId: "pLvBab",
  },
  {
    documentId: "verschwiegenheit",
    label: "Verschwiegenheitserklärung",
    questionId: "1r678W",
  },
  {
    documentId: "mindestlohn",
    label: "Mindestlohn-Nachweis",
    questionId: "MAMzBX",
  },
] as const;

export const COMPANY_DOCUMENT_IDS: readonly string[] =
  COMPANY_DOCUMENT_CATALOG.map((d) => d.documentId);

export function getCompanyDocumentDef(
  documentId: string,
): CompanyDocumentDef | undefined {
  return COMPANY_DOCUMENT_CATALOG.find((d) => d.documentId === documentId);
}

export function isKnownCompanyDocumentId(documentId: string): boolean {
  return COMPANY_DOCUMENT_CATALOG.some((d) => d.documentId === documentId);
}
