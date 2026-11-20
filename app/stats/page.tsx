import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { course } from "@/lib/course";
import StatsReport from "@/components/StatsReport";

export const metadata = {
  title: `สถิติการเข้าใช้เว็บไซต์ | ${course.code}`,
  description: "รายงานสถิติการเข้าใช้สื่อการสอนออนไลน์ จำนวนผู้เข้าใช้ จำนวนการเข้าใช้ และจำนวนการเปิดหน้า รายวัน รายเดือน และรายหน่วยเรียน",
};

export default function StatsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 print:hidden">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">หน้าหลัก</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">สถิติการเข้าใช้เว็บไซต์</span>
      </nav>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium mb-3">
          <BarChart3 className="w-3.5 h-3.5" /> รายงานสถิติ
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">สถิติการเข้าใช้สื่อการสอนออนไลน์</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          รายวิชา {course.code} {course.titleTh} ({course.titleEn})
        </p>
      </div>
      <StatsReport />
    </div>
  );
}
