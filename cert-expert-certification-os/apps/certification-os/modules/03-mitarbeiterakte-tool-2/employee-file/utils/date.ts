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
