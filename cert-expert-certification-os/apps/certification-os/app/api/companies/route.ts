import { NextResponse } from "next/server";
import { listCompanies } from "@/lib/employee-file-repository";

export async function GET() {
  try {
    const companies = await listCompanies();
    console.info("[GET /api/companies]", companies.length);
    return NextResponse.json({ companies });
  } catch (err) {
    console.error("[GET /api/companies] failed:", err);
    return NextResponse.json(
      { error: "Failed to load companies" },
      { status: 500 },
    );
  }
}
