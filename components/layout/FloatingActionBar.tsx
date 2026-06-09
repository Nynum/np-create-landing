"use client";

import { siteConfig } from "@/data/site-config";
import { track } from "@/lib/tracking";

/**
 * FloatingActionBar — NP Create
 * --------------------------------------------------
 * - ปุ่ม CTA หลักเดียว "ติดต่อดูแลการตลาด" ลอยติดล่างจอตลอดเวลา
 * - กดแล้วเด้งไปหน้าเพิ่มเพื่อน LINE OA @nynumads โดยตรง
 * - ดีไซน์โทนแดง/โรสตามแบรนด์ + โลโก้ LINE สีเขียวในชิปขาว (คงเอกลักษณ์ LINE)
 * - Mobile-first: รองรับ safe-area (iPhone X+ home indicator), ปุ่มสูง 60px+
 * - มี flash sweep + glossy highlight + live pulse dot
 * - ใช้ใน app/layout.tsx เพื่อให้แสดงทุกหน้า
 */
export default function FloatingActionBar() {
  const href = siteConfig.contactExternal.contactMarketing;
  const lineId = siteConfig.lineOa.id;

  const handleClick = () =>
    track("click_cta", {
      label: "ติดต่อดูแลการตลาด",
      href,
      position: 1,
      channel: "line_oa",
    });

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
    >
      {/* Backdrop fade ให้ปุ่มลอยเด่น ไม่ทับเนื้อหา */}
      <div
        className="absolute inset-x-0 bottom-0 h-[160%] -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* ───────── CTA ───────── */}
      <div className="pointer-events-auto px-4 max-w-md mx-auto">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`เพิ่มเพื่อน LINE ${lineId} เพื่อติดต่อดูแลการตลาด`}
          onClick={handleClick}
          className="
            group relative flex w-full items-center gap-3
            min-h-[64px] pl-3 pr-4 py-2.5
            rounded-2xl overflow-hidden
            text-white
            border border-white/15
            shadow-[0_8px_30px_rgba(225,29,72,0.4)]
            transition-all duration-200 ease-out
            hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(225,29,72,0.55)]
            active:scale-[0.98]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black
          "
          style={{
            background:
              "linear-gradient(135deg, #f43f5e 0%, #e11d48 55%, #be123c 100%)",
          }}
        >
          {/* Glossy highlight ด้านบน */}
          <span
            className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.22), transparent)",
            }}
            aria-hidden="true"
          />

          {/* Flash sweep blade */}
          <span
            className="absolute inset-0 pointer-events-none btn-flash"
            style={{
              animationDelay: "1.2s",
              background: `linear-gradient(
                90deg,
                transparent 0%,
                transparent 35%,
                rgba(255,255,255,0.18) 45%,
                rgba(255,255,255,0.6) 50%,
                rgba(255,255,255,0.18) 55%,
                transparent 65%,
                transparent 100%
              )`,
              mixBlendMode: "screen",
              width: "70%",
            }}
            aria-hidden="true"
          />

          {/* LINE logo chip */}
          <span className="relative grid place-items-center w-11 h-11 flex-shrink-0 rounded-xl bg-white shadow-inner">
            <LineIcon className="w-7 h-7 text-[#06C755]" />
            {/* live online pulse */}
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose-300 opacity-75 animate-ping" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-white ring-2 ring-rose-500" />
            </span>
          </span>

          {/* Text block */}
          <span className="relative flex flex-col items-start leading-tight text-left min-w-0">
            <span className="text-[15px] sm:text-base font-bold drop-shadow-sm">
              ติดต่อดูแลการตลาด
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-white/90 truncate">
              แอดไลน์ {lineId} · ปรึกษาฟรี ตอบไว
            </span>
          </span>

          {/* Arrow CTA */}
          <span className="relative ml-auto flex-shrink-0 grid place-items-center w-9 h-9 rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-0.5 group-active:translate-x-1">
            <ArrowIcon className="w-5 h-5" />
          </span>
        </a>
      </div>
    </div>
  );
}

/* ───────────── Inline SVG Icons ───────────── */
function LineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 5.69 2 10.23c0 4.07 3.55 7.48 8.35 8.13.32.07.77.21.88.49.1.25.06.64.03.89l-.14.86c-.04.25-.2.99.87.54 1.07-.45 5.76-3.39 7.86-5.81C21.27 13.66 22 12.02 22 10.23 22 5.69 17.52 2 12 2zM8.04 12.85H6.05c-.29 0-.52-.23-.52-.52V8.36c0-.29.23-.52.52-.52s.52.23.52.52v3.45h1.47c.29 0 .52.23.52.52s-.23.52-.52.52zm2.04-.52c0 .29-.23.52-.52.52s-.52-.23-.52-.52V8.36c0-.29.23-.52.52-.52s.52.23.52.52v3.97zm4.7 0c0 .22-.14.42-.36.49-.05.02-.11.03-.16.03-.16 0-.31-.07-.41-.21l-2.03-2.76v2.45c0 .29-.23.52-.52.52s-.52-.23-.52-.52V8.36c0-.22.14-.42.36-.49.05-.02.11-.02.16-.02.16 0 .31.08.41.21l2.04 2.77V8.36c0-.29.23-.52.52-.52s.52.23.52.52v3.97zm3.17-2.5c.29 0 .52.23.52.52s-.23.52-.52.52h-1.47v.94h1.47c.29 0 .52.23.52.52s-.23.52-.52.52h-1.99c-.29 0-.52-.23-.52-.52V8.36c0-.29.23-.52.52-.52h1.99c.29 0 .52.23.52.52s-.23.52-.52.52h-1.47v.94h1.47z" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
