/**
 * Qualifikations-Katalog (#2, Dispatch v3 Lane F) — strukturierte Multiselect-
 * Werte statt Freitext. Jeder Eintrag ist CL-belegt (oder „fachlich prüfen") aus
 * `knowledge/NORM_KLAUSEL_REGISTER_v1.md`.
 *
 * Begriffs-Modell (Mark 2026-06-09): Eine Person kann mehrere Qualifikationen
 * tragen. Die **höchste Stufe** (A < B < C) bestimmt die Qualifikationsstufe;
 * **Zusätze** (z. B. Waffensachkunde) sind additive Flags — sie ändern die Stufe
 * NICHT und erzeugen KEINE neue DIN-Pflicht.
 *
 * EC-10: Dieser Katalog macht KEINE „qualifiziert"-/Freigabe-/Auditfähigkeits-
 * Aussage. Er klassifiziert nur die erfasste Qualifikation für die Engine.
 *
 * Persistenz/Migration: Es gibt KEINE neue DB-Spalte. Die strukturierte Auswahl
 * wird über die bestehende `qualification`-Spalte (String) round-trip-stabil als
 * Label-Liste ge-/entladen (siehe `serializeQualifications` /
 * `parseQualifications` + Repository). Damit bleibt auch der bestehende
 * Presenter-/Engine-Freitext-Fallback (`/sachkunde/i`, `/unterricht/i`)
 * funktionsfähig, ohne Fremddateien zu ändern.
 */

/** Qualifikationsstufen nach DIN 77200-1 Anh. A (CL-07): A < B < C. */
export type QualificationStufe = "A" | "B" | "C";

export interface QualificationOption {
  /** Stabile Katalog-ID (persistiert / Engine-Input). */
  id: string;
  /** UI-Label (enthält bewusst „Unterrichtung"/„Sachkunde" → Freitext-Fallback-kompatibel). */
  label: string;
  /** Kurzbeschreibung für die UI. */
  description?: string;
  /** Norm-Fundstelle als CL-ID. `null` ⇒ nur als „fachlich prüfen" zulässig. */
  clauseId: string | null;
  /**
   * Qualifikationsstufe (A/B/C). `null` für reine Zusätze (Waffensachkunde),
   * die keine eigene Stufe definieren.
   */
  stufe: QualificationStufe | null;
  /** Erfüllt §34a-Sachkunde (CL-01/CL-02) — löst keine 6-Monats-Frist mehr aus. */
  erfuelltSachkunde?: boolean;
  /** Ist eine §34a-Unterrichtung (CL-01) — Sachkunde-Frist (CL-02) bleibt offen. */
  istUnterrichtung?: boolean;
  /** FK-qualifizierend (CL-10) — relevant nur bei FK-Rolle + DIN-SDL. */
  fkQualifizierend?: boolean;
  /**
   * Additiver Zusatz (z. B. Waffensachkunde) — ändert die Stufe NICHT und
   * erzeugt KEINE neue DIN-Pflicht. Wird als Flag/Hinweis geführt.
   */
  zusatz?: boolean;
  /** Optionaler Hinweis (z. B. „fachlich prüfen"). */
  hint?: string;
}

/**
 * Katalog der wählbaren Qualifikationen. Reihenfolge = UI-Reihenfolge
 * (Einstieg A → B → C → Zusätze). CL-Mapping aus dem Bauauftrag #2.
 */
