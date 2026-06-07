import { NextRequest, NextResponse } from "next/server";
import { verifyTallySignature } from "@/lib/api-auth";

/**
 * Slice 1 placeholder — signature check only. Intake mapping comes in Slice 1.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("tally-signature");

  if (!verifyTallySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid Tally signature" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, status: "accepted", slice: "1-pending" });
}
