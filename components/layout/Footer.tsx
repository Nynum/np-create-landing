import { siteConfig } from "@/data/site-config";
import { MessageCircle, Globe } from "lucide-react";
import ConsentReopenLink from "@/components/consent/ConsentReopenLink";

export default function Footer() {
  return (
    <footer
      className="
        relative border-t border-white/10
        px-6 pt-12 pb-[calc(env(safe-area-inset-bottom)+96px)]
        text-white/60
      "
    >
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-white font-bold text-lg tracking-tight">{siteConfig.name}</p>
          <p className="mt-1 text-sm">{siteConfig.company}</p>
          <p className="mt-3 text-sm leading-relaxed">
            TikTok Top Agency คนแรกของประเทศไทย — พิสูจน์ผลลัพธ์ด้วย ROI 30+
          </p>
        </div>

        <div>
          <p className="text-white text-sm font-semibold mb-2">ติดต่อ</p>
          <ul className="space-y-1.5 text-sm">
            <li>
              <a
                className="hover:text-white"
                href="https://npcreate.co.th"
                target="_blank"
                rel="noopener noreferrer"
              >
                npcreate.co.th
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-white text-sm font-semibold mb-2">ช่องทาง</p>
          <div className="flex gap-3">
            <a
              href={siteConfig.social.facebook}
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="grid place-items-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.social.line}
              aria-label="LINE"
              target="_blank"
              rel="noopener noreferrer"
              className="grid place-items-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-white/5 text-xs text-white/40 flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1 text-center">
        <span>
          © {new Date().getFullYear()} {siteConfig.company}. All rights reserved.
        </span>
        <ConsentReopenLink className="underline-offset-2 hover:text-white/70 hover:underline" />
      </div>
    </footer>
  );
}
