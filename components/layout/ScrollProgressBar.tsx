"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function ScrollProgressBar() {
  const progress = useScrollProgress();
  return (
    <div
      aria-hidden
      className="fixed top-0 inset-x-0 h-[3px] z-[60] pointer-events-none"
    >
      <div
        className="h-full origin-left brand-bg shadow-[0_0_12px_rgba(220,38,38,0.6)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
