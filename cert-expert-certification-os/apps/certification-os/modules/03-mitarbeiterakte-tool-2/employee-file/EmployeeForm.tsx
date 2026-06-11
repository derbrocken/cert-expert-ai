"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  employeeFormSchema,
  EmployeeFormData,
} from "@/lib/validations/employee-form";
import {
  Button,
  Card,
  CardContent,
  FormField,
  Input,
  Select,
  MultiSelect,
  DatePicker,
} from "@/components/ui";
import {
  User,
  UserPlus,
  RotateCcw,
  FolderOpen,
  FileText,
  Check,
  Briefcase,
  Calendar,
  Shield,
  Hash,
  Upload,
  X,
} from "lucide-react";
import type {
  Employee,
  Role,
  Appointment,
  RoleClass,
  BestellungTyp,
} from "@/lib/types/employee";
import {
  appointmentLabelDe,
  roleLabelDe,
  GRUNDROLLE_HINT,
  ZUSATZBESTELLUNGEN_HINT,
  BESTELLUNG_DEFS,
  getBestelltAls,
  setBestelltAlsPatch,
} from "./employee-display-labels";
import {
  ROLE_CLASS_LABEL_MULTI,
  ORG_TITLE_OPTIONS,
  ORG_TITLE_OTHER_ID,
  BESCHAEFTIGUNGSART_OPTIONS,
  GESCHLECHT_OPTIONS,
  DIENSTFAHRZEUG_OPTIONS,
  SDL_SCOPE_CATALOG,
  visibleOrgTitleOptions,
  isOrgTitleGatedOut,
} from "./employee-stammdaten-options";
import { resolveRoleClasses } from "./requirement-engine";
import { RoleClassSelector } from "./RoleClassSelector";
import {
  QUALIFICATION_CATALOG,
  parseQualifications,
  serializeQualifications,
} from "./qualification-catalog";
import {
  SET_KATEGORIE_DEFS,
  resolveSetKategorieRoleId,
  projectSetKategorieFromRoleId,
  OVERLAY_DEFS,
  type SetKategorie,
} from "./vorlagen-set-catalog";
import type { EmployeeEvidenceMap } from "./employee-evidence-storage";
// P3b — Sammlungen (Document Collections) als Vorauswahl-Quelle.
import { fetchCollectionsAction } from "@/app/actions/collection-actions";
import type { CollectionDto } from "@/lib/document-collection-repository";
import {
  mapCollectionToSelection,
  type CollectionSelectionResult,
  type UnsupportedItem,
} from "./collection-employee-mapping";

export type EmployeeFormDisplayMode = "full" | "master" | "documents";

