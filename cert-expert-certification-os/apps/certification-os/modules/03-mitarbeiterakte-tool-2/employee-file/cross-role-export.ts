import type { Role } from "@/lib/types/employee";

/**
 * Cross-Rollen-Mix (Generator) — reine Auflösungslogik (kein S3/Server).
 *
 * Bestimmt, welche Rollen im Export Dokumente beitragen: **alle** Rollen, deren
 * Dokumente in `selectedRoleDocIds` referenziert sind. Die primäre Rolle
 * (`primaryRoleId`, = `employee.roleId`) kommt — sofern sie selbst ein gewähltes
 * Dokument hat — ZUERST (stabile, unveränderte ZIP-Struktur wie im
 * Single-Rollen-Fall), danach weitere Rollen in Katalog-Reihenfolge.
 *
 * ADDITIV/EC-09: Sind nur Doks der primären Rolle gewählt, ist das Ergebnis
 * exakt `[primaryRoleId]` → gleiches Verhalten wie bisher. Keine Engine-/UE-/
 * CL-Wirkung; reine Generierungs-Auflösung.
 */
export function resolveExportRoleIds(
  roles: Role[],
  primaryRoleId: string,
  selectedRoleDocIds: string[],
): string[] {
  const selected = new Set(selectedRoleDocIds);
  if (selected.size === 0) return [];

  const result: string[] = [];
  const primary = roles.find((r) => r.id === primaryRoleId);
  if (primary && primary.documents.some((d) => selected.has(d.id))) {
    result.push(primary.id);
  }
  for (const r of roles) {
    if (r.id === primaryRoleId) continue;
    if (r.documents.some((d) => selected.has(d.id))) {
      result.push(r.id);
    }
  }
  return result;
}

/**
 * Kollisionsfreier ZIP-Unterordner-Name für eine Export-Rolle. Normalfall =
 * `role.name`; tragen zwei Rollen denselben Namen, wird der Name einmalig um die
 * `role.id` ergänzt. Mutiert `usedNames` (Set bereits vergebener Ordnernamen).
 */
export function resolveRoleFolderName(
  role: Role,
  usedNames: Set<string>,
): string {
  let name = role.name;
  if (usedNames.has(name)) {
    name = `${role.name} (${role.id})`;
  }
  usedNames.add(name);
  return name;
}
