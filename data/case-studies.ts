export type CaseStudy = {
  id: string;
  title: string;
  client: string;
  cover?: string;
  category: string;
  challenge: string;
  approach: string;
  results: { label: string; value: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "case-1",
    title: "ปั้นแบรนด์เครื่องสำอางจาก 0 → ROI 35x",
    client: "Beauty SME",
    category: "TikTok Ads",
    challenge:
      "แบรนด์ใหม่ไม่มี recognition งบจำกัด ต้องการสร้างยอดขายใน 90 วัน",
    approach:
      "วาง funnel + creative testing 30+ versions, optimize ดูราย hook, scale เฉพาะตัวที่ ROI > 15",
    results: [
      { label: "ROI", value: "35x" },
      { label: "ยอดขาย", value: "+450%" },
      { label: "Period", value: "90 วัน" },
    ],
  },
  {
    id: "case-2",
    title: "Health brand รุก TikTok Shop ทะลุล้านแรกใน 30 วัน",
    client: "Health & Wellness",
    category: "TikTok Shop",
    challenge:
      "หมวด health มีข้อจำกัดด้าน policy ต้องระวังเรื่อง claim และ creative",
    approach:
      "ออกแบบ creative สาย UGC + livestream daily, จับคู่ creator ที่ฐาน audience ตรง",
    results: [
      { label: "Revenue", value: "1.2M" },
      { label: "Day to 1M", value: "30 วัน" },
      { label: "Live Sessions", value: "120+" },
    ],
  },
  {
    id: "case-3",
    title: "F&B chain — ลด CPL ลง 60% จากแคมเปญ Lead Gen",
    client: "F&B Franchise",
    category: "Performance Marketing",
    challenge:
      "ต้องการ leads สาขาใหม่ 200+/เดือน ต้นทุนต่อ lead เดิมสูงเกินไป",
    approach:
      "Restructure audience, geo-targeting + landing page test 5 versions, automate lead nurturing",
    results: [
      { label: "CPL", value: "-60%" },
      { label: "Leads/Month", value: "320" },
      { label: "Conversion", value: "+25%" },
    ],
  },
];
