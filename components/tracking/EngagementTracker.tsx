"use client";

import { useEffect } from "react";
import { track } from "@/lib/tracking";

/**
 * EngagementTracker
 * --------------------------------------------------
 * วัด "ความสนใจ" ของผู้เข้าชมเพื่อสร้างชั้น Custom Audience สำหรับรีทาร์เก็ท:
 *  - view_content[section]  : เลื่อนเห็นแต่ละ section (IntersectionObserver)
 *  - scroll_depth 25/50/75/90
 *  - engaged_30s            : อยู่บนหน้า ≥ 30 วินาที
 * ยิงแต่ละ event ครั้งเดียวต่อการเข้าชม (no spam) — side-effect only, ไม่เรนเดอร์
 */
export default function EngagementTracker() {
  useEffect(() => {
    // ── 1) Section views ──
    const seenSections = new Set<string>();
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id]")
    );

    let observer: IntersectionObserver | undefined;
    if (sections.length > 0) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const id = entry.target.id;
            if (entry.isIntersecting && id && !seenSections.has(id)) {
              seenSections.add(id);
              track("view_content", {
                section: id,
                content_name: id,
                content_type: "section",
              });
            }
          }
        },
        { threshold: 0.5 }
      );
      sections.forEach((s) => observer!.observe(s));
    }

    // ── 2) Scroll depth ──
    const thresholds = [25, 50, 75, 90];
    const firedDepths = new Set<number>();
    let scrollScheduled = false;

    const measureScroll = () => {
      scrollScheduled = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((window.scrollY / scrollable) * 100);
      for (const t of thresholds) {
        if (pct >= t && !firedDepths.has(t)) {
          firedDepths.add(t);
          track("scroll_depth", { percent: t });
        }
      }
    };

    const onScroll = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(measureScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── 3) Engaged 30s ──
    const engagedTimer = window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        track("engaged_30s", { seconds: 30 });
      }
    }, 30_000);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(engagedTimer);
    };
  }, []);

  return null;
}