export interface EmployeeFormProps {
  onAdd: (employee: Employee) => void;
  onUpdate?: (employee: Employee) => void;
  editingEmployee?: Employee | null;
  onCancelEdit?: () => void;
  roles: Role[];
  appointments: Appointment[];
  /** master = Stammdaten only; documents = doc chips only; full = legacy combined */
  displayMode?: EmployeeFormDisplayMode;
  /**
   * P3 / #6 (Mark D2) — Nachweis-Upload direkt im Formular beim **Bearbeiten**
   * einer bereits gespeicherten Person. Wird nur gerendert, wenn `editingEmployee`
   * eine ID hat (Person persistiert) UND diese Handler gesetzt sind. Nutzt die
   * bestehende Evidence-Infra (kein neues Storage-Modell). EC-10: eingehende
   * Nachweise bleiben `unchecked` (Prüfung = separater Admin-Toggle, #7).
   */
  evidenceFiles?: EmployeeEvidenceMap;
  onEvidenceUpload?: (evidenceId: string, file: File) => void;
  onEvidenceRemove?: (evidenceId: string) => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onAdd,
  onUpdate,
  editingEmployee,
  onCancelEdit,
  roles,
  appointments,
  displayMode = "full",
  evidenceFiles,
  onEvidenceUpload,
  onEvidenceRemove,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    mode: "onChange",
    defaultValues: editingEmployee
      ? {
          fullName: editingEmployee.fullName,
          birthday: editingEmployee.birthday,
          startDate: editingEmployee.startDate,
          roleId: editingEmployee.roleId,
          appointmentIds: editingEmployee.appointmentIds,
          // Lane N P1 (#1): persistierte/abgeleitete Bestell-Auswahl.
          bestelltAls: getBestelltAls(editingEmployee),
          roleClasses: resolveRoleClasses(editingEmployee),
          roleType: editingEmployee.roleType || "",
          // #D: gespeichertes Feld gewinnt; sonst aus `roleId` projizieren.
          setKategorie:
            editingEmployee.setKategorie ??
            projectSetKategorieFromRoleId(editingEmployee.roleId),
          sdlScopes: editingEmployee.sdlScopes ?? [],
          drivesServiceVehicle: editingEmployee.drivesServiceVehicle,
          ersteHilfeGueltigBis: editingEmployee.ersteHilfeGueltigBis || "",
          brandschutzGueltigBis: editingEmployee.brandschutzGueltigBis || "",
          employmentType: editingEmployee.employmentType || "",
          // #2: strukturierte Auswahl — gefülltes `qualifications` gewinnt; sonst
          // tolerant aus dem Freitext migrieren (verlustfrei: Unmatched bleibt im
          // Freitext erhalten).
          qualifications:
            editingEmployee.qualifications &&
            editingEmployee.qualifications.length > 0
              ? editingEmployee.qualifications
              : parseQualifications(editingEmployee.qualification).ids,
          qualification: editingEmployee.qualification || "",
          // Lane K: Geschlecht (Mutterschutz-Overlay-Trigger CL-77).
          gender: editingEmployee.gender,
          guardIDNumber: editingEmployee.guardIDNumber || "",
          employeeIDNumber: editingEmployee.employeeIDNumber || "",
          useGuardAsEmployeeId: editingEmployee.useGuardAsEmployeeId || false,
        }
      : {
          fullName: "",
          birthday: "",
          startDate: "",
          roleId: "",
          appointmentIds: [],
          bestelltAls: [],
          roleClasses: [],
          roleType: "",
          setKategorie: undefined,
          sdlScopes: [],
          drivesServiceVehicle: undefined,
          ersteHilfeGueltigBis: "",
          brandschutzGueltigBis: "",
          employmentType: "",
          qualifications: [],
          qualification: "",
          gender: undefined,
          guardIDNumber: "",
          employeeIDNumber: "",
          useGuardAsEmployeeId: false,
        },
  });

  const selectedRoleId = watch("roleId");
  const selectedAppointmentIds = watch("appointmentIds");
  const selectedSetKategorie = watch("setKategorie");

  // #D — Set-Kategorie wählen → leitet die Core-Vorlagen-Rolle (`roleId`) ab.
  // Set-Kategorie ist eine eigene Vorlagen-Achse: NICHT die Norm-Klasse
  // (`roleClasses`, Engine-Grundset bleibt unberührt) und NICHT der Org-Titel
  // (`roleType`). Persistenz reitet auf `roleId` (keine eigene DB-Spalte).
  const handleSetKategorieChange = (value: string) => {
    const next = value ? (value as SetKategorie) : undefined;
    setValue("setKategorie", next, { shouldValidate: true });
    const derivedRoleId = resolveSetKategorieRoleId(next, roles);
    if (derivedRoleId) {
      setValue("roleId", derivedRoleId, { shouldValidate: true });
    }
  };
  const useGuardAsEmployeeId = watch("useGuardAsEmployeeId");
  const guardIDNumber = watch("guardIDNumber");

  // G4 — Org-Titel: Dropdown mit bekannten Titeln + Option „andere (Freitext)".
  const watchedRoleType = watch("roleType");
  const watchedRoleClasses = watch("roleClasses");
  // Batch-2 #7 — Schichtleitung/Objektleitung sind FK-Unter-Titel: nur sichtbar/
  // wählbar, wenn Norm-Klasse `fk` gewählt ist (UI-Gating, KEINE Engine-Wirkung).
  const visibleOrgTitles = useMemo(
    () => visibleOrgTitleOptions(watchedRoleClasses),
    [watchedRoleClasses],
  );
  const [orgTitleOther, setOrgTitleOther] = useState(
    () =>
      !!editingEmployee?.roleType &&
      !ORG_TITLE_OPTIONS.some((o) => o.id === editingEmployee.roleType),
  );
  const orgTitleSelectValue = orgTitleOther
    ? ORG_TITLE_OTHER_ID
    : visibleOrgTitles.some((o) => o.id === watchedRoleType)
      ? (watchedRoleType ?? "")
      : "";

  // Batch-2 #7 — wird `fk` abgewählt, während ein FK-Unter-Titel
  // (Schichtleitung/Objektleitung) gesetzt ist, den Org-Titel zurücksetzen
  // (Anzeige-Gatung; die Norm-Klasse bleibt maßgeblich, keine Engine-Wirkung).
  useEffect(() => {
    if (!orgTitleOther && isOrgTitleGatedOut(watchedRoleType, watchedRoleClasses)) {
      setValue("roleType", "");
    }
  }, [orgTitleOther, watchedRoleType, watchedRoleClasses, setValue]);

  const handleOrgTitleChange = (value: string) => {
    if (value === ORG_TITLE_OTHER_ID) {
      setOrgTitleOther(true);
      setValue("roleType", "");
      return;
    }
    setOrgTitleOther(false);
    setValue("roleType", value);
    // #A: Default-Klasse nur als Vorschlag setzen, wenn noch KEINE Norm-Klasse
    // erfasst ist. Ein Org-Titel überschreibt eine bewusst gewählte (oder
    // bewusst geleerte) Klassenauswahl nicht — keine Zwangsvorauswahl.
    const def = ORG_TITLE_OPTIONS.find((o) => o.id === value)?.defaultClass;
    const current = getValues("roleClasses") ?? [];
    if (def && current.length === 0)
      setValue("roleClasses", [def as RoleClass], { shouldValidate: true });
  };

  // Sync Guard ID → Employee ID when checkbox is checked
  useEffect(() => {
    if (useGuardAsEmployeeId) {
      setValue("employeeIDNumber", guardIDNumber || "");
    }
  }, [useGuardAsEmployeeId, guardIDNumber, setValue]);

  // --- Document selection state ---
  const [selectedRoleDocIds, setSelectedRoleDocIds] = useState<Set<string>>(
    () => new Set(editingEmployee?.selectedRoleDocIds || []),
  );
  const [selectedAppDocIds, setSelectedAppDocIds] = useState<Set<string>>(
    () => new Set(editingEmployee?.selectedAppointmentDocIds || []),
  );

  // ── P3b — Sammlungen ──
  const [collections, setCollections] = useState<CollectionDto[]>([]);
  const [collectionId, setCollectionId] = useState<string | undefined>(
    editingEmployee?.collectionId,
  );
  const [lockedDocIds, setLockedDocIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [unsupportedItems, setUnsupportedItems] = useState<UnsupportedItem[]>([]);
  // Wird im handleCollectionChange gesetzt; ein NACHGELAGERTER Effekt wendet die
  // Doc-Auswahl an, nachdem die Rollen-/Appointment-Effekte gelaufen sind
  // (deterministische Reihenfolge → kein Effect-Fighting).
  const [pendingApply, setPendingApply] =
    useState<CollectionSelectionResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCollectionsAction()
      .then((list) => {
        if (cancelled) return;
        setCollections(list);
        // Edit-Vorauswahl: gespeicherte collectionId, sonst Seed zur setKategorie.
        if (!editingEmployee?.collectionId && editingEmployee?.setKategorie) {
          const seed = list.find((c) => c.seedKey === editingEmployee.setKategorie);
          if (seed) setCollectionId(seed.id);
        }
      })
      .catch(() => {
        if (!cancelled) setCollections([]);
      });
    return () => {
      cancelled = true;
    };
  }, [editingEmployee]);

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId),
    [selectedRoleId, roles],
  );

  const selectedAppointments = useMemo(
    () => appointments.filter((a) => selectedAppointmentIds?.includes(a.id)),
    [selectedAppointmentIds, appointments],
  );

  const initialRoleIdRef = useRef(editingEmployee?.roleId ?? "");
  const initialAppointmentIdsRef = useRef<string[]>(
    editingEmployee?.appointmentIds ?? [],
  );

  useEffect(() => {
    initialRoleIdRef.current = editingEmployee?.roleId ?? "";
    initialAppointmentIdsRef.current = editingEmployee?.appointmentIds ?? [];
    if (editingEmployee) {
      setSelectedRoleDocIds(new Set(editingEmployee.selectedRoleDocIds));
      setSelectedAppDocIds(new Set(editingEmployee.selectedAppointmentDocIds));
    }
  }, [editingEmployee]);

  useEffect(() => {
    if (!selectedRole) {
      if (!editingEmployee) {
        setSelectedRoleDocIds(new Set());
      }
      return;
    }
    if (editingEmployee && selectedRoleId === initialRoleIdRef.current) {
      return;
    }
    setSelectedRoleDocIds(new Set(selectedRole.documents.map((d) => d.id)));
  }, [selectedRole, selectedRoleId, editingEmployee]);

  useEffect(() => {
    const currentIds = [...(selectedAppointmentIds ?? [])].sort().join(",");
    const initialIds = [...initialAppointmentIdsRef.current].sort().join(",");

    if (editingEmployee && currentIds === initialIds) {
      return;
    }

    if (!selectedAppointmentIds?.length) {
      if (!editingEmployee) {
        setSelectedAppDocIds(new Set());
      }
      return;
    }

    if (editingEmployee && currentIds !== initialIds) {
      setSelectedAppDocIds((prev) => {
        const next = new Set(prev);
        const initialSet = new Set(initialAppointmentIdsRef.current);
        for (const id of initialAppointmentIdsRef.current) {
          if (!selectedAppointmentIds.includes(id)) {
            const appt = appointments.find((a) => a.id === id);
            appt?.documents.forEach((d) => next.delete(d.id));
          }
        }
        for (const id of selectedAppointmentIds) {
          if (!initialSet.has(id)) {
            const appt = appointments.find((a) => a.id === id);
            appt?.documents.forEach((d) => next.add(d.id));
          }
        }
        return next;
      });
      return;
    }

    const allDocIds = selectedAppointments.flatMap((a) =>
      a.documents.map((d) => d.id),
    );
    setSelectedAppDocIds(new Set(allDocIds));
  }, [
    selectedAppointments,
    selectedAppointmentIds,
    editingEmployee,
    appointments,
  ]);

  // P3b — wendet die Sammlungs-Doc-Auswahl NACH den Rollen-/Appointment-Effekten
  // an (dieser Effekt ist bewusst danach deklariert → läuft danach → gewinnt).
  // Seed = bisheriges Verhalten (alle Rollen-Doks, Appointments unberührt);
  // Custom = exakte Subset-Auswahl inkl. optional-aus + Appointments.
  useEffect(() => {
    if (!pendingApply) return;
    setSelectedRoleDocIds(new Set(pendingApply.selectedRoleDocIds));
    if (pendingApply.kind === "custom") {
      setSelectedAppDocIds(new Set(pendingApply.selectedAppointmentDocIds));
    }
    setPendingApply(null);
  }, [pendingApply]);

  const toggleRoleDoc = (docId: string) => {
    setSelectedRoleDocIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  };

  const toggleAppDoc = (docId: string) => {
    setSelectedAppDocIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  };

  const selectAllRoleDocs = () => {
    if (!selectedRole) return;
    setSelectedRoleDocIds(new Set(selectedRole.documents.map((d) => d.id)));
  };

  const deselectAllRoleDocs = () => {
    setSelectedRoleDocIds(new Set());
  };

  const selectAllAppDocs = () => {
    const allDocIds = selectedAppointments.flatMap((a) =>
      a.documents.map((d) => d.id),
    );
    setSelectedAppDocIds(new Set(allDocIds));
  };

  const deselectAllAppDocs = () => {
    setSelectedAppDocIds(new Set());
  };

  // P3b — Sammlung gewählt → Doc-Vorauswahl ableiten + anwenden.
  const handleCollectionChange = (id: string) => {
    setCollectionId(id || undefined);
    const coll = collections.find((c) => c.id === id);
    if (!coll) {
      setLockedDocIds(new Set());
      setUnsupportedItems([]);
      return;
    }
    const result = mapCollectionToSelection(
      { seedKey: coll.seedKey, items: coll.items },
      roles,
      appointments,
    );
    setValue("setKategorie", result.setKategorie, { shouldValidate: true });
    setValue("roleId", result.roleId, { shouldValidate: true });
    if (result.kind === "custom") {
      setValue("appointmentIds", result.appointmentIds, { shouldValidate: true });
    }
    setLockedDocIds(new Set(result.lockedDocIds));
    setUnsupportedItems(result.unsupported);
    // Doc-Auswahl wird im nachgelagerten Effekt angewandt (nach Rollen-Effekt).
    setPendingApply(result);
  };

  const roleOptions = useMemo(
    () =>
      roles.map((r) => ({
        id: r.id,
        name:
          displayMode === "master" || displayMode === "full"
            ? roleLabelDe(r.id, r.name)
            : r.name,
        description: r.description,
      })),
    [roles, displayMode],
  );

  const appointmentOptions = useMemo(
    () =>
      appointments.map((a) => ({
        id: a.id,
        name:
          displayMode === "master" || displayMode === "full"
            ? appointmentLabelDe(a.id, a.name)
            : a.name,
        description: a.description,
      })),
    [appointments, displayMode],
  );

  const handleFormSubmit = (data: EmployeeFormData) => {
    // Determine effective Employee ID
    const effectiveEmployeeId = data.useGuardAsEmployeeId
      ? data.guardIDNumber || ""
      : data.employeeIDNumber || "";

    // Lane N P1 (#1): Bestell-Auswahl persistieren + Generator-Auswahl
    // reconcilen. `bestelltAls` ist die Source of Truth; der Patch hält den
    // realen `bestellungen`-Ordner (appointmentIds) und die Bestell-Doc-Chips
    // (selectedAppointmentDocIds) synchron, ohne andere Auswahl zu verlieren.
    const bestelltAls: BestellungTyp[] = data.bestelltAls ?? [];
    const bestellPatch = setBestelltAlsPatch(
      {
        ...(editingEmployee ?? ({} as Employee)),
        appointmentIds: data.appointmentIds,
        selectedAppointmentDocIds: Array.from(selectedAppDocIds),
      } as Employee,
      bestelltAls,
    );

    const employee: Employee = {
      // Bestehende Felder erhalten (z. B. Ist-UE, einmaligIstUE) — beim
      // Speichern aus dem Generator-Tab darf nichts verloren gehen.
      ...(editingEmployee ?? {}),
      id: editingEmployee?.id || crypto.randomUUID(),
      fullName: data.fullName,
      birthday: data.birthday,
      startDate: data.startDate,
      roleId: data.roleId,
      // Lane N P1 (#1): aus dem Bestell-Reconcile (Ordner-Sync) — behält alle
      // Nicht-Bestell-Termine.
      appointmentIds: bestellPatch.appointmentIds,
      bestelltAls,
      selectedRoleDocIds: Array.from(selectedRoleDocIds),
      // Lane N P1 (#1): Bestell-Doc-Chips reconcilet; übrige Overlay-Auswahl bleibt.
      selectedAppointmentDocIds: bestellPatch.selectedAppointmentDocIds,
      // EK/FK-Refinement — Norm-Klassen-Set (Engine) + Org-Titel (Anzeige)
      roleClasses: data.roleClasses,
      // Legacy-Einfachfelder nicht mehr schreiben (Set ist maßgeblich).
      roleClass: undefined,
      zusatzBewachungNiveau: undefined,
      roleType: data.roleType || undefined,
      // #D / Lane J (A2): Set-Kategorie (Vorlagen-Achse) — jetzt **echtes
      // persistiertes Feld** (Schema `setKategorie String?`), von der Rolle
      // entkoppelt. Default wird aus `roleId` abgeleitet (s. resolveSetKategorie/
      // vorlagen-set-catalog.ts), ist hier aber überschreibbar.
      setKategorie: data.setKategorie,
      // P3b — gewählte Sammlung (Vorauswahl-Quelle) mitpersistieren.
      collectionId,
      sdlScopes: data.sdlScopes ?? [],
      drivesServiceVehicle: data.drivesServiceVehicle,
      ersteHilfeGueltigBis: data.ersteHilfeGueltigBis || undefined,
      brandschutzGueltigBis: data.brandschutzGueltigBis || undefined,
      employmentType: data.employmentType || undefined,
      // #2: strukturierte Auswahl ist Source of Truth. Der Freitext
      // `qualification` wird aus den Labels gespiegelt (Persistenz-Träger +
      // Engine-/Presenter-Fallback). Nichts wählt → Freitext leeren.
      qualifications: data.qualifications ?? [],
      qualification:
        data.qualifications && data.qualifications.length > 0
          ? serializeQualifications(data.qualifications)
          : undefined,
      // Lane K: Geschlecht (Mutterschutz-Overlay-Trigger CL-77). Leer = nicht
      // erfasst → kein Overlay. Keine Engine-Wirkung (EC-10).
      gender: data.gender,
      guardIDNumber: data.guardIDNumber,
      employeeIDNumber: effectiveEmployeeId,
      useGuardAsEmployeeId: data.useGuardAsEmployeeId,
    };

    if (editingEmployee) {
      onUpdate?.(employee);
    } else {
      onAdd(employee);
    }
  };

  const handleReset = () => {
    reset({
      fullName: "",
      birthday: "",
      startDate: "",
      roleId: "",
      appointmentIds: [],
      bestelltAls: [],
      roleClasses: [],
      roleType: "",
      setKategorie: undefined,
      sdlScopes: [],
      drivesServiceVehicle: undefined,
      ersteHilfeGueltigBis: "",
      brandschutzGueltigBis: "",
      employmentType: "",
      qualifications: [],
      qualification: "",
      gender: undefined,
      guardIDNumber: "",
      employeeIDNumber: "",
      useGuardAsEmployeeId: false,
    });
    setOrgTitleOther(false);
    setSelectedRoleDocIds(new Set());
    setSelectedAppDocIds(new Set());
    setCollectionId(undefined);
    setLockedDocIds(new Set());
    setUnsupportedItems([]);
    onCancelEdit?.();
  };

  const coreDocCount = selectedRoleDocIds.size;
  const overlayDocCount = selectedAppDocIds.size;
  const totalRoleDocs = selectedRole?.documents.length || 0;
  const totalOverlayDocs = selectedAppointments.reduce(
    (acc, a) => acc + a.documents.length,
    0,
  );

  const showMaster = displayMode === "full" || displayMode === "master";
  const showDocuments = displayMode === "full" || displayMode === "documents";

  const formTitle =
    displayMode === "documents"
      ? "Dokumentauswahl"
      : editingEmployee
        ? "Mitarbeiterakte bearbeiten"
        : "Neue Mitarbeiterakte";
  const formSubtitle =
    displayMode === "documents"
      ? "Welche Vorlagen sollen für diese Person exportiert werden?"
      : displayMode === "master"
        ? "Name, Geburtsdatum und Beschäftigung — einmal pro Person."
        : "Configure profile details and assigned documentation for the employee.";

  const submitLabel =
    displayMode === "documents"
      ? "Dokumentauswahl speichern"
      : editingEmployee
        ? "Akte speichern"
        : "Akte anlegen";

  return (
    <Card variant="gradient" className="overflow-visible">
      <div className="flex items-center justify-between p-6 pb-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {formTitle}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{formSubtitle}</p>
        </div>
        {showMaster ? (
          <button
            type="button"
            onClick={handleReset}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
            title="Reset form"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="p-6 pt-4">
          <div
            className={
              showMaster && showDocuments
                ? "grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]"
                : "grid gap-6"
            }
          >
            {showMaster ? (
            <div className="space-y-6">
              {/* ═══ Personal Info ═══ */}
              <fieldset className="rounded-xl border border-gray-200 p-5 bg-white/60">
                <legend className="flex items-center gap-2 px-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <User className="h-4 w-4 text-blue-500" />
                  {displayMode === "master" ? "Person" : "Personal Information"}
                </legend>
                <div className="space-y-4 mt-2">
                  <FormField
                    label={displayMode === "master" ? "Name" : "Full Name"}
                    name="fullName"
                    id="fullName"
                    required
                    description="{FullName}"
                    error={errors.fullName?.message}
                  >
                    <Input
                      {...register("fullName")}
                      id="fullName"
                      placeholder="e.g. Johnathan Doe"
                      leftIcon={<User className="h-5 w-5" />}
                      hasError={!!errors.fullName}
                    />
                  </FormField>
                  <div
                    className={
                      displayMode === "master"
                        ? "space-y-4"
                        : "grid gap-4 sm:grid-cols-2"
                    }
                  >
                    <FormField
                      label={
                        displayMode === "master" ? "Geburtsdatum" : "Birthday"
                      }
                      name="birthday"
                      id="birthday"
                      description="{Birthday}"
                      required
                      error={errors.birthday?.message}
                    >
                      <Controller
                        name="birthday"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={
                              displayMode === "master"
                                ? "Geburtsdatum"
                                : "Select birthday"
                            }
                            hasError={!!errors.birthday}
                          />
                        )}
                      />
                    </FormField>
                    {displayMode !== "master" ? (
                    <FormField
                      label="Start Date"
                      name="startDate"
                      id="startDate"
                      description="{StartDate} placeholder"
                      required
                      error={errors.startDate?.message}
                    >
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select start date"
                            hasError={!!errors.startDate}
                          />
                        )}
                      />
                    </FormField>
                    ) : null}
                  </div>
                </div>
              </fieldset>

              {/* ═══ Rolle & Norm-Klasse ═══ */}
              <fieldset className="rounded-xl border border-gray-200 p-5 bg-white/60">
                <legend className="flex items-center gap-2 px-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <Briefcase className="h-4 w-4 text-indigo-500" />
                  {displayMode === "master"
                    ? "Rolle & Norm-Klasse"
                    : "Role & Training"}
                </legend>
                <div className="space-y-4 mt-2">
                  {displayMode === "master" ? (
                    <FormField
                      label="Vertragsbeginn"
                      name="startDate"
                      id="startDate"
                      description="Beginn des Arbeitsverhältnisses — Unterschrift folgt"
                      required
                      error={errors.startDate?.message}
                    >
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Vertragsbeginn"
                            hasError={!!errors.startDate}
                          />
                        )}
                      />
                    </FormField>
                  ) : null}

                  {displayMode === "master" ? (
                    <>
                      <FormField
                        label={ROLE_CLASS_LABEL_MULTI}
                        name="roleClasses"
                        id="roleClasses"
                        description="DIN 77200: EK (§3.10), FK (§3.11/§4.19.1) und Verwaltung frei kombinierbar, jede Klasse einzeln abwählbar. Leere Auswahl möglich. Maßgeblich fürs Pflicht-Set."
                        error={errors.roleClasses?.message}
                      >
                        <Controller
                          name="roleClasses"
                          control={control}
                          render={({ field }) => (
                            <RoleClassSelector
                              value={field.value ?? []}
                              onChange={field.onChange}
                              hasError={!!errors.roleClasses}
                            />
                          )}
                        />
                      </FormField>
                      <FormField
                        label="Org-Titel (optional)"
                        name="orgTitle"
                        id="orgTitle"
                        description="Anzeige/Org-Chart. Setzt eine Default-Norm-Klasse (überschreibbar). Schichtleitung/Objektleitung sind FK-Unter-Titel — nur wählbar, wenn Norm-Klasse Führungskraft (FK) gewählt ist."
                      >
                        <Select
                          options={[
                            ...visibleOrgTitles.map((o) => ({
                              id: o.id,
                              name: o.name,
                            })),
                            { id: ORG_TITLE_OTHER_ID, name: "andere (Freitext)" },
                          ]}
                          value={orgTitleSelectValue}
                          onChange={handleOrgTitleChange}
                          placeholder="Org-Titel wählen…"
                        />
                      </FormField>
                      {orgTitleOther ? (
                        <FormField
                          label="Org-Titel (Freitext)"
                          name="roleType"
                          id="roleType"
                          description="Frei benannter Org-Titel — keine Engine-Wirkung."
                        >
                          <Input
                            {...register("roleType")}
                            id="roleType"
                            placeholder="z. B. Teamleiter Empfang"
                            leftIcon={<Briefcase className="h-4 w-4" />}
                          />
                        </FormField>
                      ) : null}
                      <FormField
                        label="Vorlagen-Sammlung"
                        name="collectionId"
                        id="collectionId"
                        description="Vordefinierte oder eigene Sammlung — leitet die Dokument-Vorauswahl ab (überschreibbar)."
                      >
                        <Select
                          options={collections.map((c) => ({
                            id: c.id,
                            name: c.isSeed ? `${c.name} (vordefiniert)` : c.name,
                            description: c.description ?? undefined,
                          }))}
                          value={collectionId ?? ""}
                          onChange={handleCollectionChange}
                          placeholder="Sammlung wählen…"
                        />
                      </FormField>
                      <FormField
                        label="Dokumenten-Vorlage (Grundrolle)"
                        name="roleId"
                        id="roleId"
                        description="Core-Vorlagen-Rolle (aus der Set-Kategorie abgeleitet, manuell überschreibbar)."
                        required
                        error={errors.roleId?.message}
                      >
                        <Controller
                          name="roleId"
                          control={control}
                          render={({ field }) => (
                            <Select
                              options={roleOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Vorlagen-Rolle wählen…"
                              hasError={!!errors.roleId}
                            />
                          )}
                        />
                      </FormField>
                    </>
                  ) : (
                    <FormField
                      label="Role"
                      name="roleId"
                      id="roleId"
                      description="{RoleName}"
                      required
                      error={errors.roleId?.message}
                    >
                      <Controller
                        name="roleId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            options={roleOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select role"
                            hasError={!!errors.roleId}
                          />
                        )}
                      />
                    </FormField>
                  )}
                </div>
              </fieldset>

              {/* ═══ Einsatz & Anforderungen (Engine-Eingang) ═══ */}
              {displayMode === "master" ? (
                <fieldset className="rounded-xl border border-gray-200 p-5 bg-white/60">
                  <legend className="flex items-center gap-2 px-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <Shield className="h-4 w-4 text-indigo-500" />
                    Einsatz &amp; Anforderungen
                  </legend>
                  <div className="space-y-4 mt-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        label="Beschäftigungsart"
                        name="employmentType"
                        id="employmentType"
                        description="Vollzeit → 40 UE, sonst 24 UE (CL-11)."
                      >
                        <Controller
                          name="employmentType"
                          control={control}
                          render={({ field }) => (
                            <Select
                              options={[...BESCHAEFTIGUNGSART_OPTIONS]}
                              value={field.value ?? ""}
                              onChange={field.onChange}
                              placeholder="Beschäftigungsart wählen…"
                            />
                          )}
                        />
                      </FormField>
                      <FormField
                        label="Geschlecht (optional)"
                        name="gender"
                        id="gender"
                        description="Nur für den Mutterschutz-Hinweis (CL-77, MuSchG, fachlich prüfen). »weiblich« löst das Overlay aus. Keine Engine-Wirkung."
                      >
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <Select
                              options={[...GESCHLECHT_OPTIONS]}
                              value={field.value ?? ""}
                              onChange={(v) =>
                                field.onChange(v ? v : undefined)
                              }
                              placeholder="— nicht erfasst —"
                            />
                          )}
                        />
                      </FormField>
                      <FormField
                        label="Qualifikation"
                        name="qualifications"
                        id="qualifications"
                        description="Mehrfachauswahl — höchste Stufe zählt, Zusätze (z. B. Waffensachkunde) additiv."
                      >
                        <Controller
                          name="qualifications"
                          control={control}
                          render={({ field }) => (
                            <MultiSelect
                              options={QUALIFICATION_CATALOG.map((q) => ({
                                id: q.id,
                                name: q.label,
                                description: q.description,
                              }))}
                              value={field.value ?? []}
                              onChange={field.onChange}
                              placeholder="Unterrichtung / Sachkunde §34a, GSSK, Fachkraft, Waffensachkunde …"
                            />
                          )}
                        />
                      </FormField>
                    </div>
                    <FormField
                      label="SDL / Geltungsbereich"
                      name="sdlScopes"
                      id="sdlScopes"
                      description="Eingang der Pflicht-Engine — Mehrfachauswahl."
                    >
                      <Controller
                        name="sdlScopes"
                        control={control}
                        render={({ field }) => (
                          <MultiSelect
                            options={SDL_SCOPE_CATALOG.map((s) => ({
                              id: s.id,
                              name: s.name,
                              description: s.geltungsbereich,
                            }))}
                            value={field.value ?? []}
                            onChange={field.onChange}
                            placeholder="DIN 77200-1/-2, Veranstaltung, Objekt, Asyl …"
                          />
                        )}
                      />
                    </FormField>
                    <FormField
                      label="Fährt Dienstfahrzeug?"
                      name="drivesServiceVehicle"
                      id="drivesServiceVehicle"
                      description="Ja → Fahrer-/UVV-Unterweisung (fachlich prüfen, CL-73)."
                    >
                      <Controller
                        name="drivesServiceVehicle"
                        control={control}
                        render={({ field }) => (
                          <Select
                            options={[...DIENSTFAHRZEUG_OPTIONS]}
                            value={
                              field.value === true
                                ? "ja"
                                : field.value === false
                                  ? "nein"
                                  : ""
                            }
                            onChange={(v) =>
                              field.onChange(
                                v === "ja" ? true : v === "nein" ? false : undefined,
                              )
                            }
                            placeholder="unbekannt"
                          />
                        )}
                      />
                    </FormField>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        label="Erste Hilfe gültig bis"
                        name="ersteHilfeGueltigBis"
                        id="ersteHilfeGueltigBis"
                        description="2-Jahres-Frist (CL-08)."
                      >
                        <Controller
                          name="ersteHilfeGueltigBis"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              value={field.value ?? ""}
                              onChange={field.onChange}
                              placeholder="Ablaufdatum Erste Hilfe"
                            />
                          )}
                        />
                      </FormField>
                      <FormField
                        label="Brandschutzhelfer gültig bis"
                        name="brandschutzGueltigBis"
                        id="brandschutzGueltigBis"
                        description="3-Jahres-Frist (CL-23)."
                      >
                        <Controller
                          name="brandschutzGueltigBis"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              value={field.value ?? ""}
                              onChange={field.onChange}
                              placeholder="Ablaufdatum Brandschutzhelfer"
                            />
                          )}
                        />
                      </FormField>
                    </div>
                  </div>
                </fieldset>
              ) : null}

              {/* ═══ Identification ═══ */}
              <fieldset className="rounded-xl border border-gray-200 p-5 bg-white/60">
                <legend className="flex items-center gap-2 px-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  {displayMode === "master" ? "Identifikation" : "Identification"}
                </legend>
                <div className="space-y-4 mt-2">
                  <FormField
                    label={
                      displayMode === "master"
                        ? "Bewacher-ID (Security ID)"
                        : "Guard ID Number"
                    }
                    name="guardIDNumber"
                    id="guardIDNumber"
                    description="{GuardIDNumber}"
                  >
                    <Input
                      {...register("guardIDNumber")}
                      id="guardIDNumber"
                      placeholder="e.g. GRD-001234"
                      leftIcon={<Shield className="h-4 w-4" />}
                    />
                  </FormField>

                  {/* Checkbox: Use Guard ID as Employee ID */}
                  <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors select-none">
                    <Controller
                      name="useGuardAsEmployeeId"
                      control={control}
                      render={({ field }) => (
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={field.value}
                          onClick={() => field.onChange(!field.value)}
                          className={`flex h-5 w-5 items-center justify-center rounded border-2 shrink-0 transition-colors cursor-pointer ${
                            field.value
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-gray-300 bg-white hover:border-gray-400"
                          }`}
                        >
                          {field.value && (
                            <Check
                              className="h-3 w-3 text-white"
                              strokeWidth={3}
                            />
                          )}
                        </button>
                      )}
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Use Guard ID as Employee ID
                      </span>
                      <p className="text-xs text-gray-400">
                        The Guard ID Number will be used as the Employee ID
                      </p>
                    </div>
                  </label>

                  <FormField
                    label={
                      displayMode === "master"
                        ? "Dienstausweisnummer"
                        : "Employee ID Number"
                    }
                    name="employeeIDNumber"
                    id="employeeIDNumber"
                    description="{EmployeeIDNumber}"
                  >
                    <Input
                      {...register("employeeIDNumber")}
                      id="employeeIDNumber"
                      placeholder={
                        useGuardAsEmployeeId
                          ? "← Using Guard ID"
                          : "e.g. EMP-005678"
                      }
                      leftIcon={<Hash className="h-4 w-4" />}
                      disabled={useGuardAsEmployeeId}
                      className={
                        useGuardAsEmployeeId ? "opacity-60 !bg-gray-100" : ""
                      }
                    />
                  </FormField>
                </div>
              </fieldset>

              {/* ═══ Appointments ═══ */}
              <fieldset className="rounded-xl border border-gray-200 p-5 bg-white/60">
                <legend className="flex items-center gap-2 px-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  {displayMode === "master"
                    ? "Bestellungen"
                    : "Appointments / Overlays"}
                </legend>
                <div className="mt-2">
                  {displayMode === "master" ? (
                    <p className="mb-3 text-xs text-gray-500">
                      {ZUSATZBESTELLUNGEN_HINT}
                    </p>
                  ) : null}
                  {/* Lane N P1 (#1): „bestellt als …" = die DREI formalen
                      Ernennungen, DIREKT aus BESTELLUNG_DEFS (CL-08/CL-23/CL-74),
                      persistiert als `bestelltAls`. NICHT mehr aus nicht-existenten
                      Appointment-IDs. Beim Speichern reconcilet handleFormSubmit
                      die Generator-Auswahl (appointmentIds + Doc-Chips). */}
                  {displayMode === "master" ? (
                    <FormField
                      label="Bestellt als (formale Ernennung)"
                      name="bestelltAls"
                      id="bestelltAls"
                      description="Ersthelfer (CL-08) / Brandschutzhelfer (CL-23) / SiBe (CL-74) — unterschriftspflichtig. Bestellung ≠ Schulung. Steuert die Bestell-Vorlagen im Generator."
                    >
                      <Controller
                        name="bestelltAls"
                        control={control}
                        render={({ field }) => (
                          <MultiSelect
                            options={BESTELLUNG_DEFS.map((d) => ({
                              id: d.typ,
                              name: `${d.label} (${d.clauseId})`,
                              description: d.schulungHint,
                            }))}
                            value={field.value ?? []}
                            onChange={field.onChange}
                            placeholder="Ersthelfer, Brandschutzhelfer, SiBe …"
                          />
                        )}
                      />
                    </FormField>
                  ) : null}
                  <FormField
                    label={
                      displayMode === "master"
                        ? "Weitere Termine / Overlays (optional)"
                        : "Select Appointments"
                    }
                    name="appointmentIds"
                    id="appointmentIds"
                    error={errors.appointmentIds?.message}
                  >
                    <Controller
                      name="appointmentIds"
                      control={control}
                      render={({ field }) => (
                        <MultiSelect
                          options={appointmentOptions}
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Select appointment type"
                          hasError={!!errors.appointmentIds}
                        />
                      )}
                    />
                  </FormField>
                </div>
              </fieldset>
            </div>
            ) : null}

            {showDocuments ? (
            <div
              className={
                showMaster
                  ? "space-y-6 overflow-y-auto pr-1 custom-scrollbar lg:max-h-[calc(100vh-10rem)] lg:sticky lg:top-24 lg:self-start"
                  : "space-y-6"
              }
            >
              {/* #D — Set-Kategorie direkt im Generator wählbar (steuert das
                  Core-Vorlagen-Set). Eigene Vorlagen-Achse, NICHT die
                  Norm-Klasse, NICHT der Org-Titel. */}
              <div className="rounded-xl border border-gray-200 bg-white/60 p-4">
                <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-gray-700">
                  Vorlagen-Set
                </h3>
                <p className="mb-3 text-xs text-gray-500">
                  Vorlagen-Sammlung wählen → leitet die Dokument-Vorauswahl ab
                  (Pflicht = gesperrt, optional umschaltbar). Bestellungen +
                  Fahr-Anweisung bleiben positionsunabhängige Overlays.
                </p>
                <Select
                  options={collections.map((c) => ({
                    id: c.id,
                    name: c.isSeed ? `${c.name} (vordefiniert)` : c.name,
                    description: c.description ?? undefined,
                  }))}
                  value={collectionId ?? ""}
                  onChange={handleCollectionChange}
                  placeholder="Sammlung wählen…"
                />
                {unsupportedItems.length > 0 && (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs font-medium text-amber-800">
                      {unsupportedItems.length} Posten der Sammlung sind hier
                      nicht vorausgewählt:
                    </p>
                    <ul className="mt-1 list-disc pl-5 text-[11px] text-amber-700">
                      {unsupportedItems.map((u, i) => (
                        <li key={`${u.label}-${i}`}>
                          {u.label} — {u.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <ul className="mt-3 space-y-1">
                  {OVERLAY_DEFS.map((o) => (
                    <li
                      key={o.typ}
                      className="flex items-start gap-2 text-xs text-gray-500"
                    >
                      <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      <span>
                        <span className="font-medium text-gray-600">
                          {o.label}
                        </span>
                        {o.clauseId ? (
                          <span className="ml-1 rounded bg-amber-100 px-1 text-[0.65rem] font-semibold text-amber-700">
                            {o.clauseId}
                            {o.fachlichPruefen ? " · fachlich prüfen" : ""}
                          </span>
                        ) : null}
                        <span className="block text-gray-400">{o.hint}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Core Documents (Role) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Core Documents
                  </h3>
                  {totalRoleDocs > 0 && (
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      {coreDocCount}/{totalRoleDocs}
                    </span>
                  )}
                </div>
                {selectedRole && totalRoleDocs > 0 && (
                  <div className="mb-2 flex gap-2">
                    <button
                      type="button"
                      onClick={selectAllRoleDocs}
                      className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={deselectAllRoleDocs}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Deselect All
                    </button>
                  </div>
                )}
                {selectedRole ? (
                  <div className="space-y-2">
                    {selectedRole.documents.map((doc) => {
                      const isChecked = selectedRoleDocIds.has(doc.id);
                      const locked = lockedDocIds.has(doc.id);
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          disabled={locked}
                          onClick={() => {
                            if (!locked) toggleRoleDoc(doc.id);
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 shadow-sm transition-all ${
                            locked ? "cursor-not-allowed" : "cursor-pointer"
                          } ${
                            isChecked
                              ? "border-blue-200 bg-white hover:border-blue-300 hover:shadow-md"
                              : "border-gray-200 bg-gray-50 opacity-60 hover:opacity-80"
                          }`}
                        >
                          <FolderOpen
                            className={`h-5 w-5 shrink-0 ${
                              isChecked ? "text-blue-500" : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`flex-1 text-left text-sm font-medium ${
                              isChecked
                                ? "text-gray-700"
                                : "text-gray-400 line-through"
                            }`}
                          >
                            {doc.name}
                          </span>
                          {locked && (
                            <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                              Pflicht
                            </span>
                          )}
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                              isChecked
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {isChecked && (
                              <Check
                                className="h-3 w-3 text-white"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
                    <FileText className="mx-auto h-8 w-8 text-gray-300" />
                    <p className="text-sm text-gray-400">
                      Select a role to see associated documents
                    </p>
                  </div>
                )}
              </div>

              {/* Overlay Documents (Appointments) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Overlay Documents
                  </h3>
                  {totalOverlayDocs > 0 && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      {overlayDocCount}/{totalOverlayDocs}
                    </span>
                  )}
                </div>
                {totalOverlayDocs > 0 && (
                  <div className="mb-2 flex gap-2">
                    <button
                      type="button"
                      onClick={selectAllAppDocs}
                      className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={deselectAllAppDocs}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Deselect All
                    </button>
                  </div>
                )}
                {selectedAppointments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedAppointments.map((appointment) =>
                      appointment.documents.map((doc) => {
                        const isChecked = selectedAppDocIds.has(doc.id);
                        const locked = lockedDocIds.has(doc.id);
                        return (
                          <button
                            key={doc.id}
                            type="button"
                            disabled={locked}
                            onClick={() => {
                              if (!locked) toggleAppDoc(doc.id);
                            }}
                            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 shadow-sm transition-all ${
                              locked ? "cursor-not-allowed" : "cursor-pointer"
                            } ${
                              isChecked
                                ? "border-emerald-200 bg-white hover:border-emerald-300 hover:shadow-md"
                                : "border-gray-200 bg-gray-50 opacity-60 hover:opacity-80"
                            }`}
                          >
                            <FolderOpen
                              className={`h-5 w-5 shrink-0 ${
                                isChecked ? "text-emerald-500" : "text-gray-400"
                              }`}
                            />
                            <div className="flex-1 text-left">
                              <span
                                className={`text-sm font-medium ${
                                  isChecked
                                    ? "text-gray-700"
                                    : "text-gray-400 line-through"
                                }`}
                              >
                                {doc.name}
                              </span>
                              <span className="ml-2 text-xs text-gray-400">
                                ({appointment.name})
                              </span>
                              {locked && (
                                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                  Pflicht
                                </span>
                              )}
                            </div>
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                                isChecked
                                  ? "border-emerald-500 bg-emerald-500"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {isChecked && (
                                <Check
                                  className="h-3 w-3 text-white"
                                  strokeWidth={3}
                                />
                              )}
                            </div>
                          </button>
                        );
                      }),
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
                    <FileText className="mx-auto h-8 w-8 text-gray-300" />
                    <p className="text-sm text-gray-400">
                      Select appointments to see overlay documents
                    </p>
                  </div>
                )}
              </div>
            </div>
            ) : null}
          </div>
        </CardContent>

        {/* P3 / #6 (Mark D2) — Nachweis-Upload direkt im Formular beim
            Bearbeiten einer bereits gespeicherten Person. Nur Master-Modus +
            persistierte Person (ID) + Upload-Handler. Bewusst AUSSERHALB des
            <form>-Submit-Pfads (type="button"). EC-10: eingehend `unchecked`. */}
        {showMaster &&
        editingEmployee?.id &&
        onEvidenceUpload &&
        evidenceFiles ? (
          <FormEvidenceUploadSection
            evidenceFiles={evidenceFiles}
            onUpload={onEvidenceUpload}
            onRemove={onEvidenceRemove}
          />
        ) : null}

        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<UserPlus className="h-4 w-4" />}
              className="w-full sm:w-auto !from-orange-500 !to-orange-600 !shadow-orange-500/25 hover:!shadow-orange-500/40"
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

EmployeeForm.displayName = "EmployeeForm";

/**
 * P3 / #6 (Mark D2) — kompakter Nachweis-Upload-Block für das Bearbeiten-Formular
 * einer bereits gespeicherten Person. Nutzt die bestehende Evidence-Infra über
 * die durchgereichten Handler (kein neues Storage-Modell). Drei häufige Kern-
 * Slots; weitere/feinere Nachweise + Prüf-Toggle bleiben in der Akte/im Dossier.
 * EC-10: eingehende Nachweise sind `unchecked`; die fachliche Prüfung (#7) erfolgt
 * über den Admin-Toggle in der Akte — hier wird KEIN Status gesetzt.
 */
const FORM_EVIDENCE_SLOTS: { id: string; label: string }[] = [
  { id: "arbeitsvertrag", label: "Arbeitsvertrag / Beschäftigungsnachweis" },
  { id: "schulungsnachweise", label: "Schulungsnachweise" },
  { id: "unterweisungsnachweise", label: "Unterweisungsnachweise" },
];

const FormEvidenceUploadSection: React.FC<{
  evidenceFiles: EmployeeEvidenceMap;
  onUpload: (evidenceId: string, file: File) => void;
  onRemove?: (evidenceId: string) => void;
}> = ({ evidenceFiles, onUpload, onRemove }) => {
  return (
    <div className="border-t border-gray-200 px-6 py-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Upload className="h-4 w-4 text-orange-500" />
        Nachweise hochladen
      </p>
      <p className="mt-0.5 text-xs text-gray-400">
        Person ist gespeichert — PDFs direkt anhängen. Eingehende Nachweise gelten
        als ungeprüft; die fachliche Prüfung erfolgt in der Akte.
      </p>
      <ul className="mt-3 space-y-2">
        {FORM_EVIDENCE_SLOTS.map((slot) => {
          const stored = evidenceFiles[slot.id];
          return (
            <li
              key={slot.id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2"
            >
              <FileText
                className={`h-5 w-5 shrink-0 ${stored ? "text-orange-500" : "text-gray-300"}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-gray-700">
                  {slot.label}
                </p>
                <p className="text-[10px] text-gray-400">
                  {stored ? `${stored.fileName} · ungeprüft` : "Noch keine Datei"}
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-2 py-1 text-[11px] font-semibold text-orange-700 hover:bg-orange-100">
                <Upload className="h-3 w-3" />
                {stored ? "Ersetzen" : "Hochladen"}
                <input
                  type="file"
                  accept=".pdf,application/pdf,image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUpload(slot.id, file);
                    e.target.value = "";
                  }}
                />
              </label>
              {stored && onRemove ? (
                <button
                  type="button"
                  onClick={() => onRemove(slot.id)}
                  className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  title="Datei entfernen"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

FormEvidenceUploadSection.displayName = "FormEvidenceUploadSection";
