/** Parse common date strings to ISO YYYY-MM-DD (local calendar date). */
export function parseDateInput(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const isoMatch = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
  if (isoMatch) {
    return toIsoDate(
      Number(isoMatch[1]),
      Number(isoMatch[2]),
      Number(isoMatch[3]),
    );
  }

  const euMatch = /^(\d{1,2})[./](\d{1,2})[./](\d{4})$/.exec(trimmed);
  if (euMatch) {
    return toIsoDate(
      Number(euMatch[3]),
      Number(euMatch[2]),
      Number(euMatch[1]),
    );
  }

  return null;
}

function toIsoDate(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/** Parse ISO date string to local Date (avoids UTC midnight shift). */
export function parseIsoDateLocal(iso: string): Date | null {
  const parsed = parseDateInput(iso);
  if (!parsed) return null;
  const [y, m, d] = parsed.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatIsoDisplay(iso: string): string {
  const date = parseIsoDateLocal(iso);
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatIsoToInput(iso: string): string {
  const date = parseIsoDateLocal(iso);
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}

/** Tool 2 generator output: ISO or DD.MM.YYYY input → DD.MM.YYYY. */
export function formatDocumentOutputDate(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const iso = parseDateInput(trimmed);
  if (iso) return formatIsoToInput(iso);
  return trimmed;
}

/** Today in local calendar as DD.MM.YYYY for generator placeholders. */
export function formatTodayDocumentOutput(): string {
  const now = new Date();
  const iso = toIsoDate(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );
  return iso ? formatIsoToInput(iso) : "";
}

/**
 * #8 — Generator-Ausgabedatum auflösen: ein explizit gesetztes Datum
 * (ISO `YYYY-MM-DD` oder `DD.MM.YYYY`) wird zu `DD.MM.YYYY` formatiert; leer
 * oder unparsbar → Fallback auf „heute". So bleibt der Default „heute" intakt,
 * während ein global gesetztes oder pro Dokument überschriebenes Datum sticht.
 */
export function resolveDocumentDate(value?: string | null): string {
  if (value) {
    const formatted = formatDocumentOutputDate(value);
    if (formatted) return formatted;
  }
  return formatTodayDocumentOutput();
}

/**
 * Stabiler Schlüssel für ein pro-Dokument überschreibbares Generator-Datum:
 * `${employeeId}::${docId}`. `docId` ist die Vorlagen-Dokument-ID (Rolle oder
 * Bestellung/Appointment). So sticht ein Per-Doc-Datum über den globalen
 * Default, ohne die Vorlagen-Verarbeitung anzufassen.
 */
export function documentDateKey(employeeId: string, docId: string): string {
  return `${employeeId}::${docId}`;
}

/**
 * Q8 — Schlüssel für ein Datum **pro Dokument-Typ** (gilt für ALLE gewählten
 * Personen): der dokument-/template-übergreifende Identifier. Das ist die
 * Vorlagen-`docId` selbst — dasselbe Dokument bei mehreren Personen trägt
 * dieselbe `docId`, also denselben Typ-Schlüssel. Eigene Funktion (statt roher
 * `docId`), damit die Typ-Ebene als Konzept benannt und an einer Stelle änderbar
 * ist. Auflösung (spezifischer sticht): `perDocument` (Person+Doc) → `perDocType`
 * (Doc-Typ) → `global` → heute.
 */
export function documentTypeKey(docId: string): string {
  return docId;
}

/**
 * Q8 — löst die Override-Ebenen eines Dokuments auf: `perDocument` (Person+Doc)
 * → `perDocType` (Doc-Typ). Gibt den ROHEN Wert der stechenden Ebene zurück
 * (noch nicht formatiert) oder `undefined`, wenn keine Ebene greift (→ Aufrufer
 * fällt auf #10/#C-Default bzw. globalen Wert zurück). Reines Ausgabedatum,
 * kein Engine-/Norm-Eingriff. Spezifischer sticht.
 */
export function resolveDocDateOverride(
  perDocument: Record<string, string>,
  perDocType: Record<string, string>,
  employeeId: string,
  docId: string,
): string | undefined {
  const perDoc = perDocument[documentDateKey(employeeId, docId)];
  if (perDoc) return perDoc;
  const perType = perDocType[documentTypeKey(docId)];
  if (perType) return perType;
  return undefined;
}
