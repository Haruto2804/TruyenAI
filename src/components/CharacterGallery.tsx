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

function getShortRole(role?: string | null): string {
  if (!role) return "";
  const parts = role.split(/[/–—]/);
  const main = parts[0].trim();
  if (main.includes("Tam Công Chúa")) return "Tam Công Chúa";
  if (main.includes("Nhân vật chính")) return "Nhân vật chính";
  if (main.includes("Hầu nữ")) return "Hầu nữ thân cận";
  if (main.includes("Đại tiểu thư")) return "Đại tiểu thư";
  return main.length > 16 ? main.slice(0, 16) + "..." : main;
}

function renderFormattedDescription(desc: string | null) {
  if (!desc) return <p className="text-sm sm:text-base text-slate-500 italic py-4">Chưa có tóm tắt cho nhân vật này.</p>;

  // Split by double newline for paragraphs
  const paragraphs = desc.split(/\n\s*\n/);

  return (
    <div className="bg-black/50 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 shadow-inner">
      {paragraphs.map((p, pIdx) => {
        const parts = p.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
        return (
          <p key={pIdx} className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-100 leading-relaxed sm:leading-loose font-normal">
            {parts.map((part, idx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={idx} className="font-extrabold text-[#d4af37]">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith("*") && part.endsWith("*")) {
                return (
                  <em key={idx} className="italic text-amber-200/90 font-medium">
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
      <div className="flex items-center justify-between border-b border-white/10 pb-4 sm:pb-5">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 shadow-inner">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Hồ Sơ Nhân Vật</span>
              <span className="text-sm sm:text-base font-semibold text-amber-400">({characters.length})</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-300 font-normal mt-0.5">
              Chiêm ngưỡng chân dung minh họa 9:16 và khám phá hồ sơ nhân vật.
            </p>
          </div>
        </div>

        <span className="text-xs sm:text-sm text-amber-200/90 font-semibold bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 shrink-0">
          Chạm để mở hồ sơ
        </span>
      </div>

      {/* Grid Danh Sách Nhân Vật (2 Cột Mobile, 4 Cột Desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {characters.map((char, index) => (
          <div
            key={char.id}
            onClick={() => handleOpenChar(index)}
            className="group relative cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900/90 border border-white/10 hover:border-[#d4af37]/70 hover:shadow-[0_12px_35px_rgba(212,175,55,0.25)] transition-all duration-300 transform active:scale-98"
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
                  <User className="w-12 h-12 text-[#d4af37]/40 mb-2" />
                  <span className="text-sm font-medium">Chưa có ảnh</span>
                </div>
              )}

              {/* Gradient che sáng để làm nổi bật thông tin */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-black/30 pointer-events-none" />

              {/* Role Badge */}
              {char.role && (
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 max-w-[calc(100%-16px)]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold bg-black/85 backdrop-blur-md text-amber-300 border border-[#d4af37]/50 shadow-xl truncate">
                    <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#d4af37] shrink-0" />
                    <span className="truncate">{getShortRole(char.role)}</span>
                  </span>
                </div>
              )}

              {/* Zoom Action Pill */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="p-2 rounded-xl bg-black/85 backdrop-blur-md text-[#d4af37] border border-white/20 flex items-center justify-center shadow-lg">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-5 space-y-1.5 sm:space-y-2 z-10">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg md:text-xl text-white group-hover:text-[#d4af37] transition-colors leading-snug truncate drop-shadow-md">
                    {char.name}
                  </h3>

                  {char.aliases && (
                    <p className="text-xs sm:text-sm md:text-base text-amber-300 font-semibold truncate">
                      {char.aliases}
                    </p>
                  )}
                </div>

                {char.description && (
                  <p className="text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 sm:line-clamp-3 leading-relaxed font-normal drop-shadow">
                    {char.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/15 text-xs sm:text-sm font-extrabold text-[#d4af37] group-hover:text-amber-300 transition-colors">
                  <span>Xem hồ sơ chi tiết</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* UNIVERSAL CHARACTER DOSSIER MODAL (PORTALED TO BODY - ALWAYS CENTERED) */}
      {/* ========================================================================= */}
      {mounted && selectedChar && !isFullscreenImage && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200"
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
            <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto space-y-6">
              <div className="space-y-5">
                {/* Header Profile Title */}
                <div>
                  {selectedChar.role && (
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40 shadow-sm mb-3">
                      <Shield className="w-4 h-4" />
                      {selectedChar.role}
                    </span>
                  )}
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    {selectedChar.name}
                  </h3>
                </div>

                {/* Aliases Card */}
                {selectedChar.aliases && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-1.5 shadow-inner">
                    <div className="text-xs sm:text-sm font-bold text-amber-200/90 uppercase tracking-wider flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#d4af37]" /> Biệt danh & Danh xưng
                    </div>
                    <p className="text-base sm:text-lg md:text-xl text-slate-100 font-semibold">
                      {selectedChar.aliases}
                    </p>
                  </div>
                )}

                {/* Formatted Biography */}
                <div className="overflow-y-auto pr-1">
                  {renderFormattedDescription(selectedChar.description)}
                </div>
              </div>

              {/* Bottom Character Switcher */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1">
                  {characters.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedIndex(i)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                        i === selectedIndex
                          ? "bg-[#d4af37] text-slate-950 shadow-md shadow-[#d4af37]/20 font-extrabold scale-105"
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
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-sm sm:text-base font-semibold transition-colors border border-white/10 shrink-0 cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CENTERED MOBILE MODAL VIEW (< md screens) */}
          {/* ========================================================================= */}
          <div
            className="md:hidden relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-[#d4af37]/40 rounded-3xl p-5 sm:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.95)] max-h-[85vh] overflow-y-auto flex flex-col space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Hero Bar: Side-by-Side (Avatar + Name/Role) */}
            <div className="flex items-start justify-between gap-3.5 border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* 9:16 Mini Avatar with Tap-to-Zoom */}
                <div
                  onClick={() => setIsFullscreenImage(true)}
                  className="group relative w-18 aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border-2 border-[#d4af37]/60 shrink-0 shadow-lg cursor-pointer active:scale-95 transition-all"
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
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Name, Role & Quick Expand */}
                <div className="space-y-1.5 min-w-0">
                  {selectedChar.role && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg text-xs font-extrabold bg-[#d4af37]/15 text-amber-300 border border-[#d4af37]/30 truncate max-w-full">
                      <Shield className="w-3 h-3 shrink-0 text-[#d4af37]" />
                      <span className="truncate">{selectedChar.role}</span>
                    </span>
                  )}
                  <h3 className="text-xl font-extrabold text-white tracking-tight truncate leading-tight">
                    {selectedChar.name}
                  </h3>
                  {selectedChar.aliases && (
                    <p className="text-xs sm:text-sm text-amber-200/90 truncate font-medium">
                      {selectedChar.aliases}
                    </p>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => setIsFullscreenImage(true)}
                    className="text-xs font-bold text-[#d4af37] hover:text-amber-300 flex items-center gap-1.5 pt-0.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Xem ảnh 9:16 HD
                  </button>
                </div>
              </div>

              {/* Close Button Mobile */}
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Body Content */}
            <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[50vh] pr-0.5">
              {selectedChar.aliases && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                  <div className="text-xs font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#d4af37]" /> Danh Xưng & Biệt Hiệu
                  </div>
                  <p className="text-sm sm:text-base text-slate-100 font-semibold">
                    {selectedChar.aliases}
                  </p>
                </div>
              )}

              {renderFormattedDescription(selectedChar.description)}
            </div>

            {/* Mobile Thumb Navigation (Switch Between Characters) */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                {characters.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedIndex(i)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
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
                className="px-5 py-2 rounded-xl bg-white/10 text-slate-200 text-xs sm:text-sm font-semibold shrink-0"
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
