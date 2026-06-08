"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CompanyHubView } from "./CompanyHubView";
import { loadCompaniesForSwitcher } from "./load-companies-client";
import {
  createCompanyAction,
  fetchEmployeeCountsAction,
} from "@/app/actions/employee-file-actions";
import { setActiveCompanySlug } from "@/lib/company-session";

/**
 * Selbstständige Firmen-Übersicht zum Einbetten (z. B. im Haupt-Dashboard).
 *
 * Lädt Firmen + Mitarbeiterzahlen selbst und navigiert bei Auswahl direkt in
 * den Pool der Firma (`/employee-automation?company=…`). „Neue Firma" legt an
 * und betritt sie. Reine Navigation/Präsentation — keine Norm-/Engine-Logik.
 */
export function CompanyHubPanel() {
  const router = useRouter();
  const [companies, setCompanies] = useState<
    { slug: string; displayName: string }[]
  >([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    void loadCompaniesForSwitcher()
      .then((list) => {
        if (!cancelled) setCompanies(list);
      })
      .catch(() => {});
    void fetchEmployeeCountsAction()
      .then((c) => {
        if (!cancelled) setCounts(c);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const enter = useCallback(
    (slug: string) => {
      setActiveCompanySlug(slug);
      router.push(`/employee-automation?company=${encodeURIComponent(slug)}`);
    },
    [router],
  );

  const create = useCallback(
    async (displayName: string) => {
      const created = await createCompanyAction(displayName);
      setActiveCompanySlug(created.slug);
      router.push(
        `/employee-automation?company=${encodeURIComponent(created.slug)}`,
      );
    },
    [router],
  );

  return (
    <CompanyHubView
      companies={companies}
      counts={counts}
      onEnter={enter}
      onCreate={create}
    />
  );
}

CompanyHubPanel.displayName = "CompanyHubPanel";
