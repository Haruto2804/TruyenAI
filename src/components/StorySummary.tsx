"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";

interface StorySummaryProps {
  summary: string;
  className?: string;
}

export function StorySummary({ summary, className = "" }: StorySummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Split paragraphs
  const paragraphs = summary.split(/\n\s*\n/).filter(Boolean);
  const isLong = summary.length > 250 || paragraphs.length > 2;

  return (
    <div className={`relative flex flex-col justify-between bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black border border-[#d4af37]/30 hover:border-[#d4af37]/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-left shadow-[0_15px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#d4af37]" />
          <span>Tóm Tắt Nội Dung</span>
        </h3>

        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1 rounded-xl border border-white/10 shadow-sm active:scale-95"
          >
            <span>{isExpanded ? "Thu gọn" : "Xem thêm"}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Body Text */}
      <div className="relative flex-1 pt-3.5">
        <div
          className={`space-y-3 text-slate-200 text-sm sm:text-base leading-relaxed font-normal transition-all duration-300 ${
            isExpanded 
              ? "max-h-none" 
              : isLong 
                ? "line-clamp-4 sm:line-clamp-5" 
                : ""
          }`}
        >
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
