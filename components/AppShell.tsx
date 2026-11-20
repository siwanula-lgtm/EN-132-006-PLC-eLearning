"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import VisitTracker from "./VisitTracker";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <VisitTracker />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-14">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </>
  );
}
