/**
 * Attribution + click-id capture — NP Create
 * --------------------------------------------------
 * เก็บ "ที่มา" ของผู้เข้าชมจากลิงก์โฆษณา (utm_*, fbclid, ttclid, gclid)
 * ลง first-party cookie เพื่อ:
 *  1) วัด attribution (โฆษณาตัวไหนพาคนมา)
 *  2) ส่งต่อให้ Server CAPI (Meta Conversions API / TikTok Events API)
 *     เพื่อ match conversion กลับ → ยกระดับ match rate สำหรับรีทาร์เก็ท
 *
 * ฝั่ง client: captureAttribution() อ่าน URL → set cookie
 * ฝั่ง server: parseAttribution(cookieHeader) → อ่านกลับใน API route
 */

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export const CLICK_ID_KEYS = ["fbclid", "ttclid", "gclid"] as const;

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  ttclid?: string;
  gclid?: string;
  /** Meta-formatted click id: fb.1.<ts>.<fbclid> */
  fbc?: string;
  landing_page?: string;
  referrer?: string;
  ts?: number;
};

/** ชื่อ cookie ที่เราใช้ */
export const ATTR_COOKIE = "np_attr"; // last-touch (อัปเดตทุกครั้งที่มี param ใหม่)
export const ATTR_FIRST_COOKIE = "np_attr_first"; // first-touch (เขียนครั้งเดียว)
const FBC_COOKIE = "_fbc"; // Meta pixel ก็ใช้ชื่อนี้
const FBP_COOKIE = "_fbp"; // Meta pixel set ให้เอง
const TTP_COOKIE = "_ttp"; // TikTok pixel set ให้เอง
const COOKIE_DAYS = 90;

/* ─────────────── Cookie helpers (client) ─────────────── */

function setCookie(name: string, value: string, days = COOKIE_DAYS) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function readCookie(name: string, cookieString?: string): string | undefined {
  const source =
    cookieString ?? (typeof document !== "undefined" ? document.cookie : "");
  if (!source) return undefined;
  for (const part of source.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

/* ─────────────── Client capture ─────────────── */

/**
 * อ่าน query params ปัจจุบัน + เขียน cookie (เรียกตอน mount ครั้งเดียว).
 * - last-touch: เขียนใหม่เสมอเมื่อมี utm/click-id เข้ามา
 * - first-touch: เขียนครั้งแรกครั้งเดียว
 * - derive `_fbc` จาก fbclid ถ้า Meta pixel ยังไม่ได้ตั้ง
 * คืนค่า Attribution ที่เพิ่ง capture (หรือ {} ถ้าไม่มี param)
 */
export function captureAttribution(now: number): Attribution {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const attr: Attribution = {};

  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) attr[key] = v;
  }
  for (const key of CLICK_ID_KEYS) {
    const v = params.get(key);
    if (v) attr[key] = v;
  }

  // ไม่มี param ใด ๆ → ไม่ต้องเขียนทับ (กัน last-touch หายตอน reload ภายในเว็บ)
  const hasSignal = Object.keys(attr).length > 0;

  if (attr.fbclid) {
    // Meta click id format: fb.1.<unix_ms>.<fbclid>
    const fbc = `fb.1.${now}.${attr.fbclid}`;
    attr.fbc = fbc;
    if (!readCookie(FBC_COOKIE)) setCookie(FBC_COOKIE, fbc);
  }

  attr.landing_page = window.location.href;
  attr.referrer = document.referrer || undefined;
  attr.ts = now;

  if (hasSignal) {
    const json = JSON.stringify(attr);
    setCookie(ATTR_COOKIE, json);
    if (!readCookie(ATTR_FIRST_COOKIE)) setCookie(ATTR_FIRST_COOKIE, json);
  }

  return attr;
}

/* ─────────────── Server reader ─────────────── */

export type ServerAttribution = {
  attr: Attribution;
  first: Attribution;
  fbp?: string;
  fbc?: string;
  ttp?: string;
  ttclid?: string;
};

/** อ่าน attribution + _fbp/_fbc/_ttp จาก Cookie header ใน API route */
export function parseAttribution(cookieHeader: string | null): ServerAttribution {
  const cookie = cookieHeader ?? "";
  const safeParse = (raw?: string): Attribution => {
    if (!raw) return {};
    try {
      return JSON.parse(raw) as Attribution;
    } catch {
      return {};
    }
  };
  const attr = safeParse(readCookie(ATTR_COOKIE, cookie));
  const first = safeParse(readCookie(ATTR_FIRST_COOKIE, cookie));
  return {
    attr,
    first,
    fbp: readCookie(FBP_COOKIE, cookie),
    fbc: attr.fbc ?? readCookie(FBC_COOKIE, cookie),
    ttp: readCookie(TTP_COOKIE, cookie),
    ttclid: attr.ttclid,
  };
}
