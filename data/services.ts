import {
  Megaphone,
  Target,
  Sparkles,
  TrendingUp,
  Video,
  Users,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  highlights: string[];
};

export const services: Service[] = [
  {
    id: "tiktok-ads",
    title: "TikTok Ads Management",
    description:
      "บริหารแคมเปญโฆษณาบน TikTok เน้น ROI ที่วัดผลได้จริง ตั้งแต่วาง strategy → set ad → optimize → scale",
    Icon: Megaphone,
    highlights: ["ROI 30+ พิสูจน์ได้", "Top Agency คนแรกของไทย", "Optimize รายวัน"],
  },
  {
    id: "performance-marketing",
    title: "Performance Marketing",
    description:
      "ครอบคลุมทุก platform: Meta, Google, TikTok, LINE — ออกแบบ funnel ตั้งแต่ awareness ถึง conversion",
    Icon: Target,
    highlights: ["Multi-channel", "Funnel design", "Conversion tracking"],
  },
  {
    id: "creative-production",
    title: "Creative & Video Production",
    description:
      "ผลิต content โฆษณาที่กระตุ้นยอดขายจริง — short-form video, viral content, native ads",
    Icon: Video,
    highlights: ["Hook ใน 3 วิ", "Native style", "A/B test creative"],
  },
  {
    id: "branding",
    title: "Branding & Strategy",
    description:
      "วาง positioning, brand voice, visual system ให้ธุรกิจน่าเชื่อถือและจดจำได้บน online",
    Icon: Sparkles,
    highlights: ["Brand audit", "Positioning", "Visual system"],
  },
  {
    id: "consulting",
    title: "Marketing Consulting",
    description:
      "ที่ปรึกษาด้านการตลาดออนไลน์ให้ทีม in-house — workshop, growth plan, monthly review",
    Icon: TrendingUp,
    highlights: ["Workshop", "Growth plan", "Monthly review"],
  },
  {
    id: "agent-network",
    title: "Agent / Reseller Network",
    description:
      "โปรแกรมสำหรับนายหน้าที่อยากร่วมงาน — ระบบสนับสนุน, training, เครื่องมือพร้อมใช้",
    Icon: Users,
    highlights: ["Onboarding", "Training", "Support tools"],
  },
];
