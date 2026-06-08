/**
 * Slice-2 Requirement-Engine — deterministische Ableitung des Pflicht-Sets.
 *
 * Reine Funktion, keine Seiteneffekte, kein DB-/UI-Wissen. Eingang ist ein
 * normalisierter Bedingungs-Vektor (`RequirementContext`), Ausgang ein
 * `RequirementResult`. Jede aktive Pflicht trägt eine `clauseId` (CL-xx) aus
 * `knowledge/NORM_KLAUSEL_REGISTER_v1.md`; eine Regel ohne belegte Klausel ist
 * nur als `status: "fachlich prüfen"` zulässig (keine erfundenen Pflichten).
 *
 * EC-10: keine Freigabe-/Auditfähigkeits-/Zertifizierungsaussage. Status bleiben
 * in der konservativen `WorkingItemStatus`-Union.
 */

/** Conservative working statuses — no audit/release claims */
export type WorkingItemStatus =
  | "vorhanden"
  | "fehlt"
  | "beantragt"
  | "unvollständig"
  | "nicht lesbar"
  | "abgelaufen"
  | "nicht erforderlich"
  | "fachlich prüfen"
  | "vorbereitet"
  | "offen";

/** Eine abgeleitete Pflicht (Nachweis / Unterweisung). */
export interface EngineRule {
  id: string;
  label: string;
  /** Norm-Fundstelle als CL-ID. `null` ⇒ nur als "fachlich prüfen" zulässig. */
  clauseId: string | null;
  status: WorkingItemStatus;
  /** Klartext-Bedingung: warum greift diese Pflicht? */
  trigger: string;
  /** Optionale Original-Fundstelle (z. B. "DIN 77200-1 §4.19.1"). */
  quelle?: string;
  hint?: string;
}

/** Schulungs-Soll (Zähler) — getrennt von der "qualifiziert"-Ampel. */
export interface TrainingTarget {
  id: string;
  label: string;
  clauseId: string | null;
  /** Belegter UE-Wert (intern berechnet) oder `null`, wenn fachlich zu prüfen. */
  ue: number | null;
  period: "einmalig" | "jaehrlich" | null;
  /** Dienstleistungs-Anteil-Kappung in % (z. B. 50 für "DL ≤ 50 %"). */
  dlCap?: number;
  trigger: string;
  status: WorkingItemStatus;
  hint?: string;
}

/** Frist/Termin-Vorstufe (volle Ampel = Slice 3). */
export interface Deadline {
  id: string;
  label: string;
  clauseId: string | null;
  /** ISO-Datum (YYYY-MM-DD), falls berechenbar. */
  dueDate?: string;
  /** Berechnungsbasis als Klartext (z. B. "Eintritt + 6 Monate"). */
  basis?: string;
  status: WorkingItemStatus;
  trigger: string;
}

export interface RequirementResult {
  pflichtSet: EngineRule[];
  schulungsSoll: TrainingTarget[];
  fristen: Deadline[];
  hinweise: string[];
}

/**
 * Norm-Klassifikation (G4): primärer Engine-Input. DIN 77200 kennt als
 * Qualifikationsachse nur EK (§3.10) vs. FK (§3.11/§4.19.1); Verwaltung
 * (keine Bewachung, §4.1 b), Praktikant (reduziert) und Subunternehmer
 * (§4.13/CL-42) ergänzen die Markt-Realität. Org-Titel (SMA, Schichtleitung …)
 * sind Business-Schicht und werden NICHT mehr direkt von der Engine gelesen.
 */
export type RoleClass = "ek" | "fk" | "verwaltung" | "praktikant" | "subunternehmer";

/** Normalisierter Bedingungs-Vektor — die einzige Engine-Eingabe. */
export interface RequirementContext {
  /**
   * Norm-Klassen-Set (EK/FK-Refinement) — primärer Engine-Input. EK und FK sind
   * frei kombinierbar; Verwaltung/Praktikant/Subunternehmer sind mit EK/FK
   * kombinierbar (der frühere Doppelrolle-Fall). Pflicht-Set = Vereinigung der
   * gewählten Klassen. Da FK ⊇ EK ergibt „EK+FK" exakt das FK-Set → keine neue
   * CL/UE, keine erfundene Pflicht.
   */
  roleClasses: RoleClass[];
  /** Org-Titel (Anzeige/Org-Chart), z. B. "Einsatzleitung". Nur für Trigger-Klartext, keine Engine-Wirkung. */
  roleType?: string;
  /** DE-Labels der Beauftragungen (Ersthelfer, Brandschutzhelfer, …). */
  appointmentLabels: string[];
  employmentType?: string;
  qualification?: string;
  /** Eintrittsdatum (ISO YYYY-MM-DD). */
  startDate?: string;
  /** SDL-Katalog-IDs, in denen die Person eingesetzt ist. */
  sdlScopes: string[];
  drivesServiceVehicle?: boolean | null;
  /** Ablaufdatum Erste Hilfe (ISO). */
  ersteHilfeGueltigBis?: string;
  /** Ablaufdatum Brandschutzhelfer (ISO). */
  brandschutzGueltigBis?: string;
  /** Optionaler Stichtag für deterministische Fristen-Tests (sonst heute). */
  referenceDate?: string;
}

