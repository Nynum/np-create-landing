import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MessageCircle } from "lucide-react";
import { insights, getInsightBySlug } from "@/data/insights";
import { siteConfig } from "@/data/site-config";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import Footer from "@/components/layout/Footer";

type Params = { slug: string };

// สร้างหน้าแบบ static เฉพาะ slug ที่มีจริง (slug แปลกปลอม → 404)
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) return {};

  const url = `/insights/${insight.slug}`;
  return {
    title: insight.title,
    description: insight.excerpt,
    keywords: insight.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url: `${siteConfig.url}${url}`,
      title: insight.title,
      description: insight.excerpt,
      publishedTime: insight.date,
      modifiedTime: insight.updated ?? insight.date,
      section: insight.category,
      tags: insight.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: insight.title,
      description: insight.excerpt,
    },
  };
}

export default async function InsightArticle({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) notFound();

  const url = `${siteConfig.url}/insights/${insight.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      articleJsonLd(insight),
      breadcrumbJsonLd([
        { name: "หน้าแรก", url: siteConfig.url },
        { name: "บทความ", url: `${siteConfig.url}/insights` },
        { name: insight.title, url },
      ]),
      ...(insight.faq?.length ? [faqJsonLd(insight.faq)] : []),
    ],
  };

  const dateLabel = new Date(insight.date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-10">
        {/* Breadcrumb / back */}
        <Link
          href="/insights"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> บทความทั้งหมด
        </Link>

        {/* Header */}
        <header className="mt-6">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-rose-400">
            {insight.category}
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white leading-tight">
            {insight.title}
          </h1>
          <p className="mt-3 text-base text-white/70 leading-relaxed">
            {insight.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
            <time dateTime={insight.date}>{dateLabel}</time>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {insight.readTime}
            </span>
          </div>
        </header>

        {/* Body */}
        <div className="mt-10 space-y-8">
          {insight.content.map((block) => (
            <section key={block.heading}>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {block.heading}
              </h2>
              {block.body.map((p, i) => (
                <p
                  key={i}
                  className="mt-3 text-[15px] text-white/75 leading-relaxed"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* FAQ */}
        {insight.faq?.length ? (
          <section className="mt-12 pt-8 border-t border-white/10">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              คำถามที่พบบ่อย
            </h2>
            <div className="mt-5 space-y-4">
              {insight.faq.map((f) => (
                <div key={f.q}>
                  <h3 className="text-[15px] font-semibold text-white">
                    {f.q}
                  </h3>
                  <p className="mt-1.5 text-sm text-white/70 leading-relaxed">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* CTA */}
        <aside className="mt-12 rounded-2xl border border-white/12 bg-white/[0.04] p-6 text-center">
          <p className="text-white font-semibold">
            อยากให้ทีมเราดูแลการตลาดให้?
          </p>
          <p className="mt-1.5 text-sm text-white/60">
            ปรึกษาฟรี ตอบไว — ทักไลน์ {siteConfig.lineOa.id}
          </p>
          <a
            href={siteConfig.contactExternal.contactMarketing}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 min-h-[48px] px-6 rounded-full brand-bg text-white text-sm font-semibold transition hover:brightness-110 active:brightness-95"
          >
            <MessageCircle className="w-4 h-4" /> ติดต่อดูแลการตลาด
          </a>
        </aside>
      </article>

      <Footer />
    </main>
  );
}
