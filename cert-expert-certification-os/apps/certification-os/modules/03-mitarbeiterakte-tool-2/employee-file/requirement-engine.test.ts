/**
 * Unit-Tests für die Slice-2 Requirement-Engine (DoD-Szenarien).
 * Lauffähig ohne Test-Framework via Node-Builtin:
 *   npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/requirement-engine.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  deriveRequirements,
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

// 1. SMA Vollzeit, Sachkunde, DIN 77200-1
test("Szenario 1 — SMA Vollzeit + Sachkunde + DIN 77200-1: §4.1b-Set, 40 UE, keine Teil-2-Schulung", () => {
  const res = deriveRequirements(
    baseCtx({
      roleType: "Sicherheitsmitarbeiter",
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

// 2. SMA Teilzeit, Unterrichtung, Eintritt vor 5 Monaten
test("Szenario 2 — SMA Teilzeit + Unterrichtung + Eintritt vor 5 Mt.: 6-Monats-Frist offen (gelb), 24 UE", () => {
  const res = deriveRequirements(
    baseCtx({
      roleType: "Sicherheitsmitarbeiter",
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
      roleType: "Sicherheitsmitarbeiter",
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
test("Szenario 3 — EK/SMA Veranstaltung bes. SR: 16 UE einmalig (CL-21) + WB", () => {
  const res = deriveRequirements(
    baseCtx({
      roleType: "Sicherheitsmitarbeiter",
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

test("Szenario 3b — Führungskraft Veranstaltung bes. SR: 24 UE einmalig (CL-20)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleType: "Führungskraft",
      sdlScopes: ["din2-veranstaltung"],
    }),
  );
  const t = target(res.schulungsSoll, "sdl-veranstaltung-fk");
  assert.equal(t?.ue, 24);
  assert.equal(t?.clauseId, "CL-20");
  assert.ok(rule(res.pflichtSet, "q-fk-quali")); // CL-10
});

// F4: Schichtleitung = EK-Niveau (16 UE), KEIN Auto-FK, aber Bewachungsrolle
test("Szenario 3c — Schichtleitung Veranstaltung bes. SR: 16 UE (EK, nicht 24), kein FK-Quali, Basis-Set", () => {
  const res = deriveRequirements(
    baseCtx({
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
test("Szenario 4 — EK/SMA Flüchtling/Asyl: 40 UE (CL-24) + Personalschlüssel-Hinweis", () => {
  const res = deriveRequirements(
    baseCtx({
      roleType: "Sicherheitsmitarbeiter",
      sdlScopes: ["din2-fluechtling-asyl"],
    }),
  );
  const t = target(res.schulungsSoll, "sdl-asyl-base");
  assert.equal(t?.ue, 40);
  assert.equal(t?.clauseId, "CL-24");
  assert.ok(res.hinweise.some((h) => /Personalschlüssel/.test(h)));
  assert.equal(target(res.schulungsSoll, "sdl-asyl-fk"), undefined);
});

test("Szenario 4b — Führungskraft Flüchtling/Asyl: +24 UE (= 64) (CL-25)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleType: "Führungskraft",
      sdlScopes: ["din2-fluechtling-asyl"],
    }),
  );
  assert.equal(target(res.schulungsSoll, "sdl-asyl-base")?.ue, 40);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-fk")?.ue, 24);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-fk")?.clauseId, "CL-25");
});

// F4: Einsatzleitung Asyl = nur Basis (40), KEIN FK-Aufschlag
test("Szenario 4c — Einsatzleitung Flüchtling/Asyl: nur Basis 40 UE, kein FK-Aufschlag", () => {
  const res = deriveRequirements(
    baseCtx({
      roleType: "Einsatzleitung",
      sdlScopes: ["din2-fluechtling-asyl"],
    }),
  );
  assert.equal(target(res.schulungsSoll, "sdl-asyl-base")?.ue, 40);
  assert.equal(target(res.schulungsSoll, "sdl-asyl-fk"), undefined);
});

// 5. Bürokraft → kein §34a-Set; Datenschutz/Verschwiegenheit aktiv
test("Szenario 5 — Bürokraft: kein §34a-Set, Datenschutz/Verschwiegenheit aktiv", () => {
  const res = deriveRequirements(
    baseCtx({
      roleType: "Bürokraft / Verwaltung",
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
test("Szenario 5b — Bürokraft + SDL Veranstaltung/Objekt/Asyl: kein UE-Schulungssoll (F3-Gate)", () => {
  const res = deriveRequirements(
    baseCtx({
      roleType: "Bürokraft / Verwaltung",
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
      roleType: "Sicherheitsmitarbeiter",
      drivesServiceVehicle: true,
      sdlScopes: ["din1-grunddienste"],
    }),
  );
  const r = rule(res.pflichtSet, "fahrer-uvv");
  assert.equal(r?.status, "fachlich prüfen");
  assert.equal(r?.clauseId, null);
});

// Invariante: keine erfundene Pflicht — clauseId null ⇒ status fachlich prüfen / nicht erforderlich
test("Invariante — jede Regel ohne clauseId ist 'fachlich prüfen' oder 'nicht erforderlich'", () => {
  const scenarios: RequirementContext[] = [
    baseCtx({ roleType: "Sicherheitsmitarbeiter", sdlScopes: ["din1-grunddienste"] }),
    baseCtx({ roleType: "Führungskraft", sdlScopes: ["din2-veranstaltung", "din2-objekte"] }),
    baseCtx({ roleType: "Sicherheitsmitarbeiter", sdlScopes: ["din2-fluechtling-asyl", "din2-oepv", "non-din"], drivesServiceVehicle: true, appointmentLabels: ["SiBe / Sicherheitsbeauftragter"] }),
    baseCtx({ roleType: "Bürokraft / Verwaltung" }),
    baseCtx({ roleType: "Praktikant / Azubi" }),
    baseCtx({ roleType: "Subunternehmer-SMA", appointmentLabels: ["Ersthelfer", "Brandschutzhelfer", "Interventionskraft"] }),
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
