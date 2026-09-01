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

  return (
    <div className={`relative bg-black/40 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 text-left space-y-3 shadow-inner transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#d4af37]" />
          <span>Tóm Tắt Nội Dung</span>
        </h3>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1 rounded-xl border border-white/10"
        >
          <span>{isExpanded ? "Thu gọn" : "Xem thêm"}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="relative">
        <div
          className={`space-y-3 text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose font-normal transition-all duration-500 overflow-hidden ${
            isExpanded ? "max-h-[1200px]" : "max-h-[110px]"
          }`}
        >
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Gradient Fade Overlay when collapsed */}
        {!isExpanded && (
          <div 
            onClick={() => setIsExpanded(true)}
            className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent cursor-pointer flex items-end justify-center pb-1"
          >
            <span className="text-xs sm:text-sm font-semibold text-amber-400/90 flex items-center gap-1 bg-black/80 px-3 py-0.5 rounded-full border border-amber-500/20 shadow-md">
              <Sparkles className="w-3 h-3" /> Bấm để đọc toàn bộ tóm tắt
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
