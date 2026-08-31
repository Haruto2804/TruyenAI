"use client";

import { useState, useEffect } from "react";
import { Sparkles, User, X, ZoomIn, Shield, Scroll, Tag, ChevronRight } from "lucide-react";

export interface CharacterItem {
  id: string;
  name: string;
  aliases: string | null;
  role: string | null;
  avatarUrl: string | null;
  description: string | null;
}

interface CharacterGalleryProps {
  characters: CharacterItem[];
}

export function CharacterGallery({ characters }: CharacterGalleryProps) {
  const [selectedChar, setSelectedChar] = useState<CharacterItem | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedChar(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!characters || characters.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-3">
            <div className="p-2 bg-[#d4af37]/15 rounded-xl text-[#d4af37] border border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <span>Hồ Sơ Nhân Vật</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Chân dung nghệ thuật 9:16 • Nhấp vào thẻ để phóng to toàn màn hình và xem chi tiết tiểu sử.
          </p>
        </div>
        <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 text-amber-300 border border-[#d4af37]/20 w-fit">
          {characters.length} nhân vật
        </span>
      </div>

      {/* 9:16 Character Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {characters.map((char) => (
          <div
            key={char.id}
            onClick={() => setSelectedChar(char)}
            className="group relative flex flex-col bg-slate-950/90 border border-white/10 rounded-3xl overflow-hidden hover:border-[#d4af37]/70 hover:shadow-[0_15px_45px_rgba(212,175,55,0.25)] transition-all duration-500 cursor-pointer transform hover:-translate-y-1.5"
          >
            {/* Full 9:16 Portrait Canvas */}
            <div className="relative w-full aspect-[9/16] overflow-hidden bg-gradient-to-b from-slate-900 to-black">
              {char.avatarUrl ? (
                <img
                  src={char.avatarUrl}
                  alt={char.name}
                  className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-600 p-4 text-center">
                  <User className="w-16 h-16 text-[#d4af37]/40 mb-2" />
                  <span className="text-xs text-slate-500 font-medium">Chưa có ảnh chân dung</span>
                </div>
              )}

              {/* Multi-layered cinematic gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Role Badge (Top Left Floating) */}
              {char.role && (
                <div className="absolute top-3.5 left-3.5 max-w-[85%]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-extrabold bg-black/75 backdrop-blur-md text-amber-300 border border-[#d4af37]/40 shadow-xl truncate">
                    <Shield className="w-3 h-3 text-[#d4af37]" />
                    <span className="truncate">{char.role}</span>
                  </span>
                </div>
              )}

              {/* Zoom Action Pill (Top Right) */}
              <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="p-2 rounded-xl bg-black/70 backdrop-blur-md text-[#d4af37] border border-white/20 flex items-center justify-center shadow-lg">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>

              {/* Bottom Card Content Overlaid on Portrait */}
              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2 z-10">
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-white group-hover:text-[#d4af37] transition-colors leading-snug drop-shadow-md">
                    {char.name}
                  </h3>

                  {char.aliases && (
                    <p className="text-[11px] text-amber-200/80 line-clamp-1 mt-0.5 font-medium">
                      Biệt danh: {char.aliases}
                    </p>
                  )}
                </div>

                {char.description && (
                  <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed font-light drop-shadow">
                    {char.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-bold text-[#d4af37] group-hover:text-amber-300 transition-colors">
                  <span>Xem hồ sơ chi tiết</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Fullscreen Dossier Modal */}
      {selectedChar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setSelectedChar(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-[#d4af37]/40 rounded-3xl p-5 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden max-h-[92vh] flex flex-col md:flex-row gap-6 sm:gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Lighting Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedChar(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Đóng (Esc)"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Full 9:16 Vertical HD Artwork */}
            <div className="w-full sm:w-80 md:w-88 shrink-0 aspect-[9/16] max-h-[70vh] md:max-h-none rounded-2xl overflow-hidden bg-slate-950 border border-white/20 shadow-2xl relative mx-auto">
              {selectedChar.avatarUrl ? (
                <img
                  src={selectedChar.avatarUrl}
                  alt={selectedChar.name}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-600 p-6 text-center">
                  <User className="w-20 h-20 text-[#d4af37]/40 mb-3" />
                  <span className="text-sm text-slate-400 font-medium">Chưa có ảnh chân dung</span>
                </div>
              )}
            </div>

            {/* Detailed Dossier Panel */}
            <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-1 space-y-5">
              <div className="space-y-4">
                <div>
                  {selectedChar.role && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40 shadow-sm mb-2.5">
                      <Shield className="w-3.5 h-3.5" />
                      {selectedChar.role}
                    </span>
                  )}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    {selectedChar.name}
                  </h3>
                </div>

                {selectedChar.aliases && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                    <div className="text-[11px] font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#d4af37]" /> Biệt danh & Cách gọi
                    </div>
                    <p className="text-sm text-slate-100 font-medium">
                      {selectedChar.aliases}
                    </p>
                  </div>
                )}

                {selectedChar.description ? (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                      <Scroll className="w-4 h-4" /> Tiểu sử & Tính cách
                    </div>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light whitespace-pre-wrap bg-black/40 border border-white/5 rounded-2xl p-4 max-h-60 overflow-y-auto">
                      {selectedChar.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Chưa có mô tả chi tiết cho nhân vật này.
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedChar(null)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-sm font-semibold transition-colors border border-white/10 text-center"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
