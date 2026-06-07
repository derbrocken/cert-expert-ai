const ACTIVE_COMPANY_KEY = "cea-active-company-slug";
export const DEFAULT_COMPANY_SLUG = "TeamFlex";

export function getActiveCompanySlug(): string {
  if (typeof window === "undefined") return DEFAULT_COMPANY_SLUG;
  return localStorage.getItem(ACTIVE_COMPANY_KEY) ?? DEFAULT_COMPANY_SLUG;
}

export function setActiveCompanySlug(slug: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_COMPANY_KEY, slug);
}
