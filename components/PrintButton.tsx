"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label = "พิมพ์" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-green-600 dark:bg-green-700 text-white border border-green-700 dark:border-green-600 hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-sm print:hidden"
    >
      <Printer className="w-4 h-4" /> {label}
    </button>
  );
}
