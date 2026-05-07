import { Award, TrendingUp, Users, Target, type LucideIcon } from "lucide-react";

export type Metric = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  Icon: LucideIcon;
  description?: string;
};

export const metrics: Metric[] = [
  {
    id: "roi",
    label: "Average ROI",
    value: 30,
    suffix: "x+",
    Icon: TrendingUp,
    description: "เฉลี่ยจากแคมเปญลูกค้าจริง",
  },
  {
    id: "clients",
    label: "Active Clients",
    value: 120,
    suffix: "+",
    Icon: Users,
    description: "ลูกค้าที่ดูแลในแต่ละเดือน",
  },
  {
    id: "campaigns",
    label: "Campaigns Run",
    value: 850,
    suffix: "+",
    Icon: Target,
    description: "ตั้งแต่เริ่มดำเนินงาน",
  },
  {
    id: "award",
    label: "TikTok Top Agency",
    value: 1,
    suffix: "st",
    Icon: Award,
    description: "คนแรกของประเทศไทย",
  },
];
