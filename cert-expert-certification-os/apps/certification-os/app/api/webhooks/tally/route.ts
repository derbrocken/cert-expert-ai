import { NextRequest, NextResponse } from "next/server";
import { verifyTallySignature } from "@/lib/api-auth";
import {
  processTallyWebhookPayload,
  type TallyWebhookPayload,
} from "@/lib/tally-intake-service";

export const runtime = "nodejs";

/**
 * Tally webhook — respond within 10s, process payload asynchronously.
 * Signature: base64 HMAC-SHA256 of raw body (Tally-Signature header, no prefix).
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("tally-signature");

  if (!verifyTallySignature(rawBody, signature)) {
    console.warn("[POST /api/webhooks/tally] Invalid signature");
    return NextResponse.json({ error: "Invalid Tally signature" }, { status: 401 });
  }

  let payload: TallyWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as TallyWebhookPayload;
  } catch (err) {
    console.error("[POST /api/webhooks/tally] Invalid JSON:", err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const responseId =
    payload.data?.responseId ?? payload.data?.submissionId ?? "unknown";

  console.info("[POST /api/webhooks/tally] Accepted", {
    responseId,
    formId: payload.data?.formId,
    fieldCount: payload.data?.fields?.length ?? 0,
  });

  // 2XX immediately — Tally requires response within 10 seconds
  queueMicrotask(() => {
    void processTallyWebhookPayload(payload).catch((err) => {
      console.error("[POST /api/webhooks/tally] Async intake failed:", {
        responseId,
        err,
      });
    });
  });

  return NextResponse.json({
    ok: true,
    status: "accepted",
    responseId,
  });
}
