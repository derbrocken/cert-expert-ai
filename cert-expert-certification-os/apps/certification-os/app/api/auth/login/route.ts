import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  createSessionToken,
  timingSafeEqualStr,
} from "@/lib/auth";

export const runtime = "nodejs";

/** Site-Gate-Login: ein gemeinsames Passwort (APP_PASSWORD) → signiertes Session-Cookie. */
export async function POST(request: NextRequest) {
  const expected = process.env.APP_PASSWORD?.trim();
  const secret = process.env.AUTH_SECRET?.trim();

  if (!expected || !secret) {
    return NextResponse.json(
      { error: "Login ist nicht konfiguriert (APP_PASSWORD/AUTH_SECRET fehlen)." },
      { status: 500 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!password || !timingSafeEqualStr(password, expected)) {
    return NextResponse.json({ error: "Falsches Passwort." }, { status: 401 });
  }

  const token = await createSessionToken(secret);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return response;
}
