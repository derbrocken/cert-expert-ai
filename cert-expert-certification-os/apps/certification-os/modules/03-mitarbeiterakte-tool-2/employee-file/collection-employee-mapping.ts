/**
 * P3b — Pure Mapping: Sammlung (Document Collection) → Mitarbeiter-Doc-Vorauswahl.
 * Kein DB/IO → unit-testbar. Das Formular ruft `mapCollectionToSelection` und
 * wendet das Ergebnis auf die bestehenden Felder an.
 *
 * Modell (DPb.1 = Safe-Map, Ein-Rollen-Modell):
 *  - **Seed** (seedKey = bekannte Set-Kategorie) → bisheriges Verhalten: setzt
 *    setKategorie + roleId (resolveSetKategorieRoleId) + alle Rollen-Doks an.
 *    KEIN Lock, Appointments unberührt (keine Regression).
 *  - **Custom** → Items per `templateLogicalPath` auf Doc-IDs mappen; eine Rolle
 *    (Ein-Rollen-Modell), Inclusion-Stufen, Pflicht = lockedDocIds. Items aus
 *    weiteren Rollen / standard-models / ohne Vorlage → `unsupported` (Hinweis,
 *    nicht verschluckt) — voll ordnerübergreifend = P3c.
 *
 * EC-09: nur Vorauswahl-Daten; Generator unberührt. EC-10: keine Freigabeaussage.
 */
import type { Role, Appointment } from "@/lib/types/employee";
import {
  isKnownSetKategorie,
  resolveSetKategorieRoleId,
  type SetKategorie,
} from "./vorlagen-set-catalog";

export interface MappableCollectionItem {
  templateLogicalPath: string | null;
  label: string;
  inclusion: string; // "mandatory" | "optional-on" | "optional-off"
}

export interface MappableCollection {
  seedKey: string | null;
  items: MappableCollectionItem[];
}

export interface UnsupportedItem {
  label: string;
  reason: string;
}

export interface CollectionSelectionResult {
  kind: "seed" | "custom";
  setKategorie?: SetKategorie;
  roleId: string;
  selectedRoleDocIds: string[];
  /** Nur bei `kind:"custom"` anzuwenden (Seed lässt Appointments unberührt). */
  appointmentIds: string[];
  selectedAppointmentDocIds: string[];
  /** Pflicht-Doks → Toggle im Formular gesperrt. */
  lockedDocIds: string[];
  unsupported: UnsupportedItem[];
}

/** `category/folder/file.docx` → {category, folder, docId} (Doc-ID wie /api/templates). */
export function parseLogicalPath(
  path: string,
): { category: string; folder: string; docId: string } | null {
  const parts = path.split("/");
  if (parts.length < 3) return null;
  const category = parts[0];
  const folder = parts[1];
  const file = parts.slice(2).join("/");
  if (!category || !folder || !file.endsWith(".docx")) return null;
  return { category, folder, docId: `${folder}-${file.replace(".docx", "")}` };
}

export function mapCollectionToSelection(
  collection: MappableCollection,
  roles: readonly Role[],
  appointments: readonly Appointment[],
): CollectionSelectionResult {
  // ── Seed → bisheriges Verhalten (keine Regression) ──
  if (collection.seedKey && isKnownSetKategorie(collection.seedKey)) {
    const kat = collection.seedKey;
    const roleId = resolveSetKategorieRoleId(kat, roles) ?? "";
    const role = roles.find((r) => r.id === roleId);
    return {
      kind: "seed",
      setKategorie: kat,
      roleId,
      selectedRoleDocIds: role ? role.documents.map((d) => d.id) : [],
      appointmentIds: [],
      selectedAppointmentDocIds: [],
      lockedDocIds: [],
      unsupported: [],
    };
  }

  // ── Custom → Pfad-Mapping (Ein-Rollen-Modell) ──
  const unsupported: UnsupportedItem[] = [];
  const roleItems: { docId: string; folder: string; inclusion: string; label: string }[] = [];
  const apptItems: { docId: string; folder: string; inclusion: string; label: string }[] = [];

  for (const item of collection.items) {
    if (!item.templateLogicalPath) {
      unsupported.push({ label: item.label, reason: "keine Vorlage hinterlegt" });
      continue;
    }
    const parsed = parseLogicalPath(item.templateLogicalPath);
    if (!parsed) {
      unsupported.push({ label: item.label, reason: "ungültiger Vorlagen-Pfad" });
      continue;
    }
    const entry = {
      docId: parsed.docId,
      folder: parsed.folder,
      inclusion: item.inclusion,
      label: item.label,
    };
    if (parsed.category === "roles") roleItems.push(entry);
    else if (parsed.category === "appointments") apptItems.push(entry);
    else
      unsupported.push({
        label: item.label,
        reason: "Standard-Model (Tool 1) — nicht im Mitarbeiter-Generator",
      });
  }

  // Ein-Rollen-Modell: erste vorhandene Rolle aus den Rollen-Items.
  const chosenRole =
    roleItems.map((i) => i.folder).find((f) => roles.some((r) => r.id === f)) ??
    "";
  const role = roles.find((r) => r.id === chosenRole);
  const roleDocSet = new Set(role ? role.documents.map((d) => d.id) : []);

  const selectedRoleDocIds: string[] = [];
  const lockedDocIds: string[] = [];
  for (const it of roleItems) {
    if (it.folder !== chosenRole) {
      unsupported.push({ label: it.label, reason: "andere Rolle — erst nach P3c generierbar" });
      continue;
    }
    if (!roleDocSet.has(it.docId)) {
      unsupported.push({ label: it.label, reason: "Vorlage nicht im Rollen-Ordner" });
      continue;
    }
    if (it.inclusion !== "optional-off") selectedRoleDocIds.push(it.docId);
    if (it.inclusion === "mandatory") lockedDocIds.push(it.docId);
  }

  const appointmentIds: string[] = [];
  const selectedAppointmentDocIds: string[] = [];
  for (const it of apptItems) {
    const appt = appointments.find((a) => a.id === it.folder);
    if (!appt) {
      unsupported.push({ label: it.label, reason: "Bestellung nicht gefunden" });
      continue;
    }
    if (!appt.documents.some((d) => d.id === it.docId)) {
      unsupported.push({ label: it.label, reason: "Vorlage nicht in der Bestellung" });
      continue;
    }
    if (!appointmentIds.includes(it.folder)) appointmentIds.push(it.folder);
    if (it.inclusion !== "optional-off") selectedAppointmentDocIds.push(it.docId);
    if (it.inclusion === "mandatory") lockedDocIds.push(it.docId);
  }

  return {
    kind: "custom",
    setKategorie: undefined,
    roleId: chosenRole,
    selectedRoleDocIds,
    appointmentIds,
    selectedAppointmentDocIds,
    lockedDocIds,
    unsupported,
  };
}
