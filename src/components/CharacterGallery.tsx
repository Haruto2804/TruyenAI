"use client";

import { useState, useEffect } from "react";
import { Sparkles, User, X, ZoomIn, Shield, Scroll, Tag, ChevronRight, Maximize2, FileText, Image as ImageIcon } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"bio" | "image">("bio");
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreenImage) {
          setIsFullscreenImage(false);
        } else {
          setSelectedChar(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreenImage]);

  // Reset tab when opening a new character
  const handleOpenChar = (char: CharacterItem) => {
    setSelectedChar(char);
    setActiveTab("bio");
    setIsFullscreenImage(false);
  };

  if (!characters || characters.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 sm:pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <div className="p-1.5 sm:p-2 bg-[#d4af37]/15 rounded-xl text-[#d4af37] border border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span>Hồ Sơ Nhân Vật</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Chân dung 9:16 • Vuốt ngang hoặc nhấp vào thẻ để tra cứu tiểu sử.
          </p>
        </div>
        <span className="text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full bg-[#d4af37]/10 text-amber-300 border border-[#d4af37]/20 shrink-0">
          {characters.length} nhân vật
        </span>
      </div>

      {/* Responsive Cards: Horizontal Swipe Carousel on Mobile, Grid on Tablet/Desktop */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-none -mx-1 px-1">
        {characters.map((char) => (
          <div
            key={char.id}
            onClick={() => handleOpenChar(char)}
            className="w-[170px] xs:w-[190px] sm:w-auto shrink-0 snap-start group relative flex flex-col bg-slate-950/90 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-[#d4af37]/70 hover:shadow-[0_15px_45px_rgba(212,175,55,0.25)] transition-all duration-300 cursor-pointer select-none"
          >
            {/* 9:16 Portrait Canvas */}
            <div className="relative w-full aspect-[9/16] overflow-hidden bg-gradient-to-b from-slate-900 to-black">
              {char.avatarUrl ? (
                <img
                  src={char.avatarUrl}
                  alt={char.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-600 p-4 text-center">
                  <User className="w-12 h-12 text-[#d4af37]/40 mb-2" />
                  <span className="text-xs text-slate-500 font-medium">Chưa có ảnh</span>
                </div>
              )}

              {/* Multi-layered cinematic gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-95 group-hover:opacity-85 transition-opacity pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Role Badge (Top Left Floating) */}
              {char.role && (
                <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 max-w-[90%]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold bg-black/80 backdrop-blur-md text-amber-300 border border-[#d4af37]/40 shadow-xl truncate">
                    <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#d4af37] shrink-0" />
                    <span className="truncate">{char.role}</span>
                  </span>
                </div>
              )}

              {/* Zoom Action Pill (Top Right) */}
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="p-1.5 rounded-lg bg-black/80 backdrop-blur-md text-[#d4af37] border border-white/20 flex items-center justify-center">
                  <ZoomIn className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Bottom Card Content Overlaid on Portrait */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 space-y-1 sm:space-y-1.5 z-10">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-[#d4af37] transition-colors leading-snug truncate drop-shadow-md">
                    {char.name}
                  </h3>

                  {char.aliases && (
                    <p className="text-[10px] sm:text-[11px] text-amber-200/80 truncate font-medium">
                      {char.aliases}
                    </p>
                  )}
                </div>

                {char.description && (
                  <p className="text-[10px] sm:text-xs text-slate-300/85 line-clamp-2 leading-relaxed font-light drop-shadow">
                    {char.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[10px] font-bold text-[#d4af37] group-hover:text-amber-300 transition-colors">
                  <span>Chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Character Dossier Modal (Optimized for Mobile Bottom-Sheet & Desktop Dialog) */}
      {selectedChar && !isFullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedChar(null)}
        >
          <div
            className="relative w-full sm:max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-t sm:border border-[#d4af37]/40 rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_-10px_50px_rgba(0,0,0,0.9)] sm:shadow-2xl overflow-hidden max-h-[85vh] flex flex-col space-y-4 animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Bar */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto -mt-1 sm:hidden shrink-0" />

            {/* Header with Close Button */}
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3.5">
              {/* Compact Mini Hero (Avatar + Main Info) */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Clickable Avatar Thumbnail */}
                <div
                  onClick={() => setIsFullscreenImage(true)}
                  className="group relative w-16 sm:w-20 aspect-[9/16] rounded-xl overflow-hidden bg-slate-950 border border-[#d4af37]/40 shrink-0 shadow-lg cursor-pointer hover:border-[#d4af37] transition-all"
                  title="Chạm để phóng to toàn màn hình"
                >
                  {selectedChar.avatarUrl ? (
                    <img
                      src={selectedChar.avatarUrl}
                      alt={selectedChar.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                      <User className="w-6 h-6 text-[#d4af37]/40" />
                    </div>
                  )}
                  {/* Floating Zoom Icon on Thumbnail */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-white drop-shadow" />
                  </div>
                </div>

                {/* Name, Role & Quick Info */}
                <div className="space-y-1 min-w-0">
                  {selectedChar.role && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40 truncate max-w-full">
                      <Shield className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{selectedChar.role}</span>
                    </span>
                  )}
                  <h3 className="text-base sm:text-xl font-extrabold text-white tracking-tight truncate">
                    {selectedChar.name}
                  </h3>
                  {selectedChar.aliases && (
                    <p className="text-[11px] text-amber-200/80 truncate font-medium">
                      Biệt danh: {selectedChar.aliases}
                    </p>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedChar(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors shrink-0"
                title="Đóng (Esc)"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* View Mode Toggle: [ Xem Tiểu Sử ] vs [ Xem Chân Dung 9:16 ] */}
            <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("bio")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "bio"
                    ? "bg-[#d4af37]/20 text-amber-300 border border-[#d4af37]/30 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Hồ Sơ & Tiểu Sử</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("image")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "image"
                    ? "bg-[#d4af37]/20 text-amber-300 border border-[#d4af37]/30 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Chân Dung 9:16</span>
              </button>
            </div>

            {/* Tab 1: Biography & Details */}
            {activeTab === "bio" && (
              <div className="overflow-y-auto max-h-[50vh] pr-1 space-y-3">
                {selectedChar.aliases && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-0.5">
                    <div className="text-[10px] font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#d4af37]" /> Tên gọi & Biệt hiệu
                    </div>
                    <p className="text-xs sm:text-sm text-slate-100 font-medium">
                      {selectedChar.aliases}
                    </p>
                  </div>
                )}

                {selectedChar.description ? (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                      <Scroll className="w-3.5 h-3.5" /> Tiểu sử, Thân thế & Tính cách
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light whitespace-pre-wrap bg-black/40 border border-white/5 rounded-xl p-3.5">
                      {selectedChar.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    Chưa có mô tả chi tiết cho nhân vật này.
                  </p>
                )}
              </div>
            )}

            {/* Tab 2: 9:16 Portrait Canvas in Viewport */}
            {activeTab === "image" && (
              <div className="flex flex-col items-center justify-center space-y-3 py-1 overflow-y-auto max-h-[50vh]">
                <div
                  onClick={() => setIsFullscreenImage(true)}
                  className="relative w-44 xs:w-48 aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border border-[#d4af37]/40 shadow-2xl cursor-pointer group"
                >
                  {selectedChar.avatarUrl ? (
                    <img
                      src={selectedChar.avatarUrl}
                      alt={selectedChar.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                      <User className="w-12 h-12 text-[#d4af37]/40" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#d4af37] text-slate-950 text-xs font-bold shadow-lg">
                      <Maximize2 className="w-3.5 h-3.5" /> Toàn màn hình
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullscreenImage(true)}
                  className="text-xs text-[#d4af37] hover:text-amber-300 flex items-center gap-1 font-semibold"
                >
                  <Maximize2 className="w-3.5 h-3.5" /> Xem ảnh gốc toàn màn hình HD
                </button>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-white/10 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedChar(null)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs sm:text-sm font-semibold transition-colors border border-white/10 text-center"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Fullscreen Image Lightbox (When user taps to view 100% full artwork) */}
      {selectedChar && isFullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsFullscreenImage(false)}
        >
          {/* Top Bar inside Fullscreen Lightbox */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 pointer-events-auto">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                {selectedChar.name}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreenImage(false)}
              className="p-2.5 rounded-2xl bg-black/80 hover:bg-white/20 text-white border border-white/20 transition-colors pointer-events-auto shadow-2xl"
              title="Quay lại hồ sơ (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Full-bleed 9:16 Image */}
          <div
            className="relative max-w-sm sm:max-w-md w-full aspect-[9/16] max-h-[90vh] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.3)] border border-[#d4af37]/40"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedChar.avatarUrl ? (
              <img
                src={selectedChar.avatarUrl}
                alt={selectedChar.name}
                className="w-full h-full object-cover object-center select-none"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500">
                <User className="w-16 h-16 text-[#d4af37]/40" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