export const QUALIFICATION_CATALOG: readonly QualificationOption[] = [
  {
    id: "unterrichtung-34a",
    label: "Unterrichtung §34a GewO",
    description: "Stufe A — Einstieg; löst 6-Monats-Sachkunde-Frist (CL-02) aus.",
    clauseId: "CL-01",
    stufe: "A",
    istUnterrichtung: true,
  },
  {
    id: "sachkunde-34a",
    label: "Sachkundeprüfung §34a GewO",
    description: "Stufe A — Sachkunde nachgewiesen (keine 6-Monats-Frist).",
    clauseId: "CL-01",
    stufe: "A",
    erfuelltSachkunde: true,
  },
  {
    id: "gssk",
    label: "Geprüfte Schutz- und Sicherheitskraft (GSSK)",
    description: "Stufe B — FK-qualifizierend (CL-10) bei DIN-SDL.",
    clauseId: "CL-07",
    stufe: "B",
    // GSSK setzt §34a-Sachkunde voraus (DIN 77200-1 §4.19.1 / Anh. A).
    erfuelltSachkunde: true,
    fkQualifizierend: true,
  },
  {
    id: "servicekraft",
    label: "Servicekraft für Schutz und Sicherheit",
    description: "Stufe B — FK-qualifizierend (CL-10) bei DIN-SDL.",
    clauseId: "CL-10",
    stufe: "B",
    erfuelltSachkunde: true,
    fkQualifizierend: true,
  },
  {
    id: "gepruefte-fachkraft",
    label: "Geprüfte Fachkraft für Schutz und Sicherheit",
    description: "Stufe C — FK-qualifizierend (CL-10) bei DIN-SDL.",
    clauseId: "CL-07",
    stufe: "C",
    erfuelltSachkunde: true,
    fkQualifizierend: true,
  },
  {
    id: "meister",
    label: "Meister für Schutz und Sicherheit",
    description: "Stufe C — FK-qualifizierend (CL-10) bei DIN-SDL.",
    clauseId: "CL-07",
    stufe: "C",
    erfuelltSachkunde: true,
    fkQualifizierend: true,
  },
  {
    id: "ihk-werkschutzmeister",
    label: "IHK-Werkschutzmeister",
    description: "Stufe C — FK-qualifizierend (CL-10) bei DIN-SDL.",
    clauseId: "CL-07",
    stufe: "C",
    erfuelltSachkunde: true,
    fkQualifizierend: true,
  },
  {
    id: "waffensachkunde",
    label: "Waffensachkunde §7 WaffG (Zusatz)",
    description:
      "Additiv — ersetzt §34a NICHT, ändert die Stufe nicht. Fachlich prüfen.",
    clauseId: "CL-76",
    stufe: null,
    zusatz: true,
    hint: "Fachlich prüfen (CL-76, legal-input) — additiv, keine neue DIN-Pflicht.",
  },
] as const;

const CATALOG_BY_ID = new Map(QUALIFICATION_CATALOG.map((o) => [o.id, o]));
const CATALOG_BY_LABEL = new Map(
  QUALIFICATION_CATALOG.map((o) => [o.label.toLowerCase(), o]),
);

/** Katalog-Option zu einer ID (oder undefined bei unbekannt). */
export function qualificationById(id: string): QualificationOption | undefined {
  return CATALOG_BY_ID.get(id);
}

/** Ist `id` eine bekannte Katalog-ID? */
export function isKnownQualificationId(id: string): boolean {
  return CATALOG_BY_ID.has(id);
}

const STUFE_RANK: Record<QualificationStufe, number> = { A: 1, B: 2, C: 3 };

/** Aggregierte Flags aus einer Qualifikations-Auswahl (Engine-Eingabe). */
export interface QualificationFlags {
  /** Höchste erreichte Stufe (A/B/C) oder `null`, wenn nur Zusätze/leer. */
  hoechsteStufe: QualificationStufe | null;
  /** Mindestens eine Auswahl erfüllt §34a-Sachkunde (CL-01/02). */
  hasSachkunde: boolean;
  /** Mindestens eine Auswahl ist eine §34a-Unterrichtung (CL-01). */
  hasUnterrichtung: boolean;
  /** Mindestens eine Auswahl ist FK-qualifizierend (CL-10). */
  hasFkQualifizierend: boolean;
  /** Mindestens eine Auswahl ist ein additiver Zusatz (z. B. Waffensachkunde). */
  hasZusatz: boolean;
  /** Gewählte Zusatz-Optionen (für „fachlich prüfen"-Hinweise). */
  zusaetze: QualificationOption[];
  /** Mindestens eine Auswahl war unbekannt (Legacy-Freitext) → fachlich prüfen. */
  hasUnbekannt: boolean;
}

/**
 * Leitet die Engine-relevanten Flags aus einer strukturierten Auswahl ab.
 * Unbekannte IDs werden als `hasUnbekannt` markiert (keine erfundene Pflicht).
 */
export function deriveQualificationFlags(
  ids: readonly string[] | null | undefined,
): QualificationFlags {
  const flags: QualificationFlags = {
    hoechsteStufe: null,
    hasSachkunde: false,
    hasUnterrichtung: false,
    hasFkQualifizierend: false,
    hasZusatz: false,
    zusaetze: [],
    hasUnbekannt: false,
  };
  if (!ids) return flags;

  let bestRank = 0;
  for (const id of ids) {
    const opt = CATALOG_BY_ID.get(id);
    if (!opt) {
      flags.hasUnbekannt = true;
      continue;
    }
    if (opt.stufe && STUFE_RANK[opt.stufe] > bestRank) {
      bestRank = STUFE_RANK[opt.stufe];
      flags.hoechsteStufe = opt.stufe;
    }
    if (opt.erfuelltSachkunde) flags.hasSachkunde = true;
    if (opt.istUnterrichtung) flags.hasUnterrichtung = true;
    if (opt.fkQualifizierend) flags.hasFkQualifizierend = true;
    if (opt.zusatz) {
      flags.hasZusatz = true;
      flags.zusaetze.push(opt);
    }
  }
  return flags;
}

