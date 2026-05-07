"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Quote, Star } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import { testimonials } from "@/data/testimonials";

export default function TestimonialsCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: true });
  const [index, setIndex] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!embla) return;
    setSnaps(embla.scrollSnapList());
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
  }, [embla]);

  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);

  return (
    <section
      id="testimonials"
      className="relative py-20 sm:py-28 scroll-mt-16"
      aria-label="คำชมจากลูกค้า"
    >
      <div className="px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title="ลูกค้าพูดเองว่ายังไง"
          subtitle="คำชมจริงจากเจ้าของแบรนด์ที่ทำงานกับเรา"
        />
      </div>

      <div className="relative mt-12 sm:mt-16">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-5 px-6">
            {testimonials.map((t) => (
              <figure
                key={t.id}
                className="
                  flex-shrink-0
                  w-[88%] sm:w-[60%] md:w-[44%]
                  rounded-2xl p-6
                  bg-gradient-to-br from-white/[0.05] to-white/[0.02]
                  border border-white/10
                "
              >
                <Quote className="w-5 h-5 text-rose-400/70 mb-3" />
                <blockquote className="text-base sm:text-lg leading-relaxed text-white/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/55">
                      {t.role} · {t.company}
                    </p>
                  </div>
                  {t.rating && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-1.5 mt-6">
          {snaps.map((_, i) => (
            <button
              key={i}
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 brand-bg" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
