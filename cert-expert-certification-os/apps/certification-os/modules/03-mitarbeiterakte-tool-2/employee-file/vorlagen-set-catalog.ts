/**
 * Vorlagen-Set-Katalog (#D, Dispatch Lane G) — Set-Auswahl je Set-Kategorie +
 * positionsunabhängige Overlays.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * BEGRIFFS-MODELL (verbindlich — Feedback E, NICHT vermischen):
 *  - **Set-Kategorie** (diese Datei) = `Sicherheitsmitarbeiter | Führungskraft |
 *    Bürokraft (Verwaltung)`. EIGENE Achse, die das **Generator-Vorlagen-Set**
 *    (Core-Dokumente) ableitet. Reine Dokument-Steuerung.
 *  - **≠ Norm-Klasse** `roleClasses[]` (`ek/fk/verwaltung/…`): treibt das
 *    Engine-Grundset (Pflicht-Set/UE-Soll). Wird hier NICHT angefasst.
 *  - **≠ Org-Titel** `roleType` (z. B. Schichtleiter): reine Anzeige.
 *  - `standard models` (Upload-Manager) = Tool 1 → hier NICHT importiert/gemischt.
 *
 * EC-10: Dieser Katalog macht KEINE Freigabe-/Auditfähigkeits-/„qualifiziert"-
 * Aussage. Er wählt nur, welche Vorlagen-Dokumente exportiert werden.
 *
 * NORM: Set-Kategorie ist KEINE Norm-Pflicht (keine CL). Einzig das
 * **Fahrtätigkeit-Overlay** trägt eine CL: CL-73 (Fahrer-/UVV-Unterweisung,
 * `legal-input`) → „fachlich prüfen", KEIN erfundener Wert.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ GEPARKTE DATEN-/MARK-FRAGE (siehe HANDOFF): Welche konkreten
 * S3-Template-Ordner (`roles/<slug>`) zu welcher Set-Kategorie gehören, ist eine
 * Daten-/Mark-Entscheidung. Heute existiert im Bucket nur „DIN 77200 Allgemeine".
 * Bis Mark die echte Zuordnung liefert, mappt der Katalog jede Set-Kategorie über
 * eine **Default-/Platzhalter-Heuristik** (`DEFAULT_SET_ROLE_SLUGS`) auf einen
 * Rollen-Slug; greift keiner, fällt die Auswahl tolerant auf die erste/vorhandene
 * Rolle zurück (kein Bruch, EC-09). Persistenz reitet auf dem bestehenden
 * `roleId`-Feld → KEIN Schema-/Repo-Eingriff (eigene `setKategorie`-DB-Spalte =
 * geparkter Schema-Slice).
 */

import type { BestellungTyp, Employee, Role } from "@/lib/types/employee";
import { BESTELLUNG_DEFS } from "./employee-display-labels";

/**
 * Lane N P1 — realer S3-Logical-Path einer Bestell-Vorlage
 * (`appointments/bestellungen/<docFileName>`). Single-source aus `BESTELLUNG_DEFS`
 * (gleicher Ordner für alle drei Typen).
 */
function bestellungTemplateLogicalPath(typ: BestellungTyp): string {
  const def = BESTELLUNG_DEFS.find((d) => d.typ === typ)!;
  return `appointments/${def.appointmentFolderId}/${def.docFileName}`;
}

/** Set-Kategorie = eigene Vorlagen-Achse (NICHT Norm-Klasse, NICHT Org-Titel). */
export type SetKategorie =
  | "sicherheitsmitarbeiter"
  | "fuehrungskraft"
  | "buerokraft";

export interface SetKategorieDef {
  id: SetKategorie;
  /** DE-Label fürs Dropdown/Anzeige. */
  label: string;
  /** Kurzbeschreibung für die UI. */
  description: string;
}

/**
 * Die drei Set-Kategorien (Mark-Feedback D + Q6). Reihenfolge = UI-Reihenfolge.
 * Keine CL — Set-Kategorie ist Doku-Steuerung, keine Norm-Pflicht.
 */
