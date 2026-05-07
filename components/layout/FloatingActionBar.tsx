"use client";

import { siteConfig } from "@/data/site-config";
import { track } from "@/lib/tracking";

type ClickContext = {
  label: string;
  href: string;
  position: number;
};

/**
 * FloatingActionBar — NP Create
 * --------------------------------------------------
 * - ปุ่ม CTA 3 ปุ่ม ลอยติดล่างจอตลอดเวลา
 * - Flash sweep effect ทุกปุ่ม (เหลื่อมจังหวะแบบ stagger)
 * - Mobile-first: รองรับ safe-area สำหรับ iPhone X+ (home indicator)
 * - Touch-friendly: ปุ่มสูง 56px, hit area ใหญ่พอ
 * - ใช้ใน app/layout.tsx เพื่อให้แสดงทุกหน้า
 */
export default function FloatingActionBar() {
  const buttons = [
    {
      label: "สินค้าที่ร้านยิงแอด",
      href: siteConfig.contactExternal.productAds,
      icon: ShoppingIcon,
      delay: "0s",
      gradient: "from-orange-600 to-red-600",
    },
    {
      label: "ติดต่อดูแลการตลาด",
      href: siteConfig.contactExternal.contactMarketing,
      icon: ChatIcon,
      delay: "1.3s",
      gradient: "from-red-500 to-rose-700",
      primary: true,
    },
    {
      label: "ลงทะเบียนนายหน้า",
      href: siteConfig.contactExternal.registerAgent,
      icon: UserPlusIcon,
      delay: "2.6s",
      gradient: "from-rose-600 to-pink-700",
    },
  ];

  return (
    <>
      {/* ───────────── Container with backdrop fade ───────────── */}
      <div
        className="
          fixed bottom-0 left-0 right-0 z-50
          pointer-events-none
        "
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
        }}
      >
        {/* Backdrop fade ให้ปุ่มลอยเด่น ไม่ทับเนื้อหาเด็ดขาด */}
        <div
          className="absolute inset-x-0 bottom-0 h-[140%] -z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        />

        {/* ───────── Button row ───────── */}
        <div className="pointer-events-auto px-3 sm:px-4 max-w-3xl mx-auto">
          <div className="flex items-stretch gap-2 sm:gap-3">
            {buttons.map((btn, idx) => {
              const Icon = btn.icon;
              const ctx: ClickContext = {
                label: btn.label,
                href: btn.href,
                position: idx + 1,
              };
              return (
                <a
                  key={btn.label}
                  href={btn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("click_cta", ctx)}
                  className={`
                    group relative flex-1
                    flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2
                    min-h-[56px] sm:min-h-[60px]
                    px-2 sm:px-4 py-2
                    bg-gradient-to-br ${btn.gradient}
                    text-white text-center
                    rounded-2xl sm:rounded-full
                    overflow-hidden
                    border border-white/15
                    shadow-lg shadow-black/40
                    transition-all duration-200 ease-out
                    hover:scale-[1.03] hover:shadow-xl hover:shadow-red-600/30
                    active:scale-[0.97] active:shadow-md
                    ${btn.primary ? "ring-2 ring-white/20 ring-offset-2 ring-offset-black" : ""}
                  `}
                >
                  {/* ⭐ Inner glossy highlight */}
                  <span
                    className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-2xl sm:rounded-t-full"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)",
                    }}
                    aria-hidden="true"
                  />

                  {/* ⭐ Flash sweep blade (stagger ตาม delay) */}
                  <span
                    className="absolute inset-0 pointer-events-none btn-flash"
                    style={{
                      animationDelay: btn.delay,
                      background: `linear-gradient(
                        90deg,
                        transparent 0%,
                        transparent 35%,
                        rgba(255,255,255,0.15) 45%,
                        rgba(255,255,255,0.55) 50%,
                        rgba(255,255,255,0.15) 55%,
                        transparent 65%,
                        transparent 100%
                      )`,
                      mixBlendMode: "screen",
                      width: "70%",
                    }}
                    aria-hidden="true"
                  />

                  {/* Icon */}
                  <Icon className="relative w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0 drop-shadow" />

                  {/* Label */}
                  <span className="relative text-[11px] sm:text-sm font-semibold leading-tight whitespace-nowrap drop-shadow">
                    {btn.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ───────────── Inline SVG Icons ───────────── */
function ShoppingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    </svg>
  );
}
