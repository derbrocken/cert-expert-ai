import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Site-Gate: ohne gültige Session kommt niemand an die App (Personendaten/DSGVO).
 *
 * Öffentlich (kein Gate):
 *  - /login            — die Login-Seite selbst
 *  - /api/auth/*       — Login/Logout-Endpunkte
 *  - /api/webhooks/*   — externer Tally-Webhook (eigene Signaturprüfung, EC-09/Intake)
 *
 * Statische Assets (_next, favicon, /assets …) sind über den `matcher` ausgenommen.
 */

const PUBLIC_PREFIXES = ["/login", "/api/auth/", "/api/webhooks/"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname === p.replace(/\/$/, "") || pathname.startsWith(p),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token, process.env.AUTH_SECRET);
  if (valid) return NextResponse.next();

  // API-Aufrufe bekommen 401 statt Redirect (saubere Fehlerbehandlung im Client).
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Alles außer Next-Internas und statischen Assets durch das Gate schicken.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:png|jpg|jpeg|svg|gif|ico|webp|woff2?)$).*)"],
};
