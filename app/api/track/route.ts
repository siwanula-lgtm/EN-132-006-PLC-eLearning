import { NextRequest, NextResponse } from "next/server";
import { recordView } from "@/lib/stats-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const b = JSON.parse(await req.text());
    await recordView({
      path: String(b.path || "/"),
      vid: String(b.vid || "").slice(0, 64),
      newVisit: Boolean(b.newVisit),
      device: String(b.device || "desktop"),
      ua: req.headers.get("user-agent") || "",
    });
  } catch {
    /* ไม่ให้การนับสถิติรบกวนการใช้งานเว็บ */
  }
  return new NextResponse(null, { status: 204 });
}
