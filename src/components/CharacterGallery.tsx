"use client";

import { useState, useEffect } from "react";
import { Sparkles, User, X, ZoomIn, BookOpen, Shield, Scroll, Tag } from "lucide-react";

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
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-3">
            <div className="p-2 bg-[#d4af37]/10 rounded-xl text-[#d4af37]">
              <Sparkles className="w-5 h-5" />
            </div>
            Hồ Sơ Nhân Vật
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Nhấp vào từng nhân vật để phóng to chân dung HD và xem chi tiết tiểu sử.
          </p>
        </div>
        <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/10 text-slate-200 border border-white/5 w-fit">
          {characters.length} nhân vật
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {characters.map((char) => (
          <div
            key={char.id}
            onClick={() => setSelectedChar(char)}
            className="group relative flex flex-col bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-black/95 border border-white/10 rounded-2xl overflow-hidden hover:border-[#d4af37]/60 hover:shadow-[0_10px_35px_rgba(212,175,55,0.2)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            {/* Portrait Image Container */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-950">
              {char.avatarUrl ? (
                <img
                  src={char.avatarUrl}
                  alt={char.name}
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-600 p-4 text-center">
                  <User className="w-12 h-12 text-[#d4af37]/40 mb-2" />
                  <span className="text-xs text-slate-500 font-medium">Chưa có ảnh</span>
                </div>
              )}

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

              {/* Role Badge (Overlay Top-Right) */}
              {char.role && (
                <div className="absolute top-3 right-3 max-w-[80%] truncate">
                  <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/70 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/30 shadow-lg truncate">
                    {char.role}
                  </span>
                </div>
              )}

              {/* Hover Zoom Prompt */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#d4af37] text-slate-950 text-xs font-bold shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
                  <ZoomIn className="w-3.5 h-3.5" /> Phóng to & Chi tiết
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                  {char.name}
                </h3>

                {char.aliases && (
                  <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1 mt-1">
                    <span className="text-slate-500 font-medium">Biệt danh:</span> {char.aliases}
                  </p>
                )}
              </div>

              {char.description && (
                <p className="text-xs sm:text-[13px] text-slate-300/85 line-clamp-3 leading-relaxed font-light pt-1 border-t border-white/5">
                  {char.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Zoomed Character Dossier Modal */}
      {selectedChar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedChar(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden max-h-[90vh] flex flex-col md:flex-row gap-6 sm:gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Lighting inside Modal */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedChar(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Full-Size HD Portrait */}
            <div className="w-full sm:w-72 md:w-80 shrink-0 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 border border-white/15 shadow-2xl relative group">
              {selectedChar.avatarUrl ? (
                <img
                  src={selectedChar.avatarUrl}
                  alt={selectedChar.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-600 p-6 text-center">
                  <User className="w-16 h-16 text-[#d4af37]/40 mb-3" />
                  <span className="text-sm text-slate-400 font-medium">Chưa có ảnh chân dung</span>
                </div>
              )}
            </div>

            {/* Detailed Dossier Info */}
            <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-1 space-y-5">
              <div className="space-y-4">
                <div>
                  {selectedChar.role && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 mb-2">
                      <Shield className="w-3.5 h-3.5" />
                      {selectedChar.role}
                    </span>
                  )}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {selectedChar.name}
                  </h3>
                </div>

                {selectedChar.aliases && (
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1">
                    <div className="text-[11px] font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-[#d4af37]" /> Biệt danh & Tên gọi khác
                    </div>
                    <p className="text-sm text-slate-200 font-medium">
                      {selectedChar.aliases}
                    </p>
                  </div>
                )}

                {selectedChar.description ? (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                      <Scroll className="w-3.5 h-3.5" /> Tiểu sử & Tính cách
                    </div>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light whitespace-pre-wrap">
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
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-semibold transition-colors border border-white/10"
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
