import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Sans_Thai } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  baseMetadata,
  organizationJsonLd,
  websiteJsonLd,
  localBusinessJsonLd,
} from "@/lib/seo";
import FloatingActionBar from "@/components/layout/FloatingActionBar";
import ScrollProgressBar from "@/components/layout/ScrollProgressBar";
import SectionDots from "@/components/layout/SectionDots";
import Trackers, { GTMNoScript } from "@/components/tracking/Trackers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const ibmPlexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-plex-thai",
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      className={`${ibmPlexThai.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD: Organization + WebSite + LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                organizationJsonLd(),
                websiteJsonLd(),
                localBusinessJsonLd(),
              ],
            }),
          }}
        />
        <Trackers />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <GTMNoScript />
        <ScrollProgressBar />
        <SectionDots />
        {children}
        <FloatingActionBar />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
