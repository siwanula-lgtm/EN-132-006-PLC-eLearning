import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { getCourseInfoContent } from "@/lib/content";
import { course } from "@/lib/course";
import MarkdownContent from "@/components/MarkdownContent";
import PrintButton from "@/components/PrintButton";

export const metadata = {
  title: `ข้อมูลรายวิชา | ${course.code}`,
  description: "ลักษณะของรายวิชา การแบ่งหน่วย จุดประสงค์การสอน กำหนดการสอน การประเมินผล และตารางกำหนดน้ำหนักคะแนน",
};

export default async function CourseInfoPage() {
  const markdown = await getCourseInfoContent();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 print:hidden">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          หน้าหลัก
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">ข้อมูลรายวิชา</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium mb-3">
            <ClipboardList className="w-3.5 h-3.5" /> ข้อมูลรายวิชา
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {course.code} {course.titleTh}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {course.titleEn} · {course.credits} หน่วยกิต · ภาคการศึกษาที่ {course.semester}/{course.year}
          </p>
        </div>
        <PrintButton label="พิมพ์ข้อมูลรายวิชา" />
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-800 mb-8" />

      <article className="max-w-none">
        <MarkdownContent content={markdown} />
      </article>
    </div>
  );
}
