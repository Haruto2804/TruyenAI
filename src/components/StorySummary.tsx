"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Sparkles } from "lucide-react";

interface StorySummaryProps {
  summary: string;
  className?: string;
}

export function StorySummary({ summary, className = "" }: StorySummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Split paragraphs
  const paragraphs = summary.split(/\n\s*\n/).filter(Boolean);
  const isLong = summary.length > 280;

  return (
    <div className={`relative flex flex-col justify-between bg-black/40 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-6 text-left shadow-inner transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#d4af37]" />
          <span>Tóm Tắt Nội Dung</span>
        </h3>

        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-xl border border-white/10"
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

      {/* Body Text filling down to the bottom */}
      <div className="relative flex-1 pt-3">
        <div
          className={`space-y-2.5 text-slate-200 text-sm sm:text-base leading-relaxed sm:leading-relaxed font-normal transition-all duration-300 ${
            isExpanded 
              ? "max-h-none" 
              : isLong 
                ? "line-clamp-5 sm:line-clamp-6" 
                : ""
          }`}
        >
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Subtle click to expand indicator if long and not expanded */}
        {isLong && !isExpanded && (
          <div 
            onClick={() => setIsExpanded(true)}
            className="pt-2 cursor-pointer flex items-center justify-end"
          >
            <span className="text-[11px] sm:text-xs font-bold text-amber-400/90 hover:text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Đọc tiếp tóm tắt...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
