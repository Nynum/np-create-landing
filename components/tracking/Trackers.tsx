import Script from "next/script";
import { tracking } from "@/lib/tracking";
import { CONSENT_COOKIE } from "@/lib/consent";

/**
 * Trackers — Google tags + Consent Mode v2 (PDPA-safe).
 *
 * โหลดเสมอ แต่เคารพความยินยอม:
 * - Consent Mode default = denied (รันก่อนทุก tag)
 * - GTM / GA4: โหลดแบบ consent-aware (cookieless จนกว่าจะ grant → ยังได้ modeling)
 * - Meta / TikTok / LINE pixel: ย้ายไป ConsentedPixels (โหลดเมื่อ ads ได้รับอนุญาต)
 */
export default function Trackers() {
  return (
    <>
      {/* ─────── Consent Mode v2 default (ต้องรันก่อน Google tags) ─────── */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied',
  functionality_storage:'granted',
  security_storage:'granted',
  wait_for_update:500
});
try{
  var m=document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]*)/);
  if(m){
    var c=JSON.parse(decodeURIComponent(m[1]));
    gtag('consent','update',{
      ad_storage:c.ads?'granted':'denied',
      ad_user_data:c.ads?'granted':'denied',
      ad_personalization:c.ads?'granted':'denied',
      analytics_storage:c.analytics?'granted':'denied'
    });
  }
}catch(e){}
        `}
      </Script>

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
