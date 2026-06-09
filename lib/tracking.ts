/**
 * Tracking configuration — read from env, available client + server.
 * Set NEXT_PUBLIC_* in `.env.local` to enable each platform.
 */
export const tracking = {
  ga4: process.env.NEXT_PUBLIC_GA_ID,
  gtm: process.env.NEXT_PUBLIC_GTM_ID,
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  tiktokPixel: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
  lineTag: process.env.NEXT_PUBLIC_LINE_TAG_ID,
} as const;

export const verification = {
  google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  facebookDomain: process.env.NEXT_PUBLIC_FB_DOMAIN_VERIFICATION,
  bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  pinterest: process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION,
} as const;

/* ─────────────── Client-side event helpers ─────────────── */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, props?: Record<string, unknown>) => void };
    _lt?: (...args: unknown[]) => void;
  }
}

/** Generate an event_id for browser↔server deduplication (Meta/TikTok). */
export function eventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type TrackOptions = {
  /** Same id sent to the server CAPI so the two events deduplicate. */
  eventID?: string;
};

/**
 * Fan out a single event to every configured pixel.
 * - GA4 + GTM via dataLayer/gtag
 * - Meta Pixel via fbq (with eventID for CAPI dedup)
 * - TikTok Pixel via ttq.track (with event_id for Events API dedup)
 * - LINE Tag via _lt
 */
export function track(
  eventName: string,
  params: Record<string, unknown> = {},
  opts: TrackOptions = {}
) {
  if (typeof window === "undefined") return;

  // GA4 (gtag)
  window.gtag?.("event", eventName, params);

  // GTM (dataLayer)
  window.dataLayer?.push({ event: eventName, ...params });

  // Meta Pixel — map common events to Standard Events when possible
  const metaEvent = META_EVENT_MAP[eventName] ?? "CustomEvent";
  const metaOpts = opts.eventID ? { eventID: opts.eventID } : undefined;
  if (metaEvent === "CustomEvent") {
    window.fbq?.("trackCustom", eventName, params, metaOpts);
  } else {
    window.fbq?.("track", metaEvent, params, metaOpts);
  }

  // TikTok Pixel — event_id travels inside the properties object
  const ttEvent = TIKTOK_EVENT_MAP[eventName] ?? eventName;
  window.ttq?.track(
    ttEvent,
    opts.eventID ? { ...params, event_id: opts.eventID } : params
  );

  // LINE Tag conversion
  if (eventName === "lead" || eventName === "contact" || eventName === "conversion") {
    window._lt?.("send", "cv", { type: eventName });
  }
}

const META_EVENT_MAP: Record<string, string> = {
  lead: "Lead",
  contact: "Contact",
  view_content: "ViewContent",
  view_portfolio: "ViewContent",
  click_cta: "Contact",
  form_start: "InitiateCheckout",
  scroll_depth: "CustomEvent",
  engaged_30s: "CustomEvent",
  search: "Search",
  page_view: "PageView",
};

const TIKTOK_EVENT_MAP: Record<string, string> = {
  lead: "SubmitForm",
  contact: "Contact",
  view_content: "ViewContent",
  view_portfolio: "ViewContent",
  click_cta: "Contact",
  form_start: "InitiateCheckout",
};
