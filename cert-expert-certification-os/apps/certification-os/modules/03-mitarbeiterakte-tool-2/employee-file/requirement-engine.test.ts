/**
 * Unit-Tests für die Slice-2/3 + G4 + EK/FK-Refinement Requirement-Engine.
 * Lauffähig ohne Test-Framework via Node-Builtin:
 *   npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/requirement-engine.test.ts
 *
 * EK/FK-Refinement: Die Engine klassifiziert nach dem Norm-Klassen-Set
 * (`roleClasses`, EK + FK frei kombinierbar). Das frühere Einfachfeld
 * `roleClass` + das Doppelrolle-Niveau `zusatzBewachungNiveau` werden über
 * `resolveRoleClasses` idempotent in das Set migriert.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  deriveRequirements,
  defaultErstunterweisungDatum,
  isWiederholungUnterweisungFaellig,
  mapRoleTypeToRoleClass,
  resolveRoleClasses,
  type Deadline,
  type EngineRule,
  type RequirementContext,
  type RoleClass,
  type TrainingTarget,
} from "./requirement-engine";
import {
  deriveQualificationFlags,
  parseQualifications,
  serializeQualifications,
  QUALIFICATION_CATALOG,
} from "./qualification-catalog";

const REF = "2026-06-07";

function baseCtx(partial: Partial<RequirementContext>): RequirementContext {
  return {
    roleClasses: [],
    appointmentLabels: [],
    sdlScopes: [],
    referenceDate: REF,
    ...partial,
  };
}

function rule(rules: EngineRule[], id: string): EngineRule | undefined {
  return rules.find((r) => r.id === id);
}

function target(
  targets: TrainingTarget[],
  id: string,
): TrainingTarget | undefined {
  return targets.find((t) => t.id === id);
}

function frist(fristen: Deadline[], id: string): Deadline | undefined {
  return fristen.find((f) => f.id === id);
}

function classesFromTitle(title: string): RoleClass[] {
  const c = mapRoleTypeToRoleClass(title);
  return c ? [c] : [];
}

// ---------------------------------------------------------------------------
// G4 — Migrations-Mapping Org-Titel → Norm-Klasse (Single Source of Truth)
// ---------------------------------------------------------------------------
test("G4-Mapping — Org-Titel → roleClass (Einsatzleitung = FK, Mark-Gate)", () => {
  assert.equal(mapRoleTypeToRoleClass("Sicherheitsmitarbeiter"), "ek");
  assert.equal(mapRoleTypeToRoleClass("Schichtleitung"), "ek");
  assert.equal(mapRoleTypeToRoleClass("Objektleitung"), "ek");
  // Mark-Gate 2026-06-08: Einsatzleitung = FK (DIN 77200-1 §3.12/§4.2).
  assert.equal(mapRoleTypeToRoleClass("Einsatzleitung"), "fk");
  assert.equal(mapRoleTypeToRoleClass("Führungskraft"), "fk");
  assert.equal(mapRoleTypeToRoleClass("Geschäftsführung"), "verwaltung");
  assert.equal(mapRoleTypeToRoleClass("Bürokraft / Verwaltung"), "verwaltung");
  assert.equal(mapRoleTypeToRoleClass("Praktikant / Azubi"), "praktikant");
  assert.equal(mapRoleTypeToRoleClass("Subunternehmer-SMA"), "subunternehmer");
  // Unbekannter/leerer Titel ⇒ keine erfundene Klasse.
  assert.equal(mapRoleTypeToRoleClass("Hausmeister"), undefined);
  assert.equal(mapRoleTypeToRoleClass(""), undefined);
  assert.equal(mapRoleTypeToRoleClass(undefined), undefined);
});

// ---------------------------------------------------------------------------
// EK/FK-Refinement — Migration: Einfach-roleClass + zusatzBewachungNiveau → Set
// ---------------------------------------------------------------------------
test("Migration resolveRoleClasses — Einfach-roleClass → Set", () => {
  assert.deepEqual(resolveRoleClasses({ roleClass: "ek" }), ["ek"]);
  assert.deepEqual(resolveRoleClasses({ roleClass: "fk" }), ["fk"]);
  assert.deepEqual(resolveRoleClasses({ roleClass: "verwaltung" }), [
    "verwaltung",
  ]);
  assert.deepEqual(resolveRoleClasses({ roleClass: "praktikant" }), [
    "praktikant",
  ]);
  assert.deepEqual(resolveRoleClasses({ roleClass: "subunternehmer" }), [
    "subunternehmer",
  ]);
});

test("Migration resolveRoleClasses — altes Doppelrolle-Niveau einmischen", () => {
  // Verwaltung + zusätzliche Bewachung EK → ["verwaltung","ek"] (alter Fall;
  // Einfach-Klasse zuerst, Doppelrolle-Niveau danach, Reihenfolge = Insertion).
  assert.deepEqual(
    resolveRoleClasses({ roleClass: "verwaltung", zusatzBewachungNiveau: "ek" }),
    ["verwaltung", "ek"],
  );
  // EK + Niveau FK → ["ek","fk"].
  assert.deepEqual(
    resolveRoleClasses({ roleClass: "ek", zusatzBewachungNiveau: "fk" }).sort(),
    ["ek", "fk"],
  );
  // Praktikant + FK-Niveau → ["praktikant","fk"].
  assert.deepEqual(
    resolveRoleClasses({
      roleClass: "praktikant",
      zusatzBewachungNiveau: "fk",
    }).sort(),
    ["fk", "praktikant"],
  );
});

test("Migration resolveRoleClasses — Org-Titel-Fallback, Idempotenz, Dedup, Unbekanntes", () => {
  // Kein roleClass, aber Org-Titel → abgeleitet.
  assert.deepEqual(resolveRoleClasses({ roleType: "Einsatzleitung" }), ["fk"]);
  // Bereits gefülltes Set gewinnt (idempotent, keine erneute Einmischung).
  assert.deepEqual(
    resolveRoleClasses({
      roleClasses: ["fk"],
      roleClass: "ek",
      zusatzBewachungNiveau: "ek",
    }),
    ["fk"],
  );
  // Dedup + stabile Ordnung.
  assert.deepEqual(resolveRoleClasses({ roleClasses: ["ek", "ek", "fk"] }), [
    "ek",
    "fk",
  ]);
  // Unbekannte Werte werden verworfen (keine erfundene Klasse).
  assert.deepEqual(resolveRoleClasses({ roleClass: "hausmeister" }), []);
  assert.deepEqual(resolveRoleClasses({}), []);
});

// 1. EK Vollzeit, Sachkunde, DIN 77200-1
test("Szenario 1 — EK Vollzeit + Sachkunde + DIN 77200-1: §4.1b-Set, 40 UE, keine Teil-2-Schulung", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      employmentType: "Vollzeit",
      qualification: "Sachkundeprüfung nach § 34a GewO",
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  assert.equal(rule(res.pflichtSet, "q-34a")?.status, "vorhanden");
  assert.equal(rule(res.pflichtSet, "q-34a")?.clauseId, "CL-01");
  assert.ok(rule(res.pflichtSet, "q-einweisung"));
  assert.ok(rule(res.pflichtSet, "q-datenschutz"));
  const wb = target(res.schulungsSoll, "jahres-weiterbildung");
  assert.equal(wb?.ue, 40);
  assert.equal(wb?.clauseId, "CL-11");
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-ek"), undefined);
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-fk"), undefined);
  assert.equal(res.fristen.find((f) => f.id === "frist-sachkunde"), undefined);
});

// 2. EK Teilzeit, Unterrichtung, Eintritt vor 5 Monaten
test("Szenario 2 — EK Teilzeit + Unterrichtung + Eintritt vor 5 Mt.: 6-Monats-Frist offen (gelb), 24 UE", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      employmentType: "Teilzeit",
      qualification: "Unterrichtung nach §34a",
      startDate: "2026-01-07",
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  assert.equal(rule(res.pflichtSet, "q-34a")?.status, "unvollständig");
  const frist = res.fristen.find((f) => f.id === "frist-sachkunde");
  assert.equal(frist?.status, "beantragt");
  assert.equal(frist?.clauseId, "CL-02");
  assert.equal(frist?.dueDate, "2026-07-07");
  assert.equal(target(res.schulungsSoll, "jahres-weiterbildung")?.ue, 24);
});

test("Szenario 2b — Eintritt vor 8 Monaten: Sachkunde-Frist abgelaufen (rot)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      employmentType: "Teilzeit",
      qualification: "Unterrichtung",
      startDate: "2025-10-07",
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  assert.equal(
    res.fristen.find((f) => f.id === "frist-sachkunde")?.status,
    "abgelaufen",
  );
});

// 3. EK Veranstaltung bes. SR → 16 UE einmalig (CL-21)
test("Szenario 3 — EK Veranstaltung bes. SR: 16 UE einmalig (CL-21) + WB", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      employmentType: "Vollzeit",
      qualification: "Sachkunde",
      sdlScopes: ["din2-veranstaltung"],
    }),
  );
  const t = target(res.schulungsSoll, "sdl-veranstaltung-ek");
  assert.equal(t?.ue, 16);
  assert.equal(t?.clauseId, "CL-21");
  assert.equal(t?.period, "einmalig");
  assert.ok(target(res.schulungsSoll, "jahres-weiterbildung"));
});

test("Szenario 3b — FK Veranstaltung bes. SR: 24 UE einmalig (CL-20) + FK-Quali", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["fk"],
      sdlScopes: ["din2-veranstaltung"],
    }),
  );
  const t = target(res.schulungsSoll, "sdl-veranstaltung-fk");
  assert.equal(t?.ue, 24);
  assert.equal(t?.clauseId, "CL-20");
  assert.ok(rule(res.pflichtSet, "q-fk-quali")); // CL-10
});

// EK/FK-Refinement: EK + FK kombiniert = FK-Set (FK ⊇ EK, keine neue Pflicht)
test("Szenario 3d — EK + FK kombiniert: ergibt exakt das FK-Set (24 UE Veranstaltung, q-fk-quali, kein EK-Posten)", () => {
  const ekfk = deriveRequirements(
    baseCtx({ roleClasses: ["ek", "fk"], sdlScopes: ["din2-veranstaltung"] }),
  );
  const fkOnly = deriveRequirements(
    baseCtx({ roleClasses: ["fk"], sdlScopes: ["din2-veranstaltung"] }),
  );
  // Pflicht-Set + Schulungs-Soll identisch zu reinem FK.
  assert.deepEqual(
    ekfk.pflichtSet.map((r) => r.id).sort(),
    fkOnly.pflichtSet.map((r) => r.id).sort(),
  );
  assert.deepEqual(
    ekfk.schulungsSoll.map((t) => t.id).sort(),
    fkOnly.schulungsSoll.map((t) => t.id).sort(),
  );
  assert.equal(target(ekfk.schulungsSoll, "sdl-veranstaltung-fk")?.ue, 24);
  assert.equal(target(ekfk.schulungsSoll, "sdl-veranstaltung-ek"), undefined);
  assert.equal(rule(ekfk.pflichtSet, "q-fk-quali")?.clauseId, "CL-10");
  // EK+FK ist KEINE Doppelrolle (keine Nicht-Bewachungs-Klasse dabei).
  assert.equal(ekfk.hinweise.some((h) => /Doppelrolle erfasst/.test(h)), false);
});

// Org-Titel Schichtleitung → ek (16 UE), KEIN Auto-FK, aber Bewachungsrolle
test("Szenario 3c — Schichtleitung (→ek) Veranstaltung bes. SR: 16 UE (EK, nicht 24), kein FK-Quali, Basis-Set", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: classesFromTitle("Schichtleitung"),
      roleType: "Schichtleitung",
      sdlScopes: ["din2-veranstaltung"],
    }),
  );
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-ek")?.ue, 16);
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-fk"), undefined);
  assert.equal(rule(res.pflichtSet, "q-fk-quali"), undefined);
  assert.ok(rule(res.pflichtSet, "q-34a"));
  assert.ok(rule(res.pflichtSet, "q-datenschutz"));
});

// 4. EK Flüchtling/Asyl → 40 UE (CL-24) + Brandschutz-Hinweis
test("Szenario 4 — EK Flüchtling/Asyl: 40 UE (CL-24) + Personalschlüssel-Hinweis", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      sdlScopes: ["din2-fluechtling-asyl"],
    }),
  );
  const t = target(res.schulungsSoll, "sdl-asyl-base");
  assert.equal(t?.ue, 40);
  assert.equal(t?.clauseId, "CL-24");
  assert.ok(res.hinweise.some((h) => /Personalschlüssel/.test(h)));
  assert.equal(target(res.schulungsSoll, "sdl-asyl-fk"), undefined);
});

test("Szenario 4b — FK Flüchtling/Asyl: +24 UE (= 64) (CL-25)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["fk"],
      sdlScopes: ["din2-fluechtling-asyl"],
    }),
  );
  assert.equal(target(res.schulungsSoll, "sdl-asyl-base")?.ue, 40);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-fk")?.ue, 24);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-fk")?.clauseId, "CL-25");
});

// G4 Mark-Gate (e): Einsatzleitung = FK → Asyl bekommt FK-Aufschlag (64) + q-fk-quali
test("Szenario 4c — Einsatzleitung (→fk, G4) Flüchtling/Asyl: 40 + 24 (= 64) UE + FK-Quali (CL-10)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: classesFromTitle("Einsatzleitung"),
      roleType: "Einsatzleitung",
      sdlScopes: ["din2-fluechtling-asyl"],
    }),
  );
  assert.equal(target(res.schulungsSoll, "sdl-asyl-base")?.ue, 40);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-fk")?.ue, 24);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-fk")?.clauseId, "CL-25");
  assert.equal(rule(res.pflichtSet, "q-fk-quali")?.clauseId, "CL-10");
});

// 4d. EK ÖPV → 40 UE einmalig (CL-29, §6.4)
test("Szenario 4d — EK ÖPV: 40 UE einmalig (CL-29)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      sdlScopes: ["din2-oepv"],
    }),
  );
  const t = target(res.schulungsSoll, "sdl-oepv-base");
  assert.equal(t?.ue, 40);
  assert.equal(t?.clauseId, "CL-29");
  assert.equal(t?.period, "einmalig");
  assert.equal(target(res.schulungsSoll, "sdl-oepv-fk"), undefined);
});

// 4e. FK ÖPV → 40 (CL-29) + 16 UE Aufschlag (= 56, CL-30, §6.3)
test("Szenario 4e — FK ÖPV: 40 (CL-29) + 16 UE (= 56) (CL-30)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["fk"],
      sdlScopes: ["din2-oepv"],
    }),
  );
  assert.equal(target(res.schulungsSoll, "sdl-oepv-base")?.ue, 40);
  assert.equal(target(res.schulungsSoll, "sdl-oepv-base")?.clauseId, "CL-29");
  assert.equal(target(res.schulungsSoll, "sdl-oepv-fk")?.ue, 16);
  assert.equal(target(res.schulungsSoll, "sdl-oepv-fk")?.clauseId, "CL-30");
});

// 4f. Verwaltung + ÖPV → kein ÖPV-Soll (F3-Bewachung-Gate)
test("Szenario 4f — Verwaltung + ÖPV: kein ÖPV-Schulungssoll (F3-Gate)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["verwaltung"],
      sdlScopes: ["din2-oepv"],
    }),
  );
  assert.equal(target(res.schulungsSoll, "sdl-oepv-base"), undefined);
  assert.equal(target(res.schulungsSoll, "sdl-oepv-fk"), undefined);
});

// 5. Verwaltung → kein §34a-Set; Datenschutz/Verschwiegenheit aktiv
test("Szenario 5 — Verwaltung: kein §34a-Set, Datenschutz/Verschwiegenheit aktiv", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["verwaltung"],
      employmentType: "Vollzeit",
      sdlScopes: [],
    }),
  );
  assert.equal(rule(res.pflichtSet, "q-34a"), undefined);
  assert.equal(rule(res.pflichtSet, "v-datenschutz")?.clauseId, "CL-04");
  assert.equal(rule(res.pflichtSet, "v-verschwiegenheit")?.clauseId, "CL-05");
  assert.equal(rule(res.pflichtSet, "v-34a-na")?.status, "nicht erforderlich");
  assert.equal(target(res.schulungsSoll, "jahres-weiterbildung"), undefined);
});

// F3: Verwaltung mit SDL-Scope ⇒ KEIN schwebendes UE-Soll (an Bewachung gegatet)
test("Szenario 5b — Verwaltung + SDL Veranstaltung/Objekt/Asyl: kein UE-Schulungssoll (F3-Gate)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["verwaltung"],
      sdlScopes: ["din2-veranstaltung", "din2-objekte", "din2-fluechtling-asyl"],
    }),
  );
  assert.equal(res.schulungsSoll.length, 0);
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-ek"), undefined);
  assert.equal(target(res.schulungsSoll, "sdl-objekt-zusatz"), undefined);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-base"), undefined);
  assert.ok(rule(res.pflichtSet, "sdl-objekt-brandschutz"));
});

// 6. drivesServiceVehicle = true → Fahrer-/UVV-Zeile "fachlich prüfen"
test("Szenario 6 — fährt Dienstfahrzeug: Fahrer-/UVV-Zeile fachlich prüfen", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      drivesServiceVehicle: true,
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  const r = rule(res.pflichtSet, "fahrer-uvv");
  assert.equal(r?.status, "fachlich prüfen");
  assert.equal(r?.clauseId, null);
});

// G4: Subunternehmer → Bewachungs-Set + Firmen-Quote-Hinweis (CL-42)
test("Szenario 7 — Subunternehmer: Bewachungs-Set + CL-42-Firmenquote-Hinweis, kein FK-Quali", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["subunternehmer"],
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  assert.ok(rule(res.pflichtSet, "q-34a"));
  assert.ok(rule(res.pflichtSet, "q-datenschutz"));
  assert.equal(rule(res.pflichtSet, "q-fk-quali"), undefined);
  assert.ok(res.hinweise.some((h) => /Subunternehmer/.test(h)));
});

// G4: Praktikant ohne Doppelrolle → reduziertes Set
test("Szenario 8 — Praktikant: reduziertes Set (p-reduziert, fachlich prüfen), kein §34a-Set", () => {
  const res = deriveRequirements(baseCtx({ roleClasses: ["praktikant"] }));
  assert.equal(rule(res.pflichtSet, "p-reduziert")?.status, "fachlich prüfen");
  assert.equal(rule(res.pflichtSet, "q-34a"), undefined);
});

// G4: Keine Norm-Klasse → Hinweis, kein Pflicht-Set
test("Szenario 9 — keine Norm-Klasse: Hinweis 'Keine Norm-Klasse', kein Pflicht-Set", () => {
  const res = deriveRequirements(baseCtx({ sdlScopes: ["din1-grunddienste"] }));
  assert.equal(res.pflichtSet.length, 0);
  assert.ok(res.hinweise.some((h) => /Keine Norm-Klasse/.test(h)));
});

// ---------------------------------------------------------------------------
// EK/FK-Refinement — Doppelrolle als Set (Verwaltung/Praktikant + EK/FK)
// ---------------------------------------------------------------------------

// D1: Verwaltung + EK → volles Bewachungs-Set, keine Verwaltungs-Reduktion, kein FK-Quali
test("Szenario D1 — ['verwaltung','ek']: volles Bewachungs-Set, kein v-34a-na/v-datenschutz, kein q-fk-quali, Doppelrollen-Hinweis", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["verwaltung", "ek"],
      roleType: "Geschäftsführung",
    }),
  );
  assert.equal(rule(res.pflichtSet, "q-34a")?.clauseId, "CL-01");
  assert.equal(rule(res.pflichtSet, "q-einweisung")?.clauseId, "CL-03");
  assert.equal(rule(res.pflichtSet, "q-datenschutz")?.clauseId, "CL-04");
  assert.equal(rule(res.pflichtSet, "q-verschwiegenheit")?.clauseId, "CL-05");
  assert.equal(rule(res.pflichtSet, "q-profil")?.clauseId, "CL-06");
  assert.equal(rule(res.pflichtSet, "q-ersthilfe")?.clauseId, "CL-08");
  assert.equal(target(res.schulungsSoll, "jahres-weiterbildung")?.clauseId, "CL-11");
  assert.equal(rule(res.pflichtSet, "v-34a-na"), undefined);
  assert.equal(rule(res.pflichtSet, "v-datenschutz"), undefined);
  assert.equal(rule(res.pflichtSet, "v-verschwiegenheit"), undefined);
  assert.equal(rule(res.pflichtSet, "q-fk-quali"), undefined);
  assert.ok(res.hinweise.some((h) => /Doppelrolle erfasst/.test(h)));
});

// D2: Verwaltung ohne Bewachung (Regression) → nur Verwaltungs-Reduktion
test("Szenario D2 — ['verwaltung'] ohne Bewachung (Regression): v-datenschutz/v-verschwiegenheit/v-34a-na, kein q-34a/jahres-weiterbildung", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["verwaltung"],
      roleType: "Geschäftsführung",
    }),
  );
  assert.equal(rule(res.pflichtSet, "v-datenschutz")?.clauseId, "CL-04");
  assert.equal(rule(res.pflichtSet, "v-verschwiegenheit")?.clauseId, "CL-05");
  assert.equal(rule(res.pflichtSet, "v-34a-na")?.status, "nicht erforderlich");
  assert.equal(rule(res.pflichtSet, "q-34a"), undefined);
  assert.equal(target(res.schulungsSoll, "jahres-weiterbildung"), undefined);
  assert.equal(res.hinweise.some((h) => /Doppelrolle erfasst/.test(h)), false);
});

// D3: Verwaltung + EK + Veranstaltung → 16 UE (EK), kein FK, kein FK-Quali
test("Szenario D3 — ['verwaltung','ek'] + Veranstaltung bes. SR: sdl-veranstaltung-ek (16 UE, CL-21), kein FK", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["verwaltung", "ek"],
      sdlScopes: ["din2-veranstaltung"],
    }),
  );
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-ek")?.ue, 16);
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-ek")?.clauseId, "CL-21");
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-fk"), undefined);
  assert.equal(rule(res.pflichtSet, "q-fk-quali"), undefined);
});

// D4: Verwaltung + FK + Veranstaltung + Asyl → 24 UE FK + Asyl 40+24=64 + FK-Quali (DIN-SDL)
test("Szenario D4 — ['verwaltung','fk'] + Veranstaltung + Asyl: sdl-veranstaltung-fk (24, CL-20) + sdl-asyl-base (40) + sdl-asyl-fk (24, CL-25) + q-fk-quali (CL-10)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["verwaltung", "fk"],
      sdlScopes: ["din2-veranstaltung", "din2-fluechtling-asyl"],
    }),
  );
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-fk")?.ue, 24);
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-fk")?.clauseId, "CL-20");
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-ek"), undefined);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-base")?.ue, 40);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-fk")?.ue, 24);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-fk")?.clauseId, "CL-25");
  assert.equal(rule(res.pflichtSet, "q-fk-quali")?.clauseId, "CL-10");
  assert.equal(rule(res.pflichtSet, "q-fk-quali")?.status, "fachlich prüfen");
});

// D6: Praktikant + EK → volles Bewachungs-Set, kein p-reduziert
test("Szenario D6 — ['praktikant','ek']: volles Bewachungs-Set, kein p-reduziert", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["praktikant", "ek"],
    }),
  );
  assert.ok(rule(res.pflichtSet, "q-34a"));
  assert.ok(rule(res.pflichtSet, "q-datenschutz"));
  assert.equal(rule(res.pflichtSet, "p-reduziert"), undefined);
});

// D7: CL-10-Gate — FK-Quali nur bei DIN-SDL (beide FK-Wege)
test("Szenario D7 — CL-10-Gate: FK/Doppelrolle-fk ohne DIN-SDL ⇒ kein q-fk-quali", () => {
  const fkNoSdl = deriveRequirements(baseCtx({ roleClasses: ["fk"] }));
  assert.equal(rule(fkNoSdl.pflichtSet, "q-fk-quali"), undefined);
  const fkNonDin = deriveRequirements(
    baseCtx({ roleClasses: ["fk"], sdlScopes: ["non-din"] }),
  );
  assert.equal(rule(fkNonDin.pflichtSet, "q-fk-quali"), undefined);
  const doppelNoSdl = deriveRequirements(
    baseCtx({ roleClasses: ["verwaltung", "fk"] }),
  );
  assert.equal(rule(doppelNoSdl.pflichtSet, "q-fk-quali"), undefined);
});

// Invariante: keine erfundene Pflicht — clauseId null ⇒ status fachlich prüfen / nicht erforderlich
test("Invariante — jede Regel ohne clauseId ist 'fachlich prüfen' oder 'nicht erforderlich'", () => {
  const scenarios: RequirementContext[] = [
    baseCtx({ roleClasses: ["ek"], sdlScopes: ["din1-grunddienste"] }),
    baseCtx({ roleClasses: ["fk"], sdlScopes: ["din2-veranstaltung", "din2-objekte"] }),
    baseCtx({ roleClasses: ["ek", "fk"], sdlScopes: ["din2-objekte"] }),
    baseCtx({ roleClasses: ["ek"], sdlScopes: ["din2-fluechtling-asyl", "din2-oepv", "non-din"], drivesServiceVehicle: true, appointmentLabels: ["SiBe / Sicherheitsbeauftragter"] }),
    baseCtx({ roleClasses: ["verwaltung"] }),
    baseCtx({ roleClasses: ["verwaltung", "ek"] }),
    baseCtx({ roleClasses: ["praktikant"] }),
    baseCtx({ roleClasses: ["subunternehmer"], appointmentLabels: ["Ersthelfer", "Brandschutzhelfer", "Interventionskraft"] }),
  ];
  for (const ctx of scenarios) {
    const res = deriveRequirements(ctx);
    for (const r of [...res.pflichtSet, ...res.schulungsSoll]) {
      if (r.clauseId === null) {
        assert.ok(
          r.status === "fachlich prüfen" || r.status === "nicht erforderlich",
          `Regel ${r.id} ohne clauseId hat unzulässigen Status ${r.status}`,
        );
      }
    }
  }
});

// ===========================================================================
// #2 — Qualifikation als Multiselect (Katalog) — Stufen, Zusätze, Migration
// ===========================================================================

// Q-Katalog: jede Option ist CL-belegt ODER ein „fachlich prüfen"-Zusatz.
test("Q-Katalog — jede Option hat eine CL-ID oder ist additiver Zusatz (keine erfundene Pflicht)", () => {
  for (const opt of QUALIFICATION_CATALOG) {
    assert.ok(
      opt.clauseId !== null || opt.zusatz === true,
      `Katalog-Option ${opt.id} ohne clauseId muss ein Zusatz sein`,
    );
  }
});

// deriveQualificationFlags — höchste Stufe A<B<C.
test("Q-Flags — höchste Stufe gewinnt (A<B<C); Sachkunde/Unterrichtung korrekt", () => {
  // Nur Unterrichtung → Stufe A, Unterrichtung, KEINE Sachkunde.
  const a = deriveQualificationFlags(["unterrichtung-34a"]);
  assert.equal(a.hoechsteStufe, "A");
  assert.equal(a.hasUnterrichtung, true);
  assert.equal(a.hasSachkunde, false);
  // Unterrichtung + Sachkunde → Stufe A, Sachkunde greift.
  const aa = deriveQualificationFlags(["unterrichtung-34a", "sachkunde-34a"]);
  assert.equal(aa.hoechsteStufe, "A");
  assert.equal(aa.hasSachkunde, true);
  // Sachkunde (A) + GSSK (B) → höchste Stufe B.
  const b = deriveQualificationFlags(["sachkunde-34a", "gssk"]);
  assert.equal(b.hoechsteStufe, "B");
  assert.equal(b.hasFkQualifizierend, true);
  // Servicekraft (B) + Geprüfte Fachkraft (C) → höchste Stufe C.
  const c = deriveQualificationFlags(["servicekraft", "gepruefte-fachkraft"]);
  assert.equal(c.hoechsteStufe, "C");
  // Nur Zusatz → keine Stufe.
  const z = deriveQualificationFlags(["waffensachkunde"]);
  assert.equal(z.hoechsteStufe, null);
  assert.equal(z.hasZusatz, true);
});

// Engine liest strukturierten Wert: Unterrichtung → q-34a unvollständig + Frist.
test("Szenario Q1 — EK + ['unterrichtung-34a'] (strukturiert): q-34a unvollständig, Sachkunde-Frist offen", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      qualifications: ["unterrichtung-34a"],
      startDate: "2026-01-07",
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  assert.equal(rule(res.pflichtSet, "q-34a")?.status, "unvollständig");
  assert.equal(
    res.fristen.find((f) => f.id === "frist-sachkunde")?.clauseId,
    "CL-02",
  );
});

// Engine liest strukturierten Wert: Sachkunde → q-34a vorhanden, keine Frist.
test("Szenario Q2 — EK + ['sachkunde-34a'] (strukturiert): q-34a vorhanden, keine Sachkunde-Frist", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      qualifications: ["sachkunde-34a"],
      startDate: "2026-01-07",
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  assert.equal(rule(res.pflichtSet, "q-34a")?.status, "vorhanden");
  assert.equal(res.fristen.find((f) => f.id === "frist-sachkunde"), undefined);
});

// Höchste Stufe steuert q-profil-Label (C bei Meister).
test("Szenario Q3 — EK + ['sachkunde-34a','meister']: q-profil Stufe C, q-34a vorhanden", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      qualifications: ["sachkunde-34a", "meister"],
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  const profil = rule(res.pflichtSet, "q-profil");
  assert.ok(profil?.label.includes("Stufe C"));
  assert.equal(rule(res.pflichtSet, "q-34a")?.status, "vorhanden");
});

// Waffensachkunde = additiv: Zusatz-Zeile (CL-76, fachlich prüfen), Stufe unverändert,
// ersetzt §34a NICHT, erzeugt keine neue DIN-Pflicht.
test("Szenario Q4 — Waffensachkunde additiv: CL-76-Zusatz 'fachlich prüfen', §34a unverändert, kein Stufen-Effekt", () => {
  const ohne = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      qualifications: ["sachkunde-34a"],
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  const mit = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      qualifications: ["sachkunde-34a", "waffensachkunde"],
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  const zusatz = rule(mit.pflichtSet, "quali-zusatz-waffensachkunde");
  assert.equal(zusatz?.clauseId, "CL-76");
  assert.equal(zusatz?.status, "fachlich prüfen");
  // §34a-Status unverändert (Waffensachkunde ersetzt §34a nicht).
  assert.equal(rule(mit.pflichtSet, "q-34a")?.status, "vorhanden");
  // Stufe unverändert (Zusatz hat keine Stufe).
  assert.equal(
    rule(ohne.pflichtSet, "q-profil")?.label,
    rule(mit.pflichtSet, "q-profil")?.label,
  );
  // Keine neue DIN-/UE-Schulungspflicht durch den Zusatz.
  assert.deepEqual(
    ohne.schulungsSoll.map((t) => t.id).sort(),
    mit.schulungsSoll.map((t) => t.id).sort(),
  );
});

// Mehrere Qualifikationen kombiniert (höchste Stufe + Zusatz) auf FK + DIN-SDL.
test("Szenario Q5 — FK + ['sachkunde-34a','gssk','waffensachkunde'] + DIN-SDL: Stufe B, q-fk-quali (CL-10), Waffen-Zusatz", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["fk"],
      qualifications: ["sachkunde-34a", "gssk", "waffensachkunde"],
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  assert.ok(rule(res.pflichtSet, "q-profil")?.label.includes("Stufe B"));
  assert.equal(rule(res.pflichtSet, "q-fk-quali")?.clauseId, "CL-10");
  assert.equal(
    rule(res.pflichtSet, "quali-zusatz-waffensachkunde")?.clauseId,
    "CL-76",
  );
});

// Strukturiert hat Vorrang vor Freitext (gemischte Eingabe).
test("Szenario Q6 — strukturiert gewinnt über Freitext (qualifications gesetzt + widersprüchlicher Freitext)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      qualifications: ["sachkunde-34a"],
      qualification: "nur Unterrichtung", // Freitext-Fallback wird ignoriert
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  assert.equal(rule(res.pflichtSet, "q-34a")?.status, "vorhanden");
});

// Freitext-Fallback bleibt aktiv, wenn keine strukturierte Auswahl vorliegt.
test("Szenario Q7 — Freitext-Fallback (kein qualifications): Regex erkennt Sachkunde weiterhin", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      qualification: "Sachkundeprüfung nach §34a",
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  assert.equal(rule(res.pflichtSet, "q-34a")?.status, "vorhanden");
});

// Unbekannte Katalog-ID → fachlich-prüfen-Hinweis, keine §34a-Ableitung.
test("Szenario Q8 — unbekannte Quali-ID: Hinweis 'fachlich prüfen', q-34a bleibt 'fehlt'", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      qualifications: ["voodoo-zertifikat"],
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  assert.equal(rule(res.pflichtSet, "q-34a")?.status, "fehlt");
  assert.ok(res.hinweise.some((h) => /fachlich prüfen/.test(h)));
});

// ---------------------------------------------------------------------------
// #2 — Migration (verlustfrei): Freitext → Katalog-IDs, Round-trip
// ---------------------------------------------------------------------------
test("Migration parseQualifications — Legacy-Freitext tolerant mappen", () => {
  assert.deepEqual(parseQualifications("Sachkundeprüfung nach §34a").ids, [
    "sachkunde-34a",
  ]);
  assert.deepEqual(parseQualifications("Unterrichtung §34a").ids, [
    "unterrichtung-34a",
  ]);
  assert.deepEqual(parseQualifications("GSSK").ids, ["gssk"]);
  assert.deepEqual(parseQualifications("IHK-Werkschutzmeister").ids, [
    "ihk-werkschutzmeister",
  ]);
  // Sachkunde + Waffensachkunde im Freitext.
  assert.deepEqual(
    parseQualifications("Sachkunde §34a, Waffensachkunde").ids.sort(),
    ["sachkunde-34a", "waffensachkunde"],
  );
});

test("Migration parseQualifications — Unbekanntes geht NICHT verloren (unmatched), leer → leer", () => {
  const r = parseQualifications("Kammerjäger-Diplom");
  assert.deepEqual(r.ids, []);
  assert.deepEqual(r.unmatched, ["Kammerjäger-Diplom"]);
  assert.deepEqual(parseQualifications("").ids, []);
  assert.deepEqual(parseQualifications(null).ids, []);
  assert.deepEqual(parseQualifications(undefined).ids, []);
});

test("Migration round-trip — serialize → parse ergibt dieselbe ID-Menge", () => {
  const ids = ["sachkunde-34a", "gssk", "waffensachkunde"];
  const serialized = serializeQualifications(ids);
  assert.equal(parseQualifications(serialized).unmatched.length, 0);
  assert.deepEqual(parseQualifications(serialized).ids.sort(), [...ids].sort());
});

// ===========================================================================
// #10 — Datums-Logik / Defaults (Erst-Standardunterweisung + Wiederholung)
// ===========================================================================

// Default-Datum-Helfer: Erst-Standardunterweisung = erster Arbeitstag (startDate).
test("#10 — defaultErstunterweisungDatum: Default = startDate; ohne startDate undefined", () => {
  assert.equal(defaultErstunterweisungDatum("2026-01-07"), "2026-01-07");
  assert.equal(defaultErstunterweisungDatum(undefined), undefined);
  assert.equal(defaultErstunterweisungDatum(""), undefined);
  assert.equal(defaultErstunterweisungDatum("kein-datum"), undefined);
});

// >1-Jahr-Fälligkeit der Wiederholungs-Unterweisung — deterministisch (feste Daten).
test("#10 — isWiederholungUnterweisungFaellig: > 1 Jahr seit Bezug = fällig, sonst nicht", () => {
  const refSpaet = new Date(Date.UTC(2026, 5, 7)); // 2026-06-07
  // 2024-01-07 + 1 J = 2025-01-07 < ref → fällig.
  assert.equal(isWiederholungUnterweisungFaellig("2024-01-07", refSpaet), true);
  // 2026-01-07 + 1 J = 2027-01-07 > ref → nicht fällig.
  assert.equal(isWiederholungUnterweisungFaellig("2026-01-07", refSpaet), false);
  // Genau 1 Jahr (kein „>") → noch nicht fällig.
  assert.equal(isWiederholungUnterweisungFaellig("2025-06-07", refSpaet), false);
  // Kein Bezugsdatum → nicht fällig (kein schwebender Eintrag).
  assert.equal(isWiederholungUnterweisungFaellig(undefined, refSpaet), false);
});

// Engine: Erst-Standardunterweisung < 1 Jahr → Wiederholungs-Frist als „fachlich
// prüfen" (Beobachtung), Bezug = erster Arbeitstag, CL-75.
test("#10 — EK, Eintritt < 1 Jahr: frist-wiederholung-unterweisung CL-75 'fachlich prüfen' (Beobachtung), Bezug startDate", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      startDate: "2026-01-07",
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  const w = frist(res.fristen, "frist-wiederholung-unterweisung");
  assert.equal(w?.clauseId, "CL-75");
  assert.equal(w?.status, "fachlich prüfen");
  assert.equal(w?.dueDate, "2027-01-07"); // startDate + 1 Jahr
  assert.equal(w?.basis, "Erster Arbeitstag + 1 Jahr");
  assert.ok(/beobachten/i.test(w?.trigger ?? ""));
});

// Engine: > 1 Jahr seit Eintritt → Wiederholung fällig (Trigger „prüfen"), bleibt CL-75 „fachlich prüfen".
test("#10 — EK, Eintritt > 1 Jahr: Wiederholung fällig (Trigger 'prüfen'), Status bleibt 'fachlich prüfen' (kein Auto-abgelaufen, EC-10)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      startDate: "2024-01-07",
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  const w = frist(res.fristen, "frist-wiederholung-unterweisung");
  assert.equal(w?.clauseId, "CL-75");
  assert.equal(w?.status, "fachlich prüfen");
  assert.equal(w?.dueDate, "2025-01-07");
  assert.ok(/prüfen/i.test(w?.trigger ?? ""));
});

// Override: erstunterweisungDatum sticht über startDate als Bezug.
test("#10 — erstunterweisungDatum übersteuert startDate als Bezug (Basis-Label + dueDate)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      startDate: "2024-01-07",
      erstunterweisungDatum: "2026-03-01",
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  const w = frist(res.fristen, "frist-wiederholung-unterweisung");
  assert.equal(w?.dueDate, "2027-03-01"); // erstunterweisungDatum + 1 Jahr
  assert.equal(w?.basis, "Erstunterweisung + 1 Jahr");
});

// Kein startDate → keine Wiederholungs-Frist (manuell setzen, kein schwebender Eintrag).
test("#10 — EK ohne startDate: keine frist-wiederholung-unterweisung", () => {
  const res = deriveRequirements(
    baseCtx({ roleClasses: ["ek"], sdlScopes: ["din1-grunddienste"] }),
  );
  assert.equal(frist(res.fristen, "frist-wiederholung-unterweisung"), undefined);
});

// Keine Norm-Klasse → keine Wiederholungs-Frist (an erfasste Klasse gegatet).
test("#10 — keine Norm-Klasse: keine Wiederholungs-Frist trotz startDate", () => {
  const res = deriveRequirements(
    baseCtx({ startDate: "2024-01-07", sdlScopes: ["din1-grunddienste"] }),
  );
  assert.equal(frist(res.fristen, "frist-wiederholung-unterweisung"), undefined);
});

// Verwaltung (keine Bewachung) mit startDate → Wiederholung gilt (Arbeitsschutz CL-75
// betrifft alle Beschäftigten), bleibt „fachlich prüfen".
test("#10 — Verwaltung mit startDate: Wiederholungs-Frist greift (CL-75, alle Beschäftigten), 'fachlich prüfen'", () => {
  const res = deriveRequirements(
    baseCtx({ roleClasses: ["verwaltung"], startDate: "2024-01-07" }),
  );
  const w = frist(res.fristen, "frist-wiederholung-unterweisung");
  assert.equal(w?.clauseId, "CL-75");
  assert.equal(w?.status, "fachlich prüfen");
});

// Objektbezogene Unterweisung (CL-22) — Default-Datum = erster Arbeitstag.
// (Q10b: in der App manuell, bis Projektakte existiert; der rechnerische Default
// für die objektspezifische Schulung bleibt der Eintritt.)
test("#10 — Objekt-Zusatz (CL-22) vorhanden: objektspezifischer Eintrag bleibt (Default-Datum = Eintritt, manuell pflegbar)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClasses: ["ek"],
      startDate: "2026-01-07",
      sdlScopes: ["din2-objekte"],
    }),
  );
  // CL-22 objektspezifischer Zusatz wird weiter abgeleitet (unverändert).
  assert.equal(target(res.schulungsSoll, "sdl-objekt-zusatz")?.clauseId, "CL-22");
  // Default-Bezug der Erstunterweisung = Eintritt (für die Wiederholungs-Frist).
  assert.equal(defaultErstunterweisungDatum("2026-01-07"), "2026-01-07");
});
