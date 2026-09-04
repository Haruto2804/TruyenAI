"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookMarked, ArrowRight, X, Sparkles } from "lucide-react";

interface LastReadInfo {
  storySlug: string;
  storyTitle: string;
  chapterNo: number;
  chapterTitle: string;
  updatedAt: number;
}

export function ResumeReadingBanner() {
  const [lastRead, setLastRead] = useState<LastReadInfo | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("thien_thu_last_read");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.storySlug && parsed.chapterNo) {
          setLastRead(parsed);
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  if (!mounted || !lastRead || dismissed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#d4af37]/15 via-amber-500/10 to-transparent border border-[#d4af37]/35 p-3.5 sm:p-4 shadow-lg shadow-black/40 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Golden Aura Glow */}
      <div className="absolute -left-10 -top-10 w-24 h-24 bg-[#d4af37]/20 rounded-full blur-xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 shrink-0">
            <BookMarked className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              <Sparkles className="w-3 h-3" />
              <span>Tiếp tục hành trình đọc</span>
            </div>
            <p className="text-xs sm:text-sm font-extrabold text-white truncate max-w-md mt-0.5">
              {lastRead.storyTitle}
              <span className="text-slate-400 font-normal ml-2">
                • {lastRead.chapterTitle}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <Link
            href={`/truyen/${lastRead.storySlug}/${lastRead.chapterNo}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm hover:brightness-110 shadow-md shadow-[#d4af37]/25 transition-all cursor-pointer"
          >
            <span>Đọc Tiếp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Đóng thông báo đọc tiếp"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
