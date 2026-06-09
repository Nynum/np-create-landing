import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import { insights } from "@/data/insights";
import { siteConfig } from "@/data/site-config";
import { breadcrumbJsonLd } from "@/lib/seo";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "บทความและทิปการตลาดออนไลน์",
  description:
    "รวมบทความและ insight จากทีม NP Create — ยิงแอด TikTok, creative ที่ขายได้, การเลือก agency และเทคนิคการตลาดที่ทำได้จริง",
  alternates: { canonical: "/insights" },
};

export default function InsightsIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd([
        { name: "หน้าแรก", url: siteConfig.url },
        { name: "บทความ", url: `${siteConfig.url}/insights` },
      ]),
      {
        "@type": "CollectionPage",
        "@id": `${siteConfig.url}/insights#collection`,
        name: "บทความและทิปการตลาดออนไลน์",
        url: `${siteConfig.url}/insights`,
        inLanguage: "th-TH",
        isPartOf: { "@id": `${siteConfig.url}#website` },
      },
    ],
  };

  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> กลับหน้าแรก
        </Link>

        <header className="mt-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            บทความและทิปจากทีม
          </h1>
          <p className="mt-3 text-base text-white/70 leading-relaxed">
            เรียนรู้สิ่งที่เราเห็นจากการดูแลแคมเปญจริงทุกวัน
          </p>
        </header>

        <div className="mt-10 grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-3">
          {insights.map((p) => (
            <Link
              key={p.id}
              href={`/insights/${p.slug}`}
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
              <h2 className="text-base font-bold text-white leading-snug">
                {p.title}
              </h2>
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
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
