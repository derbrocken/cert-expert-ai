import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bundledRegistry from "./data/customer-registry.json";

const LOG_PREFIX = "[customer-registry]";

export const LEGACY_IMPORT_SLUG = "_legacy_import";

export interface RegistryProject {
  slug: string;
  display_name: string;
  aliases?: string[];
  active?: boolean;
}

interface RegistryFile {
  projects: RegistryProject[];
}

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

function registryPathCandidates(): string[] {
  const candidates: string[] = [];
  const envPath = process.env.CEA_REGISTRY_PATH?.trim();
  if (envPath) {
    candidates.push(path.resolve(envPath));
  }

  // Stable relative to this module — not process.cwd()
  candidates.push(
    path.join(moduleDir, "../../../../hq/03_Kundenprojekte/_registry.json"),
    path.join(moduleDir, "data/customer-registry.json"),
  );

  return candidates;
}

function resolveRegistryPath(): string | null {
  for (const candidate of registryPathCandidates()) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function parseRegistryFile(raw: string, source: string): RegistryProject[] {
  const parsed = JSON.parse(raw) as RegistryFile;
  if (!Array.isArray(parsed.projects)) {
    throw new Error(`Missing or invalid "projects" array in ${source}`);
  }
  const active = parsed.projects.filter((project) => project.active !== false);
  if (active.length === 0) {
    throw new Error(`No active projects in ${source}`);
  }
  return active;
}

function loadBundledRegistry(): RegistryProject[] {
  const active = (bundledRegistry as RegistryFile).projects.filter(
    (project) => project.active !== false,
  );
  if (active.length === 0) {
    throw new Error(`${LOG_PREFIX} Bundled registry has no active companies`);
  }
  console.info(
    `${LOG_PREFIX} Loaded ${active.length} active companies from bundled data/customer-registry.json`,
  );
  return active;
}

export function loadCustomerRegistry(): RegistryProject[] {
  const registryPath = resolveRegistryPath();
  if (!registryPath) {
    console.warn(
      `${LOG_PREFIX} No registry file on disk (checked: ${registryPathCandidates().join(", ")}); using bundled fallback`,
    );
    return loadBundledRegistry();
  }

  try {
    const raw = fs.readFileSync(registryPath, "utf8");
    const projects = parseRegistryFile(raw, registryPath);
    console.info(
      `${LOG_PREFIX} Loaded ${projects.length} active companies from ${registryPath}`,
    );
    return projects;
  } catch (err) {
    console.error(
      `${LOG_PREFIX} Failed to read registry at ${registryPath}, using bundled fallback:`,
      err,
    );
    return loadBundledRegistry();
  }
}

export function matchCompanySlugByName(companyName: string): string | null {
  const normalized = companyName.trim().toLowerCase();
  if (!normalized) return null;
  for (const project of loadCustomerRegistry()) {
    const names = [project.display_name, project.slug, ...(project.aliases ?? [])];
    if (names.some((name) => name.toLowerCase() === normalized)) {
      return project.slug;
    }
  }
  return null;
}
