export const siteConfig = {
  name: "NP CREATE",
  shortName: "NP Create",
  company: "บริษัท เอ็นพี ครีเอ็ท จำกัด",
  title: "NP CREATE — TikTok Top Agency คนแรกของประเทศไทย ROI 30+",
  description:
    "NP Create — เอเจนซี่ออนไลน์ที่พิสูจน์ผลลัพธ์ด้วย ROI 30+ พร้อมยกระดับธุรกิจของคุณให้เติบโตจริงบน TikTok และทุกแพลตฟอร์มออนไลน์",
  keywords: [
    "NP Create",
    "เอ็นพี ครีเอ็ท",
    "ยิงแอด TikTok",
    "TikTok Top Agency",
    "Digital Marketing Agency",
    "Online Advertising",
    "ROI 30+",
    "เอเจนซี่การตลาดออนไลน์",
  ],
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nynum.com",
  lineOa: {
    id: "@nynumads",
    // ลิงก์เพิ่มเพื่อน LINE Official Account (เด้งเข้าหน้าเพิ่มเพื่อนโดยตรง)
    addFriend: "https://line.me/R/ti/p/%40nynumads",
  },
  contactExternal: {
    productAds: "https://npcreate.co.th/product-ads",
    contactMarketing: "https://line.me/R/ti/p/%40nynumads",
    registerAgent: "https://npcreate.co.th/register",
  },
  social: {
    facebook: "https://www.facebook.com/npcreate",
    line: "https://line.me/R/ti/p/@npcreate",
    tiktok: "https://www.tiktok.com/@npcreate",
  },
} as const;

export const sections = [
  { id: "hero",     label: "Home" },
  { id: "about",    label: "About" },
  { id: "services", label: "Services" },
  { id: "metrics",  label: "Impact" },
  { id: "insights", label: "Insights" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
