import { NextResponse } from "next/server";
import { z } from "zod";
import { parseAttribution } from "@/lib/attribution";
import { sendServerEvents, getClientIp } from "@/lib/capi";

export const runtime = "nodejs";

/**
 * /api/track-lead
 * --------------------------------------------------
 * รับ conversion ฝั่ง client (เช่น คลิกปุ่ม LINE = intent "contact")
 * แล้วยิงต่อ Server CAPI (Meta + TikTok) ด้วย event_id เดียวกับ pixel → dedup
 * เรียกผ่าน fetch keepalive / sendBeacon ตอนผู้ใช้กำลังออกไป LINE
 */
const schema = z.object({
  event_id: z.string().trim().min(1).max(100),
  event_name: z.enum(["contact", "lead"]).default("contact"),
  contact: z.string().trim().max(200).optional(),
  content_name: z.string().trim().max(120).optional(),
  event_source_url: z.string().trim().max(2048).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation failed" }, { status: 400 });
  }

  const { event_id, event_name, contact, content_name, event_source_url } =
    parsed.data;
  const attribution = parseAttribution(req.headers.get("cookie"));

  const result = await sendServerEvents({
    eventName: event_name,
    eventId: event_id,
    eventSourceUrl: event_source_url ?? attribution.attr.landing_page,
    clientIp: getClientIp(req.headers),
    userAgent: req.headers.get("user-agent") ?? undefined,
    contact,
    custom: {
      content_name: content_name ?? "line_oa",
      utm_source: attribution.attr.utm_source,
      utm_campaign: attribution.attr.utm_campaign,
    },
    attribution,
  });

  return NextResponse.json({ ok: true, result });
}
