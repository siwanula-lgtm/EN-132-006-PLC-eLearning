import Link from "next/link";
import {
  BookOpen,
  FileEdit,
  ClipboardCheck,
  ArrowRight,
  GraduationCap,
  Layers,
  PenSquare,
  Target,
  Library,
  NotebookText,
  ClipboardList,
} from "lucide-react";
import { modules, colorMap } from "@/lib/modules-data";
import { course, clos } from "@/lib/course";
import ModuleIcon from "@/components/ModuleIcon";

const totalT = modules.reduce((a, m) => a + m.hoursT, 0);
const totalP = modules.reduce((a, m) => a + m.hoursP, 0);

const stats = [
  { icon: BookOpen, label: `${modules.length} หน่วยเรียน`, sub: `ท ${totalT} · ป ${totalP} ชั่วโมง`, color: "text-blue-600 dark:text-blue-400" },
  { icon: FileEdit, label: `${modules.reduce((a, m) => a + m.labCount, 0)} ใบงานปฏิบัติ`, sub: "Lab Worksheets", color: "text-green-600 dark:text-green-400" },
  { icon: ClipboardCheck, label: `${modules.length} แบบทบทวน`, sub: "Review Sheets", color: "text-orange-600 dark:text-orange-400" },
  { icon: PenSquare, label: `${modules.length * 2} แบบทดสอบ`, sub: "ก่อนเรียน / หลังเรียน", color: "text-purple-600 dark:text-purple-400" },
];

const textbooks = [
  "พิศนุรัตน์ เขจร. FX5U และการใช้ GX WORKS3.",
  "พิศนุรัตน์ เขจร. PLC และการควบคุมเซอร์โวมอเตอร์.",
  "พิศนุรัตน์ เขจร. PLC กับการควบคุมแบบซีเควนซ์.",
  "คู่มือการเขียน HMI GOT1000 / GOT2000 ด้วย GT Designer3.",
  "Mitsubishi Electric Corporation. MELSEC iQ-F FX5 User's Manual / Your First PLC.",
  "International Electrotechnical Commission. (2013). IEC 61131-3 Programming languages.",
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium mb-4">
          <GraduationCap className="w-3.5 h-3.5" />
          สื่อการสอนออนไลน์ · ภาคการศึกษาที่ {course.semester}/{course.year}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {course.code} {course.titleEn}
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {course.titleTh} <span className="text-lg font-medium text-gray-500 dark:text-gray-400">{course.credits}</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-1">จัดทำโดย</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{course.instructor}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {course.program} {course.faculty}
        </p>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
          เรียนรู้โครงสร้างและหลักการทำงานของ PLC การต่อวงจรอินพุต/เอาต์พุต การเขียนโปรแกรม Ladder ด้วย GX Works3
          การออกแบบหน้าจอ HMI ด้วย GT Designer3 การสื่อสารข้อมูล การประยุกต์ใช้ควบคุมงานเมคคาทรอนิกส์
          ไปจนถึงการตรวจสอบและบำรุงรักษาระบบ PLC พร้อมใบงานปฏิบัติ แบบฝึกหัด และแบบทดสอบก่อน/หลังเรียนทุกหน่วย
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {stats.map(({ icon: Icon, label, sub, color }) => (
          <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <Icon className={`w-5 h-5 ${color}`} />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Course info */}
      <Link
        href="/course-info"
        className="flex items-center gap-4 p-5 mb-12 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 hover:shadow-md transition-all"
      >
        <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
          <ClipboardList className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 dark:text-white">ข้อมูลรายวิชา</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ลักษณะของรายวิชา การแบ่งหน่วย/บทเรียน/หัวข้อ จุดประสงค์การสอน กำหนดการสอน การประเมินผล และตารางกำหนดน้ำหนักคะแนน
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      </Link>

      {/* Module List */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
        <Layers className="w-5 h-5" />
        หน่วยเรียนทั้งหมด
      </h2>

      <div className="space-y-3">
        {modules.map((mod) => {
          const colors = colorMap[mod.color] ?? colorMap.blue;
          return (
            <div
              key={mod.id}
              className={`group flex items-start gap-4 p-4 rounded-xl border ${colors.border} hover:shadow-md transition-all bg-white dark:bg-gray-900`}
            >
              <Link
                href={`/module/${mod.id}`}
                className={`flex-shrink-0 w-11 h-11 rounded-xl ${colors.bg} ${colors.text} flex flex-col items-center justify-center hover:opacity-80 transition-opacity`}
              >
                <ModuleIcon name={mod.icon} className="w-4 h-4" />
                <span className="text-[10px] font-bold leading-none mt-0.5">{mod.id}</span>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/module/${mod.id}`} className="block">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      หน่วยที่ {Number(mod.id)} {mod.titleTh}
                    </h3>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                      สัปดาห์ที่ {mod.week} · ท {mod.hoursT} / ป {mod.hoursP} ชม. · {mod.clo}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{mod.titleEn}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{mod.description}</p>
                </Link>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Link
                    href={`/plan/${mod.id}`}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors"
                  >
                    <NotebookText className="w-3 h-3" /> แผนการสอน
                  </Link>
                  <Link
                    href={`/exam/pre/${mod.id}`}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    <PenSquare className="w-3 h-3" /> ก่อนเรียน
                  </Link>
                  <Link
                    href={`/lab/${mod.id}`}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                  >
                    <FileEdit className="w-3 h-3" /> ใบงาน
                  </Link>
                  <a
                    href={`/api/content/SHEET/${mod.reviewSheet}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                  >
                    <ClipboardCheck className="w-3 h-3" /> Review
                  </a>
                  <Link
                    href={`/exam/post/${mod.id}`}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md bg-purple-600 dark:bg-purple-700 text-white hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                  >
                    <PenSquare className="w-3 h-3" /> หลังเรียน
                  </Link>
                </div>
              </div>

              <Link href={`/module/${mod.id}`} className="flex-shrink-0 mt-1" aria-label={`ไปที่หน่วยที่ ${mod.id}`}>
                <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* CLOs */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-12 mb-5 flex items-center gap-2">
        <Target className="w-5 h-5" />
        ผลลัพธ์การเรียนรู้ระดับรายวิชา (CLOs)
      </h2>
      <div className="grid md:grid-cols-2 gap-3">
        {clos.map((clo) => {
          const related = modules.filter((m) => m.clo === clo.id).map((m) => Number(m.id));
          return (
            <div key={clo.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <p className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-1">
                {clo.id} <span className="font-normal text-gray-500 dark:text-gray-400">· น้ำหนัก {clo.weight}%</span>
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{clo.text}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {related.length > 0 ? `หน่วยที่ ${related.join(", ")}` : "ประเมินจากจิตพิสัย รายงาน และการนำเสนอผลงาน"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Textbooks */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">ตำราและเอกสารหลักของรายวิชา</h3>
            <ul className="space-y-1.5 text-sm text-blue-50">
              {textbooks.map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
