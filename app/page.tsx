import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import MetricsSection from "@/components/sections/MetricsSection";
import InsightsSection from "@/components/sections/InsightsSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="relative">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <MetricsSection />
      <InsightsSection />
      <Footer />
    </main>
  );
}
