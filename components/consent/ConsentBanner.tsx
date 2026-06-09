"use client";

import { useState } from "react";

/**
 * ConsentBanner — แถบขอความยินยอมคุกกี้ (PDPA)
 * - วางลอยเหนือปุ่ม CTA ล่างจอ, โทนแบรนด์
 * - 3 ทางเลือก: ยอมรับทั้งหมด / จำเป็นเท่านั้น / ตั้งค่าเอง (analytics, ads)
 */
export default function ConsentBanner({
  onAcceptAll,
  onRejectAll,
  onSave,
}: {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSave: (choice: { analytics: boolean; ads: boolean }) => void;
}) {
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);

  return (
    <div
      className="fixed inset-x-0 z-[60] px-4 pointer-events-none"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 96px)" }}
      role="dialog"
      aria-label="การตั้งค่าความเป็นส่วนตัว"
      aria-live="polite"
    >
      <div
        className="
          pointer-events-auto max-w-md mx-auto
          rounded-2xl border border-white/12
          bg-neutral-900/85 backdrop-blur-xl
          shadow-[0_8px_40px_rgba(0,0,0,0.5)]
          p-4 sm:p-5
        "
      >
        <div className="flex items-start gap-3">
          <span className="text-xl leading-none mt-0.5" aria-hidden="true">
            🍪
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">
              เราใช้คุกกี้เพื่อประสบการณ์ที่ดีขึ้น
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/65">
              ใช้คุกกี้เพื่อวิเคราะห์การใช้งานและการตลาด (เช่น Meta, TikTok)
              คุณเลือกได้ว่าจะอนุญาตหมวดใด ตาม PDPA
            </p>
          </div>
        </div>

        {/* ── โหมดตั้งค่าเอง ── */}
        {managing && (
          <div className="mt-4 space-y-2">
            <ToggleRow
              label="คุกกี้จำเป็น"
              desc="ทำให้เว็บทำงานได้ — เปิดตลอด"
              checked
              disabled
            />
            <ToggleRow
              label="วิเคราะห์ (Analytics)"
              desc="วัดการใช้งานเพื่อปรับปรุงเว็บ"
              checked={analytics}
              onChange={setAnalytics}
            />
            <ToggleRow
              label="การตลาด (Ads)"
              desc="รีมาร์เก็ตติ้งผ่าน Meta / TikTok / LINE"
              checked={ads}
              onChange={setAds}
            />
          </div>
        )}

        {/* ── ปุ่ม ── */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {managing ? (
            <button
              type="button"
              onClick={() => onSave({ analytics, ads })}
              className="flex-1 min-h-[44px] px-4 rounded-full brand-bg text-white text-sm font-semibold transition hover:brightness-110 active:brightness-95"
            >
              บันทึกการตั้งค่า
            </button>
          ) : (
            <button
              type="button"
              onClick={onAcceptAll}
              className="flex-1 min-h-[44px] px-4 rounded-full brand-bg text-white text-sm font-semibold transition hover:brightness-110 active:brightness-95"
            >
              ยอมรับทั้งหมด
            </button>
          )}
          <button
            type="button"
            onClick={onRejectAll}
            className="min-h-[44px] px-4 rounded-full border border-white/15 bg-white/5 text-white/85 text-sm font-medium transition hover:bg-white/10"
          >
            จำเป็นเท่านั้น
          </button>
          {!managing && (
            <button
              type="button"
              onClick={() => setManaging(true)}
              className="min-h-[44px] px-3 text-white/60 text-xs font-medium underline-offset-2 hover:text-white/90 hover:underline"
            >
              ตั้งค่า
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] border border-white/8 px-3 py-2 ${
        disabled ? "opacity-60" : "cursor-pointer"
      }`}
    >
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-white">{label}</span>
        <span className="block text-[11px] text-white/55">{desc}</span>
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className="h-6 w-10 rounded-full bg-white/15 transition-colors peer-checked:brand-bg" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  );
}
