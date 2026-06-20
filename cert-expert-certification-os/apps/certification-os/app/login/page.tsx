"use client";

import React from "react";
import Image from "next/image";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";

/** Erlaubt nur app-interne Redirect-Ziele (kein Open-Redirect). */
function safeNext(raw: string | null): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export default function LoginPage() {
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        const params = new URLSearchParams(window.location.search);
        window.location.assign(safeNext(params.get("next")));
        return;
      }
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Anmeldung fehlgeschlagen.");
    } catch {
      setError("Netzwerkfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f5f7] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image
            src="/assets/cert-expert-logo.png"
            alt="Cert-Expert"
            width={228}
            height={48}
            className="h-9 w-auto object-contain"
            priority
          />
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(227,6,19,0.06)] text-[#e30613]">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold text-[#111827]">Anmeldung</h1>
              <p className="text-xs text-[#6b7280]">Certification OS — geschützter Bereich</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#111827]">
                Passwort
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={error ? true : undefined}
                  className="block w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 pr-11 text-[#111827] shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#e30613] focus:outline-none focus:ring-2 focus:ring-[rgba(227,6,19,0.18)]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Passwort verbergen" : "Passwort anzeigen"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-[#e30613]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e30613] px-5 py-3 font-semibold text-white shadow-lg shadow-[rgba(227,6,19,0.25)] transition-all duration-200 hover:bg-[#b80510] focus:outline-none focus:ring-2 focus:ring-[#e30613] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
              Anmelden
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#6b7280]">
          Cert-Expert Certification OS · interner Zugang
        </p>
      </div>
    </main>
  );
}
