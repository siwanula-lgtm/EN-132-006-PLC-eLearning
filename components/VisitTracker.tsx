"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_MS = 30 * 60 * 1000; // การเข้าใช้ 1 ครั้ง (Visit) สิ้นสุดเมื่อไม่มีการใช้งานเกิน 30 นาที

function anonId(): string {
  try {
    let v = localStorage.getItem("vid");
    if (!v) {
      v = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));
      localStorage.setItem("vid", v);
    }
    return v;
  } catch {
    return "anon-" + Math.random().toString(36).slice(2);
  }
}

function isNewVisit(): boolean {
  try {
    const last = Number(sessionStorage.getItem("lastSeen") || 0);
    sessionStorage.setItem("lastSeen", String(Date.now()));
    return !last || Date.now() - last > SESSION_MS;
  } catch {
    return true;
  }
}

function device(): string {
  const w = window.innerWidth;
  return w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";
}

export default function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) return;
    const body = JSON.stringify({ path: pathname, vid: anonId(), newVisit: isNewVisit(), device: device() });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "text/plain" }));
      else fetch("/api/track", { method: "POST", body, keepalive: true });
    } catch {}
    window.dispatchEvent(new Event("stats:refresh"));
  }, [pathname]);
  return null;
}
