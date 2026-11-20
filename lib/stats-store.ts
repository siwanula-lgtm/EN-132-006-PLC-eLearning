// สถิติการเข้าใช้เว็บไซต์ (Visitor statistics)
// - Docker / เครื่องแม่ข่ายของรายวิชา: เก็บในไฟล์ STATS_DIR/visitor-stats.json
// - Vercel (serverless): เก็บใน Redis (Upstash / Vercel KV) ผ่าน REST API เมื่อตั้งค่าตัวแปร
//   KV_REST_API_URL + KV_REST_API_TOKEN หรือ UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
// ไม่เก็บ IP ชื่อ หรืออีเมล: ผู้เยี่ยมชมระบุด้วยรหัสสุ่มที่เบราว์เซอร์สร้างเอง แล้วเก็บเฉพาะค่าแฮช (SHA-256 ตัดสั้น)
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const SITE = "en-132-006";
export const STATS_DIR = process.env.STATS_DIR || path.join(process.cwd(), "data");
const FILE = path.join(STATS_DIR, "visitor-stats.json");
const TZ = "Asia/Bangkok";
const ONLINE_MS = 5 * 60 * 1000;

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const USE_REDIS = Boolean(REDIS_URL && REDIS_TOKEN);
/** บน Vercel ระบบไฟล์ไม่ถาวร ถ้ายังไม่ได้ต่อ Redis จะไม่บันทึก (เพื่อไม่ให้ได้ตัวเลขผิด) */
export const STATS_READY = USE_REDIS || !process.env.VERCEL;

export type Counts = { views: number; visits: number; visitors: number; downloads: number };
type Day = Counts & { pages: Record<string, number>; ids: string[] };
type Store = {
  version: 1;
  since: string;
  total: Counts;
  days: Record<string, Day>;
  pages: Record<string, number>;
  sections: Record<string, number>;
  devices: Record<string, number>;
  knownIds: string[];
};

export function dayKey(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}
const zero = (): Counts => ({ views: 0, visits: 0, visitors: 0, downloads: 0 });
const h = (x: string) => crypto.createHash("sha256").update(SITE + ":" + x).digest("hex").slice(0, 16);

export function sectionOf(p: string): string {
  if (p === "/") return "หน้าแรก";
  if (p.startsWith("/module/")) return "ใบความรู้ (หน่วยเรียน)";
  if (p.startsWith("/plan/")) return "แผนการจัดการเรียนรู้";
  if (p.startsWith("/lab/")) return "ใบงานปฏิบัติ";
  if (p.startsWith("/exam/pre/")) return "แบบทดสอบก่อนเรียน";
  if (p.startsWith("/exam/post/")) return "แบบทดสอบหลังเรียน";
  if (p.startsWith("/course-info")) return "ข้อมูลรายวิชา";
  if (p.startsWith("/stats")) return "สถิติการเข้าใช้";
  return "อื่น ๆ";
}

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|curl|wget|python|httpclient|monitor|vercel-screenshot/i;
const DEVICES = ["mobile", "tablet", "desktop"];

