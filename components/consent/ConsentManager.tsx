"use client";

import { useEffect, useState } from "react";
import {
  readConsent,
  writeConsent,
  grantAll,
  denyAll,
  updateGoogleConsent,
  type Consent,
} from "@/lib/consent";
import ConsentedPixels from "@/components/tracking/ConsentedPixels";
import ConsentBanner from "@/components/consent/ConsentBanner";

/**
 * ConsentManager — ตัวประสานความยินยอม
 * - อ่าน consent ตอน mount (undefined = กำลังอ่าน, null = ยังไม่เลือก)
 * - โหลด pixel การตลาดเมื่อ ads === true
 * - โชว์ banner เมื่อยังไม่เลือก
 * - เปิด banner ใหม่ได้ผ่าน event 'np:open-consent' (เช่น ลิงก์ใน footer)
 */
export default function ConsentManager() {
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setShowBanner(stored === null);

    const reopen = () => setShowBanner(true);
    window.addEventListener("np:open-consent", reopen);
    return () => window.removeEventListener("np:open-consent", reopen);
  }, []);

  const decide = (c: Consent) => {
    writeConsent(c);
    updateGoogleConsent(c);
    setConsent(c);
    setShowBanner(false);
  };

  return (
    <>
      <ConsentedPixels enabled={consent?.ads === true} />
      {showBanner && (
        <ConsentBanner
          onAcceptAll={() => decide(grantAll(Date.now()))}
          onRejectAll={() => decide(denyAll(Date.now()))}
          onSave={({ analytics, ads }) =>
            decide({ analytics, ads, ts: Date.now() })
          }
        />
      )}
    </>
  );
}