// ---------------------------------------------------------------------------
// Persistenz / Migration (round-trip über die bestehende `qualification`-Spalte)
// ---------------------------------------------------------------------------

/**
 * Serialisiert die strukturierte Auswahl in einen String für die bestehende
 * `qualification`-Spalte: die zugehörigen **Labels**, mit „ · " verbunden.
 *
 * Labels (nicht IDs) bewusst gewählt: (1) menschenlesbar in Legacy-Anzeigen,
 * (2) der bestehende Freitext-Fallback (`/sachkunde/i`, `/unterricht/i`) im
 * Presenter/Engine bleibt funktionsfähig, ohne Fremddateien zu ändern.
 */
export function serializeQualifications(ids: readonly string[]): string {
  const labels = ids
    .map((id) => CATALOG_BY_ID.get(id)?.label)
    .filter((l): l is string => !!l);
  return labels.join(" · ");
}

/**
 * Tolerante Migration: bestehender `qualification`-Freitext → Katalog-IDs.
 * - Exakter Label-Match (round-trip aus `serializeQualifications`) → ID.
 * - Heuristik auf Schlüsselwörter (Sachkunde/Unterrichtung/GSSK/…).
 * - Nichts Erkennbares, aber Text vorhanden → KEIN Verlust: leere ID-Liste,
 *   der Aufrufer behält den Freitext (Engine-Fallback greift weiter).
 *
 * Verlustfrei: gibt zusätzlich zurück, ob etwas Unbekanntes übrig blieb, damit
 * die UI/Engine es als „fachlich prüfen" führen kann.
 */
export function parseQualifications(raw: string | null | undefined): {
  ids: string[];
  /** Reste, die keiner Katalog-ID zugeordnet werden konnten (nicht verloren). */
  unmatched: string[];
} {
  const text = (raw ?? "").trim();
  if (!text) return { ids: [], unmatched: [] };

  const ids: string[] = [];
  const unmatched: string[] = [];

  // Round-trip: " · "-getrennte Label-Liste exakt zurückmappen.
  const parts = text
    .split(" · ")
    .map((p) => p.trim())
    .filter(Boolean);

  for (const part of parts) {
    const exact = CATALOG_BY_LABEL.get(part.toLowerCase());
    if (exact) {
      pushUnique(ids, exact.id);
      continue;
    }
    const heuristic = heuristicMatch(part);
    if (heuristic.length > 0) {
      for (const id of heuristic) pushUnique(ids, id);
    } else {
      unmatched.push(part);
    }
  }

  // Wenn die Aufteilung nichts brachte (z. B. einzelner Freitext ohne „ · "),
  // einmal die Heuristik auf den Gesamttext anwenden.
  if (ids.length === 0 && unmatched.length === parts.length) {
    const heuristic = heuristicMatch(text);
    if (heuristic.length > 0) {
      return { ids: heuristic, unmatched: [] };
    }
  }

  return { ids, unmatched };
}

function pushUnique(list: string[], id: string): void {
  if (!list.includes(id)) list.push(id);
}

/**
 * Schlüsselwort-Heuristik für Legacy-Freitext → Katalog-IDs. Konservativ:
 * mappt nur eindeutige Begriffe; alles andere bleibt „unmatched" (kein Raten).
 */
function heuristicMatch(text: string): string[] {
  const t = text.toLowerCase();
  const out: string[] = [];
  // Reihenfolge: Zusätze + spezifische Titel vor generischen Stufen-Begriffen.
  if (/waffensachkunde|waffen/.test(t)) pushUnique(out, "waffensachkunde");
  if (/werkschutzmeister/.test(t)) pushUnique(out, "ihk-werkschutzmeister");
  else if (/meister/.test(t)) pushUnique(out, "meister");
  if (/gepr(ü|ue)fte\s+fachkraft|fachkraft\s+f(ü|ue)r/.test(t))
    pushUnique(out, "gepruefte-fachkraft");
  if (/gssk|schutz-?\s*und\s*sicherheitskraft/.test(t)) pushUnique(out, "gssk");
  if (/servicekraft/.test(t)) pushUnique(out, "servicekraft");
  // Sachkunde vor Unterrichtung (Sachkunde ist die stärkere Aussage).
  if (/sachkunde/.test(t)) pushUnique(out, "sachkunde-34a");
  else if (/unterricht/.test(t)) pushUnique(out, "unterrichtung-34a");
  return out;
}
