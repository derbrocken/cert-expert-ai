import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeComplianceStatus,
  severityOf,
  overallLabel,
} from "./compliance-status";

test("severityOf: kritische Stati", () => {
  assert.equal(severityOf("fehlt"), "kritisch");
  assert.equal(severityOf("abgelaufen"), "kritisch");
  assert.equal(severityOf("nicht lesbar"), "kritisch");
});

test("severityOf: offene/in-Prüfung Stati", () => {
  assert.equal(severityOf("offen"), "offen");
  assert.equal(severityOf("unvollständig"), "offen");
  assert.equal(severityOf("beantragt"), "offen");
  assert.equal(severityOf("fachlich prüfen"), "offen");
  assert.equal(severityOf("vorbereitet"), "offen");
});

test("severityOf: erfüllt / neutral", () => {
  assert.equal(severityOf("vorhanden"), "erfuellt");
  assert.equal(severityOf("nicht erforderlich"), "neutral");
});

test("leeres Pflicht-Set → kein-pflichtset", () => {
  const r = computeComplianceStatus([], []);
  assert.equal(r.overall, "kein-pflichtset");
  assert.equal(r.counts.relevant, 0);
  assert.equal(r.nextDeadline, undefined);
});

test("nur 'nicht erforderlich' zählt nicht als relevant → kein-pflichtset", () => {
  const r = computeComplianceStatus(
    [{ status: "nicht erforderlich" }, { status: "nicht erforderlich" }],
    [],
  );
  assert.equal(r.overall, "kein-pflichtset");
  assert.equal(r.counts.neutral, 2);
  assert.equal(r.counts.relevant, 0);
});

test("ein 'fehlt' → overall offen (kritisch dominiert)", () => {
  const r = computeComplianceStatus(
    [{ status: "vorhanden" }, { status: "fehlt" }, { status: "offen" }],
    [],
  );
  assert.equal(r.overall, "offen");
  assert.equal(r.counts.kritisch, 1);
  assert.equal(r.counts.offen, 1);
  assert.equal(r.counts.erfuellt, 1);
  assert.equal(r.counts.relevant, 3);
});

test("kein kritisch, aber offen → in-arbeit", () => {
  const r = computeComplianceStatus(
    [{ status: "vorhanden" }, { status: "fachlich prüfen" }],
    [],
  );
  assert.equal(r.overall, "in-arbeit");
});

test("alles vorhanden → rechnerisch-vollstaendig (NIE freigegeben)", () => {
  const r = computeComplianceStatus(
    [{ status: "vorhanden" }, { status: "vorhanden" }],
    [{ label: "Erste Hilfe", status: "vorhanden", dueDate: "2027-01-01" }],
  );
  assert.equal(r.overall, "rechnerisch-vollstaendig");
  // EC-10: Label enthält NICHT "freigegeben/auditfähig/zertifiziert".
  const { label } = overallLabel(r.overall);
  assert.match(label, /rechnerisch/i);
  assert.doesNotMatch(label, /freigegeben|auditf|zertifiz/i);
  // Frist 'vorhanden' ist nicht handlungsbedürftig → keine nextDeadline.
  assert.equal(r.nextDeadline, undefined);
});

test("abgelaufene Frist zählt kritisch + wird als überfällig priorisiert", () => {
  const r = computeComplianceStatus(
    [{ status: "vorhanden" }],
    [
      { label: "Sachkunde", status: "beantragt", dueDate: "2026-12-01" },
      { label: "Erste Hilfe", status: "abgelaufen", dueDate: "2026-03-01" },
    ],
  );
  assert.equal(r.overall, "offen");
  assert.equal(r.counts.kritisch, 1);
  assert.ok(r.nextDeadline);
  assert.equal(r.nextDeadline!.overdue, true);
  assert.equal(r.nextDeadline!.label, "Erste Hilfe");
});

test("nächste Frist nach frühestem Datum, wenn keine überfällig", () => {
  const r = computeComplianceStatus(
    [{ status: "offen" }],
    [
      { label: "Spät", status: "beantragt", dueDate: "2026-12-01" },
      { label: "Früh", status: "offen", dueDate: "2026-07-01" },
    ],
  );
  assert.ok(r.nextDeadline);
  assert.equal(r.nextDeadline!.overdue, false);
  assert.equal(r.nextDeadline!.label, "Früh");
});
