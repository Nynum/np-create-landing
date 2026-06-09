import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";
import { verification } from "@/lib/tracking";
import type { Insight } from "@/data/insights";
import { services } from "@/data/services";

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.company }],
  creator: siteConfig.company,
  publisher: siteConfig.company,
  applicationName: siteConfig.shortName,
  alternates: {
    canonical: "/",
    languages: { "th-TH": "/" },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.shortName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: verification.google,
    other: {
      ...(verification.facebookDomain && {
        "facebook-domain-verification": verification.facebookDomain,
      }),
      ...(verification.bing && { "msvalidate.01": verification.bing }),
      ...(verification.pinterest && {
        "p:domain_verify": verification.pinterest,
      }),
    },
  },
  category: "marketing",
};

/* ──────────────── JSON-LD generators ──────────────── */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}#organization`,
    name: siteConfig.company,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.svg`,
    description: siteConfig.description,
    sameAs: siteConfig.social ? Object.values(siteConfig.social) : [],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.shortName,
    inLanguage: "th-TH",
    publisher: { "@id": `${siteConfig.url}#organization` },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}#localbusiness`,
    name: siteConfig.company,
    image: `${siteConfig.url}/og-image.png`,
    url: siteConfig.url,
    priceRange: "฿฿",
    address: {
      "@type": "PostalAddress",
      addressCountry: "TH",
    },
    sameAs: siteConfig.social ? Object.values(siteConfig.social) : [],
  };
}

/** บริการทั้งหมด → OfferCatalog (ตรงกับ Services section บนหน้าแรก) */
export function servicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${siteConfig.url}#services`,
    name: `บริการของ ${siteConfig.shortName}`,
    url: siteConfig.url,
    provider: { "@id": `${siteConfig.url}#organization` },
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.description,
        provider: { "@id": `${siteConfig.url}#organization` },
        areaServed: "TH",
      },
    })),
  };
}

/** บทความ → BlogPosting */
export function articleJsonLd(insight: Insight) {
  const url = `${siteConfig.url}/insights/${insight.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: insight.title,
    description: insight.excerpt,
    inLanguage: "th-TH",
    datePublished: insight.date,
    dateModified: insight.updated ?? insight.date,
    articleSection: insight.category,
    keywords: insight.keywords?.join(", "),
    image: `${siteConfig.url}/og-image.png`,
    author: { "@id": `${siteConfig.url}#organization` },
    publisher: { "@id": `${siteConfig.url}#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

/** เส้นทางนำทาง → BreadcrumbList */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** คำถามที่พบบ่อย → FAQPage (ใช้เมื่อมี FAQ แสดงบนหน้าเท่านั้น) */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
