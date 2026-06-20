import { NextRequest, NextResponse } from "next/server";
import { generateCompanyReport } from "@/lib/reportEngine";
import { InvalidUrlError } from "@/lib/urlUtils";
import type { AnalyzeRequestBody, AnalyzeResponseBody } from "@/types";

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeResponseBody>> {
  try {
    const body = (await req.json()) as AnalyzeRequestBody;

    if (!body?.url || typeof body.url !== "string") {
      return NextResponse.json({ success: false, error: "Missing 'url' in request body." }, { status: 400 });
    }

    const report = await generateCompanyReport(body.url);
    return NextResponse.json({ success: true, data: report });
  } catch (err) {
    if (err instanceof InvalidUrlError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
    console.error("Unexpected error generating report:", err);
    return NextResponse.json({ success: false, error: "Something went wrong generating the report." }, { status: 500 });
  }
}
