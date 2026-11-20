"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

type C = { views: number; visits: number; visitors: number };
type S = { ready?: boolean; since: string; today: C; yesterday: C; week: C; month: C; year: C; total: C; online: number };

const n = (x: number) => x.toLocaleString("th-TH");
export const thDate = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
};

export default function VisitCounter({ compact = false }: { compact?: boolean }) {
  const [s, setS] = useState<S | null>(null);
  useEffect(() => {
    let alive = true;
    const load = () => fetch("/api/stats", { cache: "no-store" }).then((r) => r.json()).then((j) => alive && setS(j)).catch(() => {});
    const t0 = setTimeout(load, 800);
    const iv = setInterval(load, 60000);
    const on = () => setTimeout(load, 800);
    window.addEventListener("stats:refresh", on);
    return () => { alive = false; clearTimeout(t0); clearInterval(iv); window.removeEventListener("stats:refresh", on); };
  }, []);

  const rows: [string, number | undefined][] = [
    ["ผู้เข้าใช้วันนี้", s?.today.visitors],
    ["ผู้เข้าใช้เมื่อวาน", s?.yesterday.visitors],
    ["ผู้เข้าใช้เดือนนี้", s?.month.visitors],
    ["ผู้เข้าใช้ทั้งหมด", s?.total.visitors],
    ["จำนวนการเข้าใช้ทั้งหมด", s?.total.visits],
    ["จำนวนการเปิดหน้าทั้งหมด", s?.total.views],
  ];

  return (
    <div className={`rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 ${compact ? "p-3 text-xs" : "p-4 text-sm"}`}>
      <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 mb-2">
        <BarChart3 className="w-4 h-4 text-blue-600" />
        สถิติการเข้าใช้เว็บไซต์
      </div>
      {s && s.ready === false && (
        <p className="mb-2 text-[11px] text-amber-700 dark:text-amber-400">ยังไม่ได้เชื่อมต่อฐานข้อมูลสถิติ (ดู README หัวข้อ “สถิติการเข้าใช้บน Vercel”)</p>
      )}
      <table className="w-full">
        <tbody>
          {rows.map(([label, v]) => (
            <tr key={label}>
              <td className="py-0.5 text-gray-600 dark:text-gray-400">{label}</td>
              <td className="py-0.5 text-right font-mono tabular-nums text-gray-800 dark:text-gray-100">{v === undefined ? "–" : n(v)}</td>
            </tr>
          ))}
          <tr>
            <td className="py-0.5 text-gray-600 dark:text-gray-400">กำลังออนไลน์</td>
            <td className="py-0.5 text-right font-mono tabular-nums text-green-700 dark:text-green-400">{s ? n(s.online) : "–"}</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
        <span>เริ่มนับ {s ? thDate(s.since) : "–"}</span>
        <Link href="/stats" className="text-blue-600 hover:underline">รายงานสถิติ →</Link>
      </div>
    </div>
  );
}
