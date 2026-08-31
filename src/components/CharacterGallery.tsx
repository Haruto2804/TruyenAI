"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, User, X, ZoomIn, Shield, Scroll, Tag, 
  ChevronRight, ChevronLeft, Maximize2, FileText, Image as ImageIcon,
  BookOpen
} from "lucide-react";

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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"bio" | "image">("bio");
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  const selectedChar = selectedIndex !== null ? characters[selectedIndex] : null;

  // Keyboard navigation & Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreenImage) {
          setIsFullscreenImage(false);
        } else {
          setSelectedIndex(null);
        }
      } else if (selectedIndex !== null && !isFullscreenImage) {
        if (e.key === "ArrowLeft") {
          setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : characters.length - 1));
        } else if (e.key === "ArrowRight") {
          setSelectedIndex((prev) => (prev !== null && prev < characters.length - 1 ? prev + 1 : 0));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, isFullscreenImage, characters.length]);

  const handleOpenChar = (index: number) => {
    setSelectedIndex(index);
    setActiveTab("bio");
    setIsFullscreenImage(false);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : characters.length - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex < characters.length - 1 ? selectedIndex + 1 : 0);
    }
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
            Chân dung 9:16 • Nhấp vào thẻ để mở bảng hồ sơ chia đôi màn hình.
          </p>
        </div>
        <span className="text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full bg-[#d4af37]/10 text-amber-300 border border-[#d4af37]/20 shrink-0">
          {characters.length} nhân vật
        </span>
      </div>

      {/* Responsive Cards: Horizontal Swipe Carousel on Mobile, Grid on Tablet/Desktop */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-none -mx-1 px-1">
        {characters.map((char, idx) => (
          <div
            key={char.id}
            onClick={() => handleOpenChar(idx)}
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

              {/* Role Badge */}
              {char.role && (
                <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 max-w-[90%]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold bg-black/80 backdrop-blur-md text-amber-300 border border-[#d4af37]/40 shadow-xl truncate">
                    <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#d4af37] shrink-0" />
                    <span className="truncate">{char.role}</span>
                  </span>
                </div>
              )}

              {/* Zoom Action Pill */}
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="p-1.5 rounded-lg bg-black/80 backdrop-blur-md text-[#d4af37] border border-white/20 flex items-center justify-center">
                  <ZoomIn className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Bottom Card Content */}
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
                  <span>Chi tiết hồ sơ</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MASTER-DETAIL SPLIT SCREEN MODAL (Desktop Side-by-Side, Mobile Responsive Drawer) */}
      {selectedChar && !isFullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-full md:max-w-5xl lg:max-w-6xl h-auto max-h-[90vh] md:h-[82vh] bg-gradient-to-br from-slate-900 via-slate-950 to-black border-t md:border border-[#d4af37]/40 rounded-t-3xl md:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col md:flex-row animate-in slide-in-from-bottom-6 md:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient gold glow */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#d4af37]/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Close Button Top Right */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-2xl bg-black/60 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 backdrop-blur-md transition-colors shadow-xl"
              title="Đóng (Esc)"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mobile Drag Bar */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 md:hidden shrink-0" />

            {/* ======================================================== */}
            {/* CỘT 1 (BÊN TRÁI): CHÂN DUNG 9:16 CÂN ĐỐI KHÔNG TRÀN VIỀN */}
            {/* ======================================================== */}
            <div className="md:w-5/12 lg:w-9/20 h-72 sm:h-84 md:h-full bg-black/60 md:border-r border-white/10 p-4 sm:p-5 flex flex-col items-center justify-between relative shrink-0 group overflow-hidden">
              {/* Prev / Next Navigation Arrows on Desktop */}
              <button
                type="button"
                onClick={handlePrev}
                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-2xl bg-black/80 hover:bg-[#d4af37] text-white hover:text-slate-950 border border-white/20 transition-all shadow-xl items-center justify-center"
                title="Nhân vật trước (Mũi tên trái)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-2xl bg-black/80 hover:bg-[#d4af37] text-white hover:text-slate-950 border border-white/20 transition-all shadow-xl items-center justify-center"
                title="Nhân vật tiếp theo (Mũi tên phải)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Exact-fit 9:16 Canvas Box */}
              <div 
                onClick={() => setIsFullscreenImage(true)}
                className="relative flex-1 w-full max-h-[50vh] md:max-h-[62vh] flex items-center justify-center cursor-pointer my-auto"
              >
                {selectedChar.avatarUrl ? (
                  <div className="relative h-full aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-[#d4af37]/40 group-hover:border-[#d4af37] transition-all">
                    <img
                      src={selectedChar.avatarUrl}
                      alt={selectedChar.name}
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                    />
                    
                    {/* Hover Zoom Hint */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#d4af37] text-slate-950 text-xs font-extrabold shadow-xl">
                        <Maximize2 className="w-3.5 h-3.5" /> Phóng to HD
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full aspect-[9/16] rounded-2xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                    <User className="w-16 h-16 text-[#d4af37]/40 mb-2" />
                    <span className="text-xs text-slate-400">Chưa có ảnh chân dung</span>
                  </div>
                )}
              </div>

              {/* Quick Navigation / Counter Pill */}
              <div className="pt-2 hidden md:flex items-center gap-2 text-[11px] font-semibold text-slate-400 shrink-0">
                <span>{selectedIndex! + 1} / {characters.length} nhân vật</span>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => setIsFullscreenImage(true)}
                  className="text-amber-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Maximize2 className="w-3 h-3" /> Xem ảnh gốc
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* CỘT 2 (BÊN PHẢI): HỒ SƠ CHI TIẾT & TIỂU SỬ ĐỌC TIỆN LỢI */}
            {/* ======================================================== */}
            <div className="flex-1 p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-full space-y-5">
              <div className="space-y-4">
                {/* Header Information */}
                <div>
                  {selectedChar.role && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl text-xs font-extrabold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40 shadow-sm mb-2.5">
                      <Shield className="w-3.5 h-3.5" />
                      {selectedChar.role}
                    </span>
                  )}
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {selectedChar.name}
                  </h3>
                </div>

                {/* Aliases Section */}
                {selectedChar.aliases && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                    <div className="text-[11px] font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#d4af37]" /> Biệt danh & Danh xưng
                    </div>
                    <p className="text-sm sm:text-base text-slate-100 font-medium">
                      {selectedChar.aliases}
                    </p>
                  </div>
                )}

                {/* Biography & Personality */}
                {selectedChar.description ? (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                      <Scroll className="w-4 h-4" /> Tiểu sử & Thần thái
                    </div>
                    <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-light whitespace-pre-wrap bg-black/40 border border-white/5 rounded-2xl p-4 sm:p-5 max-h-72 overflow-y-auto">
                      {selectedChar.description}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-4">
                    Chưa có mô tả chi tiết cho nhân vật này.
                  </p>
                )}
              </div>

              {/* Bottom Character Switcher Bar on Desktop */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                {/* Character Pills */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                  {characters.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedIndex(i)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        i === selectedIndex
                          ? "bg-[#d4af37] text-slate-950 shadow-md shadow-[#d4af37]/20"
                          : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5"
                      }`}
                    >
                      {c.name.split(" ")[0]}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs sm:text-sm font-semibold transition-colors border border-white/10 shrink-0"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMMERSIVE LIGHTBOX (Không bao giờ tràn màn hình, vừa khít tỷ lệ) */}
      {selectedChar && isFullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsFullscreenImage(false)}
        >
          {/* Top Bar inside Fullscreen Lightbox */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none max-w-5xl mx-auto">
            <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 pointer-events-auto shadow-xl">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                {selectedChar.name}
                {selectedChar.role && (
                  <span className="text-xs text-amber-300 font-normal ml-1">
                    ({selectedChar.role})
                  </span>
                )}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreenImage(false)}
              className="p-3 rounded-2xl bg-black/80 hover:bg-white/20 text-white border border-white/20 transition-colors pointer-events-auto shadow-2xl"
              title="Quay lại hồ sơ (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fully Responsive 9:16 Canvas without any vertical overflow */}
          <div
            className="relative h-full max-h-[85vh] aspect-[9/16] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.35)] border-2 border-[#d4af37]/60 flex items-center justify-center bg-slate-950"
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
