"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import { caseStudies } from "@/data/case-studies";

export default function PortfolioCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  useEffect(() => {
    if (!embla) return;
    setSnaps(embla.scrollSnapList());
    const onSelect = () => setSelectedIndex(embla.selectedScrollSnap());
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
  }, [embla]);

  return (
    <section
      id="portfolio"
      className="relative py-20 sm:py-28 scroll-mt-16"
      aria-label="ผลงานของเรา"
    >
      <div className="px-6">
        <SectionHeading
          eyebrow="Portfolio"
          title="ผลงานที่พิสูจน์แล้ว"
          subtitle="case study จริงที่ได้ผลจริง — ตัวเลขที่ลูกค้ายืนยัน"
        />
      </div>

      <div className="relative mt-12 sm:mt-16">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-5 px-6 pb-2">
            {caseStudies.map((c) => (
              <article
                key={c.id}
                className="
                  flex-shrink-0
                  w-[85%] sm:w-[60%] md:w-[40%] lg:w-[32%]
                  rounded-2xl overflow-hidden
                  bg-gradient-to-br from-white/[0.05] to-white/[0.02]
                  border border-white/10
                "
              >
                <div className="aspect-[16/10] relative bg-gradient-to-br from-rose-900/40 via-red-800/30 to-orange-700/30 overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at top right, rgba(244,63,94,0.4), transparent 60%)",
                    }}
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-semibold tracking-wider uppercase border border-white/10">
                    {c.category}
                  </span>
                  <p className="absolute bottom-3 left-4 right-4 text-xs text-white/70 italic">
                    {c.client}
                  </p>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white leading-snug min-h-[3.5rem]">
                    {c.title}
                  </h3>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
                    {c.results.map((r) => (
                      <div key={r.label} className="text-center">
                        <p className="text-base font-bold brand-gradient">
                          {r.value}
                        </p>
                        <p className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
                          {r.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-xs text-white/60 leading-relaxed line-clamp-3">
                    <span className="text-white/80 font-medium">Approach: </span>
                    {c.approach}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 mt-6 flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex gap-1.5">
            {snaps.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => embla?.scrollTo(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === selectedIndex
                    ? "w-8 brand-bg"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              aria-label="ก่อนหน้า"
              className="grid place-items-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition disabled:opacity-30"
              disabled={selectedIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="ถัดไป"
              className="grid place-items-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition disabled:opacity-30"
              disabled={selectedIndex >= snaps.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
