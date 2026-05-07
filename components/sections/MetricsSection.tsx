"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { metrics } from "@/data/metrics";

export default function MetricsSection() {
  return (
    <section
      id="metrics"
      className="relative py-20 sm:py-28 px-6 scroll-mt-16 overflow-hidden"
      aria-label="ตัวเลข impact"
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(220,38,38,0.15) 0%, transparent 60%)",
        }}
      />

      <SectionHeading
        eyebrow="Impact"
        title="ตัวเลขที่พูดแทนเรา"
        subtitle="ทุกตัวเลขมาจากแคมเปญและลูกค้าจริง — ตรวจสอบได้"
      />

      <div className="max-w-5xl mx-auto mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {metrics.map((m, i) => {
          const Icon = m.Icon;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="
                relative rounded-2xl p-5 sm:p-6 text-center
                bg-white/[0.03] border border-white/10
              "
            >
              <Icon className="w-5 h-5 mx-auto text-rose-400 mb-2" />
              <div className="text-3xl sm:text-4xl font-bold brand-gradient leading-none">
                <AnimatedCounter
                  to={m.value}
                  prefix={m.prefix ?? ""}
                  suffix={m.suffix ?? ""}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-white/90">{m.label}</p>
              {m.description && (
                <p className="mt-1 text-xs text-white/50">{m.description}</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
