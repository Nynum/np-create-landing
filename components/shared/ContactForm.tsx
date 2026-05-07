"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "กรุณากรอกชื่อ"),
  contact: z
    .string()
    .trim()
    .min(5, "กรุณากรอกอีเมล หรือ เบอร์/LINE"),
  message: z.string().trim().min(10, "กรุณาบอกรายละเอียดอย่างน้อย 10 ตัวอักษร"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = async (data: FormValues) => {
    setStatus("idle");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "ส่งไม่สำเร็จ");
      }
      setStatus("ok");
      reset();
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "ส่งไม่สำเร็จ");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field
        label="ชื่อ"
        error={errors.name?.message}
        input={
          <input
            type="text"
            autoComplete="name"
            placeholder="ชื่อของคุณ"
            {...register("name")}
            className="form-input"
          />
        }
      />

      <Field
        label="อีเมล / เบอร์ / LINE ID"
        error={errors.contact?.message}
        input={
          <input
            type="text"
            autoComplete="email"
            placeholder="hello@example.com หรือ 08x-xxx-xxxx"
            {...register("contact")}
            className="form-input"
          />
        }
      />

      <Field
        label="เล่าให้ฟังหน่อย"
        error={errors.message?.message}
        input={
          <textarea
            rows={4}
            placeholder="บอกธุรกิจ + สิ่งที่ต้องการให้ช่วย"
            {...register("message")}
            className="form-input resize-none"
          />
        }
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          relative w-full inline-flex items-center justify-center gap-2
          min-h-[52px] px-6 rounded-full
          brand-bg text-white font-semibold
          shadow-lg shadow-rose-700/30
          transition-all duration-200
          hover:brightness-110 active:brightness-95
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> กำลังส่ง...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" /> ส่งข้อความ
          </>
        )}
      </button>

      {status === "ok" && (
        <p className="flex items-center gap-2 text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          ส่งสำเร็จ ทีมงานจะติดต่อกลับโดยเร็วที่สุด
        </p>
      )}
      {status === "error" && (
        <p className="flex items-center gap-2 text-rose-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {errorMsg ?? "ส่งไม่สำเร็จ ลองใหม่อีกครั้ง"}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-white/80 mb-1.5">{label}</span>
      {input}
      {error && <span className="block text-rose-400 text-xs mt-1.5">{error}</span>}
    </label>
  );
}
