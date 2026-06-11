"use client";

/**
 * P3a — Admin-Verwaltung editierbarer Sammlungen (Document Collections).
 * Eigene Sektion im Upload-Manager. Reine Verwaltung — KEIN Mitarbeiter-
 * Formular-Konsum (= P3b), KEINE Generator-Änderung (EC-09). EC-10: keine
 * Freigabe-Aussage.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Layers, Plus, Copy, Pencil, Trash2, X, Save } from "lucide-react";
import {
  Button,
  Input,
  Select,
  FormField,
  Toast,
  type ToastProps,
} from "@/components/ui";
import {
  fetchCollectionsAction,
  createCollectionAction,
  updateCollectionAction,
  deleteCollectionAction,
  cloneCollectionAction,
} from "@/app/actions/collection-actions";
import type { CollectionDto } from "@/lib/document-collection-repository";

const INCLUSION_OPTIONS = [
  { id: "mandatory", name: "Pflicht (gesperrt an)" },
  { id: "optional-on", name: "Optional (vorausgewählt)" },
  { id: "optional-off", name: "Optional (aus)" },
];

const DATE_SOURCE_OPTIONS = [
  { id: "startDate", name: "Einstellungsdatum" },
  { id: "manual", name: "Manuell" },
];

interface DraftItem {
  key: string;
  templateLogicalPath: string | null;
  label: string;
  inclusion: string;
  dateSource: string;
  clauseId: string | null;
  templateMissing: boolean;
}

interface TemplateOption {
  id: string; // logical path
  name: string; // "Kategorie · Ordner · Datei"
}

type EditorState =
  | { mode: "closed" }
  | { mode: "new" }
  | { mode: "edit"; id: string };

export const CollectionsManager: React.FC = () => {
  const [collections, setCollections] = useState<CollectionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Pick<ToastProps, "message" | "type"> | null>(
    null,
  );
  const [editor, setEditor] = useState<EditorState>({ mode: "closed" });
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [pickValue, setPickValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const keyCounter = useRef(0);

  const nextKey = () => `it-${keyCounter.current++}`;

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setCollections(await fetchCollectionsAction());
    } catch {
      setToast({ message: "Sammlungen konnten nicht geladen werden.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Verfügbare Templates (für den Picker) aus den bestehenden APIs.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const opts: TemplateOption[] = [];
      try {
        const r = await fetch("/api/templates");
        if (r.ok) {
          const d = await r.json();
          for (const f of d.roles ?? [])
            for (const doc of f.documents ?? [])
              opts.push({
                id: `roles/${f.id}/${doc.fileName}`,
                name: `Rolle · ${f.name} · ${doc.name}`,
              });
          for (const f of d.appointments ?? [])
            for (const doc of f.documents ?? [])
              opts.push({
                id: `appointments/${f.id}/${doc.fileName}`,
                name: `Bestellung · ${f.name} · ${doc.name}`,
              });
        }
      } catch {
        /* tolerant — Picker bleibt evtl. leer */
      }
      try {
        const r = await fetch("/api/standard-models");
        if (r.ok) {
          const d = await r.json();
          for (const f of d.folders ?? [])
            for (const doc of f.documents ?? [])
              opts.push({
                id: `standard-models/${f.id}/${doc.fileName}`,
                name: `Standard · ${f.name} · ${doc.name}`,
              });
        }
      } catch {
        /* tolerant */
      }
      if (!cancelled) setTemplateOptions(opts);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openNew = () => {
    setDraftName("");
    setDraftDescription("");
    setDraftItems([]);
    setPickValue("");
    setEditor({ mode: "new" });
  };

  const openEdit = (c: CollectionDto) => {
    setDraftName(c.name);
    setDraftDescription(c.description ?? "");
    setDraftItems(
      c.items.map((it) => ({
        key: nextKey(),
        templateLogicalPath: it.templateLogicalPath,
        label: it.label,
        inclusion: it.inclusion,
        dateSource: it.dateSource,
        clauseId: it.clauseId,
        templateMissing: it.templateMissing,
      })),
    );
    setPickValue("");
    setEditor({ mode: "edit", id: c.id });
  };

  const closeEditor = () => setEditor({ mode: "closed" });

  const addPickedTemplate = (logicalPath: string) => {
    if (!logicalPath) return;
    const opt = templateOptions.find((o) => o.id === logicalPath);
    const fileName = logicalPath.split("/").pop()?.replace(/\.docx$/, "") ?? logicalPath;
    setDraftItems((prev) => [
      ...prev,
      {
        key: nextKey(),
        templateLogicalPath: logicalPath,
        label: opt ? opt.name.split(" · ").pop() ?? fileName : fileName,
        inclusion: "optional-on",
        dateSource: "startDate",
        clauseId: null,
        templateMissing: false,
      },
    ]);
    setPickValue("");
  };

  const patchItem = (key: string, patch: Partial<DraftItem>) =>
    setDraftItems((prev) =>
      prev.map((it) => (it.key === key ? { ...it, ...patch } : it)),
    );

  const removeItem = (key: string) =>
    setDraftItems((prev) => prev.filter((it) => it.key !== key));

  const handleSave = async () => {
    setSaving(true);
    try {
      const input = {
        name: draftName,
        description: draftDescription,
        items: draftItems.map((it) => ({
          templateLogicalPath: it.templateLogicalPath,
          label: it.label,
          inclusion: it.inclusion,
          dateSource: it.dateSource,
          clauseId: it.clauseId,
          templateMissing: it.templateMissing,
        })),
      };
      if (editor.mode === "edit") {
        await updateCollectionAction(editor.id, input);
      } else {
        await createCollectionAction(input);
      }
      setToast({ message: "Sammlung gespeichert.", type: "success" });
      closeEditor();
      await reload();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Speichern fehlgeschlagen.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClone = async (id: string) => {
    try {
      await cloneCollectionAction(id);
      setToast({ message: "Sammlung geklont.", type: "success" });
      await reload();
    } catch {
      setToast({ message: "Klonen fehlgeschlagen.", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Sammlung wirklich löschen?")) return;
    try {
      await deleteCollectionAction(id);
      setToast({ message: "Sammlung gelöscht.", type: "success" });
      await reload();
    } catch {
      setToast({ message: "Löschen fehlgeschlagen.", type: "error" });
    }
  };

  return (
    <section>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sammlungen</h2>
            <p className="text-xs text-gray-500">
              {collections.length} Sammlung{collections.length !== 1 ? "en" : ""}{" "}
              · vordefinierte (read-only) + eigene
            </p>
          </div>
        </div>
        {editor.mode === "closed" && (
          <Button
            type="button"
            onClick={openNew}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Neue Sammlung
          </Button>
        )}
      </div>

      {/* Editor */}
      {editor.mode !== "closed" && (
        <div className="mb-6 rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              {editor.mode === "edit" ? "Sammlung bearbeiten" : "Neue Sammlung"}
            </h3>
            <button
              type="button"
              onClick={closeEditor}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Name" name="collName" required>
              <Input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="z. B. SMA-Standardpaket"
              />
            </FormField>
            <FormField label="Beschreibung" name="collDesc">
              <Input
                value={draftDescription}
                onChange={(e) => setDraftDescription(e.target.value)}
                placeholder="optional"
              />
            </FormField>
          </div>

          {/* Template-Picker */}
          <div className="mt-4">
            <FormField
              label="Dokument hinzufügen"
              name="pick"
              description="Vorlage aus Rollen / Bestellungen / Standard-Models wählen"
            >
              <Select
                options={templateOptions}
                value={pickValue}
                onChange={addPickedTemplate}
                placeholder={
                  templateOptions.length
                    ? "Vorlage wählen…"
                    : "Keine Vorlagen gefunden"
                }
                disabled={templateOptions.length === 0}
              />
            </FormField>
          </div>

          {/* Posten-Liste */}
          <div className="mt-4 space-y-2">
            {draftItems.length === 0 && (
              <p className="text-sm text-gray-400">
                Noch keine Dokumente. Oben eine Vorlage wählen.
              </p>
            )}
            {draftItems.map((it) => (
              <div
                key={it.key}
                className="rounded-xl border border-gray-200 bg-gray-50/60 p-3"
              >
                <div className="flex items-center gap-2">
                  <Input
                    value={it.label}
                    onChange={(e) => patchItem(it.key, { label: e.target.value })}
                    placeholder="Bezeichnung"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(it.key)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 cursor-pointer shrink-0"
                    aria-label="Entfernen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <Select
                    options={INCLUSION_OPTIONS}
                    value={it.inclusion}
                    onChange={(v) => patchItem(it.key, { inclusion: v })}
                  />
                  <Select
                    options={DATE_SOURCE_OPTIONS}
                    value={it.dateSource}
                    onChange={(v) => patchItem(it.key, { dateSource: v })}
                  />
                </div>
                {it.templateLogicalPath && (
                  <p className="mt-1 text-[10px] font-mono text-gray-400">
                    {it.templateLogicalPath}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <Button
              type="button"
              onClick={handleSave}
              isLoading={saving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Speichern
            </Button>
            <Button type="button" variant="ghost" onClick={closeEditor}>
              Abbrechen
            </Button>
          </div>
        </div>
      )}

      {/* Liste */}
      {loading ? (
        <p className="text-sm text-gray-400">Lädt…</p>
      ) : (
        <div className="space-y-2">
          {collections.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 truncate">
                    {c.name}
                  </span>
                  {c.isSeed && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                      vordefiniert
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {c.items.length} Dokument{c.items.length !== 1 ? "e" : ""}
                  {c.description ? ` · ${c.description}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleClone(c.id)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-violet-50 hover:text-violet-600 cursor-pointer"
                  title="Klonen"
                >
                  <Copy className="h-4 w-4" />
                </button>
                {!c.isSeed && (
                  <>
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                      title="Bearbeiten"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                      title="Löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

CollectionsManager.displayName = "CollectionsManager";
