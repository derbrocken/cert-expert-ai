"use client";

import React, {
  useActionState,
  useTransition,
  useState,
  useCallback,
} from "react";
import { generateDocument, GenerateState } from "@/app/actions/send-model-entries";
import { DocumentForm } from "@/components/document";
import type { StandardModelFolder } from "@/components/document/DocumentForm";
import { cn } from "@/lib/utils";
import {
  FolderOpen,
  FileText,
  Check,
  ChevronRight,
  X,
} from "lucide-react";

const initialState: GenerateState = {
  success: false,
  zipBase64: undefined,
  error: undefined,
};

/**
 * Tool-1-Firmen-/Standard-Model-Generator als wiederverwendbarer Workspace
 * (ohne Page-Chrome wie Navbar/Footer/Seiten-Header). Wird von der bestehenden
 * Top-Level-`/generator` (Firmen-Bereich) genutzt.
 *
 * EC-09: Der ZIP-Pfad `generateDocument` ist unverändert — diese Extraktion ist
 * reines Auslagern des bisherigen `ModelCreatorPage`-Bodys, keine Logik-Änderung.
 */
export function ModelCreatorWorkspace() {
  const [state, formAction] = useActionState(generateDocument, initialState);
  const [isPending, startTransition] = useTransition();
  const [resetKey, setResetKey] = useState(0);
  const [isReset, setIsReset] = useState(false);

  // Document tree state
  const [activeFolder, setActiveFolder] = useState<StandardModelFolder | null>(
    null
  );
  const [excludedDocIds, setExcludedDocIds] = useState<Set<string>>(new Set());

  const handleFormSubmit = (formData: FormData) => {
    setIsReset(false);
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleReset = useCallback(() => {
    setResetKey((prev) => prev + 1);
    setIsReset(true);
    setActiveFolder(null);
    setExcludedDocIds(new Set());
  }, []);

  const handleFolderClick = useCallback(
    (folder: StandardModelFolder) => {
      setActiveFolder((prev) =>
        prev?.id === folder.id ? null : folder
      );
    },
    []
  );

  const toggleDoc = useCallback((docId: string) => {
    setExcludedDocIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    if (!activeFolder) return;
    setExcludedDocIds((prev) => {
      const next = new Set(prev);
      activeFolder.documents.forEach((d) => next.delete(d.id));
      return next;
    });
  }, [activeFolder]);

  const deselectAll = useCallback(() => {
    if (!activeFolder) return;
    setExcludedDocIds((prev) => {
      const next = new Set(prev);
      activeFolder.documents.forEach((d) => next.add(d.id));
      return next;
    });
  }, [activeFolder]);

  const includedCount = activeFolder
    ? activeFolder.documents.filter((d) => !excludedDocIds.has(d.id)).length
    : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr] xl:grid-cols-[460px_1fr] lg:gap-8">
      {/* Form */}
      <div>
        <DocumentForm
          key={resetKey}
          onSubmit={handleFormSubmit}
          onReset={handleReset}
          isPending={isPending}
          hasDocument={!isReset && state.success}
          zipBase64={!isReset ? state.zipBase64 : undefined}
          error={!isReset ? state.error : undefined}
          skipped={!isReset ? state.skipped : undefined}
          onFolderClick={handleFolderClick}
          activeFolderId={activeFolder?.id}
          excludedDocIds={excludedDocIds}
        />
      </div>

      {/* Document Tree Panel */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        {activeFolder ? (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Tree Header */}
            <div className="border-b border-gray-100 bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                    <FolderOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {activeFolder.name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {includedCount} von {activeFolder.documents.length}{" "}
                      Dokumenten ausgewählt
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveFolder(null)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-white/80 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Quick actions */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={selectAll}
                  className="rounded-lg bg-white/80 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-white transition-colors cursor-pointer border border-blue-200"
                >
                  Alle auswählen
                </button>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="rounded-lg bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white transition-colors cursor-pointer border border-gray-200"
                >
                  Alle abwählen
                </button>
              </div>
            </div>

            {/* Document Tree */}
            <div className="p-4">
              {/* Tree root line */}
              <div className="relative pl-6">
                {/* Vertical connector line */}
                <div className="absolute left-[11px] top-0 bottom-3 w-px bg-gray-200" />

                <div className="space-y-1">
                  {activeFolder.documents.map((doc, index) => {
                    const isIncluded = !excludedDocIds.has(doc.id);
                    const isLast =
                      index === activeFolder.documents.length - 1;
                    return (
                      <div key={doc.id} className="relative">
                        {/* Horizontal branch line */}
                        <div
                          className={cn(
                            "absolute -left-[13px] top-1/2 w-4 border-t border-gray-200",
                            isLast && "border-l border-gray-200 h-1/2 -top-0 rounded-bl-lg"
                          )}
                        />
                        {/* Hide vertical line after last item */}
                        {isLast && (
                          <div className="absolute -left-[13.5px] top-1/2 bottom-0 w-px bg-white" />
                        )}

                        <button
                          type="button"
                          onClick={() => toggleDoc(doc.id)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all cursor-pointer group",
                            isIncluded
                              ? "bg-blue-50/60 hover:bg-blue-50 border border-blue-200"
                              : "bg-gray-50 hover:bg-gray-100 border border-gray-200 opacity-60"
                          )}
                        >
                          {/* Checkbox */}
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors shrink-0",
                              isIncluded
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300 bg-white group-hover:border-gray-400"
                            )}
                          >
                            {isIncluded && (
                              <Check
                                className="h-3 w-3 text-white"
                                strokeWidth={3}
                              />
                            )}
                          </div>

                          {/* File icon */}
                          <FileText
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isIncluded
                                ? "text-blue-500"
                                : "text-gray-400"
                            )}
                          />

                          {/* File name */}
                          <span
                            className={cn(
                              "flex-1 text-left text-sm font-medium transition-colors",
                              isIncluded
                                ? "text-gray-800"
                                : "text-gray-400 line-through"
                            )}
                          >
                            {doc.name}
                          </span>

                          {/* File extension badge */}
                          <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            .docx
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tree Footer */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {includedCount === activeFolder.documents.length ? (
                    <span className="text-emerald-600 font-medium">
                      Alle Dokumente enthalten
                    </span>
                  ) : includedCount === 0 ? (
                    <span className="text-red-500 font-medium">
                      Keine Dokumente ausgewählt
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium">
                      {activeFolder.documents.length - includedCount}{" "}
                      Dokument
                      {activeFolder.documents.length - includedCount !== 1
                        ? "e"
                        : ""}{" "}
                      ausgeschlossen
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 p-16 text-center min-h-[300px]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-4">
              <FolderOpen className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-500">
              Dokument-Explorer
            </h3>
            <p className="mt-2 max-w-xs text-sm text-gray-400">
              Links einen Standard-Model-Ordner wählen und anklicken, um
              seine Dokumente hier zu sehen und zu filtern.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs text-gray-400">
              <ChevronRight className="h-3 w-3" />
              <span>Ordner anklicken zum Starten</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ModelCreatorWorkspace.displayName = "ModelCreatorWorkspace";
