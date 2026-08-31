"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Sparkles, User, X, ZoomIn, Shield, Tag, 
  ChevronRight, ChevronLeft, Maximize2, Eye
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

function renderFormattedDescription(desc: string | null) {
  if (!desc) return <p className="text-xs text-slate-500 italic py-4">Chưa có tóm tắt cho nhân vật này.</p>;

  // Split by double newline for paragraphs
  const paragraphs = desc.split(/\n\s*\n/);

  return (
    <div className="bg-black/40 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-inner">
      {paragraphs.map((p, pIdx) => {
        const parts = p.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
        return (
          <p key={pIdx} className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
            {parts.map((part, idx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={idx} className="font-bold text-[#d4af37]">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith("*") && part.endsWith("*")) {
                return (
                  <em key={idx} className="italic text-amber-200/90">
                    {part.slice(1, -1)}
                  </em>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export function CharacterGallery({ characters }: CharacterGalleryProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedChar = selectedIndex !== null ? characters[selectedIndex] : null;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null || isFullscreenImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex, isFullscreenImage]);

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
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 sm:pb-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="p-1.5 sm:p-2 rounded-xl bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 shadow-inner">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>Hồ Sơ Nhân Vật</span>
              <span className="text-xs font-normal text-slate-400">({characters.length})</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
              Chiêm ngưỡng chân dung minh họa 9:16 và khám phá thông tin nhân vật
            </p>
          </div>
        </div>

        <span className="text-[10px] sm:text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
          Chạm để mở hồ sơ
        </span>
      </div>

      {/* Grid Danh Sách Nhân Vật (2 Cột Mobile, 4 Cột Desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {characters.map((char, index) => (
          <div
            key={char.id}
            onClick={() => handleOpenChar(index)}
            className="group relative cursor-pointer rounded-2xl overflow-hidden bg-slate-900/90 border border-white/10 hover:border-[#d4af37]/60 hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all duration-300 transform active:scale-98"
          >
            {/* Khung Tranh Chuẩn 9:16 */}
            <div className="relative aspect-[9/16] w-full overflow-hidden bg-slate-950">
              {char.avatarUrl ? (
                <img
                  src={char.avatarUrl}
                  alt={char.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 p-4 text-center">
                  <User className="w-10 h-10 text-[#d4af37]/40 mb-2" />
                  <span className="text-xs font-medium">Chưa có ảnh</span>
                </div>
              )}

              {/* Gradient che sáng để làm nổi bật thông tin */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30 pointer-events-none" />

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
                  <span>Xem hồ sơ chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* UNIVERSAL CHARACTER DOSSIER MODAL (PORTALED TO BODY) */}
      {/* ========================================================================= */}
      {mounted && selectedChar && !isFullscreenImage && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          {/* ========================================================================= */}
          {/* DESKTOP SPLIT-SCREEN VIEW (>= md screens) */}
          {/* ========================================================================= */}
          <div
            className="hidden md:flex relative w-full md:max-w-5xl lg:max-w-6xl h-[84vh] bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-[#d4af37]/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Desktop */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-2xl bg-black/60 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 backdrop-blur-md transition-colors shadow-xl"
              title="Đóng (Esc)"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cột 1 (Desktop Trái): Chân dung 9:16 */}
            <div className="w-5/12 lg:w-9/20 h-full bg-black/60 border-r border-white/10 p-5 flex flex-col items-center justify-between relative shrink-0 group overflow-hidden">
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-2xl bg-black/80 hover:bg-[#d4af37] text-white hover:text-slate-950 border border-white/20 transition-all shadow-xl items-center justify-center cursor-pointer"
                title="Nhân vật trước (Mũi tên trái)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-2xl bg-black/80 hover:bg-[#d4af37] text-white hover:text-slate-950 border border-white/20 transition-all shadow-xl items-center justify-center cursor-pointer"
                title="Nhân vật tiếp theo (Mũi tên phải)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div 
                onClick={() => setIsFullscreenImage(true)}
                className="relative flex-1 w-full max-h-[62vh] flex items-center justify-center cursor-pointer my-auto"
              >
                {selectedChar.avatarUrl ? (
                  <div className="relative h-full aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-[#d4af37]/40 group-hover:border-[#d4af37] transition-all">
                    <img
                      src={selectedChar.avatarUrl}
                      alt={selectedChar.name}
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                    />
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

              <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-400 shrink-0">
                <span>{selectedIndex! + 1} / {characters.length} nhân vật</span>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => setIsFullscreenImage(true)}
                  className="text-amber-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3" /> Xem ảnh gốc
                </button>
              </div>
            </div>

            {/* Cột 2 (Desktop Phải): Hồ sơ chi tiết */}
            <div className="flex-1 p-7 md:p-8 flex flex-col justify-between overflow-y-auto space-y-5">
              <div className="space-y-4">
                {/* Header Profile Title */}
                <div>
                  {selectedChar.role && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl text-xs font-extrabold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40 shadow-sm mb-2.5">
                      <Shield className="w-3.5 h-3.5" />
                      {selectedChar.role}
                    </span>
                  )}
                  <h3 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {selectedChar.name}
                  </h3>
                </div>

                {/* Aliases Card */}
                {selectedChar.aliases && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                    <div className="text-[11px] font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#d4af37]" /> Biệt danh & Danh xưng
                    </div>
                    <p className="text-base text-slate-100 font-medium">
                      {selectedChar.aliases}
                    </p>
                  </div>
                )}

                {/* Formatted Biography */}
                <div className="max-h-80 overflow-y-auto pr-1">
                  {renderFormattedDescription(selectedChar.description)}
                </div>
              </div>

              {/* Bottom Character Switcher */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                  {characters.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedIndex(i)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        i === selectedIndex
                          ? "bg-[#d4af37] text-slate-950 shadow-md shadow-[#d4af37]/20 font-extrabold"
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
                  className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-sm font-semibold transition-colors border border-white/10 shrink-0 cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COMPACT & ERGONOMIC MOBILE BOTTOM-SHEET (< md screens) */}
          {/* ========================================================================= */}
          <div
            className="md:hidden relative w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black border-t border-[#d4af37]/40 rounded-t-3xl p-4 sm:p-5 shadow-[0_-15px_50px_rgba(0,0,0,0.95)] max-h-[85vh] overflow-y-auto flex flex-col space-y-3.5 animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto -mt-1 shrink-0" />

            {/* Mobile Hero Bar: Side-by-Side (Avatar + Name/Role) */}
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* 9:16 Mini Avatar with Tap-to-Zoom */}
                <div
                  onClick={() => setIsFullscreenImage(true)}
                  className="group relative w-16 aspect-[9/16] rounded-xl overflow-hidden bg-slate-950 border-2 border-[#d4af37]/60 shrink-0 shadow-lg cursor-pointer active:scale-95 transition-all"
                  title="Chạm để xem ảnh toàn màn hình"
                >
                  {selectedChar.avatarUrl ? (
                    <img
                      src={selectedChar.avatarUrl}
                      alt={selectedChar.name}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                      <User className="w-6 h-6 text-[#d4af37]/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Name, Role & Quick Expand */}
                <div className="space-y-1 min-w-0">
                  {selectedChar.role && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#d4af37]/15 text-amber-300 border border-[#d4af37]/30 truncate max-w-full">
                      <Shield className="w-2.5 h-2.5 shrink-0 text-[#d4af37]" />
                      <span className="truncate">{selectedChar.role}</span>
                    </span>
                  )}
                  <h3 className="text-base font-extrabold text-white tracking-tight truncate leading-tight">
                    {selectedChar.name}
                  </h3>
                  {selectedChar.aliases && (
                    <p className="text-[11px] text-amber-200/80 truncate font-medium">
                      {selectedChar.aliases}
                    </p>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => setIsFullscreenImage(true)}
                    className="text-[11px] font-bold text-[#d4af37] hover:text-amber-300 flex items-center gap-1 pt-0.5 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" /> Xem ảnh 9:16 HD
                  </button>
                </div>
              </div>

              {/* Close Button Mobile */}
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Body Content */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[48vh] pr-0.5">
              {selectedChar.aliases && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 space-y-0.5">
                  <div className="text-[10px] font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#d4af37]" /> Danh Xưng & Biệt Hiệu
                  </div>
                  <p className="text-xs text-slate-100 font-medium">
                    {selectedChar.aliases}
                  </p>
                </div>
              )}

              {renderFormattedDescription(selectedChar.description)}
            </div>

            {/* Mobile Thumb Navigation (Switch Between Characters) */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {characters.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedIndex(i)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      i === selectedIndex
                        ? "bg-[#d4af37] text-slate-950 shadow-md font-extrabold"
                        : "bg-white/5 text-slate-300 border border-white/5"
                    }`}
                  >
                    {c.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="px-4 py-1.5 rounded-xl bg-white/10 text-slate-200 text-xs font-semibold shrink-0"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* FULLSCREEN IMMERSIVE LIGHTBOX (PORTALED TO BODY) */}
      {mounted && selectedChar && isFullscreenImage && createPortal(
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
        </div>,
        document.body
      )}
    </div>
  );
}
