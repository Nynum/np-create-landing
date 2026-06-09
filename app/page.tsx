import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import MetricsSection from "@/components/sections/MetricsSection";
import InsightsSection from "@/components/sections/InsightsSection";
import Footer from "@/components/layout/Footer";
import { servicesJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd()) }}
      />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <MetricsSection />
      <InsightsSection />
      <Footer />
    </main>
  );
}
