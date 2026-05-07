import Script from "next/script";
import { tracking } from "@/lib/tracking";

/**
 * Loads every configured tracking pixel.
 * Each block renders only when its env var is present.
 *
 * Strategies:
 * - GTM: head + noscript body (must run early)
 * - GA4 / Meta / TikTok / LINE: afterInteractive (don't block paint)
 */
export default function Trackers() {
  return (
    <>
      {/* ─────── Google Tag Manager (head) ─────── */}
      {tracking.gtm && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${tracking.gtm}');
          `}
        </Script>
      )}

      {/* ─────── Google Analytics 4 (gtag) ─────── */}
      {tracking.ga4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${tracking.ga4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${tracking.ga4}', { send_page_view: true });
            `}
          </Script>
        </>
      )}

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

/**
 * Body-level noscript fallback for GTM. Must be inside <body>.
 */
export function GTMNoScript() {
  if (!tracking.gtm) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${tracking.gtm}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="GTM"
      />
    </noscript>
  );
}
