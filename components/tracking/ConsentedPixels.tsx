"use client";

import Script from "next/script";
import { tracking } from "@/lib/tracking";

/**
 * ConsentedPixels — โหลด pixel การตลาด "หลังได้รับความยินยอม (ads)" เท่านั้น
 * (Meta / TikTok / LINE) เพื่อให้สอดคล้อง PDPA
 * - render เมื่อ enabled === true → next/script จะ inject + ยิง PageView ตอนนั้น
 * - ก่อนยินยอมจะไม่มี fbq/ttq/_lt → track() จะ no-op สำหรับ pixel เหล่านี้
 */
export default function ConsentedPixels({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  return (
    <>
      {/* ─────── Meta Pixel (Facebook + Instagram) ─────── */}
      {tracking.metaPixel && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${tracking.metaPixel}');
fbq('track', 'PageView');
            `}
          </Script>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${tracking.metaPixel}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* ─────── TikTok Pixel ─────── */}
      {tracking.tiktokPixel && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('${tracking.tiktokPixel}');
  ttq.page();
}(window, document, 'ttq');
          `}
        </Script>
      )}

      {/* ─────── LINE Tag (LAP) ─────── */}
      {tracking.lineTag && (
        <Script id="line-tag" strategy="afterInteractive">
          {`
(function(g,d,o){
g._ltq=g._ltq||[];g._lt=g._lt||function(){g._ltq.push(arguments)};
var h=location.protocol==='https:'?'https://d.line-scdn.net':'http://d.line-cdn.net';
var s=d.createElement('script');s.async=1;s.src=h+'/n/line_tag/public/release/v1/lt.js';
var t=d.getElementsByTagName('script')[0];t.parentNode.insertBefore(s,t);
})(window,document);
_lt('init', { customerType: 'lap', tagId: '${tracking.lineTag}' });
_lt('send', 'pv', ['${tracking.lineTag}']);
          `}
        </Script>
      )}
    </>
  );
}
