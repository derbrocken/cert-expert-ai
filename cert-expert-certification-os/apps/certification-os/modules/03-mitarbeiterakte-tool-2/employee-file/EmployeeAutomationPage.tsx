"use client";

import React, { useState, useCallback, useEffect, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EmployeeForm } from "@/components/employee";
import { EmployeeFileWorkspaceLayout } from "./EmployeeFileWorkspaceLayout";
import { EmployeeFileIndex } from "./EmployeeFileIndex";
import { EmployeeFileDossierView } from "./EmployeeFileDossierView";
import { EmployeeFileOnboardingPanel } from "./EmployeeFileOnboardingPanel";
import { EmployeeFileOverviewIntro } from "./EmployeeFileOverviewIntro";
import { Button } from "@/components/ui";
import { Toast } from "@/components/ui/Toast";
import { generateEmployeeDocs } from "@/app/actions/generate-employee-docs";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  Employee,
  GlobalProperties,
  Role,
  Appointment,
} from "@/lib/types/employee";
import { loadCompaniesForSwitcher } from "./load-companies-client";
import {
  getActiveCompanySlug,
  setActiveCompanySlug,
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

type DossierTab = "akte" | "generator";

function EmployeeAutomationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [companies, setCompanies] = useState<
    { slug: string; displayName: string }[]
  >([]);
  const [companySlug, setCompanySlug] = useState(getActiveCompanySlug);
  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [queueHydrated, setQueueHydrated] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [dossierTab, setDossierTab] = useState<DossierTab>("akte");
  const [evidenceEditMode, setEvidenceEditMode] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<EmployeeEvidenceMap>({});
  const [batchSelectedIds, setBatchSelectedIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isGenerating, setIsGenerating] = useState(false);
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

  useEffect(() => {
    if (!queueHydrated || !companySlug) return;
    const timer = window.setTimeout(() => {
      void saveEmployeeQueue(companySlug, { employees, globalProps });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [employees, globalProps, queueHydrated, companySlug]);

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
    router.replace("/employee-automation", { scroll: false });
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

  const generateBar =
    employees.length > 0 ? (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#111827]">
            ZIP-Export (Generator)
          </p>
          <p className="text-xs text-[#6b7280]">
            {exportCount} von {employees.length} Person(en) ausgewählt — nutzt
            Firmendaten für {activeCompanyName}.
          </p>
        </div>
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
    ) : null;

  const companySwitcherToolbar =
    companies.length > 0 ? (
      <CompanySwitcher
        companies={companies}
        value={companySlug}
        onChange={handleCompanyChange}
      />
    ) : companiesLoaded ? (
      <p className="text-sm text-red-700">
        Kundenliste konnte nicht geladen werden — Dev-Konsole prüfen.
      </p>
    ) : (
      <p className="text-sm text-[#6b7280]">Kunden laden…</p>
    );

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
        dossier={dossierContent}
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
