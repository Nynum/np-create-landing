export type Insight = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  href?: string;
};

export const insights: Insight[] = [
  {
    id: "i1",
    title: "5 เทคนิคปั้นยอดขายบน TikTok ที่ทำได้จริงในปี 2026",
    excerpt:
      "รวม insight จากการดูแลแคมเปญ TikTok Ads กว่า 800+ campaign — สิ่งที่ทำให้ ROI สูงไม่ใช่งบ",
    date: "2026-04-22",
    readTime: "6 นาที",
    category: "TikTok Marketing",
  },
  {
    id: "i2",
    title: "Creative ที่ขายได้ vs Creative ที่ดูสวย — แตกต่างยังไง",
    excerpt:
      "Hook 3 วินาทีแรกสำคัญที่สุด แต่อะไรทำให้คน 'กดซื้อ' ไม่ใช่แค่ 'ดูจบ' — เปิดเคสจริง",
    date: "2026-04-08",
    readTime: "5 นาที",
    category: "Creative",
  },
  {
    id: "i3",
    title: "เลือก Agency ยิงแอดยังไงไม่ให้ถูกหลอก — Checklist 10 ข้อ",
    excerpt:
      "เกณฑ์ที่เจ้าของธุรกิจควรใช้คัด agency ก่อนตัดสินใจ พร้อมคำถามที่ควรถามในรอบสัมภาษณ์",
    date: "2026-03-19",
    readTime: "7 นาที",
    category: "Business",
  },
];
