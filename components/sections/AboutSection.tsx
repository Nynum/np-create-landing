"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import { Award } from "lucide-react";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-20 sm:py-28 px-6 scroll-mt-16"
      aria-label="เกี่ยวกับ NP Create"
    >
      <SectionHeading
        eyebrow="About Us"
        title="ทีมที่ทำให้ตัวเลขเปลี่ยน"
        subtitle="NP Create — เอเจนซี่ที่ขับเคลื่อนด้วยผลลัพธ์จริง ไม่ใช่ slide สวย ไม่ใช่ buzzword เราวัด ROI ทุกบาท"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="
          relative max-w-3xl mx-auto mt-12
          grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6
        "
      >
        {[
          { title: "ROI 30+", desc: "ค่าเฉลี่ยจากแคมเปญลูกค้าจริง" },
          { title: "TikTok Top Agency", desc: "คนแรกของประเทศไทย" },
          { title: "120+", desc: "แบรนด์ที่ดูแลในแต่ละเดือน" },
        ].map((item) => (
          <div
            key={item.title}
            className="
              relative rounded-2xl p-5
              bg-white/[0.03] border border-white/10
              hover:bg-white/[0.05] transition-colors
            "
          >
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-rose-400" />
              <span className="text-xs uppercase tracking-wider text-white/50">
                Proof
              </span>
            </div>
            <p className="text-2xl font-bold brand-gradient">{item.title}</p>
            <p className="text-sm text-white/60 mt-1">{item.desc}</p>
          </div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="
          max-w-2xl mx-auto mt-10 sm:mt-12
          text-base sm:text-lg leading-relaxed text-white/70 text-center
        "
      >
        เราเริ่มจากการเป็นทีมเล็กๆ ที่อยากเปลี่ยนวงการ digital marketing ของไทย
        ให้วัดผลได้จริง โปร่งใส และผูกความสำเร็จของลูกค้าเป็นความสำเร็จของเราเอง
      </motion.p>
    </section>
  );
}
