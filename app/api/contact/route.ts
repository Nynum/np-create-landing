import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  contact: z.string().trim().min(5).max(200),
  message: z.string().trim().min(10).max(5000),
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
    return NextResponse.json(
      { error: "validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, contact, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "no-reply@nynum.com";
  const to = process.env.CONTACT_EMAIL;

  // If env not configured, don't fail loudly in dev — log only.
  if (!apiKey || !to) {
    console.warn(
      "[contact] RESEND_API_KEY or CONTACT_EMAIL not set — skipping email send. payload:",
      { name, contact, message: message.slice(0, 200) }
    );
    return NextResponse.json({ ok: true, dryRun: true });
  }

  const resend = new Resend(apiKey);

  const subject = `[nynum.com] ติดต่อใหม่: ${name}`;
  const text = [
    `ชื่อ: ${name}`,
    `ช่องทางติดต่อ: ${contact}`,
    "",
    "ข้อความ:",
    message,
  ].join("\n");

  const html = `
    <div style="font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; padding: 16px; max-width: 560px;">
      <h2 style="margin: 0 0 8px;">ติดต่อใหม่จาก nynum.com</h2>
      <p style="margin: 0 0 16px; color:#555;">มีคนกรอกฟอร์มเข้ามา</p>
      <table style="width:100%; border-collapse:collapse;">
        <tr><td style="padding:6px 0; color:#666; width:140px;">ชื่อ</td><td><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:6px 0; color:#666;">ช่องทางติดต่อ</td><td><strong>${escapeHtml(contact)}</strong></td></tr>
      </table>
      <hr style="margin:16px 0; border:none; border-top:1px solid #eee;" />
      <pre style="white-space:pre-wrap; font-family:inherit; line-height:1.6;">${escapeHtml(message)}</pre>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: maybeEmail(contact),
      subject,
      text,
      html,
    });

    if (result.error) {
      console.error("[contact] Resend error:", result.error);
      return NextResponse.json({ error: "ส่งอีเมลไม่สำเร็จ" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

function maybeEmail(value: string): string | undefined {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : undefined;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
