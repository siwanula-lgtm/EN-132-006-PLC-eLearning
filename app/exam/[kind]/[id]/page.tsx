import { notFound } from "next/navigation";
import { modules, getModuleById } from "@/lib/modules-data";
import { getExam, examKindLabel } from "@/lib/content";
import { course } from "@/lib/course";
import ExamClient from "@/components/ExamClient";

interface PageProps {
  params: { kind: string; id: string };
}

export function generateStaticParams() {
  return modules.flatMap((mod) => [
    { kind: "pre", id: mod.id },
    { kind: "post", id: mod.id },
  ]);
}

export function generateMetadata({ params }: PageProps) {
  const mod = getModuleById(params.id);
  if (!mod || (params.kind !== "pre" && params.kind !== "post")) return {};
  return {
    title: `${examKindLabel[params.kind]} หน่วยที่ ${Number(mod.id)}: ${mod.titleTh} | ${course.code}`,
    description: `${examKindLabel[params.kind]} หน่วยที่ ${Number(mod.id)} - ${mod.titleTh}`,
  };
}

export default async function ExamPage({ params }: PageProps) {
  const mod = getModuleById(params.id);
  if (!mod) notFound();

  const exam = await getExam(params.kind, params.id);
  if (!exam) notFound();

  return <ExamClient exam={exam} moduleTitleTh={mod.titleTh} />;
}
