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
      <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 sm:pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <div className="p-1.5 sm:p-2 bg-cyan-500/15 rounded-xl text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <BookMarked className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span>Bách Khoa Chú Giải & Khái Niệm</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Tra cứu thuật ngữ ma pháp, độc dược, bí cảnh và các khái niệm trong truyện.
          </p>
        </div>

        <span className="text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shrink-0">
          {lores.length} chú giải
        </span>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          <button
            type="button"
            onClick={() => setActiveCategory("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[36px] ${
              activeCategory === "ALL"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-extrabold"
                : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 min-h-[36px] ${
                  activeCategory === cat
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-extrabold"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat} ({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Lore Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredLores.map((lore) => {
          const Icon = (lore.category && CATEGORY_ICONS[lore.category]) || BookMarked;
          return (
            <div
              key={lore.id}
              onClick={() => setSelectedLore(lore)}
              className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(6,182,212,0.2)] transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                      {lore.term}
                    </h3>
                  </div>

                  {lore.category && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
                      {lore.category}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300/85 line-clamp-2 leading-relaxed font-light">
                  {lore.definition}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors">
                <span>Chi tiết thuật ngữ</span>
                <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lore Detail Modal (Responsive Bottom-Sheet on Mobile, Centered Dialog on Desktop) */}
      {selectedLore && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedLore(null)}
        >
          <div
            className="relative w-full sm:max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-black border-t sm:border border-cyan-500/40 rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_-10px_50px_rgba(0,0,0,0.9)] sm:shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Bar */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto -mt-1 sm:hidden shrink-0" />

            <div className="flex items-start justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/15 rounded-2xl text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0">
                  <BookMarked className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-2xl font-extrabold text-white">
                      {selectedLore.term}
                    </h3>
                    {selectedLore.category && (
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {selectedLore.category}
                      </span>
                    )}
                  </div>
                  {selectedLore.aliases && (
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                      Từ đồng nghĩa: <span className="text-slate-200 font-medium">{selectedLore.aliases}</span>
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLore(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors shrink-0"
                title="Đóng (Esc)"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                Định Nghĩa & Giải Thích Chi Tiết
              </div>
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light whitespace-pre-wrap bg-black/40 border border-white/5 rounded-2xl p-4 max-h-60 overflow-y-auto">
                {selectedLore.definition}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLore(null)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs sm:text-sm font-semibold transition-colors border border-white/10 text-center"
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
