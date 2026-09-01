import React from "react";
import { BookOpen, Sparkles } from "lucide-react";

interface BrandLoaderProps {
  text?: string;
  subtext?: string;
  fullScreen?: boolean;
}

export function BrandLoader({
  text = "Thiên Thư AI",
  subtext = "Đang tải dữ liệu kỳ thư...",
  fullScreen = false,
}: BrandLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center relative select-none ${
        fullScreen
          ? "fixed inset-0 z-50 bg-[#09090b]/90 backdrop-blur-2xl"
          : "min-h-[60vh] py-16 w-full"
      }`}
    >
      {/* Mystical Golden Aura Ambient */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-[#d4af37]/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      <div className="relative flex flex-col items-center gap-6 z-10">
        {/* Animated Icon & Rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-[#d4af37]/30 animate-[spin_8s_linear_infinite]" />

          {/* Middle pulsing ring */}
          <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#d4af37]/50 animate-ping opacity-25" />

          {/* Inner Glowing Badge */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/60 border border-[#d4af37]/60 shadow-[0_0_35px_rgba(212,175,55,0.35)] flex items-center justify-center group overflow-hidden">
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#d4af37]/20 to-transparent animate-pulse" />

            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37] drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] animate-bounce duration-1000" />
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200 absolute top-2 right-2 animate-spin duration-3000" />
          </div>
        </div>

        {/* Brand Text & Indicator */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <h2 className="text-2xl sm:text-3xl font-black tracking-wider bg-gradient-to-r from-amber-200 via-[#d4af37] to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(212,175,55,0.4)]">
            {text}
          </h2>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400">
            <span>{subtext}</span>
            <div className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandLoader;
