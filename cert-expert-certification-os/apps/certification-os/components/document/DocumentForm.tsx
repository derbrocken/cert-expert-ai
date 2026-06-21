"use client";
"use no memo";
import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  modelFormSchema,
  ModelFormData,
} from "@/lib/validations/model-form";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  FormField,
  Input,
  MultiSelect,
  Select,
  FileDropzone,
  DatePicker,
} from "@/components/ui";
import {
  fetchCompaniesAction,
  fetchExportSettingsAction,
} from "@/app/actions/employee-file-actions";
import { mapProfileToTool1Fields } from "@/app/actions/tool1-company-profile";
import {
  LOGO_MAX_BYTES,
  LOGO_MAX_SIZE_LABEL,
  logoSizeErrorMessage,
} from "@/lib/constants/logo-upload";
import {
  FileText,
  Building2,
  UserCheck,
  Sparkles,
  Download,
  RotateCcw,
  Hash,
  User,
  MapPin,
  Globe,
  FolderOpen,
} from "lucide-react";

export interface StandardModelFolder {
  id: string;
  name: string;
  documents: { id: string; name: string; fileName: string }[];
}

export interface DocumentFormProps {
  onSubmit: (data: FormData) => void;
  onReset?: () => void;
  isPending: boolean;
  hasDocument: boolean;
  zipBase64?: string;
  error?: string;
  /** Übersprungene Vorlagen (defekt) — ZIP enthält den Rest */
  skipped?: string[];
  /** Called when user clicks a folder pill */
  onFolderClick?: (folder: StandardModelFolder) => void;
  /** Active folder (highlighted in the list) */
  activeFolderId?: string | null;
  /** Externally managed set of excluded doc IDs */
  excludedDocIds?: Set<string>;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  onSubmit,
  onReset,
  isPending,
  hasDocument,
  zipBase64,
  error,
  skipped,
  onFolderClick,
  activeFolderId,
  excludedDocIds,
}) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoSizeError, setLogoSizeError] = useState<string | null>(null);
  const [folders, setFolders] = useState<StandardModelFolder[]>([]);
  const [foldersLoaded, setFoldersLoaded] = useState(false);
  const [foldersLoadError, setFoldersLoadError] = useState<string | null>(null);

  // P1: zentrales Firmen-Profil (gemeinsam mit Tool 2)
  const [companies, setCompanies] = useState<
    { slug: string; displayName: string }[]
  >([]);
  const [selectedCompanySlug, setSelectedCompanySlug] = useState<string>("");
  const [profileLogoPreview, setProfileLogoPreview] = useState<string | null>(
    null,
  );
  const [companyLoading, setCompanyLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchCompaniesAction()
      .then((list) => {
        if (!cancelled) setCompanies(list);
      })
      .catch(() => {
        if (!cancelled) setCompanies([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    fetch("/api/standard-models", { signal: controller.signal })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setFoldersLoadError(
            data.detail ||
              data.error ||
              `Standard models could not be loaded (${res.status}).`,
          );
          setFolders([]);
          return;
        }
        setFoldersLoadError(null);
        setFolders(data.folders || []);
      })
      .catch((err: unknown) => {
        const isAbort = err instanceof DOMException && err.name === "AbortError";
        setFoldersLoadError(
          isAbort
            ? "Timeout beim Laden der Ordner. Dev-Server prüfen (http://localhost:3001/generator)."
            : "Standard-Model-Ordner konnten nicht geladen werden.",
        );
        setFolders([]);
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
        setFoldersLoaded(true);
      });

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<ModelFormData>({
    resolver: zodResolver(modelFormSchema),
    mode: "onChange",
    defaultValues: {
      folders: [],
      docVersion: "",
      createdBy: "",
      approvedBy: "",
      docDate: "",
      companyName: "",
      companyStreet: "",
      companyZip: "",
      companyCity: "",
      companyCountry: "",
      companyAddressLine: "",
    },
  });

  const selectedFolders = watch("folders");

  const folderOptions = useMemo(
    () => folders.map((f) => ({ id: f.id, name: f.name })),
    [folders]
  );

  const selectedFolderObjects = useMemo(
    () => folders.filter((f) => selectedFolders?.includes(f.id)),
    [folders, selectedFolders]
  );

  // Count included docs (excluding excluded ones)
  const totalDocs = selectedFolderObjects.reduce((acc, f) => {
    const included = f.documents.filter(
      (d) => !excludedDocIds?.has(d.id)
    ).length;
    return acc + included;
  }, 0);

  // P1: Firma gewählt → Felder + Logo-Vorschau aus zentralem Profil vorbefüllen (überschreibbar)
  const handleCompanyChange = async (slug: string) => {
    setSelectedCompanySlug(slug);
    if (!slug) {
      setProfileLogoPreview(null);
      return;
    }
    setCompanyLoading(true);
    try {
      const props = await fetchExportSettingsAction(slug);
      const f = mapProfileToTool1Fields(props);
      const opts = { shouldValidate: true, shouldDirty: true } as const;
      setValue("companyName", f.companyName, opts);
      setValue("companyAddressLine", f.companyAddressLine, opts);
      setValue("docVersion", f.docVersion, opts);
      setValue("docDate", f.docDate, opts);
      setValue("createdBy", f.createdBy, opts);
      setValue("approvedBy", f.approvedBy, opts);
      setProfileLogoPreview(props.companyLogo ?? null);
    } catch {
      setProfileLogoPreview(null);
    } finally {
      setCompanyLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setLogoFile(null);
    setLogoSizeError(null);
    setSelectedCompanySlug("");
    setProfileLogoPreview(null);
    onReset?.();
  };

  const handleLogoSelect = (file: File | null) => {
    if (file && file.size > LOGO_MAX_BYTES) {
      setLogoFile(null);
      setLogoSizeError(logoSizeErrorMessage(file.size));
      return;
    }
    setLogoSizeError(null);
    setLogoFile(file);
  };

  const handleFormSubmit = (data: ModelFormData) => {
    if (logoFile && logoFile.size > LOGO_MAX_BYTES) {
      setLogoSizeError(logoSizeErrorMessage(logoFile.size));
      return;
    }

    const formData = new FormData();
    formData.append("folders", JSON.stringify(data.folders));
    // P1: gewählte Firma → Server zieht Logo (und ggf. Profil) aus CompanyExportSettings
    if (selectedCompanySlug) formData.append("companySlug", selectedCompanySlug);
    // Pass excluded doc IDs so server can skip them
    if (excludedDocIds && excludedDocIds.size > 0) {
      formData.append(
        "excludedDocIds",
        JSON.stringify(Array.from(excludedDocIds))
      );
    }
	
    formData.append("docVersion", data.docVersion);
    formData.append("createdBy", data.createdBy);
    formData.append("approvedBy", data.approvedBy);
    formData.append("docDate", data.docDate);
    formData.append("companyName", data.companyName);
    if (data.companyStreet) formData.append("companyStreet", data.companyStreet);
    if (data.companyZip) formData.append("companyZip", data.companyZip);
    if (data.companyCity) formData.append("companyCity", data.companyCity);
    if (data.companyCountry)
      formData.append("companyCountry", data.companyCountry);
    if (data.companyAddressLine)
      formData.append("companyAddressLine", data.companyAddressLine);
    if (logoFile) formData.append("logo", logoFile);
    onSubmit(formData);
  };

  const handleDownloadZip = () => {
    if (!zipBase64) return;
    const byteCharacters = atob(zipBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `standard-models-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card variant="gradient" className="h-fit sticky top-20 sm:top-24">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 sm:h-12 sm:w-12">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-2xl">
              Dokument-Generator
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Standard-Model-Ordner wählen, Platzhalter ausfüllen, als ZIP laden
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-6">
          {/* ═══ Firma (zentrales Profil — gemeinsam mit Tool 2) ═══ */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              <Building2 className="h-4 w-4 text-orange-500" />
              Firma
              <span className="text-[10px] font-medium text-gray-400 normal-case">
                (zentrales Profil)
              </span>
            </h3>
            <FormField
              label="Firma wählen"
              name="company"
              description="Firmendaten + Logo automatisch aus dem zentralen Profil vorausfüllen (überschreibbar)"
            >
              <Select
                options={companies.map((c) => ({
                  id: c.slug,
                  name: c.displayName,
                }))}
                value={selectedCompanySlug}
                onChange={handleCompanyChange}
                placeholder={
                  companies.length
                    ? "Firma wählen…"
                    : "Keine Firmen vorhanden"
                }
                disabled={companies.length === 0}
              />
            </FormField>
            {companyLoading && (
              <p className="mt-2 text-xs text-gray-400">Profil wird geladen…</p>
            )}
            {selectedCompanySlug && !companyLoading && (
              <p className="mt-2 text-xs text-emerald-600">
                Firmendaten vorausgefüllt — Felder unten sind überschreibbar.
              </p>
            )}
          </div>

          {/* ═══ Standard Model Selection ═══ */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              <FolderOpen className="h-4 w-4 text-blue-500" />
              Standard-Models
            </h3>
            <FormField
              label="Ordner auswählen"
              name="folders"
              required
              error={errors.folders?.message}
              description="Zu verarbeitende Ordner wählen"
            >
              <MultiSelect
                options={folderOptions}
                value={selectedFolders || []}
                onChange={(value) => setValue("folders", value)}
                placeholder={
                  foldersLoaded
                    ? "Standard-Model-Ordner wählen…"
                    : "Ordner werden geladen…"
                }
                hasError={!!errors.folders}
              />
            </FormField>

            {foldersLoadError && (
              <p className="mt-2 text-sm text-red-600">{foldersLoadError}</p>
            )}

            {foldersLoaded && !foldersLoadError && folders.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                Noch keine Standard-Models in der Storage. Ordner über den
                Upload-Manager → Standard-Models hochladen.
              </p>
            )}

            {/* Clickable folder pills */}
            {selectedFolderObjects.length > 0 && (
              <div className="mt-3 space-y-1.5 max-h-44 overflow-y-auto custom-scrollbar">
                {selectedFolderObjects.map((folder) => {
                  const includedCount = folder.documents.filter(
                    (d) => !excludedDocIds?.has(d.id),
                  ).length;
                  const isActive = activeFolderId === folder.id;
                  return (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => onFolderClick?.(folder)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 transition-all cursor-pointer ${
                        isActive
                          ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200 shadow-md"
                          : "border-blue-100 bg-blue-50/50 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <FolderOpen
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-blue-600" : "text-blue-400"
                        }`}
                      />
                      <span
                        className={`flex-1 text-left text-sm font-medium ${
                          isActive ? "text-blue-800" : "text-gray-700"
                        }`}
                      >
                        {folder.name}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          includedCount < folder.documents.length
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {includedCount}/{folder.documents.length}
                      </span>
                    </button>
                  );
                })}
                <p className="text-xs text-gray-400 pt-1">
                  Ordner anklicken, um seine Dokumente zu sehen & zu filtern →
                </p>
              </div>
            )}
          </div>

          {/* ═══ Header Placeholder ═══ */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              <FileText className="h-4 w-4 text-purple-500" />
              Kopfzeile
            </h3>
            <FormField
              label="Firmenlogo"
              name="logo"
              description={`Optional — ersetzt Platzhalter {Logo} (max. ${LOGO_MAX_SIZE_LABEL})`}
              error={logoSizeError ?? undefined}
            >
              <FileDropzone
                onFileSelect={handleLogoSelect}
                onReject={(message) => {
                  setLogoFile(null);
                  setLogoSizeError(message);
                }}
                value={logoFile}
                maxSize={LOGO_MAX_BYTES}
                accept={{ "image/*": [".png", ".jpg", ".jpeg", ".svg"] }}
                placeholder="Logo hier ablegen"
                description={`PNG, JPG oder SVG bis ${LOGO_MAX_SIZE_LABEL}`}
                hasError={!!logoSizeError}
              />
            </FormField>
            {profileLogoPreview && !logoFile && (
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profileLogoPreview}
                  alt="Firmenlogo aus Profil"
                  className="h-10 w-auto object-contain"
                />
                <p className="text-xs text-gray-500">
                  Logo aus Firmenprofil — wird verwendet, sofern kein neues
                  hochgeladen wird.
                </p>
              </div>
            )}
          </div>

          {/* ═══ Footer Metadata ═══ */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              <Hash className="h-4 w-4 text-indigo-500" />
              Fußzeile / Metadaten
            </h3>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Dokumentversion"
                  name="docVersion"
                  id="docVersion"
                  required
                  description="Platzhalter {DocVersion}"
                  error={errors.docVersion?.message}
                >
                  <Input
                    id="docVersion"
                    {...register("docVersion")}
                    placeholder="z. B. v1.0"
                    leftIcon={<Hash className="h-4 w-4" />}
                    hasError={!!errors.docVersion}
                  />
                </FormField>
                <FormField
                  label="Dokumentdatum"
                  name="docDate"
                  description="Platzhalter {DocDate}"
                  required
                  error={errors.docDate?.message}
                >
                  <Controller
                    name="docDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Datum wählen"
                        hasError={!!errors.docDate}
                      />
                    )}
                  />
                </FormField>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Erstellt von"
                  name="createdBy"
                  id="createdBy"
                  description="Platzhalter {CreatedBy}"
                  required
                  error={errors.createdBy?.message}
                >
                  <Input
                    {...register("createdBy")}
                    id="createdBy"
                    placeholder="Name des Erstellers"
                    leftIcon={<User className="h-4 w-4" />}
                    hasError={!!errors.createdBy}
                  />
                </FormField>
                <FormField
                  label="Freigegeben von"
                  name="approvedBy"
                  id="approvedBy"
                  description="Platzhalter {ApprovedBy}"
                  required
                  error={errors.approvedBy?.message}
                >
                  <Input
                    {...register("approvedBy")}
                    id="approvedBy"
                    placeholder="Name des Freigebenden"
                    leftIcon={<UserCheck className="h-4 w-4" />}
                    hasError={!!errors.approvedBy}
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* ═══ Company Data (Global) ═══ */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              <Building2 className="h-4 w-4 text-orange-500" />
              Firmendaten
              <span className="text-[10px] font-medium text-gray-400 normal-case">
                (global)
              </span>
            </h3>
            <div className="space-y-4">
              <FormField
                label="Firmenname"
                name="companyName"
                id="companyName"
                description="Platzhalter {CompanyName}"
                required
                error={errors.companyName?.message}
              >
                <Input
                  {...register("companyName")}
                  id="companyName"
                  placeholder="Muster GmbH"
                  leftIcon={<Building2 className="h-4 w-4" />}
                  hasError={!!errors.companyName}
                />
              </FormField>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  description="Platzhalter {CompanyStreet}"
                  label="Straße"
                  name="companyStreet"
                  id="companyStreet"
                >
                  <Input
                    {...register("companyStreet")}
                    id="companyStreet"
                    placeholder="Musterstraße 1"
                    leftIcon={<MapPin className="h-4 w-4" />}
                  />
                </FormField>
                <FormField
                  description="Platzhalter {CompanyZip}"
                  label="PLZ"
                  name="companyZip"
                  id="companyZip"
                >
                  <Input
                    id="companyZip"
                    {...register("companyZip")}
                    placeholder="12345"
                  />
                </FormField>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  description="Platzhalter {CompanyCity}"
                  label="Stadt"
                  name="companyCity"
                  id="companyCity"
                >
                  <Input
                    id="companyCity"
                    {...register("companyCity")}
                    placeholder="Berlin"
                  />
                </FormField>
                <FormField
                  description="Platzhalter {CompanyCountry}"
                  label="Land"
                  name="companyCountry"
                  id="companyCountry"
                >
                  <Input
                    id="companyCountry"
                    {...register("companyCountry")}
                    placeholder="Deutschland"
                    leftIcon={<Globe className="h-4 w-4" />}
                  />
                </FormField>
              </div>
              <FormField
                label="Vollständige Adresszeile"
                name="companyAddressLine"
                id="companyAddressLine"
                description="Kombinierte Adresse (füllt {CompanyAddressLine})"
              >
                <Input
                  id="companyAddressLine"
                  {...register("companyAddressLine")}
                  placeholder="Musterstraße 1, 12345 Berlin, Deutschland"
                />
              </FormField>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Skipped templates note (EC-09: ZIP wurde trotzdem erzeugt) */}
          {skipped && skipped.length > 0 && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm font-medium text-amber-800">
                {skipped.length} Vorlage{skipped.length !== 1 ? "n" : ""} konnte
                {skipped.length !== 1 ? "n" : ""} nicht verarbeitet werden und
                wurde{skipped.length !== 1 ? "n" : ""} übersprungen. Das ZIP
                enthält die übrigen Dokumente.
              </p>
              <ul className="mt-2 list-disc pl-5 text-xs text-amber-700">
                {skipped.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Button
            type="submit"
            isLoading={isPending}
            className="w-full cursor-pointer"
            size="lg"
            leftIcon={<Sparkles className="h-5 w-5" />}
          >
            {isPending
              ? "Wird generiert…"
              : `${totalDocs > 0 ? `${totalDocs} Dokumente` : "Dokumente"} generieren`}
          </Button>

          {hasDocument && zipBase64 && (
            <div className="flex w-full gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleDownloadZip}
                leftIcon={<Download className="h-5 w-5" />}
              >
                ZIP herunterladen
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={handleReset}
                leftIcon={<RotateCcw className="h-5 w-5" />}
              >
                Neu starten
              </Button>
            </div>
          )}

          {!hasDocument && (
            <Button
              type="button"
              variant="ghost"
              className="w-full cursor-pointer"
              onClick={handleReset}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Formular leeren
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

DocumentForm.displayName = "DocumentForm";
