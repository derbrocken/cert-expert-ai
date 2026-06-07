import { NextRequest, NextResponse } from "next/server";
import { ApiAuthError, requireInternalApiKey } from "@/lib/api-auth";
import {
  migrateFromLocalStoragePayload,
  type LocalStorageMigrationPayload,
} from "@/lib/employee-file-repository";

export async function POST(request: NextRequest) {
  try {
    requireInternalApiKey(request);
    const payload = (await request.json()) as LocalStorageMigrationPayload;
    const result = await migrateFromLocalStoragePayload(payload);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ApiAuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    console.error("Migration failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Migration failed" },
      { status: 500 },
    );
  }
}
