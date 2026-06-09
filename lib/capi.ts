import { createHash } from "crypto";
import type { ServerAttribution } from "@/lib/attribution";

/**
 * Server-side Conversions API — NP Create
 * --------------------------------------------------
 * ยิง conversion จากฝั่ง server ไปยัง Meta (Conversions API) และ TikTok
 * (Events API) ขนานกับ pixel ฝั่ง browser โดยใช้ event_id เดียวกัน → dedup
 *
 * ทำไมต้องมี: iOS/ATT + cookie หาย ทำให้ pixel ฝั่ง browser match ได้ ~50%
 * การส่งซ้ำฝั่ง server พร้อม PII ที่ hash แล้ว + click-id ดัน match rate ขึ้น
 * → audience รีทาร์เก็ทครบ + ad optimization แม่นขึ้น โดยไม่เพิ่มงบ
 *
 * เปิดใช้งานด้วย env (ไม่มี = ไม่ส่ง, แค่ log — ปลอดภัยใน dev):
 *   META_CAPI_TOKEN, NEXT_PUBLIC_META_PIXEL_ID, (META_TEST_EVENT_CODE)
 *   TIKTOK_EVENTS_TOKEN, NEXT_PUBLIC_TIKTOK_PIXEL_ID, (TIKTOK_TEST_EVENT_CODE)
 */

const META_API_VERSION = "v21.0";
const META_ENDPOINT = (pixelId: string) =>
  `https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events`;
const TIKTOK_ENDPOINT = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

/** ชื่อ event มาตรฐานต่อแพลตฟอร์ม */
const META_EVENT: Record<string, string> = {
  lead: "Lead",
  contact: "Contact",
};
const TIKTOK_EVENT: Record<string, string> = {
  lead: "SubmitForm",
  contact: "Contact",
};

export type ServerEventInput = {
  /** internal event name: "lead" | "contact" */
  eventName: string;
  /** dedup id ตรงกับ browser pixel */
  eventId: string;
  eventSourceUrl?: string;
  clientIp?: string;
  userAgent?: string;
  /** ค่าที่ผู้ใช้กรอก (freeform: email / phone / LINE id) */
  contact?: string;
  /** custom data เพิ่มเติม เช่น value, currency, content_name */
  custom?: Record<string, unknown>;
  attribution: ServerAttribution;
};

/* ─────────────── helpers ─────────────── */

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function hashEmail(email: string): string {
  return sha256(email.trim().toLowerCase());
}

/** normalize เบอร์ไทยเป็นรูป digits + country code (66...) แล้ว hash */
function hashPhone(raw: string): string {
  let digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) digits = "66" + digits.slice(1);
  else if (!digits.startsWith("66") && digits.length <= 9) digits = "66" + digits;
  return sha256(digits);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** แยกว่า contact เป็น email หรือ phone แล้วคืน hash ที่เหมาะสม */
function deriveUserIdentifiers(contact?: string): {
  emHash?: string;
  phHash?: string;
} {
  if (!contact) return {};
  const value = contact.trim();
  if (EMAIL_RE.test(value)) return { emHash: hashEmail(value) };
  // ถ้ามีตัวเลข ≥ 9 หลัก ถือเป็นเบอร์โทร (ไม่งั้นอาจเป็น LINE id → ข้าม)
  const digits = value.replace(/[^\d]/g, "");
  if (digits.length >= 9) return { phHash: hashPhone(value) };
  return {};
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/* ─────────────── Meta Conversions API ─────────────── */

async function sendMeta(input: ServerEventInput): Promise<"sent" | "skipped" | "error"> {
  const token = process.env.META_CAPI_TOKEN;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!token || !pixelId) return "skipped";

  const { emHash, phHash } = deriveUserIdentifiers(input.contact);
  const { fbp, fbc } = input.attribution;

  const userData: Record<string, unknown> = {};
  if (emHash) userData.em = [emHash];
  if (phHash) userData.ph = [phHash];
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (fbc) userData.fbc = fbc;
  if (fbp) userData.fbp = fbp;

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: META_EVENT[input.eventName] ?? input.eventName,
        event_time: nowSeconds(),
        event_id: input.eventId,
        action_source: "website",
        ...(input.eventSourceUrl && { event_source_url: input.eventSourceUrl }),
        user_data: userData,
        ...(input.custom && { custom_data: input.custom }),
      },
    ],
  };
  if (process.env.META_TEST_EVENT_CODE) {
    body.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  try {
    const res = await fetch(`${META_ENDPOINT(pixelId)}?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error("[capi:meta] HTTP", res.status, await res.text());
      return "error";
    }
    return "sent";
  } catch (err) {
    console.error("[capi:meta] fetch failed:", err);
    return "error";
  }
}

/* ─────────────── TikTok Events API ─────────────── */

async function sendTiktok(input: ServerEventInput): Promise<"sent" | "skipped" | "error"> {
  const token = process.env.TIKTOK_EVENTS_TOKEN;
  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  if (!token || !pixelId) return "skipped";

  const { emHash, phHash } = deriveUserIdentifiers(input.contact);
  const { ttp, ttclid } = input.attribution;

  const user: Record<string, unknown> = {};
  if (emHash) user.email = emHash;
  if (phHash) user.phone = phHash;
  if (ttclid) user.ttclid = ttclid;
  if (ttp) user.ttp = ttp;
  if (input.clientIp) user.ip = input.clientIp;
  if (input.userAgent) user.user_agent = input.userAgent;

  const body: Record<string, unknown> = {
    event_source: "web",
    event_source_id: pixelId,
    ...(process.env.TIKTOK_TEST_EVENT_CODE && {
      test_event_code: process.env.TIKTOK_TEST_EVENT_CODE,
    }),
    data: [
      {
        event: TIKTOK_EVENT[input.eventName] ?? input.eventName,
        event_time: nowSeconds(),
        event_id: input.eventId,
        user,
        ...(input.eventSourceUrl && { page: { url: input.eventSourceUrl } }),
        ...(input.custom && { properties: input.custom }),
      },
    ],
  };

  try {
    const res = await fetch(TIKTOK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Access-Token": token },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as { code?: number; message?: string };
    if (!res.ok || (json.code !== undefined && json.code !== 0)) {
      console.error("[capi:tiktok] error", res.status, json);
      return "error";
    }
    return "sent";
  } catch (err) {
    console.error("[capi:tiktok] fetch failed:", err);
    return "error";
  }
}

/* ─────────────── public API ─────────────── */

/**
 * ส่ง conversion ขนานไป Meta + TikTok พร้อมกัน (ไม่ throw — กัน API route ล้ม).
 * คืนสถานะของแต่ละแพลตฟอร์มไว้ debug
 */
export async function sendServerEvents(input: ServerEventInput): Promise<{
  meta: "sent" | "skipped" | "error";
  tiktok: "sent" | "skipped" | "error";
}> {
  const [meta, tiktok] = await Promise.all([sendMeta(input), sendTiktok(input)]);
  return { meta, tiktok };
}

/** ดึง client IP จาก headers (รองรับ proxy / Vercel) */
export function getClientIp(headers: Headers): string | undefined {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? undefined;
}
