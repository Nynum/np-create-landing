"use client";

import { useActiveSection } from "@/hooks/useActiveSection";
import { sections } from "@/data/site-config";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const ids = sections.map((s) => s.id);

export default function SectionDots() {
  const active = useActiveSection(ids);
  const isTabletUp = useMediaQuery("(min-width: 768px)");
  if (!isTabletUp) return null;

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            aria-current={isActive ? "true" : undefined}
            className="group relative grid place-items-center w-6 h-6"
          >
            <span
              className={`
                block rounded-full transition-all duration-300
                ${isActive
                  ? "w-3 h-3 bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.7)]"
                  : "w-2 h-2 bg-white/30 group-hover:bg-white/60"}
              `}
            />
            <span
              className="
                absolute right-full mr-3 px-2 py-1
                text-[11px] font-medium whitespace-nowrap rounded-md
                bg-black/70 text-white border border-white/10
                opacity-0 -translate-x-1 transition-all duration-200
                group-hover:opacity-100 group-hover:translate-x-0
              "
            >
              {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
