import { fetchCompaniesAction } from "@/app/actions/employee-file-actions";

export interface CompanyOption {
  slug: string;
  displayName: string;
}

export async function loadCompaniesForSwitcher(): Promise<CompanyOption[]> {
  try {
    const res = await fetch("/api/companies", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`GET /api/companies → HTTP ${res.status}`);
    }
    const data = (await res.json()) as { companies?: CompanyOption[] };
    if (!Array.isArray(data.companies)) {
      throw new Error("GET /api/companies → invalid payload");
    }
    return data.companies;
  } catch (apiErr) {
    console.warn(
      "[loadCompaniesForSwitcher] API route failed, falling back to server action:",
      apiErr,
    );
    return fetchCompaniesAction();
  }
}