export const SET_KATEGORIE_DEFS: readonly SetKategorieDef[] = [
  {
    id: "sicherheitsmitarbeiter",
    label: "Sicherheitsmitarbeiter",
    description: "Core-Vorlagen-Set für operative Sicherheitskräfte (SMA).",
  },
  {
    id: "fuehrungskraft",
    label: "Führungskraft",
    description: "Core-Vorlagen-Set für Führung / Einsatzleitung.",
  },
  {
    id: "buerokraft",
    label: "Bürokraft (Verwaltung)",
    description: "Core-Vorlagen-Set für Verwaltung / Büro.",
  },
] as const;

const SET_KATEGORIE_BY_ID: Record<SetKategorie, SetKategorieDef> =
  Object.fromEntries(SET_KATEGORIE_DEFS.map((d) => [d.id, d])) as Record<
    SetKategorie,
    SetKategorieDef
  >;

export function setKategorieLabel(id: SetKategorie): string {
  return SET_KATEGORIE_BY_ID[id]?.label ?? id;
}

export function isKnownSetKategorie(id: string): id is SetKategorie {
  return id in SET_KATEGORIE_BY_ID;
}

/**
 * ⚠️ PLATZHALTER-MAPPING (geparkte Mark-Entscheidung): Set-Kategorie →
 * bevorzugte Rollen-Slug-Kandidaten (erster im Bucket vorhandener gewinnt).
 * Die Slugs decken die heutigen Demo-/Legacy-Rollen ab (siehe
 * `ROLE_KATEGORIE_DE` in `employee-display-labels.ts`). Sobald Mark die echten
 * Set-Ordner liefert, werden hier die realen Slugs eingetragen — kein
 * Logik-Umbau nötig.
 */
const DEFAULT_SET_ROLE_SLUGS: Record<SetKategorie, readonly string[]> = {
  // Reale S3-Rollen-Ordner (2026-06-10 eingespielt), je genau ein Slug → eindeutiges
  // Reverse-Mapping (projectSetKategorieFromRoleId). Forward-Fallback auf die Basis-
  // Rolle macht resolveSetKategorieRoleId über roles[0] (din-77200-1-allgemeine).
  sicherheitsmitarbeiter: ["sicherheitsmitarbeiter"],
  fuehrungskraft: ["fuehrungskraft"],
  buerokraft: ["buerokraft"],
};

/**
 * Leitet die Core-Vorlagen-Rolle (S3-Rollen-Ordner) aus einer Set-Kategorie ab.
 * Tolerant: erster Slug-Kandidat, der als Rolle vorhanden ist; sonst Fallback
 * auf die erste verfügbare Rolle (verhindert EC-09-Bruch, falls der Bucket nur
 * „DIN 77200 Allgemeine" enthält). Gibt `undefined` zurück, wenn gar keine
 * Rollen geladen sind.
 */
export function resolveSetKategorieRoleId(
  setKategorie: SetKategorie | undefined,
  roles: readonly Role[],
): string | undefined {
  if (roles.length === 0) return undefined;
  if (setKategorie) {
    const candidates = DEFAULT_SET_ROLE_SLUGS[setKategorie] ?? [];
    for (const slug of candidates) {
      const hit = roles.find((r) => r.id === slug);
      if (hit) return hit.id;
    }
  }
  // Fallback: erste verfügbare Rolle (heute „DIN 77200 Allgemeine").
  return roles[0]?.id;
}

/**
 * Projiziert eine bestehende `roleId` (Persistenz-Träger) zurück auf die
 * Set-Kategorie. Gibt `undefined`, wenn die Rolle keiner Set-Kategorie
 * eindeutig zugeordnet ist.
 */
export function projectSetKategorieFromRoleId(
  roleId: string | undefined,
): SetKategorie | undefined {
  if (!roleId) return undefined;
  for (const def of SET_KATEGORIE_DEFS) {
    if (DEFAULT_SET_ROLE_SLUGS[def.id].includes(roleId)) return def.id;
  }
  return undefined;
}

/**
 * Lane J (A2) — `setKategorie` ist jetzt ein **echtes persistiertes Feld** an
 * der Akte (Schema `setKategorie String?`). Diese Funktion ist die
 * Read-Normalisierung / der Default-Resolver:
 *  1. persistiertes, gültiges Feld → Source of Truth (überschreibbar),
 *  2. sonst **Default aus der Rolle** ableiten (Legacy-Backfill aus `roleId`),
 *  3. sonst `undefined` (UI „— bitte wählen —").
 * **Rolle vs. Set-Kategorie entkoppelt:** ein gesetztes Feld gewinnt auch dann,
 * wenn es von der aus `roleId` abgeleiteten Default abweicht. Idempotent.
 */
