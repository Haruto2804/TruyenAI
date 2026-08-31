"use client";

import { useState } from "react";
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
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
              <BookMarked className="w-5 h-5" />
            </div>
            Bách Khoa Chú Giải & Khái Niệm
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tra cứu thuật ngữ ma pháp, độc dược, bí cảnh và các khái niệm đặc thù trong truyện.
          </p>
        </div>

        <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/10 text-cyan-200 border border-white/5 w-fit">
          {lores.length} chú giải
        </span>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeCategory === "ALL"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeCategory === cat
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Lore Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLores.map((lore) => {
          const Icon = (lore.category && CATEGORY_ICONS[lore.category]) || BookMarked;
          return (
            <div
              key={lore.id}
              onClick={() => setSelectedLore(lore)}
              className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/40 hover:shadow-[0_4px_25px_rgba(6,182,212,0.15)] transition-all cursor-pointer group flex flex-col justify-between space-y-2.5"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                      {lore.term}
                    </h3>
                  </div>

                  {lore.category && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shrink-0">
                      {lore.category}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300/80 line-clamp-2 leading-relaxed font-light">
                  {lore.definition}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-500 group-hover:text-cyan-400 transition-colors">
                <span>Nhấn để xem chi tiết</span>
                <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lore Detail Modal */}
      {selectedLore && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedLore(null)}
        >
          <div
            className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20">
                  <BookMarked className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      {selectedLore.term}
                    </h3>
                    {selectedLore.category && (
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        {selectedLore.category}
                      </span>
                    )}
                  </div>
                  {selectedLore.aliases && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Từ đồng nghĩa: <span className="text-slate-200">{selectedLore.aliases}</span>
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLore(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Định Nghĩa & Giải Thích Chi Tiết
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light whitespace-pre-wrap bg-black/40 border border-white/5 rounded-2xl p-4">
                {selectedLore.definition}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLore(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-semibold transition-colors border border-white/10"
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
