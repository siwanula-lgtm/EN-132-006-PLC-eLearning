import { NextRequest, NextResponse } from "next/server";
import { summary, report } from "@/lib/stats-store";
import { course } from "@/lib/course";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const csv = (rows: (string | number)[][]) =>
  "﻿" + rows.map((r) => r.map((c) => (/[",\n]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : c)).join(",")).join("\r\n");

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const fmt = q.get("format");
  if (!fmt) return NextResponse.json(await summary(), { headers: { "Cache-Control": "no-store" } });
  const r = await report();
  if (fmt === "json") return NextResponse.json(r, { headers: { "Cache-Control": "no-store" } });
  const kind = q.get("type") || "daily";
  let rows: (string | number)[][];
  if (kind === "monthly") {
    rows = [["เดือน (YYYY-MM)", "จำนวนการเปิดหน้า (Page views)", "จำนวนครั้งที่เข้าใช้ (Visits)", "ผู้เข้าใช้ไม่ซ้ำรายวัน (รวม)", "ดาวน์โหลดเอกสาร"],
      ...r.months.map((m) => [m.month, m.views, m.visits, m.visitors, m.downloads])];
  } else if (kind === "pages") {
    rows = [["หน้า (Path)", "หมวด", "จำนวนการเปิดหน้า"], ...r.pages.map((p) => [p.path, p.section, p.views])];
  } else {
    rows = [["วันที่ (YYYY-MM-DD)", "จำนวนการเปิดหน้า (Page views)", "จำนวนครั้งที่เข้าใช้ (Visits)", "ผู้เข้าใช้ไม่ซ้ำ (Unique visitors)", "ดาวน์โหลดเอกสาร"],
      ...r.days.map((d) => [d.date, d.views, d.visits, d.visitors, d.downloads])];
  }
  return new NextResponse(csv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${course.code}_visitor-stats_${kind}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
