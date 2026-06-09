"use client";

import React, { useState, useCallback, useEffect, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EmployeeForm } from "@/components/employee";
import { EmployeeFileWorkspaceLayout } from "./EmployeeFileWorkspaceLayout";
import { EmployeeFileIndex } from "./EmployeeFileIndex";
import { EmployeeFileDossierView } from "./EmployeeFileDossierView";
import { EmployeeFileOverview } from "./EmployeeFileOverview";
import { EmployeeFileOnboardingPanel } from "./EmployeeFileOnboardingPanel";
import { EmployeeFileOverviewIntro } from "./EmployeeFileOverviewIntro";
import { Button } from "@/components/ui";
import { Toast } from "@/components/ui/Toast";
import { generateEmployeeDocs } from "@/app/actions/generate-employee-docs";
import { generateAuditExport } from "@/app/actions/generate-audit-export";
import { ArrowLeft, CalendarRange, Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { documentDateKey, documentTypeKey, formatIsoDisplay } from "./utils/date";
import { cn } from "@/lib/utils";
import type {
  Employee,
  GeneratorDates,
  GlobalProperties,
  Role,
  Appointment,
} from "@/lib/types/employee";
import { loadCompaniesForSwitcher } from "./load-companies-client";
import {
  createCompanyAction,
  fetchEmployeeCountsAction,
} from "@/app/actions/employee-file-actions";
import {
  getActiveCompanySlug,
  setActiveCompanySlug,
  DEFAULT_COMPANY_SLUG,
} from "@/lib/company-session";
import {
  loadEmployeeQueue,
  saveEmployeeQueue,
  loadGlobalExportSettings,
  runLocalStorageMigrationIfNeeded,
} from "@/lib/employee-queue-storage";
import {
  loadEmployeeEvidence,
  saveEmployeeEvidenceFile,
  removeEmployeeEvidenceFile,
  type EmployeeEvidenceMap,
} from "./employee-evidence-storage";
import { CompanySwitcher } from "./CompanySwitcher";
import { CompanyCreateDialog } from "./CompanyCreateDialog";
import { CompanyHubView } from "./CompanyHubView";

type DossierTab = "akte" | "generator";

/**
 * Lane J (A3) + Q8 — Generator-Datum ist **persistiert** (`generatorDates` je
 * Akte) statt Session-State. Diese reinen Helfer übersetzen zwischen der
 * Batch-Ansicht der UI (globaler Default + flacher Per-Person+Doc-Override-Map,
 * Schlüssel `documentDateKey(employeeId, docId)` + Per-Dokument-Typ-Map, Schlüssel
 * = `docId`) und der per-Akte-Persistenz (`employee.generatorDates` mit
 * `perDocument` je **docId** + `perDocType` je **Dokument-Typ**, cross-person
 * gespiegelt in jede Akte). Reines Ausgabedatum, kein Engine-/Norm-/UE-Eingriff
 * (EC-10).
 */
function extractBatchDatesFromEmployees(employees: Employee[]): {
  global: string;
  perDoc: Record<string, string>;
  perDocType: Record<string, string>;
} {
  let global = "";
  const perDoc: Record<string, string> = {};
  // perDocType ist cross-person (für ALLE gewählten Personen gleich) → in jede
  // Akte gespiegelt; beim Lesen die Werte über alle Akten vereinen (jüngste
  // gewinnt nicht — gleiche Werte erwartet, sonst erster nicht-leerer).
  const perDocType: Record<string, string> = {};
  for (const emp of employees) {
    const gd = emp.generatorDates;
    if (!gd) continue;
    if (!global && gd.global) global = gd.global;
    if (gd.perDocument) {
      for (const [docId, date] of Object.entries(gd.perDocument)) {
        if (date) perDoc[documentDateKey(emp.id, docId)] = date;
      }
    }
    if (gd.perDocType) {
      for (const [docId, date] of Object.entries(gd.perDocType)) {
        if (date && !perDocType[docId]) perDocType[docId] = date;
      }
    }
  }
  return { global, perDoc, perDocType };
}

/**
 * Lane J (A3) + Q8 — schreibt die Batch-Ansicht (globaler Default + Per-Person+
 * Doc-Map + Per-Dokument-Typ-Map) zurück in jede Akte als `generatorDates`. Der
 * Per-Doc-Schlüssel `employeeId::docId` wird je Akte zu `docId` aufgelöst; die
 * `perDocType`-Map (cross-person) wird unverändert in jede Akte gespiegelt, damit
 * sie unabhängig von der Lade-Reihenfolge round-trippt. Gibt eine neue
 * Employees-Liste zurück (immutable); ungeänderte Akten bleiben referenzgleich,
 * damit der Persistenz-Effekt nicht unnötig feuert.
 */
function applyBatchDatesToEmployees(
  employees: Employee[],
  global: string,
  perDoc: Record<string, string>,
  perDocType: Record<string, string>,
): Employee[] {
  let changed = false;
  // Cross-person: nur nicht-leere Typ-Overrides spiegeln.
  const sharedPerDocType: Record<string, string> = {};
  for (const [docId, date] of Object.entries(perDocType)) {
    if (date) sharedPerDocType[docId] = date;
  }
  const hasPerDocType = Object.keys(sharedPerDocType).length > 0;
  const next = employees.map((emp) => {
    const prefix = `${emp.id}::`;
    const perDocument: Record<string, string> = {};
    for (const [key, date] of Object.entries(perDoc)) {
      if (key.startsWith(prefix) && date) {
        perDocument[key.slice(prefix.length)] = date;
      }
    }
    const gd: GeneratorDates = {};
    if (global) gd.global = global;
    if (Object.keys(perDocument).length > 0) gd.perDocument = perDocument;
    if (hasPerDocType) gd.perDocType = { ...sharedPerDocType };
    const resolved =
      gd.global !== undefined ||
      gd.perDocument !== undefined ||
      gd.perDocType !== undefined
        ? gd
        : undefined;
    // Referenzgleichheit erhalten, wenn sich nichts ändert.
    const prev = emp.generatorDates;
    if (JSON.stringify(prev ?? null) === JSON.stringify(resolved ?? null)) {
      return emp;
    }
    changed = true;
    return { ...emp, generatorDates: resolved };
  });
  return changed ? next : employees;
}

function EmployeeAutomationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [companies, setCompanies] = useState<
    { slug: string; displayName: string }[]
  >([]);
  // SSR-stabil: erster Render (Server == Client) nutzt den konstanten Default.
  // Der echte localStorage-Slug wird erst nach Mount im Bootstrap-Effekt
  // (getActiveCompanySlug → setCompanySlug) gesetzt → kein Hydration-Mismatch.
  const [companySlug, setCompanySlug] = useState(DEFAULT_COMPANY_SLUG);
  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  // Einstieg = Firmen-Übersicht ("hub"); eine gewählte Firma betritt den Pool.
  const [view, setView] = useState<"hub" | "pool">("hub");
  const [employeeCounts, setEmployeeCounts] = useState<Record<string, number>>(
    {},
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [queueHydrated, setQueueHydrated] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [dossierTab, setDossierTab] = useState<DossierTab>("akte");
  // Bearbeiten ↔ Übersicht (read-only Vorzeige-Ansicht). Default = Bearbeiten
  // (kein Verhaltensbruch). SSR-stabil: konstanter Initialwert, kein
  // localStorage im ersten Render (Hydration-Lehre `01f720b`).
  const [akteViewMode, setAkteViewMode] = useState<"bearbeiten" | "uebersicht">(
    "bearbeiten",
  );
  const [evidenceEditMode, setEvidenceEditMode] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<EmployeeEvidenceMap>({});
  const [batchSelectedIds, setBatchSelectedIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  // #8 / Q8 — Generator-Ausgabedatum: globaler Default („Datum für alle", ISO;
  // leer = heute) + zwei Override-Ebenen: Per-Person+Doc (Schlüssel
  // `documentDateKey(employeeId, docId)`) und Per-Dokument-Typ (Schlüssel =
  // `documentTypeKey(docId)`, gilt für alle gewählten Personen). Rein
  // Ausgabedatum, kein Engine-/Norm-Eingriff. Auflösung (spezifischer sticht):
  // Per-Person+Doc → Per-Dokument-Typ → global → heute.
  const [generatorGlobalDate, setGeneratorGlobalDate] = useState<string>("");
  const [perDocDates, setPerDocDates] = useState<Record<string, string>>({});
  const [perDocTypeDates, setPerDocTypeDates] = useState<
    Record<string, string>
  >({});
  const [showDateOverrides, setShowDateOverrides] = useState(false);
  const [showDocTypeOverrides, setShowDocTypeOverrides] = useState(false);
  // Lane B / Pt 1 — read-only Batch-Vorzeige-/Audit-Ansicht (je gewählter
  // Person die `EmployeeFileOverview` mit Feld-Kopieren). Eigenständig; fasst
  // den EC-09-ZIP-Generator NICHT an.
  const [showExportView, setShowExportView] = useState(false);
  const [isAuditExporting, setIsAuditExporting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [globalProps, setGlobalProps] = useState<GlobalProperties>({
    companyName: "",
    companyEmail: "",
    companyAddress: "",
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [templatesLoaded, setTemplatesLoaded] = useState(false);
  const [templatesLoadError, setTemplatesLoadError] = useState<string | null>(
    null,
  );
  const bootstrapRunRef = useRef(0);

  useEffect(() => {
    const runId = ++bootstrapRunRef.current;

    async function bootstrap() {
      let list: { slug: string; displayName: string }[] = [];

      try {
        list = await loadCompaniesForSwitcher();
        if (runId !== bootstrapRunRef.current) return;
        setCompanies(list);
        console.info(
          "[EmployeeAutomationPage] Loaded companies for switcher:",
          list.length,
          list.map((company) => company.slug).join(", "),
        );
      } catch (err) {
        console.error(
          "[EmployeeAutomationPage] loadCompaniesForSwitcher failed — switcher may stay empty:",
          err,
        );
      }

      let slug = getActiveCompanySlug();
      if (list.length > 0 && !list.some((company) => company.slug === slug)) {
        slug = list[0]!.slug;
        setActiveCompanySlug(slug);
      }
      if (runId === bootstrapRunRef.current) {
        setCompanySlug(slug);
        setCompaniesLoaded(true);
      }

      try {
        console.info(
          "[EmployeeAutomationPage] Starting localStorage migration (non-blocking)…",
        );
        const migration = await runLocalStorageMigrationIfNeeded();
        if (runId !== bootstrapRunRef.current) return;
        if (migration?.companySlug && !migration.skipped) {
          const migratedSlug = migration.companySlug;
          setActiveCompanySlug(migratedSlug);
          if (list.some((company) => company.slug === migratedSlug)) {
            setCompanySlug(migratedSlug);
          }
        }
        console.info(
          "[EmployeeAutomationPage] localStorage migration finished:",
          migration,
        );
      } catch (err) {
        console.error(
          "[EmployeeAutomationPage] localStorage migration failed (page continues):",
          err,
        );
      }
    }

    void bootstrap();
  }, []);

  useEffect(() => {
    if (!companiesLoaded || !companySlug) return;
    let cancelled = false;
    async function loadCompanyData() {
      setQueueHydrated(false);
      const snapshot = await loadEmployeeQueue(companySlug);
      if (cancelled) return;
      setEmployees(snapshot.employees);
      setGlobalProps(snapshot.globalProps);
      setBatchSelectedIds(new Set(snapshot.employees.map((e) => e.id)));
      // #8 / Lane J (A3) — Generator-Datum aus den persistierten
      // `generatorDates` der Akten in die Batch-Ansicht laden (statt Session).
      const seeded = extractBatchDatesFromEmployees(snapshot.employees);
      setGeneratorGlobalDate(seeded.global);
      setPerDocDates(seeded.perDoc);
      setPerDocTypeDates(seeded.perDocType);
      setSelectedEmployeeId(null);
      setEditingEmployee(null);
      setIsCreatingNew(false);
      setQueueHydrated(true);
    }
    void loadCompanyData();
    return () => {
      cancelled = true;
    };
  }, [companySlug, companiesLoaded]);

  // #8 / Lane J (A3) — Generator-Datum wird beim Debounce-Save in die Akten
  // gemerged (`generatorDates`) statt in einem eigenen Effekt in den State zu
  // schreiben (vermeidet kaskadierende Renders). `applyBatchDatesToEmployees`
  // erhält Referenzgleichheit, wenn sich nichts ändert. Reines Ausgabedatum
  // (EC-10). Der Datum-State (`generatorGlobalDate`/`perDocDates`) triggert den
  // Save mit, damit Änderungen persistiert werden.
  useEffect(() => {
    if (!queueHydrated || !companySlug) return;
    const timer = window.setTimeout(() => {
      const withDates = applyBatchDatesToEmployees(
        employees,
        generatorGlobalDate,
        perDocDates,
        perDocTypeDates,
      );
      void saveEmployeeQueue(companySlug, {
        employees: withDates,
        globalProps,
      });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [
    employees,
    globalProps,
    queueHydrated,
    companySlug,
    generatorGlobalDate,
    perDocDates,
    perDocTypeDates,
  ]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    fetch("/api/templates", { signal: controller.signal })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setTemplatesLoadError(
            data.detail ||
              data.error ||
              `Vorlagen konnten nicht geladen werden (${res.status}).`,
          );
          setRoles([]);
          setAppointments([]);
          return;
        }
        setTemplatesLoadError(null);
        setRoles(data.roles || []);
        setAppointments(data.appointments || []);
      })
      .catch((err: unknown) => {
        const isAbort = err instanceof DOMException && err.name === "AbortError";
        setTemplatesLoadError(
          isAbort
            ? "Timeout beim Laden der Vorlagen. Dev-Server prüfen (Port 3001)."
            : "Vorlagen konnten nicht geladen werden.",
        );
        setRoles([]);
        setAppointments([]);
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
        setTemplatesLoaded(true);
      });

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const openEmployee = useCallback(
    (employee: Employee) => {
      setSelectedEmployeeId(employee.id);
      setEditingEmployee(employee);
      setIsCreatingNew(false);
      setEvidenceEditMode(false);
      setDossierTab("akte");
      router.replace(`/employee-automation?id=${employee.id}`, {
        scroll: false,
      });
    },
    [router],
  );

  const searchKey = searchParams.toString();
  const [syncedSearchKey, setSyncedSearchKey] = useState(searchKey);
  const [initialUrlSynced, setInitialUrlSynced] = useState(false);

  if (queueHydrated && !initialUrlSynced) {
    setInitialUrlSynced(true);
    if (searchParams.get("new") === "1") {
      setSelectedEmployeeId(null);
      setEditingEmployee(null);
      setIsCreatingNew(true);
      setEvidenceEditMode(false);
    } else {
      const id = searchParams.get("id");
      if (id) {
        const employee = employees.find((e) => e.id === id);
        if (employee) {
          setSelectedEmployeeId(id);
          setEditingEmployee(employee);
          setIsCreatingNew(false);
          setDossierTab("akte");
        }
      }
    }
  }

  if (queueHydrated && searchKey !== syncedSearchKey) {
    setSyncedSearchKey(searchKey);
    if (searchParams.get("new") === "1") {
      setSelectedEmployeeId(null);
      setEditingEmployee(null);
      setIsCreatingNew(true);
      setEvidenceEditMode(false);
    } else {
      const id = searchParams.get("id");
      if (id) {
        const employee = employees.find((e) => e.id === id);
        if (employee) {
          setSelectedEmployeeId(id);
          setEditingEmployee(employee);
          setIsCreatingNew(false);
          setDossierTab("akte");
        }
      }
    }
  }

  const handleBackToOverview = useCallback(() => {
    setSelectedEmployeeId(null);
    setEditingEmployee(null);
    setIsCreatingNew(false);
    setDossierTab("akte");
    router.replace("/employee-automation", { scroll: false });
  }, [router]);

  const focusEmployee = useMemo(() => {
    if (isCreatingNew) return null;
    const id = editingEmployee?.id ?? selectedEmployeeId;
    if (!id) return null;
    return employees.find((e) => e.id === id) ?? editingEmployee;
  }, [editingEmployee, selectedEmployeeId, employees, isCreatingNew]);

  const focusEmployeeId = focusEmployee?.id ?? null;

  useEffect(() => {
    if (!focusEmployeeId || !queueHydrated) {
      return;
    }
    let cancelled = false;
    void loadEmployeeEvidence(companySlug, focusEmployeeId).then((map) => {
      if (!cancelled) {
        setEvidenceFiles(map);
        setEvidenceEditMode(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [focusEmployeeId, companySlug, queueHydrated]);

  const formInstanceKey = isCreatingNew
    ? "new"
    : (focusEmployee?.id ?? "none");

  const handleAddEmployee = useCallback(
    (employee: Employee) => {
      setEmployees((prev) => [...prev, employee]);
      setBatchSelectedIds((prev) => new Set(prev).add(employee.id));
      openEmployee(employee);
      setToast({
        message: "Person angelegt — Dokumente optional unter „Generator“.",
        type: "success",
      });
    },
    [openEmployee],
  );

  const handleUpdateEmployee = useCallback((employee: Employee) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === employee.id ? employee : e)),
    );
    setEditingEmployee(employee);
    setToast({
      message: "Akte gespeichert.",
      type: "success",
    });
  }, []);

  const handleSavePerson = useCallback((employee: Employee) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === employee.id ? employee : e)),
    );
    setEditingEmployee(employee);
  }, []);

  const handleEvidenceUpload = useCallback(
    async (evidenceId: string, file: File) => {
      if (!focusEmployee?.id) return;
      try {
        const entry = await saveEmployeeEvidenceFile(
          companySlug,
          focusEmployee.id,
          evidenceId,
          file,
        );
        setEvidenceFiles((prev) => ({ ...prev, [evidenceId]: entry }));
        setToast({ message: "Nachweis hochgeladen.", type: "success" });
      } catch {
        setToast({ message: "Nachweis-Upload fehlgeschlagen.", type: "error" });
      }
    },
    [focusEmployee, companySlug],
  );

  const handleEvidenceRemove = useCallback(
    async (evidenceId: string) => {
      if (!focusEmployee?.id) return;
      await removeEmployeeEvidenceFile(
        companySlug,
        focusEmployee.id,
        evidenceId,
      );
      setEvidenceFiles((prev) => {
        const next = { ...prev };
        delete next[evidenceId];
        return next;
      });
    },
    [focusEmployee, companySlug],
  );

  const handleCompanyChange = useCallback(
    (slug: string) => {
      setActiveCompanySlug(slug);
      setCompanySlug(slug);
      router.replace("/employee-automation", { scroll: false });
    },
    [router],
  );

  // „Firma anlegen" — Server-Action legt die Company-Row an, dann Switcher-
  // Liste neu laden + auf die neue Firma wechseln. Keine Norm-/Engine-Logik.
  const handleCreateCompany = useCallback(
    async (displayName: string) => {
      const created = await createCompanyAction(displayName);
      const list = await loadCompaniesForSwitcher();
      setCompanies(list);
      handleCompanyChange(created.slug);
      setView("pool");
      setToast({
        message: `Firma „${created.displayName}" angelegt`,
        type: "success",
      });
    },
    [handleCompanyChange],
  );

  // Firma aus der Übersicht betreten → Pool-Ansicht.
  const handleEnterCompany = useCallback(
    (slug: string) => {
      handleCompanyChange(slug);
      setView("pool");
    },
    [handleCompanyChange],
  );

  // Mitarbeiterzahlen für die Übersicht laden (nur im Hub, eine groupBy-Query).
  useEffect(() => {
    if (view !== "hub" || !companiesLoaded) return;
    let cancelled = false;
    void fetchEmployeeCountsAction()
      .then((counts) => {
        if (!cancelled) setEmployeeCounts(counts);
      })
      .catch((err) => {
        console.warn("[EmployeeAutomationPage] employee counts failed:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [view, companiesLoaded]);

  // Deep-Link aus der Haupt-Übersicht: ?company=slug öffnet direkt den Pool.
  useEffect(() => {
    if (!companiesLoaded) return;
    const param = searchParams.get("company");
    if (param) {
      setActiveCompanySlug(param);
      setCompanySlug(param);
      setView("pool");
    }
  }, [companiesLoaded, searchParams]);

  const handleSelectEmployee = useCallback(
    (employeeId: string) => {
      const employee = employees.find((e) => e.id === employeeId);
      if (employee) openEmployee(employee);
    },
    [employees, openEmployee],
  );

  const handleCreateNew = useCallback(() => {
    setSelectedEmployeeId(null);
    setEditingEmployee(null);
    setIsCreatingNew(true);
    setEvidenceEditMode(false);
    // ?new=1 macht die Anlege-Ansicht teilbar/bookmarkbar (wird beim Laden
    // wieder ausgewertet, s. searchParams-Sync oben).
    router.replace("/employee-automation?new=1", { scroll: false });
  }, [router]);

  const handleDeleteEmployee = useCallback(
    (employeeId: string) => {
      setEmployees((prev) => prev.filter((e) => e.id !== employeeId));
      setBatchSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(employeeId);
        return next;
      });
      if (
        selectedEmployeeId === employeeId ||
        editingEmployee?.id === employeeId
      ) {
        setSelectedEmployeeId(null);
        setEditingEmployee(null);
        setIsCreatingNew(false);
        router.replace("/employee-automation", { scroll: false });
      }
      setToast({
        message: "Akte aus dem Index entfernt.",
        type: "success",
      });
    },
    [selectedEmployeeId, editingEmployee, router],
  );

  const handleCancelEdit = useCallback(() => {
    setIsCreatingNew(false);
    if (selectedEmployeeId) {
      const employee = employees.find((e) => e.id === selectedEmployeeId);
      if (employee) setEditingEmployee(employee);
    } else {
      setEditingEmployee(null);
    }
  }, [selectedEmployeeId, employees]);

  const handleToggleBatch = useCallback((employeeId: string) => {
    setBatchSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(employeeId)) next.delete(employeeId);
      else next.add(employeeId);
      return next;
    });
  }, []);

  const handleToggleAllBatch = useCallback(
    (selected: boolean) => {
      setBatchSelectedIds(
        selected ? new Set(employees.map((e) => e.id)) : new Set(),
      );
    },
    [employees],
  );

  const handleGenerate = async () => {
    const exportList = employees.filter((e) => batchSelectedIds.has(e.id));
    if (exportList.length === 0) {
      setToast({
        message: "Mindestens eine Person für den Export auswählen.",
        type: "error",
      });
      return;
    }

    const freshGlobal = await loadGlobalExportSettings(companySlug);
    setGlobalProps(freshGlobal);

    setIsGenerating(true);
    try {
      const result = await generateEmployeeDocs(
        exportList,
        freshGlobal,
        roles,
        appointments,
        {
          global: generatorGlobalDate,
          perDocument: perDocDates,
          perDocType: perDocTypeDates,
        },
      );

      if (result.success && result.zipBase64) {
        const byteCharacters = atob(result.zipBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `employee-documents-${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setToast({
          message: `ZIP für ${exportList.length} ausgewählte Person(en) erzeugt.`,
          type: "success",
        });
      } else {
        setToast({
          message: result.error || "Export fehlgeschlagen.",
          type: "error",
        });
      }
    } catch {
      setToast({
        message: "Unerwarteter Fehler beim Export.",
        type: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Browser-Download aus base64 — exakt das `handleGenerate`-Muster
  // (atob → Uint8Array → Blob → <a download>); kein neuer Infra-Teil.
  const downloadBase64 = (base64: string, mime: string, filename: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Lane B / Pt 2 — Audit-Datei (XLSX + PDF) als Browser-Download. Nutzt die
  // gewählte Batch-Menge (batchSelectedIds) — NICHT den ZIP-Generator-Action.
  const handleAuditExport = async () => {
    const exportList = employees.filter((e) => batchSelectedIds.has(e.id));
    if (exportList.length === 0) {
      setToast({
        message: "Mindestens eine Person für den Export auswählen.",
        type: "error",
      });
      return;
    }
    setIsAuditExporting(true);
    try {
      const result = await generateAuditExport({
        employees: exportList,
        appointments,
        roles,
        companyName: globalProps.companyName,
        companySlug,
        format: "both",
      });
      if (!result.success) {
        setToast({
          message: result.error || "Audit-Export fehlgeschlagen.",
          type: "error",
        });
        return;
      }
      const stamp = Date.now();
      if (result.xlsxBase64) {
        downloadBase64(
          result.xlsxBase64,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          `audit-export-${stamp}.xlsx`,
        );
      }
      if (result.pdfBase64) {
        downloadBase64(
          result.pdfBase64,
          "application/pdf",
          `audit-export-${stamp}.pdf`,
        );
      }
      setToast({
        message: `Audit-Datei (XLSX + PDF) für ${exportList.length} Person(en) erzeugt.`,
        type: "success",
      });
    } catch {
      setToast({
        message: "Unerwarteter Fehler beim Audit-Export.",
        type: "error",
      });
    } finally {
      setIsAuditExporting(false);
    }
  };

  const activeCompanyName = useMemo(
    () =>
      companies.find((company) => company.slug === companySlug)?.displayName ??
      companySlug,
    [companies, companySlug],
  );

  const dossierContent = !queueHydrated || !templatesLoaded ? (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-[#6b7280]" />
      <span className="ml-3 text-[#6b7280]">
        {!queueHydrated ? "Akten laden…" : "Vorlagen laden…"}
      </span>
    </div>
  ) : templatesLoadError ? (
    <div className="mx-auto max-w-lg p-6">
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {templatesLoadError}
      </p>
    </div>
  ) : isCreatingNew ? (
    <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
      <div className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#e30613]">
          Personal erfassen
        </p>
        <h2 className="mt-1 text-lg font-bold text-[#111827]">
          Neue Person anlegen
        </h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          Name, Geburtsdatum, Vertrag, Grundrolle und Zusatzbestellungen — danach
          eigene Akte im Index.
        </p>
      </div>
      <EmployeeForm
        key="new-person"
        displayMode="master"
        onAdd={handleAddEmployee}
        onUpdate={handleUpdateEmployee}
        editingEmployee={null}
        onCancelEdit={handleCancelEdit}
        roles={roles}
        appointments={appointments}
      />
    </div>
  ) : focusEmployee ? (
    <>
      <nav
        className="flex gap-2 border-b border-[#e5e7eb] bg-white px-4 py-2 sm:px-6"
        aria-label="Akte-Bereiche"
      >
        {(
          [
            ["akte", "Akte"],
            ["generator", "Generator"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setDossierTab(id);
              if (id === "generator") {
                setEvidenceEditMode(false);
              }
            }}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-semibold sm:text-sm",
              dossierTab === id
                ? "border-[#e30613] bg-[rgba(227,6,19,0.08)] text-[#111827]"
                : "border-[#e5e7eb] text-[#6b7280] hover:border-[rgba(227,6,19,0.35)]",
            )}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
        {dossierTab === "akte" ? (
          <>
            <div
              className="inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white p-1"
              role="group"
              aria-label="Ansicht umschalten"
            >
              {(
                [
                  ["bearbeiten", "Bearbeiten"],
                  ["uebersicht", "Übersicht"],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setAkteViewMode(mode);
                    if (mode === "uebersicht") setEvidenceEditMode(false);
                  }}
                  aria-pressed={akteViewMode === mode}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                    akteViewMode === mode
                      ? "bg-[rgba(227,6,19,0.08)] text-[#b80510]"
                      : "text-[#6b7280] hover:text-[#111827]",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {akteViewMode === "uebersicht" ? (
              <EmployeeFileOverview
                employee={focusEmployee}
                roles={roles}
                appointments={appointments}
                companyName={globalProps.companyName}
                evidenceFiles={focusEmployeeId ? evidenceFiles : {}}
              />
            ) : (
              <EmployeeFileDossierView
                employee={focusEmployee}
                roles={roles}
                appointments={appointments}
                companyName={globalProps.companyName}
                evidenceEditMode={evidenceEditMode}
                onToggleEvidenceEdit={() => setEvidenceEditMode((v) => !v)}
                evidenceFiles={focusEmployeeId ? evidenceFiles : {}}
                onEvidenceUpload={handleEvidenceUpload}
                onEvidenceRemove={handleEvidenceRemove}
                onSavePerson={handleSavePerson}
                onOpenGenerator={() => {
                  setEvidenceEditMode(false);
                  setDossierTab("generator");
                }}
              />
            )}
          </>
        ) : null}

        {dossierTab === "generator" ? (
          <EmployeeForm
            key={`gen-${formInstanceKey}`}
            displayMode="documents"
            onAdd={handleAddEmployee}
            onUpdate={handleUpdateEmployee}
            editingEmployee={editingEmployee}
            onCancelEdit={handleCancelEdit}
            roles={roles}
            appointments={appointments}
          />
        ) : null}
      </div>
    </>
  ) : employees.length > 0 ? (
    <EmployeeFileOverviewIntro
      employeeCount={employees.length}
      onCreateNew={handleCreateNew}
    />
  ) : (
    <EmployeeFileOnboardingPanel onCreateNew={handleCreateNew} />
  );

  const exportCount = batchSelectedIds.size;

  const selectedEmployees = useMemo(
    () => employees.filter((e) => batchSelectedIds.has(e.id)),
    [employees, batchSelectedIds],
  );

  // #8 — Liste aller im Export ausgewählten Einzeldokumente (Rolle + Bestellung/
  // Appointment) je gewählter Person → Grundlage für die Per-Doc-Datum-Override.
  // Schlüssel = `documentDateKey(employeeId, docId)`, identisch zur Generator-
  // Auflösung. Reine Selektions-Ableitung; berührt keine Norm-Werte.
  const exportDocuments = useMemo(() => {
    const rows: {
      key: string;
      employeeId: string;
      employeeName: string;
      docId: string;
      docLabel: string;
      groupLabel: string;
    }[] = [];
    for (const emp of selectedEmployees) {
      const role = roles.find((r) => r.id === emp.roleId);
      if (role) {
        for (const doc of role.documents) {
          if (!emp.selectedRoleDocIds.includes(doc.id)) continue;
          rows.push({
            key: documentDateKey(emp.id, doc.id),
            employeeId: emp.id,
            employeeName: emp.fullName,
            docId: doc.id,
            docLabel: doc.name,
            groupLabel: role.name,
          });
        }
      }
      for (const appointmentId of emp.appointmentIds) {
        const appointment = appointments.find((a) => a.id === appointmentId);
        if (!appointment) continue;
        for (const doc of appointment.documents) {
          if (!emp.selectedAppointmentDocIds.includes(doc.id)) continue;
          rows.push({
            key: documentDateKey(emp.id, doc.id),
            employeeId: emp.id,
            employeeName: emp.fullName,
            docId: doc.id,
            docLabel: doc.name,
            groupLabel: appointment.name,
          });
        }
      }
    }
    return rows;
  }, [selectedEmployees, roles, appointments]);

  const handlePerDocDateChange = useCallback((key: string, value: string) => {
    setPerDocDates((prev) => {
      const next = { ...prev };
      if (value) next[key] = value;
      else delete next[key];
      return next;
    });
  }, []);

  // Q8 — distinkte Dokument-Typen über ALLE gewählten Personen (gleiches
  // Dokument bei mehreren Personen = ein Typ, Schlüssel `documentTypeKey(docId)`).
  // Grundlage für „Datum pro Dokument-Typ" (ein Feld je Typ für alle gewählten
  // Personen). Reine Selektions-Ableitung; berührt keine Norm-Werte.
  const exportDocTypes = useMemo(() => {
    const seen = new Map<
      string,
      { typeKey: string; label: string; groupLabel: string }
    >();
    for (const row of exportDocuments) {
      const typeKey = documentTypeKey(row.docId);
      if (!seen.has(typeKey)) {
        seen.set(typeKey, {
          typeKey,
          label: row.docLabel,
          groupLabel: row.groupLabel,
        });
      }
    }
    return Array.from(seen.values());
  }, [exportDocuments]);

  const handlePerDocTypeDateChange = useCallback(
    (typeKey: string, value: string) => {
      setPerDocTypeDates((prev) => {
        const next = { ...prev };
        if (value) next[typeKey] = value;
        else delete next[typeKey];
        return next;
      });
    },
    [],
  );

  // „Datum für alle übernehmen" — globalen Wert auf alle Per-Doc-Overrides
  // schreiben (Muster Queue C Bulk). Override sticht weiter pro Dokument.
  const handleApplyGlobalToAll = useCallback(() => {
    if (!generatorGlobalDate || exportDocuments.length === 0) return;
    setPerDocDates((prev) => {
      const next = { ...prev };
      for (const row of exportDocuments) next[row.key] = generatorGlobalDate;
      return next;
    });
  }, [generatorGlobalDate, exportDocuments]);

  const exportViewContent = (
    <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
      <div className="flex flex-col gap-3 rounded-lg border border-[#e5e7eb] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#e30613]">
            Vorzeige-/Audit-Ansicht
          </p>
          <h2 className="mt-1 text-lg font-bold text-[#111827]">
            {selectedEmployees.length} ausgewählte Akte(n)
          </h2>
          <p className="mt-1 text-xs text-[#6b7280]">
            Read-only Übersicht je gewählter Person — Feld-Kopieren über die
            Kopier-Buttons. Rechnerischer Stand, kein Freigabestatus.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAuditExport}
            isLoading={isAuditExporting}
            disabled={selectedEmployees.length === 0}
            leftIcon={
              isAuditExporting ? undefined : (
                <FileSpreadsheet className="h-4 w-4" />
              )
            }
            className="w-full sm:w-auto"
          >
            {isAuditExporting ? "Erzeuge…" : "Audit-Datei erzeugen (XLSX + PDF)"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowExportView(false)}
            className="w-full sm:w-auto"
          >
            Zurück zum Index
          </Button>
        </div>
      </div>

      {selectedEmployees.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#e5e7eb] bg-white px-4 py-8 text-center text-sm text-[#6b7280]">
          Keine Person ausgewählt — im Index Akten für den Export anwählen.
        </p>
      ) : (
        selectedEmployees.map((emp) => (
          <EmployeeFileOverview
            key={emp.id}
            employee={emp}
            roles={roles}
            appointments={appointments}
            companyName={globalProps.companyName}
            evidenceFiles={{}}
          />
        ))
      )}
    </div>
  );

  // #8 — Generator-Datum-Panel: globaler Default („Datum für alle") +
  // Per-Doc-Override (Muster Queue C Bulk + Einzel). Leer = heute.
  const generatorDatePanel =
    exportCount > 0 ? (
      <div className="flex flex-col gap-3 rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-3 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-[#6b7280]" />
            <label className="flex items-center gap-2 text-xs font-medium text-[#374151]">
              Generator-Datum (Default für alle):
              <input
                type="date"
                value={generatorGlobalDate}
                onChange={(e) => setGeneratorGlobalDate(e.target.value)}
                className="rounded-md border border-[#e5e7eb] px-2 py-1 text-xs text-[#111827] focus:border-[#e30613] focus:outline-none"
              />
            </label>
            <span className="text-[10px] text-[#9ca3af]">
              {generatorGlobalDate
                ? `→ ${formatIsoDisplay(generatorGlobalDate)}`
                : "leer = heute"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplyGlobalToAll}
              disabled={!generatorGlobalDate || exportDocuments.length === 0}
              title="Globales Datum auf alle Einzeldokumente übernehmen"
              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e5e7eb] px-2.5 py-1 text-xs font-medium text-[#374151] hover:border-[rgba(227,6,19,0.35)] hover:text-[#e30613] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CalendarRange className="h-3.5 w-3.5" />
              Datum für alle übernehmen
            </button>
            {exportDocTypes.length > 0 ? (
              <button
                type="button"
                onClick={() => setShowDocTypeOverrides((v) => !v)}
                title="Ein Datum je Dokument-Typ für alle gewählten Personen"
                className="inline-flex shrink-0 items-center rounded-md border border-[#e5e7eb] px-2.5 py-1 text-xs font-medium text-[#374151] hover:border-[rgba(227,6,19,0.35)] hover:text-[#e30613]"
              >
                {showDocTypeOverrides
                  ? "Pro Dokument-Typ schließen"
                  : `Pro Dokument-Typ (${exportDocTypes.length})`}
              </button>
            ) : null}
            {exportDocuments.length > 0 ? (
              <button
                type="button"
                onClick={() => setShowDateOverrides((v) => !v)}
                title="Ein Datum je Person+Dokument (spezifischster Override)"
                className="inline-flex shrink-0 items-center rounded-md border border-[#e5e7eb] px-2.5 py-1 text-xs font-medium text-[#374151] hover:border-[rgba(227,6,19,0.35)] hover:text-[#e30613]"
              >
                {showDateOverrides
                  ? "Pro Person+Dokument schließen"
                  : `Pro Person+Dokument (${exportDocuments.length})`}
              </button>
            ) : null}
          </div>
        </div>

        {showDocTypeOverrides && exportDocTypes.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6b7280]">
              Datum pro Dokument-Typ (für alle gewählten Personen)
            </p>
            <ul className="divide-y divide-[#f1f3f5] rounded-md border border-[#e5e7eb] bg-white">
              {exportDocTypes.map((type) => (
                <li
                  key={type.typeKey}
                  className="flex flex-wrap items-center justify-between gap-2 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs text-[#111827]">
                      {type.label}
                    </p>
                    <p className="truncate text-[10px] text-[#9ca3af]">
                      {type.groupLabel} · gilt für alle gewählten Personen
                    </p>
                  </div>
                  <label className="flex shrink-0 items-center gap-1 text-[10px] text-[#6b7280]">
                    Datum:
                    <input
                      type="date"
                      value={perDocTypeDates[type.typeKey] ?? ""}
                      onChange={(e) =>
                        handlePerDocTypeDateChange(type.typeKey, e.target.value)
                      }
                      placeholder={generatorGlobalDate || undefined}
                      className="rounded-md border border-[#e5e7eb] px-2 py-1 text-xs text-[#111827] focus:border-[#e30613] focus:outline-none"
                    />
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {showDateOverrides && exportDocuments.length > 0 ? (
          <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6b7280]">
            Datum pro Person+Dokument (spezifischster Override)
          </p>
          <ul className="divide-y divide-[#f1f3f5] rounded-md border border-[#e5e7eb] bg-white">
            {exportDocuments.map((row) => (
              <li
                key={row.key}
                className="flex flex-wrap items-center justify-between gap-2 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs text-[#111827]">
                    {row.docLabel}
                  </p>
                  <p className="truncate text-[10px] text-[#9ca3af]">
                    {row.employeeName} · {row.groupLabel}
                  </p>
                </div>
                <label className="flex shrink-0 items-center gap-1 text-[10px] text-[#6b7280]">
                  Datum:
                  <input
                    type="date"
                    value={perDocDates[row.key] ?? ""}
                    onChange={(e) =>
                      handlePerDocDateChange(row.key, e.target.value)
                    }
                    placeholder={generatorGlobalDate || undefined}
                    className="rounded-md border border-[#e5e7eb] px-2 py-1 text-xs text-[#111827] focus:border-[#e30613] focus:outline-none"
                  />
                </label>
              </li>
            ))}
          </ul>
          </div>
        ) : null}
        <p className="text-[10px] text-[#9ca3af]">
          Reines Ausgabedatum auf den Dokumenten. Auflösung (spezifischer sticht):
          Pro Person+Dokument → Pro Dokument-Typ → globaler Default → heute. Leer =
          nächste Ebene greift. Keine Freigabe-/Auditfähigkeitsaussage.
        </p>
      </div>
    ) : null;

  const generateBar =
    employees.length > 0 ? (
      <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#111827]">
            ZIP-Export (Generator)
          </p>
          <p className="text-xs text-[#6b7280]">
            {exportCount} von {employees.length} Person(en) ausgewählt → als
            Gruppe exportieren (nutzt Firmendaten für {activeCompanyName}).
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => setShowExportView((v) => !v)}
            disabled={exportCount === 0}
            leftIcon={<FileText className="h-5 w-5" />}
            className="w-full sm:w-auto"
          >
            {showExportView ? "Ansicht schließen" : "Vorzeige-/Audit-Ansicht"}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={exportCount === 0}
            leftIcon={
              isGenerating ? undefined : <Download className="h-5 w-5" />
            }
            className="w-full sm:w-auto"
          >
            {isGenerating ? "Erzeuge…" : "ZIP exportieren"}
          </Button>
        </div>
      </div>
      {generatorDatePanel}
      </div>
    ) : null;

  const companySwitcherToolbar =
    companies.length > 0 ? (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => router.push("/?area=mitarbeiterakte")}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Zur Übersicht
        </Button>
        <CompanySwitcher
          companies={companies}
          value={companySlug}
          onChange={handleCompanyChange}
        />
        <CompanyCreateDialog onCreate={handleCreateCompany} />
      </div>
    ) : companiesLoaded ? (
      <p className="text-sm text-red-700">
        Kundenliste konnte nicht geladen werden — Dev-Konsole prüfen.
      </p>
    ) : (
      <p className="text-sm text-[#6b7280]">Kunden laden…</p>
    );

  if (view === "hub") {
    return (
      <>
        <CompanyHubView
          companies={companies}
          counts={employeeCounts}
          onEnter={handleEnterCompany}
          onCreate={handleCreateCompany}
          onBack={() => router.push("/?area=mitarbeiterakte")}
        />
        {toast ? (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        ) : null}
      </>
    );
  }

  return (
    <>
      <EmployeeFileWorkspaceLayout
        toolbar={companySwitcherToolbar}
        index={
          <EmployeeFileIndex
            employees={employees}
            roles={roles}
            selectedEmployeeId={selectedEmployeeId}
            isCreatingNew={isCreatingNew}
            batchSelectedIds={batchSelectedIds}
            isHydrating={!queueHydrated}
            perCompanyMode
            companyDisplayName={activeCompanyName}
            onSelectEmployee={handleSelectEmployee}
            onCreateNew={handleCreateNew}
            onBackToOverview={handleBackToOverview}
            onDeleteEmployee={handleDeleteEmployee}
            onToggleBatch={handleToggleBatch}
            onToggleAllBatch={handleToggleAllBatch}
          />
        }
        dossier={showExportView ? exportViewContent : dossierContent}
        generateBar={generateBar}
      />

      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
    </>
  );
}

export default function EmployeeAutomationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7]">
          <Loader2 className="h-8 w-8 animate-spin text-[#e30613]" />
        </div>
      }
    >
      <EmployeeAutomationPageContent />
    </Suspense>
  );
}