export function resolveSetKategorie(employee: {
  setKategorie?: string;
  roleId?: string;
}): SetKategorie | undefined {
  if (employee.setKategorie && isKnownSetKategorie(employee.setKategorie)) {
    return employee.setKategorie;
  }
  return projectSetKategorieFromRoleId(employee.roleId);
}

// ════════════════════════════════════════════════════════════════════════════
// OVERLAYS — positionsunabhängig (knüpfen NICHT an die Set-Kategorie)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Overlay-Typ. Positionsunabhängig = unabhängig von der Set-Kategorie wählbar.
 *  - `bestellung`: knüpft an `bestelltAls`/`appointmentIds` (Lane C) — die
 *    formalen Ernennungen (Ersthelfer/Brandschutzhelfer/SiBe). Doku-Quelle =
 *    bestehende Appointment-Dokumente (kein neuer Vorlagen-Slot nötig).
 *  - `fahrtaetigkeit`: Fahr-/UVV-Anweisung bei „fährt Dienstfahrzeug" — CL-73
 *    (`legal-input`, „fachlich prüfen", KEIN erfundener Wert).
 */
export type OverlayTyp = "bestellung" | "fahrtaetigkeit";

export interface OverlayDef {
  typ: OverlayTyp;
  label: string;
  /** Norm-Fundstelle (CL-xx) oder `null` (keine Norm-Pflicht). */
  clauseId: string | null;
  /** Kurzhinweis für die UI. */
  hint: string;
  /** `true` ⇒ nur als „fachlich prüfen" zulässig (legal-input). */
  fachlichPruefen?: boolean;
}

export const OVERLAY_DEFS: readonly OverlayDef[] = [
  {
    typ: "bestellung",
    label: "Bestellungen (Ernennung)",
    clauseId: null,
    hint: "Positionsunabhängig — knüpft an »bestellt als …« (Ersthelfer/Brandschutzhelfer/SiBe). Bestellung ≠ Schulung.",
  },
  {
    typ: "fahrtaetigkeit",
    label: "Fahrtätigkeit → Fahr-/UVV-Anweisung",
    clauseId: "CL-73",
    hint: "Bei »fährt Dienstfahrzeug«: Fahrer-/UVV-Unterweisung — fachlich prüfen (CL-73, legal-input, kein erfundener Wert).",
    fachlichPruefen: true,
  },
] as const;

// ════════════════════════════════════════════════════════════════════════════
// SET → DOKUMENT-MAPPING (Batch-2 Entscheidung B, Lane K)
// ════════════════════════════════════════════════════════════════════════════
/**
 * Konkretes B-Mapping (Mark, C-10-Gate 2026-06-09): welche **Standard-/Core-
 * Dokumente** ein MA je Set-Kategorie bekommt + welche **positionsunabhängigen
 * Overlays** bedingt dazukommen. Dies ist eine **deklarative Beschreibung** des
 * Dokument-Plans (Was-gehört-dazu) — sie steuert die Anzeige + den Generator-
 * Manifest. Die physische Vorlagen-Verarbeitung bleibt am bestehenden S3-Pfad
 * (`role.documents`/`appointment.documents`); fehlende Vorlagen werden hier als
 * `templateMissing: true` markiert → Generator legt einen Platzhalter-Hinweis ab
 * statt zu brechen (EC-09).
 *
 * NORM: Set-Kategorie ist KEINE Norm-Pflicht. Die einzelnen Dokumente tragen,
 * soweit normgestützt, ihre CL aus dem Register; sonst `null`. Posten mit
 * `legal-input` (CL-73/CL-75/CL-77) sind als `fachlichPruefen: true` markiert —
 * KEIN erfundener Wert, kein Auto-Status (EC-10).
 *
 * DATUM (Batch-2 B + #10): Default-Ausgabedatum aller Standarddokumente =
 * `startDate` (Arbeitsvertrag/Einstellung) → `dateSource: "startDate"`. Ausnahme
 * objektbezogene DA (CL-22) = erster Einsatz, **manuell** → `dateSource:
 * "manual"`. Overlays je nach Posten.
 */

/** Herkunft des Default-Ausgabedatums eines Set-Dokuments. */
export type SetDocDateSource =
  /** Arbeitsvertrags-/Einstellungsdatum (`startDate`) — Default Standarddoku. */
  | "startDate"
  /** Manuell zu setzen (z. B. objektbezogene DA = erster Einsatz). */
  | "manual";

/** Klassifikation eines Set-Dokuments (Anzeige/Filter). */
export type SetDocKind = "core" | "overlay";

export interface SetDocumentSpec {
  /** Stabile, sprechende ID (für Anzeige/Manifest, KEINE S3-Vorlagen-ID). */
  id: string;
  /** DE-Label fürs Dokument. */
  label: string;
  /** Core (aus Set-Kategorie) oder Overlay (positionsunabhängig, bedingt). */
  kind: SetDocKind;
  /** Norm-Fundstelle (CL-xx) oder `null` (keine Norm-Pflicht). */
  clauseId: string | null;
  /** `true` ⇒ nur als „fachlich prüfen" zulässig (legal-input). */
  fachlichPruefen?: boolean;
  /** Default-Ausgabedatum-Herkunft. */
  dateSource: SetDocDateSource;
  /**
   * `true` ⇒ es liegt (noch) **keine Vorlage** im Bucket vor → Platzhalter-
   * Hinweis im Generator-Manifest statt Bruch (EC-09). Siehe HANDOFF-Liste der
   * fehlenden Vorlagen.
   */
  templateMissing?: boolean;
  /**
   * Lane N P1 — realer S3-Logical-Path der Vorlage
   * (`category/folderName/fileName.docx`), wenn das Dokument auf eine konkret
   * eingespielte Vorlage zeigt (z. B. Bestellungen unter
   * `appointments/bestellungen/`). Dient der Nachvollziehbarkeit im Manifest;
   * die physische Verarbeitung läuft weiterhin über die Doc-Chips (EC-09).
   */
  templateLogicalPath?: string;
  /** Kurzhinweis für UI/Manifest. */
  hint: string;
}

/**
 * BASIS-DOKUMENTE — gelten für JEDEN MA (Sicherheitsmitarbeiter + Führungskraft).
 * Bürokraft hat eine ABWEICHENDE Basis (Bildschirmarbeitsplatz statt SR-DA) →
 * siehe `BUEROKRAFT_BASIS`.
 *  - Allgemeine (Jahres-)Pflicht-/Arbeitsschutz-Unterweisung: CL-75
 *    („fachlich prüfen", DGUV — exakte Nummern Mark nachreichen). VORLAGE FEHLT.
 *  - Datenschutz-/Verschwiegenheitserklärung (1 Blatt): CL-04/CL-05.
 */
const BASIS_DOCS: readonly SetDocumentSpec[] = [
  {
    id: "basis-arbeitsschutz-unterweisung",
    label: "Allgemeine (Jahres-)Pflichtunterweisung Arbeitsschutz",
    kind: "core",
    clauseId: "CL-75",
    dateSource: "startDate",
    hint: "Arbeitsschutz-Grundunterweisung (CL-75: §12 Abs.1 ArbSchG, §4 DGUV V1, §4 Abs.2 DGUV V23).",
  },
  {
    id: "basis-datenschutz-verschwiegenheit",
    label: "Datenschutz-/Verschwiegenheitserklärung",
    kind: "core",
    clauseId: "CL-04/CL-05",
    dateSource: "startDate",
    hint: "Datenschutz- (CL-04) + Verschwiegenheitsverpflichtung (CL-05), unterschriftspflichtig.",
  },
] as const;

/** Bildschirmarbeitsplatz-Unterweisung — Büro UND Führungskraft (PC-Arbeit, Mark 2026-06-10). */
const BILDSCHIRM_DOC: SetDocumentSpec = {
  id: "buero-bildschirmarbeitsplatz-unterweisung",
  label: "Bildschirmarbeitsplatz-Unterweisung",
  kind: "core",
  clauseId: "CL-75",
  dateSource: "startDate",
  hint: "Bildschirm-/Büro-Arbeitsschutz-Unterweisung (CL-75: ArbStättV Anh. Nr.6, DGUV Information 215-410).",
};

/** Bürokraft-Basis: KEINE SR-Dienstanweisung; Bildschirmarbeitsplatz + Erklärung. */
const BUEROKRAFT_BASIS: readonly SetDocumentSpec[] = [
  BILDSCHIRM_DOC,
  {
    id: "basis-datenschutz-verschwiegenheit",
    label: "Datenschutz-/Verschwiegenheitserklärung",
    kind: "core",
    clauseId: "CL-04/CL-05",
    dateSource: "startDate",
    hint: "Datenschutz- (CL-04) + Verschwiegenheitsverpflichtung (CL-05), unterschriftspflichtig.",
  },
] as const;

const STELLENBESCHREIBUNG_SMA: SetDocumentSpec = {
  id: "stellenbeschreibung-sma",
  label: "Stellenbeschreibung Sicherheitsmitarbeiter",
  kind: "core",
  clauseId: null,
  dateSource: "startDate",
  hint: "Stellenbeschreibung SMA (Set-Doku, keine Norm-Pflicht).",
};

const STELLENBESCHREIBUNG_FK: SetDocumentSpec = {
  id: "stellenbeschreibung-fk",
  label: "Stellenbeschreibung Führungskraft",
  kind: "core",
  clauseId: null,
  dateSource: "startDate",
  hint: "Stellenbeschreibung FK (Set-Doku, keine Norm-Pflicht).",
};

/** Core-Dokument-Set je Set-Kategorie (Batch-2 B). */
export function coreDocsForSetKategorie(
  setKategorie: SetKategorie | undefined,
): SetDocumentSpec[] {
  switch (setKategorie) {
    case "sicherheitsmitarbeiter":
      return [...BASIS_DOCS, STELLENBESCHREIBUNG_SMA];
    case "fuehrungskraft":
      // FK arbeitet auch an PCs → Bildschirmarbeitsplatz mit dazu (Mark 2026-06-10).
      return [...BASIS_DOCS, BILDSCHIRM_DOC, STELLENBESCHREIBUNG_FK];
    case "buerokraft":
      return [...BUEROKRAFT_BASIS];
    default:
      // Keine Set-Kategorie gewählt → nur die allgemeine Basis (jeder MA).
      return [...BASIS_DOCS];
  }
}

/**
 * Overlay-Spec je Bestell-Typ (positionsunabhängig, bedingt).
 *
 * Lane N P1 (2026-06-10): `templateLogicalPath` zeigt jetzt auf die real
 * eingespielten Vorlagen unter `appointments/bestellungen/` (drei `.docx` in
 * EINEM Ordner) statt auf die nie existenten Einzel-Appointment-IDs
 * (`safety-training`/`fire-safety`/`compliance-training`). Filenames sind
 * single-source aus `BESTELLUNG_DEFS` (siehe `employee-display-labels.ts`).
 */
const BESTELLUNG_OVERLAY_DOCS: Record<BestellungTyp, SetDocumentSpec> = {
  ersthelfer: {
    id: "overlay-bestellung-ersthelfer",
    label: "Bestellung Ersthelfer",
    kind: "overlay",
    clauseId: "CL-08",
    dateSource: "startDate",
    templateLogicalPath: bestellungTemplateLogicalPath("ersthelfer"),
    hint: "Bestellung (Ernennung) Ersthelfer — unterschriftspflichtig, ≠ Erste-Hilfe-Schulung (CL-08).",
  },
  brandschutzhelfer: {
    id: "overlay-bestellung-brandschutzhelfer",
    label: "Bestellung Brandschutzhelfer",
    kind: "overlay",
    clauseId: "CL-23",
    dateSource: "startDate",
    templateLogicalPath: bestellungTemplateLogicalPath("brandschutzhelfer"),
    hint: "Bestellung (Ernennung) Brandschutzhelfer — unterschriftspflichtig, ≠ Brandschutz-Schulung (CL-23).",
  },
  sibe: {
    id: "overlay-bestellung-sibe",
    label: "Bestellung SiBe / Sicherheitsbeauftragter",
    kind: "overlay",
    clauseId: "CL-74",
    dateSource: "startDate",
    templateLogicalPath: bestellungTemplateLogicalPath("sibe"),
    hint: "Betriebliche Bestellung SiBe — unterschriftspflichtig (Beauftragung ≠ Schulung, CL-74).",
  },
};

const FAHR_ANWEISUNG_OVERLAY: SetDocumentSpec = {
  id: "overlay-fahranweisung",
  label: "Kfz-/Fahr-Anweisung (UVV)",
  kind: "overlay",
  clauseId: "CL-73",
  fachlichPruefen: true,
  dateSource: "startDate",
  hint: "Fahr-/UVV-Anweisung bei Fahrtätigkeit (CL-73, legal-input, fachlich prüfen). VORLAGE FEHLT → Platzhalter.",
  templateMissing: true,
};

const OBJEKT_DA_OVERLAY: SetDocumentSpec = {
  id: "overlay-objektbezogene-da",
  label: "Objektbezogene Dienstanweisung",
  kind: "overlay",
  clauseId: "CL-22",
  dateSource: "manual",
  hint: "Objektbezogene DA (CL-22) — eigenes Datum = erster Einsatz am Objekt, MANUELL (Q10b, bis Projektakte existiert).",
};

const MUTTERSCHUTZ_OVERLAY: SetDocumentSpec = {
  id: "overlay-mutterschutz-hinweis",
  label: "Mutterschutz-Hinweis (MuSchG)",
  kind: "overlay",
  clauseId: "CL-77",
  fachlichPruefen: true,
  dateSource: "startDate",
  hint: "Hinweis auf Meldepflicht Schwangerschaft — weibliche MA, ALLE Sets (CL-77, MuSchG, legal-input, fachlich prüfen). VORLAGE FEHLT → Platzhalter.",
  templateMissing: true,
};

/**
 * Leitet die **bedingten Overlays** aus den persistierten Akte-Feldern ab
 * (positionsunabhängig — knüpfen NICHT an die Set-Kategorie):
 *  - Bestellungen aus `bestelltAls` (Ersthelfer CL-08 / Brandschutz CL-23 / SiBe
 *    CL-74),
 *  - Kfz-/Fahr-Anweisung (CL-73, fachlich prüfen) bei `drivesServiceVehicle`,
 *  - objektbezogene DA (CL-22, manuelles Datum) bei zugeordnetem Objekt
 *    (`sdlScopes` nicht leer — Heuristik bis Projektakte; KEIN erfundener Wert),
 *  - Mutterschutz-Hinweis (CL-77) für `gender === "weiblich"`, ALLE Sets.
 * Reihenfolge ist stabil (Bestellungen → Fahr → Objekt → Mutterschutz).
 */
export function overlayDocsForEmployee(employee: {
  bestelltAls?: BestellungTyp[];
  drivesServiceVehicle?: boolean;
  sdlScopes?: string[];
  gender?: Employee["gender"];
}): SetDocumentSpec[] {
  const out: SetDocumentSpec[] = [];
  // Bestellungen (in Katalog-Reihenfolge der drei Typen).
  const order: BestellungTyp[] = ["ersthelfer", "brandschutzhelfer", "sibe"];
  const wanted = new Set(employee.bestelltAls ?? []);
  for (const typ of order) {
    if (wanted.has(typ)) out.push(BESTELLUNG_OVERLAY_DOCS[typ]);
  }
  if (employee.drivesServiceVehicle === true) out.push(FAHR_ANWEISUNG_OVERLAY);
  if ((employee.sdlScopes?.length ?? 0) > 0) out.push(OBJEKT_DA_OVERLAY);
  // Mutterschutz: NUR weiblich, positionsunabhängig (alle Sets).
  if (employee.gender === "weiblich") out.push(MUTTERSCHUTZ_OVERLAY);
  return out;
}

/**
 * **Voller Set→Dokument-Plan** für einen MA (Batch-2 B): Core-Set (aus
 * Set-Kategorie) + bedingte Overlays. Deklarativ — Quelle für Anzeige + den
 * Generator-Manifest. Verändert NICHTS an der physischen Vorlagen-Verarbeitung
 * (EC-09); fehlende Vorlagen tragen `templateMissing: true`.
 */
export function buildSetDocumentPlan(employee: {
  setKategorie?: SetKategorie;
  roleId?: string;
  bestelltAls?: BestellungTyp[];
  drivesServiceVehicle?: boolean;
  sdlScopes?: string[];
  gender?: Employee["gender"];
}): SetDocumentSpec[] {
  const kategorie = resolveSetKategorie(employee);
  return [...coreDocsForSetKategorie(kategorie), ...overlayDocsForEmployee(employee)];
}
