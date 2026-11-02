import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, FileEdit, PenSquare } from "lucide-react";
import { modules, getModuleById } from "@/lib/modules-data";
import { getPlanContent } from "@/lib/content";
import { course } from "@/lib/course";
import MarkdownContent from "@/components/MarkdownContent";
import PrevNextNav from "@/components/PrevNextNav";
import PrintButton from "@/components/PrintButton";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return modules.map((mod) => ({ id: mod.id }));
}

export function generateMetadata({ params }: PageProps) {
  const mod = getModuleById(params.id);
  if (!mod) return { title: "Not Found" };
  return {
    title: `แผนการจัดการเรียนรู้ที่ ${Number(mod.id)}: ${mod.titleTh} | ${course.code}`,
    description: `แผนการจัดการเรียนรู้ประจำหน่วยที่ ${Number(mod.id)} - ${mod.titleTh}`,
  };
}

export default async function PlanPage({ params }: PageProps) {
  const mod = getModuleById(params.id);
  if (!mod) notFound();

  const markdown = await getPlanContent(params.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 print:hidden">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          หน้าหลัก
        </Link>
        <span>/</span>
        <Link href={`/module/${mod.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          หน่วยที่ {Number(mod.id)}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">แผนการจัดการเรียนรู้</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-medium mb-3">
          แผนการจัดการเรียนรู้ · สัปดาห์ที่ {mod.week} · {mod.hoursT + mod.hoursP} ชั่วโมง (ท {mod.hoursT} / ป {mod.hoursP})
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
          แผนการจัดการเรียนรู้ที่ {Number(mod.id)}: {mod.titleTh}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {mod.titleEn} · {mod.clo}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 print:hidden">
        <Link
          href={`/module/${mod.id}`}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          <BookOpen className="w-4 h-4" /> ใบความรู้หน่วยที่ {Number(mod.id)}
        </Link>
        <Link
          href={`/exam/pre/${mod.id}`}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
        >
          <PenSquare className="w-4 h-4" /> แบบทดสอบก่อนเรียน
        </Link>
        <Link
          href={`/lab/${mod.id}`}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
        >
          <FileEdit className="w-4 h-4" /> ใบงานปฏิบัติ
        </Link>
        <PrintButton label="พิมพ์แผนการสอน" />
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-800 mb-8" />

      <article className="max-w-none">
        <MarkdownContent content={markdown} />
      </article>

      <div className="h-px bg-gray-200 dark:bg-gray-800 my-10 print:hidden" />

      <div className="print:hidden">
        <PrevNextNav id={mod.id} kind="plan" />
      </div>
    </div>
  );
}
