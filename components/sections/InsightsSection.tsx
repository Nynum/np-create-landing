"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import { insights } from "@/data/insights";
import { ArrowUpRight, Clock } from "lucide-react";

export default function InsightsSection() {
  return (
    <section
      id="insights"
      className="relative py-20 sm:py-28 px-6 scroll-mt-16"
      aria-label="บทความและทิป"
    >
      <SectionHeading
        eyebrow="Insights"
        title="บทความและทิปจากทีม"
        subtitle="เรียนรู้สิ่งที่เราเห็นจากการดูแลแคมเปญจริงทุกวัน"
      />

      <div className="max-w-5xl mx-auto mt-12 sm:mt-16 grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-3">
        {insights.map((p, i) => (
          <motion.a
            key={p.id}
            href={`/insights/${p.slug}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="
              group relative rounded-2xl p-5
              bg-white/[0.03] border border-white/10
              hover:border-rose-500/40 hover:bg-white/[0.05] transition-colors
            "
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-rose-400">
                {p.category}
              </span>
              <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-rose-400 transition-colors" />
            </div>
            <h3 className="text-base font-bold text-white leading-snug">
              {p.title}
            </h3>
            <p className="mt-2 text-sm text-white/60 leading-relaxed line-clamp-3">
              {p.excerpt}
            </p>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
              <time dateTime={p.date}>
                {new Date(p.date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {p.readTime}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