/* ============================ Redis (Vercel) ============================ */
type Cmd = (string | number)[];
async function redis(cmds: Cmd[]): Promise<any[]> {
  const r = await fetch(REDIS_URL.replace(/\/$/, "") + "/pipeline", {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!r.ok) throw new Error("redis " + r.status);
  const j = (await r.json()) as { result?: any; error?: string }[];
  return j.map((x) => (x.error ? null : x.result));
}
const K = (s: string) => `stats:${SITE}:${s}`;
const num = (v: any) => Number(v || 0);
const hobj = (arr: any): Record<string, number> => {
  const o: Record<string, number> = {};
  if (Array.isArray(arr)) for (let i = 0; i + 1 < arr.length; i += 2) o[arr[i]] = Number(arr[i + 1]);
  else if (arr && typeof arr === "object") for (const [k, v] of Object.entries(arr)) o[k] = Number(v);
  return o;
};

async function rView(p: string, id: string, newVisit: boolean, device: string) {
  const d = dayKey(), now = Date.now();
  const c: Cmd[] = [
    ["SETNX", K("since"), d],
    ["SADD", K("days"), d],
    ["INCR", K("total:views")],
    ["INCR", K(`day:${d}:views`)],
    ["HINCRBY", K("pages"), p, 1],
    ["HINCRBY", K("sections"), sectionOf(p), 1],
    ["SADD", K(`day:${d}:ids`), id],
    ["SADD", K("ids"), id],
    ["ZADD", K("online"), now, id],
    ["ZREMRANGEBYSCORE", K("online"), 0, now - ONLINE_MS],
  ];
  if (newVisit) c.push(["INCR", K("total:visits")], ["INCR", K(`day:${d}:visits`)]);
  const res = await redis(c);
  if (res[6] === 1) await redis([["HINCRBY", K("devices"), DEVICES.includes(device) ? device : "desktop", 1]]);
}

async function rDays(days: string[]): Promise<Record<string, Counts>> {
  if (!days.length) return {};
  const c: Cmd[] = [];
  for (const d of days) c.push(["GET", K(`day:${d}:views`)], ["GET", K(`day:${d}:visits`)], ["SCARD", K(`day:${d}:ids`)], ["GET", K(`day:${d}:downloads`)]);
  const r = await redis(c);
  const o: Record<string, Counts> = {};
  days.forEach((d, i) => (o[d] = { views: num(r[i * 4]), visits: num(r[i * 4 + 1]), visitors: num(r[i * 4 + 2]), downloads: num(r[i * 4 + 3]) }));
  return o;
}

/* ============================ File (Docker) ============================ */
const g = globalThis as unknown as { __stats?: Store; __statsLoad?: Promise<Store>; __online?: Map<string, number>; __timer?: NodeJS.Timeout; __known?: Set<string> };
function empty(): Store {
  return { version: 1, since: dayKey(), total: zero(), days: {}, pages: {}, sections: {}, devices: {}, knownIds: [] };
}
async function load(): Promise<Store> {
  if (g.__stats) return g.__stats;
  if (!g.__statsLoad) {
    g.__statsLoad = (async () => {
      let s: Store;
      try { s = { ...empty(), ...JSON.parse(await fs.readFile(FILE, "utf8")) }; } catch { s = empty(); }
      g.__stats = s; g.__known = new Set(s.knownIds); g.__online = new Map();
      return s;
    })();
  }
  return g.__statsLoad;
}
function scheduleSave() {
  if (g.__timer) return;
  g.__timer = setTimeout(async () => {
    g.__timer = undefined;
    const s = g.__stats;
    if (!s) return;
    s.knownIds = Array.from(g.__known || []);
    try {
      await fs.mkdir(STATS_DIR, { recursive: true });
      const tmp = FILE + ".tmp";
      await fs.writeFile(tmp, JSON.stringify(s));
      await fs.rename(tmp, FILE);
    } catch (e) { console.error("[stats] save failed", e); }
  }, 3000);
}
function getDay(s: Store, k: string): Day {
  return (s.days[k] ||= { ...zero(), pages: {}, ids: [] });
}

/* ============================ API ============================ */
export async function recordView(input: { path: string; vid: string; newVisit: boolean; device: string; ua: string }) {
  if (!STATS_READY || !input.vid || BOT.test(input.ua)) return false;
  const p = input.path.split("?")[0].slice(0, 120) || "/";
  if (!/^\/[\w\-/.]*$/.test(p)) return false;
  const id = h(input.vid);
  if (USE_REDIS) { await rView(p, id, input.newVisit, input.device); return true; }
  const s = await load();
  const k = dayKey();
  const d = getDay(s, k);
  d.views++; s.total.views++;
  d.pages[p] = (d.pages[p] || 0) + 1;
  s.pages[p] = (s.pages[p] || 0) + 1;
  const sec = sectionOf(p);
  s.sections[sec] = (s.sections[sec] || 0) + 1;
  if (input.newVisit) { d.visits++; s.total.visits++; }
  if (!d.ids.includes(id)) {
    d.ids.push(id); d.visitors++;
    const dev = DEVICES.includes(input.device) ? input.device : "desktop";
    s.devices[dev] = (s.devices[dev] || 0) + 1;
  }
  if (!g.__known!.has(id)) { g.__known!.add(id); s.total.visitors++; }
  g.__online!.set(id, Date.now());
  for (const [kk, dd] of Object.entries(s.days)) if (kk !== k && dd.ids.length) dd.ids = [];
  scheduleSave();
  return true;
}

export async function recordDownload(ua: string) {
  if (!STATS_READY || BOT.test(ua)) return;
  if (USE_REDIS) {
    const d = dayKey();
    await redis([["SETNX", K("since"), d], ["SADD", K("days"), d], ["INCR", K("total:downloads")], ["INCR", K(`day:${d}:downloads`)]]);
    return;
  }
  const s = await load();
  getDay(s, dayKey()).downloads++;
  s.total.downloads++;
  scheduleSave();
}

function periodKeys() {
  const now = new Date();
  const today = dayKey(now);
  const yesterday = dayKey(new Date(now.getTime() - 86400000));
  const week = Array.from({ length: 7 }, (_, i) => dayKey(new Date(now.getTime() - i * 86400000)));
  return { today, yesterday, week, month: today.slice(0, 7), year: today.slice(0, 4) };
}
function sumDays(days: Record<string, Counts>, pred: (k: string) => boolean): Counts {
  const r = zero();
  for (const [k, d] of Object.entries(days)) if (pred(k)) { r.views += d.views; r.visits += d.visits; r.visitors += d.visitors; r.downloads += d.downloads || 0; }
  return r;
}
function build(since: string, total: Counts, days: Record<string, Counts>, online: number) {
  const P = periodKeys();
  const wk = new Set(P.week);
  return {
    ready: STATS_READY,
    since,
    today: sumDays(days, (k) => k === P.today),
    yesterday: sumDays(days, (k) => k === P.yesterday),
    week: sumDays(days, (k) => wk.has(k)),
    month: sumDays(days, (k) => k.startsWith(P.month)),
    year: sumDays(days, (k) => k.startsWith(P.year)),
    total,
    online,
  };
}

async function redisAll() {
  const r = await redis([
    ["GET", K("since")], ["GET", K("total:views")], ["GET", K("total:visits")], ["SCARD", K("ids")], ["GET", K("total:downloads")],
    ["SMEMBERS", K("days")], ["ZCOUNT", K("online"), Date.now() - ONLINE_MS, "+inf"],
  ]);
  const days = await rDays(((r[5] as string[]) || []).sort());
  const total = { views: num(r[1]), visits: num(r[2]), visitors: num(r[3]), downloads: num(r[4]) };
  return { since: (r[0] as string) || dayKey(), total, days, online: num(r[6]) };
}

export async function summary() {
  if (!STATS_READY) return build(dayKey(), zero(), {}, 0);
  if (USE_REDIS) {
    const a = await redisAll();
    return build(a.since, a.total, a.days, a.online);
  }
  const s = await load();
  const cutoff = Date.now() - ONLINE_MS;
  let online = 0;
  for (const [id, t] of Array.from(g.__online!.entries())) { if (t >= cutoff) online++; else g.__online!.delete(id); }
  return build(s.since, s.total, s.days, online);
}

export async function report() {
  let since: string, total: Counts, days: Record<string, Counts>, online: number;
  let pages: Record<string, number> = {}, sections: Record<string, number> = {}, devices: Record<string, number> = {};
  if (!STATS_READY) { since = dayKey(); total = zero(); days = {}; online = 0; }
  else if (USE_REDIS) {
    const a = await redisAll();
    ({ since, total, days, online } = a);
    const r = await redis([["HGETALL", K("pages")], ["HGETALL", K("sections")], ["HGETALL", K("devices")]]);
    pages = hobj(r[0]); sections = hobj(r[1]); devices = hobj(r[2]);
  } else {
    const s = await load();
    since = s.since; total = s.total; days = s.days; pages = s.pages; sections = s.sections; devices = s.devices;
    const sm = await summary(); online = sm.online;
  }
  const dl = Object.keys(days).sort().map((k) => ({ date: k, views: days[k].views, visits: days[k].visits, visitors: days[k].visitors, downloads: days[k].downloads || 0 }));
  const months: Record<string, Counts> = {};
  for (const d of dl) {
    const m = (months[d.date.slice(0, 7)] ||= zero());
    m.views += d.views; m.visits += d.visits; m.visitors += d.visitors; m.downloads += d.downloads;
  }
  const pg = Object.entries(pages).sort((a, b) => b[1] - a[1]).map(([p, v]) => ({ path: p, section: sectionOf(p), views: v }));
  return { summary: build(since, total, days, online), days: dl, months: Object.entries(months).map(([m, v]) => ({ month: m, ...v })), pages: pg, sections, devices };
}
