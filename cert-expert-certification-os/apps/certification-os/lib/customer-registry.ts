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

/** Strip legal suffixes and normalize spacing/case for fuzzy company match. */
export function normalizeCompanyLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(
      /\b(gmbh|gbr|ug|ag|kg|ohg|e\.?\s?k\.?|inc|llc|co\.?|limited|ltd)\b\.?/gi,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
}

export function matchCompanySlugBySlug(rawSlug: string): string | null {
  const slug = rawSlug.trim();
  if (!slug) return null;
  for (const project of loadCustomerRegistry()) {
    if (project.slug === slug) return project.slug;
  }
  const lower = slug.toLowerCase();
  for (const project of loadCustomerRegistry()) {
    if (project.slug.toLowerCase() === lower) return project.slug;
    if (project.slug.toLowerCase().replace(/_/g, "") === lower.replace(/[_\s-]/g, "")) {
      return project.slug;
    }
  }
  return null;
}

export function matchCompanySlugByName(companyName: string): string | null {
  const normalized = normalizeCompanyLabel(companyName);
  if (!normalized) return null;

  for (const project of loadCustomerRegistry()) {
    const names = [project.display_name, project.slug, ...(project.aliases ?? [])];
    if (
      names.some((name) => normalizeCompanyLabel(name) === normalized)
    ) {
      return project.slug;
    }
  }

  for (const project of loadCustomerRegistry()) {
    const tokens = [project.display_name, project.slug, ...(project.aliases ?? [])]
      .map((name) => normalizeCompanyLabel(name).replace(/_/g, " "))
      .filter((token) => token.length >= 4);
    const compact = normalized.replace(/\s+/g, "");
    if (
      tokens.some((token) => {
        const tokenCompact = token.replace(/\s+/g, "");
        return (
          normalized.includes(token) ||
          compact.includes(tokenCompact) ||
          token.includes(normalized)
        );
      })
    ) {
      return project.slug;
    }
  }
  return null;
}

/** Prefer exact registry slug (hidden field); else name match; else legacy pool. */
export function resolveCompanySlug(options: {
  slugHint?: string;
  companyName?: string;
}): string {
  const fromSlug = options.slugHint
    ? matchCompanySlugBySlug(options.slugHint)
    : null;
  if (fromSlug) return fromSlug;

  const fromName = options.companyName
    ? matchCompanySlugByName(options.companyName)
    : null;
  if (fromName) return fromName;

  return LEGACY_IMPORT_SLUG;
}
