# 📊 ระบบ Tracking & Retargeting — NP Create (nynum.com)

เอกสารสรุปสำหรับทีม: เว็บเก็บ "ความสนใจ" ของคนที่กดเข้ามาจากโฆษณายังไง
แล้วเอาไปยิงรีทาร์เก็ทกลับบน **Facebook / TikTok** ได้อย่างไร

> สรุปสั้น: Ad → Land (เก็บ click-id) → Engage (เก็บ event ความสนใจ) →
> Convert (LINE/ฟอร์ม) → ยิง pixel **+ Server CAPI** ด้วย event_id เดียวกัน →
> สร้าง Custom Audience เป็นชั้น ๆ → รีทาร์เก็ทกลับ

---

## 1) ตั้งค่า Environment Variables

ตั้งบน Vercel (Project → Settings → Environment Variables) หรือ `.env.local`
ดูตัวอย่างทั้งหมดได้ใน [`.env.example`](../.env.example)

| ตัวแปร | ใช้ทำอะไร | จำเป็น |
|--------|-----------|--------|
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel (Facebook/Instagram) | ✅ สำหรับ FB |
| `META_CAPI_TOKEN` | Meta Conversions API token (server-side) | ✅ สำหรับ match rate |
| `META_TEST_EVENT_CODE` | โค้ดทดสอบ (Test Events) | ตอนเทสต์ |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | TikTok Pixel | ✅ สำหรับ TikTok |
| `TIKTOK_EVENTS_TOKEN` | TikTok Events API token (server-side) | ✅ สำหรับ match rate |
| `TIKTOK_TEST_EVENT_CODE` | โค้ดทดสอบ TikTok | ตอนเทสต์ |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 | ตามต้องการ |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager | ตามต้องการ |
| `NEXT_PUBLIC_LINE_TAG_ID` | LINE Tag (LAP) | ตามต้องการ |

> ⚠️ `NEXT_PUBLIC_*` = เปิดเผยฝั่ง browser (pixel id ปกติเปิดเผยได้)
> ส่วน `*_TOKEN` = **ความลับ ห้าม** ขึ้นต้นด้วย `NEXT_PUBLIC_` เด็ดขาด

**หา token จากไหน:**
- Meta: Events Manager → เลือก Pixel → Settings → Conversions API → *Generate access token*
- TikTok: Events Manager → Web Events → เลือก pixel → Events API → *Generate Access Token*

---

## 2) Event ที่เว็บยิง และ map ไปแต่ละแพลตฟอร์ม

ทุก event ยิงผ่านฟังก์ชันกลาง `track()` ใน [`lib/tracking.ts`](../lib/tracking.ts)
ซึ่งกระจายไป GA4, GTM, Meta, TikTok, LINE ให้อัตโนมัติ

| event ภายใน | ยิงเมื่อ | Meta | TikTok | ชั้น Audience |
|-------------|---------|------|--------|---------------|
| `page_view` | โหลดหน้า | PageView | (auto) | **T1** |
| `view_content` | เลื่อนเห็นแต่ละ section (≥50%) | ViewContent | ViewContent | T2 |
| `scroll_depth` | เลื่อน 25/50/75/90% | CustomEvent | — | T2/T3 |
| `engaged_30s` | อยู่บนหน้า ≥30 วิ | CustomEvent | — | T2 |
| `view_portfolio` | เลื่อนดู case study | ViewContent | ViewContent | **T3** |
| `form_start` | เริ่มกรอกฟอร์ม | InitiateCheckout | InitiateCheckout | T3 |
| `contact` | **กดปุ่ม LINE** | Contact | Contact | **T4** |
| `lead` | ส่งฟอร์มสำเร็จ | Lead | SubmitForm | **T4** |

**ที่มาของแต่ละ event ในโค้ด:**
- engagement (view_content / scroll_depth / engaged_30s) → [`components/tracking/EngagementTracker.tsx`](../components/tracking/EngagementTracker.tsx)
- view_portfolio → [`components/sections/PortfolioCarousel.tsx`](../components/sections/PortfolioCarousel.tsx)
- contact (LINE) → [`components/layout/FloatingActionBar.tsx`](../components/layout/FloatingActionBar.tsx)
- form_start / lead → [`components/shared/ContactForm.tsx`](../components/shared/ContactForm.tsx)

---

## 3) Audience Ladder — ชั้นความสนใจสำหรับรีทาร์เก็ท