// ---------------------------------------------------------------------------
// SDL-Katalog (mappt auf Geltungsbereich / DIN-Teil)
// ---------------------------------------------------------------------------

export type SdlScopeId =
  | "din1-grunddienste"
  | "din1-intervention"
  | "din2-veranstaltung"
  | "din2-objekte"
  | "din2-fluechtling-asyl"
  | "din2-oepv"
  | "non-din";

export interface SdlScopeOption {
  id: SdlScopeId;
  /** UI-Label. */
  name: string;
  /** Geltungsbereich-Kurztext. */
  geltungsbereich: string;
  hint?: string;
}

export const SDL_SCOPE_CATALOG: SdlScopeOption[] = [
  {
    id: "din1-grunddienste",
    name: "Alarm-, Empfangs-, Kontroll-, Revierdienst (stat./mobil)",
    geltungsbereich: "DIN 77200-1",
    hint: "Grund-Pflichtset DIN 77200-1",
  },
  {
    id: "din1-intervention",
    name: "Interventionsdienst",
    geltungsbereich: "DIN 77200-1",
    hint: "Löst 24-h-Schulung + 5 Interventionen aus (CL-09)",
  },
  {
    id: "din2-veranstaltung",
    name: "Veranstaltung bes. Sicherheitsrelevanz",
    geltungsbereich: "DIN 77200-2 §5",
    hint: "Einmalige Schulung (FK 24 / EK 16 UE)",
  },
  {
    id: "din2-objekte",
    name: "Objekte bes. Sicherheitsrelevanz",
    geltungsbereich: "DIN 77200-2 §7",
    hint: "+20 UE/Jahr objektspezifisch · Brandschutzhelfer",
  },
  {
    id: "din2-fluechtling-asyl",
    name: "Flüchtlings-/Asyleinrichtungen",
    geltungsbereich: "DIN 77200-2 §8",
    hint: "40 / 64 UE einmalig",
  },
  {
    id: "din2-oepv",
    name: "Öffentlicher Personenverkehr (ÖPV)",
    geltungsbereich: "DIN 77200-2 §6",
    hint: "Scope-Nachweis — UE fachlich prüfen",
  },
  {
    id: "non-din",
    name: "NON-DIN (gesetzlicher Mindeststandard)",
    geltungsbereich: "außerhalb DIN",
    hint: "Nur gesetzlicher Boden — fachlich prüfen",
  },
];

export function sdlScopeLabel(id: string): string {
  return SDL_SCOPE_CATALOG.find((s) => s.id === id)?.name ?? id;
}

// ---------------------------------------------------------------------------
// Rollen-Klassifikation (G4: roleClass-Norm-Klasse, nicht Org-Titel-Heuristik)
// ---------------------------------------------------------------------------

/**
 * G4-Migration/Mapping: Org-Titel (Legacy-`roleType`) → Norm-Klasse `roleClass`.
 * Single Source of Truth — genutzt von der idempotenten Read-Migration im
 * Repository und vom Presenter-Fallback (`buildRequirementContext`).
 *
 * Mark-Gate (2026-06-08): **Einsatzleitung = FK** (DIN 77200-1 §3.12/§4.2:
 * Einsatzleitung führt operativ, enthält mind. eine FK). Objekt-/Schichtleitung
 * **bleiben EK** (Mark: „nur Einsatzleitung = FK"). Keine titelgebundene
 * FK-Quali-Pflicht erfunden — FK hängt weiter an §4.19.1.
 */
