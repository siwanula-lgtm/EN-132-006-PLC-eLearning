import type { Metadata } from "next";
import "@fontsource/prompt/300.css";
import "@fontsource/prompt/400.css";
import "@fontsource/prompt/500.css";
import "@fontsource/prompt/600.css";
import "@fontsource/prompt/700.css";
import "@fontsource/source-code-pro/400.css";
import "@fontsource/source-code-pro/600.css";
import "katex/dist/katex.min.css";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { course } from "@/lib/course";

export const metadata: Metadata = {
  title: `${course.titleTh} (${course.titleEn}) | ${course.code}`,
  description:
    "สื่อการสอนออนไลน์รายวิชาโปรแกรมเมเบิลลอจิกคอนโทรลเลอร์ 10 หน่วยเรียน พร้อมแผนการสอน ใบงานปฏิบัติ แบบทบทวน และแบบทดสอบก่อน/หลังเรียน",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-prompt bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
