"use client";

import { useState, useEffect } from "react";
import { BookMarked, Sparkles, X, ShieldAlert, Flame, Compass, Gem, Layers, Tag, ChevronRight } from "lucide-react";

export interface LoreItem {
  id: string;
  term: string;
  category: string | null;
  definition: string;
  aliases: string | null;
}

interface LoreGalleryProps {
  lores: LoreItem[];
}

const CATEGORY_ICONS: Record<string, any> = {
  "Độc Dược": ShieldAlert,
  "Bí Thuật": Flame,
  "Địa Danh": Compass,
  "Bảo Vật": Gem,
  "Thế Lực": Layers,
  "Cảnh Giới": Sparkles,
};

export function LoreGallery({ lores }: LoreGalleryProps) {
  const [selectedLore, setSelectedLore] = useState<LoreItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedLore(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!lores || lores.length === 0) {
    return null;
  }

  // Extract unique categories
  const categories = Array.from(
    new Set(lores.map((l) => l.category).filter(Boolean))
  ) as string[];

  const filteredLores =
    activeCategory === "ALL"
      ? lores
      : lores.filter((l) => l.category === activeCategory);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4 sm:pb-5">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div className="p-2 sm:p-2.5 bg-cyan-500/15 rounded-2xl text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <BookMarked className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
              <span>Bách Khoa Chú Giải & Khái Niệm</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-300 font-normal mt-0.5">
              Tra cứu thuật ngữ ma pháp, độc dược, bí cảnh và các khái niệm trong truyện.
            </p>
          </div>
        </div>

        <span className="text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
          {lores.length} chú giải
        </span>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          <button
            type="button"
            onClick={() => setActiveCategory("ALL")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm md:text-base font-bold transition-all shrink-0 min-h-[40px] ${
              activeCategory === "ALL"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 font-extrabold scale-102"
                : "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10"
            }`}
          >
            Tất Cả ({lores.length})
          </button>
          {categories.map((cat) => {
            const count = lores.filter((l) => l.category === cat).length;
            const Icon = CATEGORY_ICONS[cat] || Tag;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm md:text-base font-bold transition-all flex items-center gap-2 shrink-0 min-h-[40px] ${
                  activeCategory === cat
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 font-extrabold scale-102"
                    : "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat} ({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Lore Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredLores.map((lore) => {
          const Icon = (lore.category && CATEGORY_ICONS[lore.category]) || BookMarked;
          return (
            <div
              key={lore.id}
              onClick={() => setSelectedLore(lore)}
              className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-black/40 border border-white/10 hover:border-cyan-500/60 hover:shadow-[0_10px_35px_rgba(6,182,212,0.25)] transition-all cursor-pointer group flex flex-col justify-between space-y-3.5"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0 shadow-inner">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                      {lore.term}
                    </h3>
                  </div>

                  {lore.category && (
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
                      {lore.category}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300/90 line-clamp-3 leading-relaxed font-normal">
                  {lore.definition}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-white/10 text-xs font-bold text-slate-400 group-hover:text-cyan-300 transition-colors">
                <span>Chi tiết thuật ngữ</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lore Detail Modal (Always Centered Dialog on All Devices) */}
      {selectedLore && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setSelectedLore(null)}
        >
          <div
            className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.95)] space-y-5 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-cyan-500/15 rounded-2xl text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)] shrink-0">
                  <BookMarked className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                      {selectedLore.term}
                    </h3>
                    {selectedLore.category && (
                      <span className="px-3 py-0.5 rounded-lg text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {selectedLore.category}
                      </span>
                    )}
                  </div>
                  {selectedLore.aliases && (
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Từ đồng nghĩa: <span className="text-slate-100 font-semibold">{selectedLore.aliases}</span>
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLore(null)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors shrink-0"
                title="Đóng (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Định Nghĩa & Giải Thích Chi Tiết
              </div>
              <div className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-100 leading-relaxed sm:leading-loose font-normal whitespace-pre-wrap bg-black/50 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-h-80 overflow-y-auto shadow-inner">
                {selectedLore.definition}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLore(null)}
                className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-sm sm:text-base font-semibold transition-colors border border-white/10 text-center"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