const ORG_TITLE_TO_ROLE_CLASS: Record<string, RoleClass> = {
  Sicherheitsmitarbeiter: "ek",
  Schichtleitung: "ek",
  Objektleitung: "ek",
  Einsatzleitung: "fk",
  Führungskraft: "fk",
  Geschäftsführung: "verwaltung",
  "Bürokraft / Verwaltung": "verwaltung",
  "Praktikant / Azubi": "praktikant",
  "Subunternehmer-SMA": "subunternehmer",
};

/**
 * Org-Titel → Norm-Klasse. Unbekannter/leerer Titel ⇒ `undefined` (keine
 * erfundene Klasse) — die Engine liefert dann „Keine Rolle erfasst".
 */
export function mapRoleTypeToRoleClass(roleType?: string): RoleClass | undefined {
  if (!roleType) return undefined;
  return ORG_TITLE_TO_ROLE_CLASS[roleType.trim()];
}

const ALL_ROLE_CLASSES: readonly RoleClass[] = [
  "ek",
  "fk",
  "verwaltung",
  "praktikant",
  "subunternehmer",
];

/** Type-Guard: ist der Wert eine bekannte Norm-Klasse? */
export function isRoleClass(value: unknown): value is RoleClass {
  return (
    typeof value === "string" &&
    (ALL_ROLE_CLASSES as readonly string[]).includes(value)
  );
}

/**
 * Norm-Klasse mit Bewachungstätigkeit ⇒ "qualifiziert"-Pflichtset (CL-40):
 * EK, FK und Subunternehmer. Verwaltung/Praktikant tragen keine Bewachung.
 */
export function isBewachungsklasse(roleClass?: RoleClass): boolean {
  return roleClass === "ek" || roleClass === "fk" || roleClass === "subunternehmer";
}

/** Enthält das Klassen-Set eine Bewachungsklasse (EK/FK/Subunternehmer)? */
export function isBewachungsSet(roleClasses: readonly RoleClass[]): boolean {
  return roleClasses.some(isBewachungsklasse);
}

/**
 * EK/FK-Refinement — idempotente Ableitung des Norm-Klassen-Sets aus dem
 * heutigen Modell. Wird einmal von der Repository-Read-Migration genutzt und
 * als Presenter-Fallback. Reihenfolge:
 * 1. Ist `roleClasses` bereits gefüllt → unverändert (nur dedupliziert) zurück
 *    (idempotent — kein erneutes Einmischen von Legacy-Feldern).
 * 2. Sonst: aus Einfach-`roleClass` (G4) bzw. Org-Titel ableiten …
 * 3. … plus altes Doppelrolle-Niveau `zusatzBewachungNiveau` (Slice 3)
 *    einmischen (`"ek"`/`"fk"` → Liste, dedupliziert).
 * Keine erfundene Klasse: unbekannte Werte werden verworfen.
 */
export function resolveRoleClasses(input: {
  roleClasses?: readonly unknown[] | null;
  roleClass?: unknown;
  zusatzBewachungNiveau?: unknown;
  roleType?: string | null;
}): RoleClass[] {
  const existing = (input.roleClasses ?? []).filter(isRoleClass);
  if (existing.length > 0) return uniqueRoleClasses(existing);

  const out: RoleClass[] = [];
  const single = isRoleClass(input.roleClass)
    ? input.roleClass
    : mapRoleTypeToRoleClass(input.roleType ?? undefined);
  if (single) out.push(single);
  if (input.zusatzBewachungNiveau === "ek") out.push("ek");
  else if (input.zusatzBewachungNiveau === "fk") out.push("fk");
  return uniqueRoleClasses(out);
}

function uniqueRoleClasses(list: RoleClass[]): RoleClass[] {
  return Array.from(new Set(list));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hasLabel(labels: string[], ...needles: string[]): boolean {
  const lower = labels.map((l) => l.toLowerCase());
  return needles.some((n) => lower.some((l) => l.includes(n.toLowerCase())));
}

function hasSachkunde(qualification?: string): boolean {
  return !!qualification && /sachkunde/i.test(qualification);
}

function hasUnterrichtung(qualification?: string): boolean {
  return !!qualification && /unterricht/i.test(qualification);
}

/** Vollzeit ⇒ 40 UE, sonst 24 UE (CL-11). */
function isVollzeit(employmentType?: string): boolean {
  return employmentType === "Vollzeit";
}

/** Parse als UTC-Mitternacht — deterministisch, zeitzonenunabhängig. */
function parseIsoDate(value?: string): Date | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (m) {
    const d = new Date(
      Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])),
    );
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  d.setUTCMonth(d.getUTCMonth() + months);
  return d;
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

