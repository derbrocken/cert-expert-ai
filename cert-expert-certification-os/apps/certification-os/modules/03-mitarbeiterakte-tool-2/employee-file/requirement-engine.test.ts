/**
 * Unit-Tests für die Slice-2/3 + G4 Requirement-Engine (DoD-Szenarien).
 * Lauffähig ohne Test-Framework via Node-Builtin:
 *   npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/requirement-engine.test.ts
 *
 * G4: Die Engine klassifiziert nach `roleClass` (Norm-Klasse), nicht mehr nach
 * Org-Titel-Strings. Org-Titel → Klasse läuft über `mapRoleTypeToRoleClass`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  deriveRequirements,
  mapRoleTypeToRoleClass,
  type EngineRule,
  type RequirementContext,
  type TrainingTarget,
} from "./requirement-engine";

const REF = "2026-06-07";

function baseCtx(partial: Partial<RequirementContext>): RequirementContext {
  return {
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

// 1. EK Vollzeit, Sachkunde, DIN 77200-1
test("Szenario 1 — EK Vollzeit + Sachkunde + DIN 77200-1: §4.1b-Set, 40 UE, keine Teil-2-Schulung", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClass: "ek",
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
  // keine offene Sachkunde-Frist, da Sachkunde vorhanden
  assert.equal(res.fristen.find((f) => f.id === "frist-sachkunde"), undefined);
});

// 2. EK Teilzeit, Unterrichtung, Eintritt vor 5 Monaten
test("Szenario 2 — EK Teilzeit + Unterrichtung + Eintritt vor 5 Mt.: 6-Monats-Frist offen (gelb), 24 UE", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClass: "ek",
      employmentType: "Teilzeit",
      qualification: "Unterrichtung nach §34a",
      startDate: "2026-01-07", // 5 Monate vor REF
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  // F1: reine Unterrichtung (ohne Sachkunde) ⇒ §34a "unvollständig" (nicht grün)
  assert.equal(rule(res.pflichtSet, "q-34a")?.status, "unvollständig");
  const frist = res.fristen.find((f) => f.id === "frist-sachkunde");
  assert.equal(frist?.status, "beantragt"); // noch nicht überschritten
  assert.equal(frist?.clauseId, "CL-02");
  assert.equal(frist?.dueDate, "2026-07-07");
  assert.equal(target(res.schulungsSoll, "jahres-weiterbildung")?.ue, 24);
});

test("Szenario 2b — Eintritt vor 8 Monaten: Sachkunde-Frist abgelaufen (rot)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClass: "ek",
      employmentType: "Teilzeit",
      qualification: "Unterrichtung",
      startDate: "2025-10-07", // 8 Monate vor REF
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
      roleClass: "ek",
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
      roleClass: "fk",
      sdlScopes: ["din2-veranstaltung"],
    }),
  );
  const t = target(res.schulungsSoll, "sdl-veranstaltung-fk");
  assert.equal(t?.ue, 24);
  assert.equal(t?.clauseId, "CL-20");
  assert.ok(rule(res.pflichtSet, "q-fk-quali")); // CL-10
});

// Org-Titel Schichtleitung → ek (16 UE), KEIN Auto-FK, aber Bewachungsrolle
test("Szenario 3c — Schichtleitung (→ek) Veranstaltung bes. SR: 16 UE (EK, nicht 24), kein FK-Quali, Basis-Set", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClass: mapRoleTypeToRoleClass("Schichtleitung"),
      roleType: "Schichtleitung",
      sdlScopes: ["din2-veranstaltung"],
    }),
  );
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-ek")?.ue, 16);
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-fk"), undefined);
  assert.equal(rule(res.pflichtSet, "q-fk-quali"), undefined); // kein CL-10
  // bleibt Bewachungsrolle ⇒ Basis-Pflichtset vorhanden
  assert.ok(rule(res.pflichtSet, "q-34a"));
  assert.ok(rule(res.pflichtSet, "q-datenschutz"));
});

// 4. EK Flüchtling/Asyl → 40 UE (CL-24) + Brandschutz-Hinweis
test("Szenario 4 — EK Flüchtling/Asyl: 40 UE (CL-24) + Personalschlüssel-Hinweis", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClass: "ek",
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
      roleClass: "fk",
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
      roleClass: mapRoleTypeToRoleClass("Einsatzleitung"),
      roleType: "Einsatzleitung",
      sdlScopes: ["din2-fluechtling-asyl"],
    }),
  );
  assert.equal(target(res.schulungsSoll, "sdl-asyl-base")?.ue, 40);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-fk")?.ue, 24);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-fk")?.clauseId, "CL-25");
  assert.equal(rule(res.pflichtSet, "q-fk-quali")?.clauseId, "CL-10");
});

// 5. Verwaltung → kein §34a-Set; Datenschutz/Verschwiegenheit aktiv
test("Szenario 5 — Verwaltung: kein §34a-Set, Datenschutz/Verschwiegenheit aktiv", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClass: "verwaltung",
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
      roleClass: "verwaltung",
      sdlScopes: ["din2-veranstaltung", "din2-objekte", "din2-fluechtling-asyl"],
    }),
  );
  assert.equal(res.schulungsSoll.length, 0);
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-ek"), undefined);
  assert.equal(target(res.schulungsSoll, "sdl-objekt-zusatz"), undefined);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-base"), undefined);
  // Brandschutz-Pflichtnachweis aus SDL Objekte bleibt ungated (kein UE-Soll)
  assert.ok(rule(res.pflichtSet, "sdl-objekt-brandschutz"));
});

// 6. drivesServiceVehicle = true → Fahrer-/UVV-Zeile "fachlich prüfen" (CL-73 legal-input → clauseId null)
test("Szenario 6 — fährt Dienstfahrzeug: Fahrer-/UVV-Zeile fachlich prüfen", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClass: "ek",
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
      roleClass: "subunternehmer",
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
  const res = deriveRequirements(baseCtx({ roleClass: "praktikant" }));
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
// Slice 3 — Doppelrolle (zusatzBewachungNiveau EK/FK)
// ---------------------------------------------------------------------------

// D1: Verwaltung + EK-Niveau → volles Bewachungs-Set, keine Verwaltungs-Reduktion, kein FK-Quali
test("Szenario D1 — Verwaltung + zusatzBewachungNiveau 'ek': volles Bewachungs-Set, kein v-34a-na/v-datenschutz, kein q-fk-quali, Doppelrollen-Hinweis", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClass: "verwaltung",
      roleType: "Geschäftsführung",
      zusatzBewachungNiveau: "ek",
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

// D2: Verwaltung ohne Niveau (Regression) → nur Verwaltungs-Reduktion, kein §34a-Set
test("Szenario D2 — Verwaltung ohne Niveau (Regression): v-datenschutz/v-verschwiegenheit/v-34a-na, kein q-34a/jahres-weiterbildung", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClass: "verwaltung",
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
test("Szenario D3 — Verwaltung + 'ek' + Veranstaltung bes. SR: sdl-veranstaltung-ek (16 UE, CL-21), kein FK", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClass: "verwaltung",
      zusatzBewachungNiveau: "ek",
      sdlScopes: ["din2-veranstaltung"],
    }),
  );
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-ek")?.ue, 16);
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-ek")?.clauseId, "CL-21");
  assert.equal(target(res.schulungsSoll, "sdl-veranstaltung-fk"), undefined);
  assert.equal(rule(res.pflichtSet, "q-fk-quali"), undefined);
});

// D4: Verwaltung + FK + Veranstaltung + Asyl → 24 UE FK + Asyl 40+24=64 + FK-Quali (DIN-SDL)
test("Szenario D4 — Verwaltung + 'fk' + Veranstaltung + Asyl: sdl-veranstaltung-fk (24, CL-20) + sdl-asyl-base (40) + sdl-asyl-fk (24, CL-25) + q-fk-quali (CL-10)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClass: "verwaltung",
      zusatzBewachungNiveau: "fk",
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

// D5: EK + EK-Niveau = idempotent (echte Bewachungsklasse, Niveau ist No-op)
test("Szenario D5 — EK + 'ek': identisch zu EK ohne Niveau (Idempotenz, kein doppeltes Set)", () => {
  const withNiveau = deriveRequirements(
    baseCtx({
      roleClass: "ek",
      employmentType: "Vollzeit",
      qualification: "Sachkunde",
      sdlScopes: ["din1-grunddienste"],
      zusatzBewachungNiveau: "ek",
    }),
  );
  const without = deriveRequirements(
    baseCtx({
      roleClass: "ek",
      employmentType: "Vollzeit",
      qualification: "Sachkunde",
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  assert.equal(
    withNiveau.pflichtSet.map((r) => r.id).sort().join(","),
    without.pflichtSet.map((r) => r.id).sort().join(","),
  );
  assert.equal(
    withNiveau.schulungsSoll.map((t) => t.id).sort().join(","),
    without.schulungsSoll.map((t) => t.id).sort().join(","),
  );
  // EK ist baseBewachung ⇒ keine Doppelrolle (kein Doppelrollen-Hinweis)
  assert.equal(withNiveau.hinweise.some((h) => /Doppelrolle erfasst/.test(h)), false);
});

// D6: Praktikant + EK → volles Bewachungs-Set, kein p-reduziert
test("Szenario D6 — Praktikant + 'ek': volles Bewachungs-Set, kein p-reduziert", () => {
  const res = deriveRequirements(
    baseCtx({
      roleClass: "praktikant",
      zusatzBewachungNiveau: "ek",
    }),
  );
  assert.ok(rule(res.pflichtSet, "q-34a"));
  assert.ok(rule(res.pflichtSet, "q-datenschutz"));
  assert.equal(rule(res.pflichtSet, "p-reduziert"), undefined);
});

// D7: CL-10-Gate — FK-Quali nur bei DIN-SDL (beide FK-Wege)
test("Szenario D7 — CL-10-Gate: FK/Doppelrolle-fk ohne DIN-SDL ⇒ kein q-fk-quali", () => {
  // (a) Norm-Klasse FK ohne SDL
  const fkNoSdl = deriveRequirements(baseCtx({ roleClass: "fk" }));
  assert.equal(rule(fkNoSdl.pflichtSet, "q-fk-quali"), undefined);
  // (a') FK nur mit non-din (kein DIN)
  const fkNonDin = deriveRequirements(
    baseCtx({ roleClass: "fk", sdlScopes: ["non-din"] }),
  );
  assert.equal(rule(fkNonDin.pflichtSet, "q-fk-quali"), undefined);
  // (b) Doppelrolle-fk ohne DIN-SDL
  const doppelNoSdl = deriveRequirements(
    baseCtx({
      roleClass: "verwaltung",
      zusatzBewachungNiveau: "fk",
    }),
  );
  assert.equal(rule(doppelNoSdl.pflichtSet, "q-fk-quali"), undefined);
});

// Invariante: keine erfundene Pflicht — clauseId null ⇒ status fachlich prüfen / nicht erforderlich
test("Invariante — jede Regel ohne clauseId ist 'fachlich prüfen' oder 'nicht erforderlich'", () => {
  const scenarios: RequirementContext[] = [
    baseCtx({ roleClass: "ek", sdlScopes: ["din1-grunddienste"] }),
    baseCtx({ roleClass: "fk", sdlScopes: ["din2-veranstaltung", "din2-objekte"] }),
    baseCtx({ roleClass: "ek", sdlScopes: ["din2-fluechtling-asyl", "din2-oepv", "non-din"], drivesServiceVehicle: true, appointmentLabels: ["SiBe / Sicherheitsbeauftragter"] }),
    baseCtx({ roleClass: "verwaltung" }),
    baseCtx({ roleClass: "praktikant" }),
    baseCtx({ roleClass: "subunternehmer", appointmentLabels: ["Ersthelfer", "Brandschutzhelfer", "Interventionskraft"] }),
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
