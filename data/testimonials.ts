export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar?: string;
  rating?: number;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "คุณเอ",
    role: "เจ้าของแบรนด์",
    company: "ร้านเครื่องสำอาง",
    quote:
      "ยอดขายโตขึ้น 5 เท่าใน 3 เดือน ทีม NP Create ทำงานละเอียด รายงานชัดเจน ปรึกษาได้ทุกเรื่อง",
    rating: 5,
  },
  {
    id: "t2",
    name: "คุณบี",
    role: "Marketing Manager",
    company: "Lifestyle Brand",
    quote:
      "ROI สูงกว่าที่เคยทำมา 3 เท่า ที่ชอบสุดคือ creative ที่เข้ากับ trend TikTok ได้แบบเป๊ะๆ",
    rating: 5,
  },
  {
    id: "t3",
    name: "คุณซี",
    role: "Founder",
    company: "Health & Wellness",
    quote:
      "เริ่มจาก 0 ตอนนี้ขายดีทุกวัน ระบบที่วางไว้ทำให้สบายใจ ส่งต่อได้แม้พักร้อน",
    rating: 5,
  },
  {
    id: "t4",
    name: "คุณดี",
    role: "เจ้าของกิจการ",
    company: "F&B SME",
    quote:
      "เปลี่ยนจาก agency อื่นมาที่ NP Create แล้วเห็นความต่างชัดเจน — ทุกบาททุกสตางค์มีที่มา",
    rating: 5,
  },
];