export function deriveRequirements(ctx: RequirementContext): RequirementResult {
  const pflichtSet: EngineRule[] = [];
  const schulungsSoll: TrainingTarget[] = [];
  const fristen: Deadline[] = [];
  const hinweise: string[] = [];

  // EK/FK-Refinement — Norm-Klassen-Set ist die einzige Klassifikationsquelle.
  // EK + FK frei kombinierbar; Verwaltung/Praktikant + zusätzliche Bewachung
  // (ek/fk) = der frühere Doppelrolle-Fall. Pflicht-Set = Vereinigung.
  // Keine neue Normpflicht — nur Trigger/Niveau (CL-40 / CL-01).
  const set = ctx.roleClasses ?? [];
  const hasEK = set.includes("ek");
  const hasFK = set.includes("fk");
  const hasVerwaltung = set.includes("verwaltung");
  const hasPraktikant = set.includes("praktikant");
  const subunternehmer = set.includes("subunternehmer");
  const bewachung = hasEK || hasFK || subunternehmer; // effektive Bewachung
  const fuehrung = hasFK; // FK treibt CL-10/CL-20/CL-25
  const verwaltung = hasVerwaltung;
  const praktikant = hasPraktikant;
  // Doppelrolle = Nicht-Bewachungs-Klasse (Verwaltung/Praktikant) + zusätzlich
  // EK/FK. Effektives Niveau = FK falls FK gewählt, sonst EK.
  const doppelrolle = (hasVerwaltung || hasPraktikant) && (hasEK || hasFK);
  const niveau: "ek" | "fk" = hasFK ? "fk" : "ek";
  // CL-10-Gate (Mark 2026-06-07): FK-Quali-Posten nur bei DIN-SDL/Auftrag.
  const hasDinSdl = ctx.sdlScopes.some(
    (s) => s.startsWith("din1") || s.startsWith("din2"),
  );
  // §4.4 Transparenz: bei Doppelrolle lesbar machen, warum das Set greift.
  const grundrolleLabel =
    ctx.roleType?.trim() ||
    (hasVerwaltung ? "Verwaltung" : hasPraktikant ? "Praktikant" : "Grundrolle");
  const bewTrigger = doppelrolle
    ? `Doppelrolle (${grundrolleLabel} + Bewachung, ${niveau.toUpperCase()}-Niveau)`
    : "Bewachungsrolle";

  const ref = parseIsoDate(ctx.referenceDate) ?? new Date();
  const sachkunde = hasSachkunde(ctx.qualification);
  const unterrichtung = hasUnterrichtung(ctx.qualification);

  const hasErsthelfer = hasLabel(ctx.appointmentLabels, "ersthelfer", "erste hilfe");
  const hasBrandschutz = hasLabel(ctx.appointmentLabels, "brand");
  const hasInterventionAppt = hasLabel(ctx.appointmentLabels, "intervention");

  const sdl = new Set(ctx.sdlScopes);
  const hasObjekte = sdl.has("din2-objekte");
  const hasIntervention = sdl.has("din1-intervention") || hasInterventionAppt;

  // -------------------------------------------------------------------------
  // A. "Qualifiziert"-Pflichtset (Bewachungsrolle) — CL-40 Definition
  // -------------------------------------------------------------------------
  if (bewachung) {
    // q-34a (CL-01)
    pflichtSet.push({
      id: "q-34a",
      label: "Unterrichtung oder Sachkunde §34a GewO",
      clauseId: "CL-01",
      quelle: "DIN 77200-1 §4.1 b) 1)",
      trigger: bewTrigger,
      // F1: nur Unterrichtung (ohne Sachkunde) = §34a teilerfüllt ⇒
      // "unvollständig" (nicht grün). Die 6-Monats-Sachkunde-Frist (CL-02)
      // fängt die Nachholpflicht zusätzlich in fristen[] ab.
      status: sachkunde
        ? "vorhanden"
        : unterrichtung
          ? "unvollständig"
          : "fehlt",
      hint: sachkunde
        ? "Sachkunde erfasst"
        : unterrichtung
          ? "Unterrichtung erfasst — Sachkunde-Frist beachten"
          : "Qualifikation nicht erfasst",
    });

    // q-einweisung (CL-03)
    pflichtSet.push({
      id: "q-einweisung",
      label: "Einweisung in die Dienstanweisung",
      clauseId: "CL-03",
      quelle: "DIN 77200-1 §4.1 b) 3) → §4.12",
      trigger: bewTrigger,
      status: "fehlt",
    });

    // q-datenschutz (CL-04)
    pflichtSet.push({
      id: "q-datenschutz",
      label: "Datenschutzverpflichtungserklärung",
      clauseId: "CL-04",
      quelle: "DIN 77200-1 §4.1 b) 4)",
      trigger: bewTrigger,
      status: "fehlt",
    });

    // q-verschwiegenheit (CL-05)
    pflichtSet.push({
      id: "q-verschwiegenheit",
      label: "Verschwiegenheitsverpflichtung",
      clauseId: "CL-05",
      quelle: "DIN 77200-1 §4.1 b) 5)",
      trigger: bewTrigger,
      status: "fehlt",
    });

    // q-profil (CL-06 / CL-07) — Default Stufe A
    pflichtSet.push({
      id: "q-profil",
      label: "Profil-Mindestqualifikation (Stufe A)",
      clauseId: "CL-06",
      quelle: "DIN 77200-1 §4.19.1 + Anh. A Tab. A.1",
      trigger: `${bewTrigger} — Default Stufe A`,
      status: "vorbereitet",
      hint: "Stufe B/C nur manueller Sonderfall (CL-07) → fachlich prüfen",
    });

    // q-ersthilfe (CL-08) — Detail-Frist unten in fristen[]
    pflichtSet.push({
      id: "q-ersthilfe",
      label: "Erste Hilfe aktuell (Erneuerung alle 2 Jahre)",
      clauseId: "CL-08",
      quelle: "DIN 77200-1 §4.19.1",
      trigger: bewTrigger,
      status: ersteHilfeStatus(ctx.ersteHilfeGueltigBis, ref),
    });

    // q-fk-quali (CL-10) — FK-Niveau + DIN-SDL (Mark 2026-06-07: FK-Quali nur
    // bei DIN-SDLs/Aufträgen). Greift für beide FK-Wege (echte Grundrolle
    // Führungskraft + Doppelrolle "fk", da effektive `fuehrung`). non-din zählt
    // nicht. Slice-2-Präzisierung: FK ohne SDL bekommt CL-10 nicht mehr.
    if (fuehrung && hasDinSdl) {
      pflichtSet.push({
        id: "q-fk-quali",
        label:
          "Fachkraft/Servicekraft/GSSK/Werkschutzfachkraft + 2 J. Erfahrung",
        clauseId: "CL-10",
        quelle: "DIN 77200-1 §4.19.1",
        trigger: doppelrolle
          ? "Doppelrolle FK-Niveau · DIN-SDL"
          : "Rolle = Führungskraft · DIN-SDL",
        status: "fachlich prüfen",
      });
    }

    // q-intervention (CL-09)
    if (hasIntervention) {
      pflichtSet.push({
        id: "q-intervention",
        label: "Interventionskräfte: 24-h-Schulung + 5 Interventionen",
        clauseId: "CL-09",
        quelle: "DIN 77200-1 §4.19.1",
        trigger: hasInterventionAppt
          ? "Beauftragung Interventionskraft"
          : "SDL Interventionsdienst",
        status: "fehlt",
      });
    }

    // Subunternehmer-Hinweis (CL-42 = Firmenebene)
    if (subunternehmer) {
      hinweise.push(
        "Subunternehmer-SMA: gleiches Personen-Pflichtset wie SMA. Zählt in die Firmen-Quote (CL-42); Subunternehmer-<50 % ist Firmenebene (Phase 2), nicht diese Akte.",
      );
    }
  }

  // -------------------------------------------------------------------------
  // B. Rollenabhängige Reduktion (Verwaltung / Praktikant)
  // -------------------------------------------------------------------------
  // §4.3 Bei Doppelrolle liefert Abschnitt A bereits Datenschutz (CL-04),
  // Verschwiegenheit (CL-05) + §34a (CL-01) als Pflicht — die Reduktions-Notiz
  // (v-34a-na, clauseId null) würde nicht dedupt und widerspräche q-34a.
  if (verwaltung && !doppelrolle) {
    pflichtSet.push({
      id: "v-datenschutz",
      label: "Datenschutzverpflichtungserklärung",
      clauseId: "CL-04",
      quelle: "DIN 77200-1 §4.1 b) 4)",
      trigger: "Rolle Verwaltung / Geschäftsführung",
      status: "fehlt",
    });
    pflichtSet.push({
      id: "v-verschwiegenheit",
      label: "Verschwiegenheitsverpflichtung",
      clauseId: "CL-05",
      quelle: "DIN 77200-1 §4.1 b) 5)",
      trigger: "Rolle Verwaltung / Geschäftsführung",
      status: "fehlt",
    });
    pflichtSet.push({
      id: "v-34a-na",
      label: "§34a / Sachkunde",
      clauseId: null,
      trigger: "Keine Bewachungstätigkeit",
      status: "nicht erforderlich",
      hint: "Sofern keine Bewachungstätigkeit ausgeübt wird",
    });
  }

  if (praktikant && !doppelrolle) {
    pflichtSet.push({
      id: "p-reduziert",
      label: "Bewachungsspezifische Anforderungen",
      clauseId: null,
      trigger: "Rolle Praktikant / Azubi",
      status: "fachlich prüfen",
      hint: "Reduziertes Set — individuell prüfen",
    });
  }

  if (set.length === 0) {
    hinweise.push(
      "Keine Norm-Klasse erfasst — Pflicht-Set kann nicht abgeleitet werden. Norm-Klasse (EK/FK/Verwaltung/Praktikant/Subunternehmer) setzen.",
    );
  }

  // §4.4 Doppelrollen-Transparenz-Hinweis.
  if (doppelrolle) {
    const niveauLabel = niveau === "fk" ? "FK" : "EK";
    let hinweis = `Doppelrolle erfasst: Grundrolle „${grundrolleLabel}" + zusätzliche Bewachung auf ${niveauLabel}-Niveau → volles Bewachungs-Pflichtset (CL-40) und niveau-richtiges SDL-Schulungssoll angewandt.`;
    if (niveau === "fk") {
      hinweis +=
        ' FK-Quali (CL-10) ist bei DIN-SDL als „fachlich prüfen" zu belegen.';
    }
    hinweise.push(hinweis);
  }

  // -------------------------------------------------------------------------
  // C. SDL / Geltungsbereich → Scope-Nachweise + einmalige Schulung
  // -------------------------------------------------------------------------
  // F3 (Mark, 2026-06-07): Das UE-Schulungssoll aus SDL (Veranstaltung/Asyl/
  // Objekt-Zusatz) nur erzeugen, wenn die Person eine Bewachungsrolle hat —
  // sonst entstünde ein "schwebendes" UE-Soll ohne Basis-Pflichtset.
  // Brandschutz-Pflichtnachweis (Objekte) sowie ÖPV/NON-DIN "fachlich prüfen"
  // bleiben davon unberührt (kein UE-Soll).
  // Slice 3: Die effektive `bewachung` schließt jetzt die Doppelrolle ein
  // (Verwaltung/GF + zusätzliche Bewachung, Niveau EK/FK). Damit erhält auch
  // eine GF-Bewachungs-Doppelrolle das niveau-richtige SDL-Soll.
  if (sdl.has("din2-veranstaltung") && bewachung) {
    if (fuehrung) {
      schulungsSoll.push({
        id: "sdl-veranstaltung-fk",
        label: "Veranstaltung bes. SR — Führungskraft (einmalig)",
        clauseId: "CL-20",
        ue: 24,
        period: "einmalig",
        trigger: "SDL Veranstaltung bes. SR · Rolle FK",
        status: "fehlt",
      });
    } else {
      schulungsSoll.push({
        id: "sdl-veranstaltung-ek",
        label: "Veranstaltung bes. SR — EK/SMA (einmalig)",
        clauseId: "CL-21",
        ue: 16,
        period: "einmalig",
        trigger: "SDL Veranstaltung bes. SR · Rolle EK/SMA",
        status: "fehlt",
      });
    }
  }

  if (hasObjekte) {
    // Objektspezifischer UE-Zusatz nur bei Bewachungsrolle (F3-Gate).
    if (bewachung) {
      schulungsSoll.push({
        id: "sdl-objekt-zusatz",
        label: "Objekte bes. SR — objektspezifischer Zusatz",
        clauseId: "CL-22",
        ue: 20,
        period: "jaehrlich",
        dlCap: 50,
        trigger: "SDL Objekte bes. SR",
        status: "fehlt",
      });
    }
    // Brandschutz-Pflichtnachweis aus SDL Objekte bleibt ungated (kein UE-Soll).
    pflichtSet.push({
      id: "sdl-objekt-brandschutz",
      label: "Brandschutzhelfer (ASR A2.2): 4 UE, alle 3 Jahre",
      clauseId: "CL-23",
      quelle: "DIN 77200-2 §7.3",
      trigger: "SDL Objekte bes. SR (DIN 77200-2)",
      status: brandschutzStatus(ctx.brandschutzGueltigBis, ref),
    });
  }

  if (sdl.has("din2-fluechtling-asyl")) {
    if (bewachung) {
      schulungsSoll.push({
        id: "sdl-asyl-base",
        // F5: rollen-neutrales Label (Basis gilt für EK/SMA und als FK-Basis).
        label:
          "Flüchtling/Asyl — Basis 40 UE einmalig (interkult. + Deeskalation + Brandschutz)",
        clauseId: "CL-24",
        ue: 40,
        period: "einmalig",
        trigger: "SDL Flüchtling/Asyl",
        status: "fehlt",
      });
      if (fuehrung) {
        schulungsSoll.push({
          id: "sdl-asyl-fk",
          label: "Flüchtling/Asyl — Führungskraft: +24 UE (= 64) einmalig",
          clauseId: "CL-25",
          ue: 24,
          period: "einmalig",
          trigger: "SDL Flüchtling/Asyl · Rolle FK",
          status: "fehlt",
          hint: "Gesamt 64 UE (40 Basis + 24 FK-Aufschlag)",
        });
      }
    }
    hinweise.push(
      "Flüchtling/Asyl: Personalschlüssel (z. B. 2 SMA/Schicht, CL-26) ist Schicht-/Firmenebene, nicht Einzelakten-Pflicht.",
    );
  }

  if (sdl.has("din2-oepv")) {
    pflichtSet.push({
      id: "sdl-oepv",
      label: "ÖPV — scope-bezogene Unterweisung",
      clauseId: null,
      trigger: "SDL Öffentlicher Personenverkehr (§6)",
      status: "fachlich prüfen",
      hint: "Kein belegter UE-Wert in Norm-Matrix v2",
    });
  }

  if (sdl.has("non-din")) {
    pflichtSet.push({
      id: "sdl-non-din",
      label: "NON-DIN — gesetzlicher Mindeststandard (BewachV)",
      clauseId: null,
      trigger: "SDL NON-DIN",
      status: "fachlich prüfen",
      hint: "Legal-Input ausstehend (CL-70/71/72)",
    });
  }

  // -------------------------------------------------------------------------
  // D. Beauftragungen (additive Overlays)
  // -------------------------------------------------------------------------
  if (hasErsthelfer) {
    pflichtSet.push({
      id: "appt-ersthelfer",
      label: "Erste-Hilfe-Nachweis (Erneuerung alle 2 Jahre)",
      clauseId: "CL-08",
      quelle: "DIN 77200-1 §4.19.1",
      trigger: "Beauftragung Ersthelfer",
      status: ersteHilfeStatus(ctx.ersteHilfeGueltigBis, ref),
    });
  }

  if (hasBrandschutz) {
    pflichtSet.push({
      id: "appt-brandschutz",
      label: "Brandschutzhelfer: 4 UE, alle 3 Jahre",
      clauseId: "CL-23",
      quelle: "DIN 77200-2 §7.3",
      trigger: "Beauftragung Brandschutzhelfer",
      status: brandschutzStatus(ctx.brandschutzGueltigBis, ref),
    });
  }

  if (hasInterventionAppt && !bewachung) {
    pflichtSet.push({
      id: "appt-intervention",
      label: "Interventionskraft: 24 h + 5 Interventionen",
      clauseId: "CL-09",
      quelle: "DIN 77200-1 §4.19.1",
      trigger: "Beauftragung Interventionskraft",
      status: "fehlt",
    });
  }

  if (hasLabel(ctx.appointmentLabels, "sibe", "sicherheitsbeauftragt")) {
    pflichtSet.push({
      id: "appt-sibe",
      label: "SiBe / Sicherheitsbeauftragter — additiver Nachweis",
      clauseId: null,
      trigger: "Beauftragung SiBe",
      status: "fachlich prüfen",
    });
  }

  // -------------------------------------------------------------------------
  // E. Schulungs-Soll: Jahres-Weiterbildung (CL-11)
  // -------------------------------------------------------------------------
  if (bewachung) {
    const vollzeit = isVollzeit(ctx.employmentType);
    schulungsSoll.push({
      id: "jahres-weiterbildung",
      label: `Jahres-Weiterbildung (${vollzeit ? "Vollzeit" : "Teilzeit/anteilig"})`,
      clauseId: "CL-11",
      ue: vollzeit ? 40 : 24,
      period: "jaehrlich",
      dlCap: 50,
      trigger: ctx.employmentType
        ? `Beschäftigungsart ${ctx.employmentType}`
        : "Bewachungsrolle (Beschäftigungsart unbekannt → 24 UE angenommen)",
      status: "offen",
      hint: "DL ≤ 50 %. Einmalschulung im Erwerbsjahr anrechenbar (CL-27).",
    });
  }

  // -------------------------------------------------------------------------
  // F. "fährt Dienstfahrzeug?"
  // -------------------------------------------------------------------------
  if (ctx.drivesServiceVehicle) {
    pflichtSet.push({
      id: "fahrer-uvv",
      label: "Fahrer-/UVV-Unterweisung (DGUV) + ggf. Führerschein-Nachweis",
      clauseId: null,
      trigger: "fährt Dienstfahrzeug",
      status: "fachlich prüfen",
      hint: "Werte/Turnus offen (Legal-Input CL-73)",
    });
  }

  // -------------------------------------------------------------------------
  // Fristen (deterministisch) — volle Ampel = Slice 3
  // -------------------------------------------------------------------------
  if (bewachung && unterrichtung && !sachkunde) {
    const start = parseIsoDate(ctx.startDate);
    if (start) {
      const due = addMonths(start, 6);
      const overdue = ref.getTime() > due.getTime();
      fristen.push({
        id: "frist-sachkunde",
        label: "Sachkunde §34a spätestens Ende 6. Monat",
        clauseId: "CL-02",
        dueDate: toIso(due),
        basis: "Eintritt + 6 Monate",
        status: overdue ? "abgelaufen" : "beantragt",
        trigger: "Eintritt mit Unterrichtung (Sachkunde ausstehend)",
      });
    } else {
      fristen.push({
        id: "frist-sachkunde",
        label: "Sachkunde §34a spätestens Ende 6. Monat",
        clauseId: "CL-02",
        basis: "Eintritt + 6 Monate (Eintrittsdatum fehlt)",
        status: "offen",
        trigger: "Eintritt mit Unterrichtung (Sachkunde ausstehend)",
      });
    }
  }

  if (bewachung || hasErsthelfer) {
    fristen.push(
      deadlineFromGueltigBis(
        "frist-ersthilfe",
        "Erste Hilfe — Erneuerung alle 2 Jahre",
        "CL-08",
        ctx.ersteHilfeGueltigBis,
        ref,
        hasErsthelfer ? "Beauftragung Ersthelfer" : "Bewachungsrolle",
      ),
    );
  }

  if (hasBrandschutz || hasObjekte) {
    fristen.push(
      deadlineFromGueltigBis(
        "frist-brandschutz",
        "Brandschutzhelfer — Erneuerung alle 3 Jahre",
        "CL-23",
        ctx.brandschutzGueltigBis,
        ref,
        hasBrandschutz ? "Beauftragung Brandschutzhelfer" : "SDL Objekte bes. SR",
      ),
    );
  }

  return { pflichtSet, schulungsSoll, fristen, hinweise };
}

