// ชนิดข้อมูลแบบทดสอบ — ใช้ได้ทั้งฝั่ง server และ client
export interface ExamChoice {
  key: string;
  text: string;
}

export interface ExamQuestion {
  id: number;
  question: string;
  code?: string;
  choices: ExamChoice[];
  answer: string;
  explanation: string;
}

export type ExamKind = "pre" | "post";

export interface ExamData {
  moduleId: string;
  kind: ExamKind;
  title: string;
  titleTh: string;
  timeMinutes: number;
  questions: ExamQuestion[];
}

export const examKindLabel: Record<ExamKind, string> = {
  pre: "แบบทดสอบก่อนเรียน",
  post: "แบบทดสอบหลังเรียน",
};

