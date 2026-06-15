/**
 * Unit-Tests für die Cross-Rollen-Export-Auflösung (`cross-role-export.ts`).
 * Reine Generierungs-Auflösung (Doc-ID → Rolle), keine Engine/UE/CL.
 *   npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/cross-role-export.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import type { Role } from "@/lib/types/employee";
import { resolveExportRoleIds, resolveRoleFolderName } from "./cross-role-export";

const roleDoc = (id: string) => ({ id, name: id, fileName: `${id}.docx` });

const sima: Role = {
  id: "sicherheitsmitarbeiter",
  name: "Sicherheitsmitarbeiter",
  description: "",
  documents: [roleDoc("sima-1"), roleDoc("sima-2")],
};
const fk: Role = {
  id: "fuehrungskraft",
  name: "Führungskraft",
  description: "",
  documents: [roleDoc("fk-1"), roleDoc("fk-2")],
};
const buero: Role = {
  id: "buerokraft",
  name: "Bürokraft",
  description: "",
  documents: [roleDoc("buero-1")],
};
const ROLES = [sima, fk, buero];

test("Single-Rolle (EC-09): nur primäre Doks → exakt [primaryRoleId]", () => {
  const out = resolveExportRoleIds(ROLES, "sicherheitsmitarbeiter", [
    "sima-1",
    "sima-2",
  ]);
  assert.deepEqual(out, ["sicherheitsmitarbeiter"]);
});

test("Multi-Rolle: Doks aus 2 Rollen → beide Rollen, primäre zuerst", () => {
  const out = resolveExportRoleIds(ROLES, "sicherheitsmitarbeiter", [
    "sima-1",
    "fk-2",
  ]);
  assert.deepEqual(out, ["sicherheitsmitarbeiter", "fuehrungskraft"]);
});

test("Multi-Rolle: drei Rollen, primäre zuerst, Rest in Katalog-Reihenfolge", () => {
  const out = resolveExportRoleIds(ROLES, "fuehrungskraft", [
    "buero-1",
    "fk-1",
    "sima-2",
  ]);
  assert.deepEqual(out, [
    "fuehrungskraft",
    "sicherheitsmitarbeiter",
    "buerokraft",
  ]);
});

test("Primäre Rolle ohne eigenes gewähltes Doc wird NICHT vorangestellt", () => {
  const out = resolveExportRoleIds(ROLES, "sicherheitsmitarbeiter", ["fk-1"]);
  assert.deepEqual(out, ["fuehrungskraft"]);
});

test("Leere Auswahl → keine Export-Rolle", () => {
  assert.deepEqual(resolveExportRoleIds(ROLES, "sicherheitsmitarbeiter", []), []);
});

test("Unbekannte Doc-IDs werden ignoriert", () => {
  const out = resolveExportRoleIds(ROLES, "sicherheitsmitarbeiter", [
    "sima-1",
    "ghost-doc",
  ]);
  assert.deepEqual(out, ["sicherheitsmitarbeiter"]);
});

test("Ordnername: Normalfall = role.name, kollisionsfrei", () => {
  const used = new Set<string>();
  assert.equal(resolveRoleFolderName(sima, used), "Sicherheitsmitarbeiter");
  assert.equal(resolveRoleFolderName(fk, used), "Führungskraft");
});

test("Ordnername: Namenskollision → Suffix mit role.id", () => {
  const used = new Set<string>();
  const a: Role = { id: "a", name: "Wachdienst", description: "", documents: [] };
  const b: Role = { id: "b", name: "Wachdienst", description: "", documents: [] };
  assert.equal(resolveRoleFolderName(a, used), "Wachdienst");
  assert.equal(resolveRoleFolderName(b, used), "Wachdienst (b)");
});
