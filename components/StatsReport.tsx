"use client";

import { useEffect, useState } from "react";
import { Download, Printer } from "lucide-react";
import { modules } from "@/lib/modules-data";
import { thDate } from "./VisitCounter";

type C = { views: number; visits: number; visitors: number; downloads?: number };
type R = {
  summary: { ready?: boolean; since: string; today: C; yesterday: C; week: C; month: C; year: C; total: C & { downloads: number }; online: number };
  days: (C & { date: string; downloads: number })[];
  months: (C & { month: string; downloads: number })[];
  pages: { path: string; section: string; views: number }[];
  sections: Record<string, number>;
  devices: Record<string, number>;
};

const n = (x: number) => (x || 0).toLocaleString("th-TH");
const TH_M = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const thMonth = (k: string) => `${TH_M[Number(k.slice(5, 7)) - 1]} ${Number(k.slice(0, 4)) + 543}`;

function pageName(p: string): string {
  if (p === "/") return "หน้าแรก (ภาพรวมรายวิชา)";
  if (p === "/course-info") return "ข้อมูลรายวิชา";
  if (p === "/stats") return "สถิติการเข้าใช้เว็บไซต์";
  const m = p.match(/^\/(module|plan|lab|exam\/pre|exam\/post)\/(\d+)$/);
  if (m) {
    const mod = modules.find((x) => x.id === m[2]);
    const kind = { module: "ใบความรู้", plan: "แผนการจัดการเรียนรู้", lab: "ใบงานปฏิบัติ", "exam/pre": "แบบทดสอบก่อนเรียน", "exam/post": "แบบทดสอบหลังเรียน" }[m[1]];
    return `${kind} หน่วยที่ ${Number(m[2])}${mod ? " " + mod.titleTh : ""}`;
  }
  return p;
}

function lastDays(days: R["days"], count = 30) {
  const map = new Map(days.map((d) => [d.date, d]));
  const out: { date: string; visitors: number; views: number }[] = [];
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit" });
  for (let i = count - 1; i >= 0; i--) {
    const k = fmt.format(new Date(Date.now() - i * 86400000));
    const d = map.get(k);
    out.push({ date: k, visitors: d?.visitors || 0, views: d?.views || 0 });
  }
  return out;
}

const card = "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4";
const th = "px-3 py-2 whitespace-nowrap text-left font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/60";
const td = "px-3 py-1.5 border-t border-gray-100 dark:border-gray-800";
const num = td + " text-right tabular-nums";

