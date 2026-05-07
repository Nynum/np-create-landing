"use client";

import Image from "next/image";

/**
 * HeroSection — NP Create
 * --------------------------------------------------
 * - รูปยึดแนว top (object-position: top)
 * - ด้านล่างของรูป fade เป็น transparent ผ่าน CSS mask
 * - Mobile-first: รูป portrait เต็มจอบนมือถือ
 * - Tablet/Desktop: ครอป + จัดให้รูปอยู่ด้านบน, content ซ้อนทับ
 * - ⭐ Flash sweep effect: แสงปาดเฉียงๆ กวาดผ่านรูปทุก ~5 วินาที
 */
export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[100svh] overflow-hidden bg-black"
      aria-label="NP Create — Top Agency"
    >
      {/* ───────────── 1. Background Image (anchor top + gradient fade) ───────────── */}
      <div
        className="
          absolute inset-x-0 top-0
          h-[85vh] sm:h-[90vh] md:h-screen
          z-0
          overflow-hidden
        "
        style={{
          // ⭐ Key technique: mask gradient ทำให้รูปจางลงด้านล่าง
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
        }}
      >
        <Image
          src="/images/hero-np-create.png"
          alt="NP Create — Top Agency ROI 30+ คนแรกของประเทศไทย"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="
            object-cover
            object-top          /* ⭐ ยึดรูปไว้ด้านบน */
          "
        />

        {/* ⭐ Flash Sweep Blade — แสงปาดหลัก */}
        <div
          className="absolute inset-0 pointer-events-none flash-blade"
          style={{
            background: `linear-gradient(
              90deg,
              transparent 0%,
              transparent 35%,
              rgba(255, 255, 255, 0.08) 45%,
              rgba(255, 255, 255, 0.45) 50%,
              rgba(255, 255, 255, 0.08) 55%,
              transparent 65%,
              transparent 100%
            )`,
            mixBlendMode: "screen",
            width: "60%",
          }}
        />

        {/* ⭐ Flash Glow — แสงเรืองอ่อนๆ ทั่วรูป (ตอนแฟลช) */}
        <div
          className="absolute inset-0 pointer-events-none flash-glow"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 60%)",
            mixBlendMode: "screen",
          }}
        />

        {/* Optional: subtle dark vignette ด้านบน เพื่อให้ status bar ของ mobile อ่านง่าย */}
        <div
          className="absolute inset-x-0 top-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ───────────── 2. Spacer ให้รูปโชว์ก่อน content ───────────── */}
      {/* บน mobile รูปสูง ~70vh แล้วค่อยมี content ตามมา */}
      <div className="relative z-10 pt-[82vh] sm:pt-[85vh] md:pt-[88vh] pb-12 px-6">
        {/* Sub-headline / CTA ที่อยู่ใต้รูป (อยู่ในโซนที่ gradient จาง) */}
        <div className="max-w-md mx-auto text-center">
          <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6">
            พิสูจน์ความสำเร็จด้วย<span className="text-red-500 font-semibold">ผลลัพธ์จริง</span>
            <br />
            จาก TikTok Top Agency คนแรกของประเทศไทย
          </p>

          {/* Scroll indicator */}
          <div className="mt-8 flex justify-center">
            <ChevronDown className="w-6 h-6 text-white/60 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───── Inline SVG icon ───── */
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
