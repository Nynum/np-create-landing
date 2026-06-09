"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * AttributionCapture
 * --------------------------------------------------
 * รันครั้งเดียวตอนโหลดหน้า: เก็บ utm/click-id (fbclid, ttclid, gclid)
 * จากลิงก์โฆษณาลง first-party cookie เพื่อใช้ต่อกับ Server CAPI
 * ไม่เรนเดอร์อะไร (side-effect only) — วางไว้ใน layout
 */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution(Date.now());
  }, []);

  return null;
}
