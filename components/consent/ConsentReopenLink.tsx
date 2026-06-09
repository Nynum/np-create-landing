"use client";

/**
 * ลิงก์ "ตั้งค่าคุกกี้" — เปิด ConsentBanner ใหม่ (สิทธิ์เพิกถอน/แก้ไขตาม PDPA)
 */
export default function ConsentReopenLink({
  className,
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("np:open-consent"))}
      className={className}
    >
      ตั้งค่าคุกกี้
    </button>
  );
}
