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

export function getModuleContent(id: string) {
  return readMarkdown("modules", `module-${id.padStart(2, "0")}.md`, `# ไม่พบเนื้อหาหน่วยที่ ${id}`);
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
