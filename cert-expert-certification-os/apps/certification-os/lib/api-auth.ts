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
 * Tally webhook signature (Slice 1).
 * Header: Tally-Signature — base64 HMAC-SHA256 of the raw request body, no prefix.
 * @see https://tally.so/help/webhooks
 */
export function verifyTallySignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  const secret = process.env.TALLY_WEBHOOK_SECRET?.trim();
  if (!secret || !signatureHeader) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("base64");
  const received = signatureHeader.trim();
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(received, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
