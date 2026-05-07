"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import { services } from "@/data/services";
import { Check } from "lucide-react";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative py-20 sm:py-28 px-6 scroll-mt-16"
      aria-label="บริการของเรา"
    >
      <SectionHeading
        eyebrow="Services"
        title="บริการที่พิสูจน์ผลลัพธ์ได้"
        subtitle="ตั้งแต่ strategy ถึง execution — ครอบคลุมทุก touchpoint ที่ทำให้ธุรกิจของคุณโตจริง"
      />

      <div className="max-w-5xl mx-auto mt-12 sm:mt-16 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Icon = s.Icon;
          return (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="
                group relative rounded-2xl p-6
                bg-white/[0.03] border border-white/10
                hover:border-rose-500/40 hover:bg-white/[0.06]
                transition-colors
              "
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="
                    grid place-items-center w-11 h-11 rounded-xl
                    brand-bg shadow-lg shadow-rose-700/20
                  "
                >
                  <Icon className="w-5 h-5 text-white" />
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {s.title}
                </h3>
              </div>

              <p className="text-sm text-white/65 leading-relaxed">
                {s.description}
              </p>

              <ul className="mt-4 space-y-1.5">
                {s.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-2 text-xs text-white/70"
                  >
                    <Check className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
