import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

export class ApiAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiAuthError";
  }
}

/** Internal API routes (migration, future admin). */
export function requireInternalApiKey(request: NextRequest): void {
  const expected = process.env.INTERNAL_API_KEY?.trim();
  if (!expected) {
    throw new ApiAuthError("INTERNAL_API_KEY is not configured");
  }
  const provided =
    request.headers.get("x-api-key")?.trim() ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!provided) {
    throw new ApiAuthError("Missing API key");
  }
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new ApiAuthError("Invalid API key");
  }
}

/**
 * Tally webhook signature (Slice 1). Header: Tally-Signature = sha256=...
 * @see https://tally.so/help/webhooks
 */
export function verifyTallySignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  const secret = process.env.TALLY_WEBHOOK_SECRET?.trim();
  if (!secret || !signatureHeader) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = signatureHeader.replace(/^sha256=/i, "").trim();
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(received, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
