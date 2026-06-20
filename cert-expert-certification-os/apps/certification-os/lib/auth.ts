/**
 * Site-Gate Auth — EIN gemeinsames Passwort schützt die ganze App.
 *
 * Bewusst KEIN User-/Rollen-Modell (Mark-Entscheid 2026-06-20): nur ein
 * Passwort-Gate, das die öffentlich erreichbare App (Personendaten, DSGVO)
 * zumacht. Session = signiertes, httpOnly-Cookie — keine neue Abhängigkeit.
 *
 * Isomorph (Web Crypto): läuft sowohl in der Edge-Middleware als auch in
 * Node-Route-Handlern. Deshalb HIER kein `crypto` aus Node verwenden.
 */

const encoder = new TextEncoder();

/** Cookie-Name der Session. */
export const SESSION_COOKIE = "cos_session";

/** Session-Laufzeit: 7 Tage. */
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function stringToBase64Url(value: string): string {
  return bytesToBase64Url(encoder.encode(value));
}

function base64UrlToString(value: string): string {
  return atob(value.replace(/-/g, "+").replace(/_/g, "/"));
}

async function hmacBase64Url(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return bytesToBase64Url(new Uint8Array(signature));
}

/** Konstantzeit-Vergleich gleichlanger Strings (Timing-Schutz). */
export function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Signiertes Session-Token: `<payload>.<hmac>` (payload trägt das Ablaufdatum). */
export async function createSessionToken(
  secret: string,
  now: number = Date.now(),
): Promise<string> {
  const payload = stringToBase64Url(JSON.stringify({ exp: now + SESSION_TTL_MS }));
  const signature = await hmacBase64Url(secret, payload);
  return `${payload}.${signature}`;
}

/** Prüft Signatur UND Ablaufdatum. Kein gültiges/frisches Token → false. */
export async function verifySessionToken(
  token: string | undefined | null,
  secret: string | undefined | null,
  now: number = Date.now(),
): Promise<boolean> {
  if (!token || !secret) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!payload || !signature) return false;

  const expected = await hmacBase64Url(secret, payload);
  if (!timingSafeEqualStr(signature, expected)) return false;

  try {
    const { exp } = JSON.parse(base64UrlToString(payload)) as { exp?: unknown };
    return typeof exp === "number" && exp > now;
  } catch {
    return false;
  }
}