export default function StatsReport() {
  const [r, setR] = useState<R | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    fetch("/api/stats?format=json", { cache: "no-store" }).then((x) => x.json()).then(setR).catch(() => setErr(true));
  }, []);
  if (err) return <p className="text-red-600">ไม่สามารถโหลดข้อมูลสถิติได้</p>;
  if (!r) return <p className="text-gray-500">กำลังโหลดข้อมูลสถิติ…</p>;
  const s = r.summary;
  const periods: [string, C][] = [["วันนี้", s.today], ["เมื่อวาน", s.yesterday], ["7 วันล่าสุด", s.week], ["เดือนนี้", s.month], ["ปีนี้", s.year], ["ทั้งหมด", s.total]];
  const chart = lastDays(r.days);
  const max = Math.max(1, ...chart.map((d) => d.visitors));
  const secTotal = Object.values(r.sections).reduce((a, b) => a + b, 0) || 1;
  const devTotal = Object.values(r.devices).reduce((a, b) => a + b, 0) || 1;
  const devName: Record<string, string> = { desktop: "คอมพิวเตอร์", tablet: "แท็บเล็ต", mobile: "โทรศัพท์มือถือ" };
  const unitRows = modules.map((m) => {
    const v = (k: string) => r.pages.find((p) => p.path === `/${k}/${m.id}`)?.views || 0;
    return { id: m.id, title: m.titleTh, module: v("module"), plan: v("plan"), lab: v("lab"), pre: v("exam/pre"), post: v("exam/post") };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 print:hidden">
        {[["daily", "รายวัน"], ["monthly", "รายเดือน"], ["pages", "รายหน้า"]].map(([k, l]) => (
          <a key={k} href={`/api/stats?format=csv&type=${k}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
            <Download className="w-4 h-4" /> ดาวน์โหลด CSV ({l})
          </a>
        ))}
        <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
          <Printer className="w-4 h-4" /> พิมพ์รายงาน / บันทึกเป็น PDF
        </button>
      </div>

      {s.ready === false && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-3 text-sm text-amber-800 dark:text-amber-300">
          ระบบนับสถิติยังไม่ได้เชื่อมต่อฐานข้อมูล (Redis) บนเซิร์ฟเวอร์นี้ จึงยังไม่บันทึกการเข้าใช้ — ผู้ดูแลต้องเพิ่มฐานข้อมูล Upstash Redis ให้โปรเจกต์บน Vercel ก่อน
        </div>
      )}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        เริ่มเก็บสถิติ {thDate(s.since)} · ข้อมูล ณ {new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok", dateStyle: "long", timeStyle: "short" })} น. · กำลังออนไลน์ {n(s.online)} คน
      </p>

      <div className={card + " overflow-x-auto"}>
        <h2 className="font-semibold mb-3">สรุปสถิติตามช่วงเวลา</h2>
        <table className="w-full text-sm">
          <thead><tr><th className={th}>ช่วงเวลา</th><th className={th + " text-right"}>ผู้เข้าใช้ (คน)</th><th className={th + " text-right"}>การเข้าใช้ (ครั้ง)</th><th className={th + " text-right"}>การเปิดหน้า (หน้า)</th></tr></thead>
          <tbody>
            {periods.map(([l, c]) => (
              <tr key={l} className={l === "ทั้งหมด" ? "font-semibold" : ""}><td className={td}>{l}</td><td className={num}>{n(c.visitors)}</td><td className={num}>{n(c.visits)}</td><td className={num}>{n(c.views)}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">ดาวน์โหลดเอกสารประกอบ (แบบทบทวน/ไฟล์) ทั้งหมด {n(s.total.downloads)} ครั้ง</p>
      </div>

      <div className={card}>
        <h2 className="font-semibold mb-3">ผู้เข้าใช้รายวัน 30 วันล่าสุด</h2>
        <div className="flex items-end gap-[3px] h-40" role="img" aria-label="แผนภูมิแท่งผู้เข้าใช้รายวัน 30 วันล่าสุด">
          {chart.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col justify-end h-full group relative">
              <div className="bg-blue-500 dark:bg-blue-400 rounded-t-sm min-h-[1px]" style={{ height: `${(d.visitors / max) * 100}%` }} />
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap text-[11px] bg-gray-900 text-white rounded px-1.5 py-0.5 z-10">
                {thDate(d.date)}: {n(d.visitors)} คน / {n(d.views)} หน้า
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-gray-500 mt-1"><span>{thDate(chart[0].date)}</span><span>สูงสุด {n(max)} คน/วัน</span><span>{thDate(chart[chart.length - 1].date)}</span></div>
      </div>

      <div className={card + " overflow-x-auto"}>
        <h2 className="font-semibold mb-3">สถิติรายเดือน</h2>
        {r.months.length === 0 ? <p className="text-sm text-gray-500">ยังไม่มีข้อมูล</p> : (
          <table className="w-full text-sm">
            <thead><tr><th className={th}>เดือน</th><th className={th + " text-right"}>ผู้เข้าใช้ (รวมรายวัน)</th><th className={th + " text-right"}>การเข้าใช้</th><th className={th + " text-right"}>การเปิดหน้า</th><th className={th + " text-right"}>ดาวน์โหลด</th></tr></thead>
            <tbody>{r.months.slice().reverse().map((m) => (
              <tr key={m.month}><td className={td}>{thMonth(m.month)}</td><td className={num}>{n(m.visitors)}</td><td className={num}>{n(m.visits)}</td><td className={num}>{n(m.views)}</td><td className={num}>{n(m.downloads)}</td></tr>
            ))}</tbody>
          </table>
        )}
      </div>

      <div className={card + " overflow-x-auto"}>
        <h2 className="font-semibold mb-3">การเปิดหน้ารายหน่วยเรียน</h2>
        <table className="w-full text-sm">
          <thead><tr><th className={th}>หน่วยเรียน</th><th className={th + " text-right"}>ใบความรู้</th><th className={th + " text-right"}>แผนการสอน</th><th className={th + " text-right"}>ใบงาน</th><th className={th + " text-right"}>ก่อนเรียน</th><th className={th + " text-right"}>หลังเรียน</th></tr></thead>
          <tbody>{unitRows.map((u) => (
            <tr key={u.id}><td className={td}>{Number(u.id)}. {u.title}</td><td className={num}>{n(u.module)}</td><td className={num}>{n(u.plan)}</td><td className={num}>{n(u.lab)}</td><td className={num}>{n(u.pre)}</td><td className={num}>{n(u.post)}</td></tr>
          ))}</tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className={card}>
          <h2 className="font-semibold mb-3">สัดส่วนตามหมวดเนื้อหา</h2>
          {Object.entries(r.sections).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
            <div key={k} className="mb-2 text-sm">
              <div className="flex justify-between"><span>{k}</span><span className="tabular-nums">{n(v)} ({((v / secTotal) * 100).toFixed(1)}%)</span></div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded"><div className="h-1.5 bg-blue-500 rounded" style={{ width: `${(v / secTotal) * 100}%` }} /></div>
            </div>
          ))}
        </div>
        <div className={card}>
          <h2 className="font-semibold mb-3">อุปกรณ์ที่ใช้เข้าชม (ผู้เข้าใช้รายวัน)</h2>
          {Object.entries(r.devices).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
            <div key={k} className="mb-2 text-sm">
              <div className="flex justify-between"><span>{devName[k] || k}</span><span className="tabular-nums">{n(v)} ({((v / devTotal) * 100).toFixed(1)}%)</span></div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded"><div className="h-1.5 bg-green-600 rounded" style={{ width: `${(v / devTotal) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className={card + " overflow-x-auto"}>
        <h2 className="font-semibold mb-3">หน้าที่มีการเปิดมากที่สุด 20 อันดับ</h2>
        <table className="w-full text-sm">
          <thead><tr><th className={th}>อันดับ</th><th className={th}>หน้า</th><th className={th + " text-right"}>การเปิดหน้า</th></tr></thead>
          <tbody>{r.pages.slice(0, 20).map((p, i) => (
            <tr key={p.path}><td className={td}>{i + 1}</td><td className={td}>{pageName(p.path)}</td><td className={num}>{n(p.views)}</td></tr>
          ))}</tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 border-t border-gray-200 dark:border-gray-800 pt-4">
        <p><b>นิยาม:</b> ผู้เข้าใช้ (Unique visitor) = อุปกรณ์/เบราว์เซอร์ที่ไม่ซ้ำกันในแต่ละวัน · การเข้าใช้ (Visit/Session) = การเข้าใช้ 1 ครั้ง สิ้นสุดเมื่อไม่มีการใช้งานเกิน 30 นาที · การเปิดหน้า (Page view) = จำนวนครั้งที่เปิดหน้าเว็บ · ผู้เข้าใช้ทั้งหมด = อุปกรณ์ไม่ซ้ำตลอดช่วงเวลา ส่วนผู้เข้าใช้รายเดือนเป็นผลรวมของผู้เข้าใช้รายวัน</p>
        <p><b>การคุ้มครองข้อมูลส่วนบุคคล (PDPA):</b> ระบบนับสถิติทำงานบนเครื่องแม่ข่ายของรายวิชาเท่านั้น ไม่ใช้บริการภายนอก ไม่เก็บหมายเลข IP ชื่อ อีเมล หรือข้อมูลที่ระบุตัวบุคคล เบราว์เซอร์สร้างรหัสสุ่มที่ไม่ระบุตัวตนเก็บไว้ในเครื่องผู้ใช้ และเครื่องแม่ข่ายเก็บเพียงค่าแฮชของรหัสนั้น ไม่นับการเข้าชมจากโปรแกรมอัตโนมัติ (Bot)</p>
      </div>
    </div>
  );
}
