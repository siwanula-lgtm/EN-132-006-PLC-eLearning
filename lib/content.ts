import { readFile } from "fs/promises";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

import type { ExamData } from "./exam-types";
export type { ExamData, ExamKind, ExamQuestion, ExamChoice } from "./exam-types";
export { examKindLabel } from "./exam-types";

async function readMarkdown(subdir: string, filename: string, fallback: string) {
  try {
    return await readFile(path.join(CONTENT_DIR, subdir, filename), "utf-8");
  } catch {
    return fallback;
  }
}

/** ใบความรู้ + แทรกตัวอย่างโจทย์ (content/examples/example-XX.md) ไว้ก่อนแบบฝึกหัดท้ายหน่วย */
export async function getModuleContent(id: string) {
  const num = id.padStart(2, "0");
  const body = await readMarkdown("modules", `module-${num}.md`, `# ไม่พบเนื้อหาหน่วยที่ ${id}`);
  const examples = await readMarkdown("examples", `example-${num}.md`, "");
  if (!examples.trim()) return body;
  const marker = "## แบบฝึกหัดท้ายหน่วยเรียน";
  const at = body.indexOf(marker);
  return at < 0 ? `${body}\n\n${examples}` : `${body.slice(0, at)}${examples.trim()}\n\n${body.slice(at)}`;
}

export function getLabContent(id: string) {
  return readMarkdown("labs", `lab-${id.padStart(2, "0")}.md`, `# ไม่พบใบงานที่ ${id}`);
}

export function getPlanContent(id: string) {
  return readMarkdown("plans", `plan-${id.padStart(2, "0")}.md`, `# ไม่พบแผนการจัดการเรียนรู้ที่ ${id}`);
}

export async function getExam(kind: string, id: string): Promise<ExamData | undefined> {
  if (kind !== "pre" && kind !== "post") return undefined;
  try {
    const raw = await readFile(path.join(CONTENT_DIR, "exams", `${kind}-${id.padStart(2, "0")}.json`), "utf-8");
    return JSON.parse(raw) as ExamData;
  } catch {
    return undefined;
  }
}

export function getCourseInfoContent() {
  return readMarkdown("", "course-info.md", "# ยังไม่มีข้อมูลรายวิชา");
}