ยิ่งชั้นสูง = ยิ่งสนใจ → ใช้ครีเอทีฟ/ข้อเสนอต่างกัน

| ชั้น | เงื่อนไข | กลยุทธ์ยิงกลับ |
|-----|---------|----------------|
| **T1** เย็น | เข้าเว็บ (PageView) | brand awareness ซ้ำ |
| **T2** อุ่น | scroll ≥50% / เห็น Services/Metrics / ค้าง ≥30 วิ | social proof, ผลงาน |
| **T3** ร้อน | ดู Portfolio / scroll ≥75% / เริ่มกรอกฟอร์ม | ข้อเสนอแรง, urgency |
| **T4** Lead | กด LINE / ส่งฟอร์ม | **exclude** จาก acquisition + ทำ Lookalike |

**วิธีสร้างใน Ads Manager:**
1. **Meta** → Events Manager ดูว่า event เข้าหรือยัง → Audiences → Create Custom Audience → Website → เลือก event (เช่น `ViewContent`, `Contact`, `Lead`) + ช่วงเวลา (เช่น 30/90 วัน)
2. **TikTok** → Assets → Audiences → Create → Website Traffic → เลือก event เดียวกัน
3. ตั้ง retarget campaign: target T2/T3, **exclude T4**, และสร้าง **Lookalike จาก T4 (Lead)** เพื่อหา audience ใหม่ที่คล้ายคนที่ปิดได้

---

## 4) Server CAPI + การ dedup (หัวใจของ match rate)

ปัญหา: iOS/ATT + cookie ถูกบล็อก ทำให้ pixel ฝั่ง browser match conversion ได้ ~50%
วิธีแก้: ยิง conversion **ซ้ำจากฝั่ง server** ([`lib/capi.ts`](../lib/capi.ts)) ด้วย PII ที่ hash แล้ว + click-id

```
                    event_id เดียวกันทั้งสองทาง
  Browser pixel ──┐                          ┌── Meta Conversions API
   (fbq/ttq)      ├─ event_id: abc-123 ──────┤
                  ┘                          └── TikTok Events API
                         ↓
              Meta/TikTok เห็น event_id ซ้ำ → นับเป็น 1 (dedup)
```

- **event_id** สร้างฝั่ง client (`eventId()` ใน `lib/tracking.ts`) ส่งเข้าทั้ง pixel และ server
- **คลิก LINE**: ยิง `contact` ที่ pixel + `fetch('/api/track-lead', keepalive)` → [`app/api/track-lead/route.ts`](../app/api/track-lead/route.ts)
- **ส่งฟอร์ม**: ยิง `lead` ที่ pixel + POST `/api/contact` (แนบ `event_id`) → server ยิง CAPI ใน [`app/api/contact/route.ts`](../app/api/contact/route.ts)
- ฝั่ง server อ่าน click-id/utm จาก cookie ([`lib/attribution.ts`](../lib/attribution.ts)) — `_fbp`, `_fbc`, `_ttp`, `ttclid`
- PII (email/เบอร์) ถูก **sha256 hash** ก่อนส่งเสมอ — ไม่มี raw PII ออกจาก server

> 🔒 ถ้าไม่ได้ตั้ง `META_CAPI_TOKEN` / `TIKTOK_EVENTS_TOKEN` → CAPI จะ **no-op**
> (คืน `skipped`) ปลอดภัยใน dev ไม่พัง

### Click-id / UTM capture
ตอนคนกดลิงก์โฆษณาเข้ามา ([`components/tracking/AttributionCapture.tsx`](../components/tracking/AttributionCapture.tsx)):
- อ่าน `utm_source/medium/campaign/term/content`, `fbclid`, `ttclid`, `gclid`
- เก็บลง cookie `np_attr` (last-touch) + `np_attr_first` (first-touch), อายุ 90 วัน
- ใช้ลิงก์โฆษณาแบบ: `https://nynum.com/?utm_source=facebook&utm_campaign=xxx` — fbclid/ttclid ระบบเติมให้เอง

---

## 5) Consent / PDPA — pixel ทำงานเมื่อไหร่

ดู [`components/consent/`](../components/consent/) + [`lib/consent.ts`](../lib/consent.ts)

| สถานะ | Google (GA4/GTM) | Meta / TikTok / LINE pixel | Server CAPI |
|-------|------------------|----------------------------|-------------|
| ยังไม่เลือก | โหลดแบบ **cookieless** (Consent Mode v2) | **ยังไม่โหลด** | ยิงเมื่อมี conversion จริง |
| กด "ยอมรับทั้งหมด" | full tracking | โหลด + ยิง PageView | ✅ |
| กด "จำเป็นเท่านั้น" | cookieless | ไม่โหลด | — |

