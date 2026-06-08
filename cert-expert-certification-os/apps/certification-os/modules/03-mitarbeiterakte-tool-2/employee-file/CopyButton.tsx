"use client";

import React, { useCallback, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 1-Klick-Kopieren (Lane B / Pt 1).
 *
 * Reine UI: kopiert den übergebenen Wert in die Zwischenablage und zeigt kurz
 * ein „kopiert"-Feedback. KEIN Datenfluss-/Engine-Eingriff — nur Anzeige.
 * Fällt ohne `navigator.clipboard` (unsicherer Kontext) auf `execCommand` zurück.
 */
export interface CopyButtonProps {
  /** Der zu kopierende Text. Leere Werte deaktivieren den Button. */
  value?: string | null;
  /** Optionales Label für Screenreader (z. B. „Name kopieren"). */
  ariaLabel?: string;
  /** Sichtbarer Text neben dem Icon (z. B. „Alles kopieren"). */
  children?: React.ReactNode;
  className?: string;
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard?.writeText
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fällt unten auf das Legacy-Verfahren zurück.
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  ariaLabel,
  children,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  const hasValue = Boolean(value && value.trim());

  const handleCopy = useCallback(async () => {
    if (!hasValue) return;
    const ok = await copyToClipboard(String(value));
    if (!ok) return;
    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1500);
  }, [hasValue, value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!hasValue}
      aria-label={ariaLabel ?? "In die Zwischenablage kopieren"}
      title={copied ? "Kopiert" : "Kopieren"}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e5e7eb] bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#6b7280] transition-colors hover:border-[rgba(227,6,19,0.35)] hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-40",
        copied && "border-green-300 bg-green-50 text-green-700",
        className,
      )}
    >
      {copied ? (
        <Check className="h-3 w-3" aria-hidden />
      ) : (
        <Copy className="h-3 w-3" aria-hidden />
      )}
      {children ? <span>{children}</span> : null}
      {copied && !children ? <span>kopiert</span> : null}
    </button>
  );
};

CopyButton.displayName = "CopyButton";
