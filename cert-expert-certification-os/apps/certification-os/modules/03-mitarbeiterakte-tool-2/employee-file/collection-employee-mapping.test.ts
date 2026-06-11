/**
 * Unit-Tests P3b — Sammlung → Mitarbeiter-Doc-Vorauswahl.
 *   npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/collection-employee-mapping.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseLogicalPath,
  mapCollectionToSelection,
  type MappableCollection,
} from "./collection-employee-mapping";
import type { Role, Appointment } from "@/lib/types/employee";

const roles: Role[] = [
  {
    id: "sicherheitsmitarbeiter",
    name: "Sicherheitsmitarbeiter",
    documents: [
      { id: "sicherheitsmitarbeiter-Stellenbeschreibung", name: "Stellenbeschreibung", fileName: "Stellenbeschreibung.docx" },
      { id: "sicherheitsmitarbeiter-Basis", name: "Basis", fileName: "Basis.docx" },
    ],
  },
  {
    id: "fuehrungskraft",
    name: "Führungskraft",
    documents: [
      { id: "fuehrungskraft-FK", name: "FK", fileName: "FK.docx" },
    ],
  },
];

const appointments: Appointment[] = [
  {
    id: "bestellungen",
    name: "Bestellungen",
    documents: [
      { id: "bestellungen-Ersthelfer", name: "Ersthelfer", fileName: "Ersthelfer.docx" },
    ],
  },
];

test("parseLogicalPath: category/folder/file → docId", () => {
  assert.deepEqual(parseLogicalPath("roles/sma/A.docx"), {
    category: "roles",
    folder: "sma",
    docId: "sma-A",
  });
  assert.equal(parseLogicalPath("roles/sma"), null); // zu kurz
  assert.equal(parseLogicalPath("roles/sma/A.txt"), null); // keine docx
});

test("Seed → bisheriges Verhalten (setKategorie + roleId + alle Rollen-Doks, kein Lock)", () => {
  const coll: MappableCollection = {
    seedKey: "sicherheitsmitarbeiter",
    items: [{ templateLogicalPath: null, label: "Basis", inclusion: "mandatory" }],
  };
  const r = mapCollectionToSelection(coll, roles, appointments);
  assert.equal(r.kind, "seed");
  assert.equal(r.setKategorie, "sicherheitsmitarbeiter");
  assert.equal(r.roleId, "sicherheitsmitarbeiter");
  assert.deepEqual(r.selectedRoleDocIds.sort(), [
    "sicherheitsmitarbeiter-Basis",
    "sicherheitsmitarbeiter-Stellenbeschreibung",
  ]);
  assert.deepEqual(r.lockedDocIds, []);
  assert.deepEqual(r.unsupported, []);
});

test("Custom: Rollen-Items → Auswahl + Pflicht-Lock + optional-off ausgeschlossen", () => {
  const coll: MappableCollection = {
    seedKey: null,
    items: [
      { templateLogicalPath: "roles/sicherheitsmitarbeiter/Stellenbeschreibung.docx", label: "Stelle", inclusion: "mandatory" },
      { templateLogicalPath: "roles/sicherheitsmitarbeiter/Basis.docx", label: "Basis", inclusion: "optional-off" },
    ],
  };
  const r = mapCollectionToSelection(coll, roles, appointments);
  assert.equal(r.kind, "custom");
  assert.equal(r.roleId, "sicherheitsmitarbeiter");
  // mandatory an, optional-off NICHT vorausgewählt
  assert.deepEqual(r.selectedRoleDocIds, ["sicherheitsmitarbeiter-Stellenbeschreibung"]);
  assert.deepEqual(r.lockedDocIds, ["sicherheitsmitarbeiter-Stellenbeschreibung"]);
  assert.deepEqual(r.unsupported, []);
});

test("Custom: zweite Rolle → unsupported (Ein-Rollen-Modell, P3c-Hinweis)", () => {
  const coll: MappableCollection = {
    seedKey: null,
    items: [
      { templateLogicalPath: "roles/sicherheitsmitarbeiter/Stellenbeschreibung.docx", label: "Stelle", inclusion: "optional-on" },
      { templateLogicalPath: "roles/fuehrungskraft/FK.docx", label: "FK", inclusion: "optional-on" },
    ],
  };
  const r = mapCollectionToSelection(coll, roles, appointments);
  assert.equal(r.roleId, "sicherheitsmitarbeiter");
  assert.deepEqual(r.selectedRoleDocIds, ["sicherheitsmitarbeiter-Stellenbeschreibung"]);
  assert.equal(r.unsupported.length, 1);
  assert.match(r.unsupported[0].reason, /andere Rolle/);
});

test("Custom: Appointment-Item → appointmentIds + Doc + Lock", () => {
  const coll: MappableCollection = {
    seedKey: null,
    items: [
      { templateLogicalPath: "appointments/bestellungen/Ersthelfer.docx", label: "Ersthelfer", inclusion: "mandatory" },
    ],
  };
  const r = mapCollectionToSelection(coll, roles, appointments);
  assert.deepEqual(r.appointmentIds, ["bestellungen"]);
  assert.deepEqual(r.selectedAppointmentDocIds, ["bestellungen-Ersthelfer"]);
  assert.deepEqual(r.lockedDocIds, ["bestellungen-Ersthelfer"]);
});

test("Custom: standard-models + null-Pfad + nicht-vorhandene Vorlage → unsupported", () => {
  const coll: MappableCollection = {
    seedKey: null,
    items: [
      { templateLogicalPath: "standard-models/qm/Handbuch.docx", label: "QM", inclusion: "optional-on" },
      { templateLogicalPath: null, label: "Ohne", inclusion: "optional-on" },
      { templateLogicalPath: "roles/sicherheitsmitarbeiter/Fehlt.docx", label: "Fehlt", inclusion: "optional-on" },
    ],
  };
  const r = mapCollectionToSelection(coll, roles, appointments);
  assert.deepEqual(r.selectedRoleDocIds, []);
  assert.equal(r.unsupported.length, 3);
  const reasons = r.unsupported.map((u) => u.reason).join(" | ");
  assert.match(reasons, /Standard-Model/);
  assert.match(reasons, /keine Vorlage/);
  assert.match(reasons, /nicht im Rollen-Ordner/);
});
