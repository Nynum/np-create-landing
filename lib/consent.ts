import { readCookie } from "@/lib/attribution";

/**
 * Consent (PDPA) + Google Consent Mode v2 — NP Create
 * --------------------------------------------------
 * เก็บความยินยอม 2 หมวด:
 *   - analytics : GA4 / สถิติการใช้งาน
 *   - ads       : Meta / TikTok / LINE pixel + รีมาร์เก็ตติ้ง
 *
 * พฤติกรรม:
 *   - ก่อนยินยอม: Google tags ทำงานแบบ Consent Mode (cookieless),
 *     ส่วน Meta/TikTok/LINE จะยัง "ไม่โหลด" จนกว่าจะ grant ads
 *   - บันทึกใน cookie `np_consent` (first-party, 180 วัน)
 */

export type Consent = {
  analytics: boolean;
  ads: boolean;
  ts: number;
};

export const CONSENT_COOKIE = "np_consent";
const CONSENT_DAYS = 180;

/** อ่านความยินยอม — คืน null ถ้ายังไม่เคยเลือก */
export function readConsent(cookieString?: string): Consent | null {
  const raw = readCookie(CONSENT_COOKIE, cookieString);
  if (!raw) return null;
  try {
    const c = JSON.parse(raw) as Partial<Consent>;
    return {
      analytics: Boolean(c.analytics),
      ads: Boolean(c.ads),
      ts: typeof c.ts === "number" ? c.ts : 0,
    };
  } catch {
    return null;
  }
}

/** บันทึกความยินยอมลง cookie */
export function writeConsent(consent: Consent) {
  if (typeof document === "undefined") return;
  const maxAge = CONSENT_DAYS * 24 * 60 * 60;
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
    JSON.stringify(consent)
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function grantAll(now: number): Consent {
  return { analytics: true, ads: true, ts: now };
}

export function denyAll(now: number): Consent {
  return { analytics: false, ads: false, ts: now };
}

/**
 * แจ้ง Google Consent Mode v2 ว่าผู้ใช้เลือกอะไร (gtag consent update).
 * เรียกหลังผู้ใช้กดเลือกใน banner
 */
export function updateGoogleConsent(consent: Consent) {
  if (typeof window === "undefined") return;
  window.gtag?.("consent", "update", {
    ad_storage: consent.ads ? "granted" : "denied",
    ad_user_data: consent.ads ? "granted" : "denied",
    ad_personalization: consent.ads ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
  });
}