- เก็บการเลือกใน cookie `np_consent` (180 วัน) — returning user ไม่ต้องถามซ้ำ
- ผู้ใช้แก้ไขความยินยอมได้ผ่านลิงก์ **"ตั้งค่าคุกกี้"** ใน footer
- **ผลกระทบ:** audience จะเก็บได้เฉพาะคนที่กดยอมรับ (เป็น trade-off ปกติของ PDPA/GDPR)

---

## 6) SEO & Structured Data

- หน้าบทความ `/insights` + `/insights/[slug]` สร้างจาก [`data/insights.ts`](../data/insights.ts) (SSG)
- Schema (JSON-LD) — ดู [`lib/seo.ts`](../lib/seo.ts):
  - ทุกหน้า: Organization + WebSite + LocalBusiness ([`app/layout.tsx`](../app/layout.tsx))
  - หน้าแรก: **Services (OfferCatalog)**
  - หน้าบทความ: **BlogPosting + BreadcrumbList + FAQPage**
- `sitemap.xml` รวม URL บทความอัตโนมัติ → submit ที่ Google Search Console
- **เพิ่มบทความใหม่:** เพิ่ม object ใน `data/insights.ts` → route, sitemap, schema สร้างให้เอง

---

## 7) วิธีทดสอบ (สำคัญก่อนยิงงบจริง)

1. **Meta Test Events**: ใส่ `META_TEST_EVENT_CODE` → Events Manager → Test Events
   - เปิดเว็บ, กดยอมรับคุกกี้, เลื่อนหน้า, กดปุ่ม LINE
   - ต้องเห็น event ทั้งจาก *Browser* และ *Server* และ **ถูก dedup** (ไม่นับซ้ำ)
2. **TikTok Test Events**: ใส่ `TIKTOK_TEST_EVENT_CODE` → Events Manager → Test Events
3. **GA4 DebugView**: เปิด GA4 → Admin → DebugView ดู event แบบ realtime
4. **ตรวจ click-id**: เข้าเว็บด้วย `?utm_source=test&fbclid=abc` แล้วเปิด DevTools →
   Application → Cookies → ควรเห็น `np_attr`
5. **ตรวจ schema**: วาง URL ใน https://search.google.com/test/rich-results

---

## 8) แผนผังไฟล์ที่เกี่ยวข้อง

```
lib/
  tracking.ts        ← track() กระจาย event + eventId() (dedup)
  attribution.ts     ← เก็บ/อ่าน click-id, utm (cookie)
  capi.ts            ← Server CAPI: Meta + TikTok (hash PII)
  consent.ts         ← PDPA consent storage + Consent Mode
  seo.ts             ← metadata + JSON-LD generators
components/
  tracking/
    Trackers.tsx           ← GA4/GTM + Consent Mode default
    ConsentedPixels.tsx    ← Meta/TikTok/LINE (โหลดเมื่อยินยอม)
    AttributionCapture.tsx ← เก็บ click-id ตอนโหลดหน้า
    EngagementTracker.tsx  ← view_content/scroll/engaged_30s
  consent/
    ConsentManager.tsx     ← orchestrator
    ConsentBanner.tsx      ← UI ขอความยินยอม
    ConsentReopenLink.tsx  ← ลิงก์ตั้งค่าใหม่ (footer)
app/
  api/contact/route.ts     ← ฟอร์ม + CAPI Lead
  api/track-lead/route.ts  ← LINE click + CAPI Contact
  insights/                ← หน้าบทความ SEO
```

---

## 9) เพิ่ม event ใหม่ยังไง

```ts
import { track, eventId } from "@/lib/tracking";

// event ทั่วไป
track("view_content", { section: "pricing" });

// conversion ที่ต้อง dedup กับ server
const id = eventId();
track("lead", { value: 1000 }, { eventID: id });
// แล้วส่ง id เดียวกันไป /api/track-lead หรือ /api/contact
```

ถ้าต้องการ map ไป Standard Event ของ Meta/TikTok → เพิ่มใน
`META_EVENT_MAP` / `TIKTOK_EVENT_MAP` ใน `lib/tracking.ts`
และ (ถ้ายิง server-side) ใน `META_EVENT` / `TIKTOK_EVENT` ใน `lib/capi.ts`