// ---------------------------------------------------------------------------
// Status-Helfer (Fristen)
// ---------------------------------------------------------------------------

function ersteHilfeStatus(
  gueltigBis: string | undefined,
  ref: Date,
): WorkingItemStatus {
  const d = parseIsoDate(gueltigBis);
  if (!d) return "fehlt";
  return ref.getTime() > d.getTime() ? "abgelaufen" : "vorhanden";
}

function brandschutzStatus(
  gueltigBis: string | undefined,
  ref: Date,
): WorkingItemStatus {
  const d = parseIsoDate(gueltigBis);
  if (!d) return "fehlt";
  return ref.getTime() > d.getTime() ? "abgelaufen" : "vorhanden";
}

function deadlineFromGueltigBis(
  id: string,
  label: string,
  clauseId: string,
  gueltigBis: string | undefined,
  ref: Date,
  trigger: string,
): Deadline {
  const d = parseIsoDate(gueltigBis);
  if (!d) {
    return {
      id,
      label,
      clauseId,
      basis: "Ablaufdatum nicht erfasst",
      status: "offen",
      trigger,
    };
  }
  const overdue = ref.getTime() > d.getTime();
  return {
    id,
    label,
    clauseId,
    dueDate: toIso(d),
    basis: "erfasstes Ablaufdatum",
    status: overdue ? "abgelaufen" : "vorhanden",
    trigger,
  };
}
