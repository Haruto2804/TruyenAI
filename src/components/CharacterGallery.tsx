"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Sparkles, User, X, Shield, Tag,
  ChevronRight, ChevronLeft, Maximize2, Eye, ChevronDown, Loader2
} from "lucide-react";
import { getCharacterAvatarUrl } from "@/lib/images";
import { getPublicCharacters } from "@/app/actions/character_loader";

function DefaultSilhouette({ showText = false, text = "Chưa có ảnh" }: { showText?: boolean; text?: string }) {
  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900">
      <img src="/characters/default-avatar.jpeg" alt="Default Avatar" loading="lazy" className="w-full h-full object-cover object-center opacity-70" />
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-4 pb-6">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-widest backdrop-blur-md bg-black/50 px-2 py-1 rounded shadow-lg border border-white/10">{text}</span>
        </div>
      )}
    </div>
  );
}

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
  storySlug?: string;
  storyId?: string;
  totalCharacters?: number;
}

function getCardRole(role?: string | null): string {
  if (!role) return "";
  const parts = role.split(/[/–—]/);
  return parts[0].trim();
}

function renderFormattedDescription(desc: string | null) {
  if (!desc) return <p className="text-sm text-slate-500 italic py-3">Chưa có tóm tắt cho nhân vật này.</p>;

  // Split by double newline for paragraphs
  const paragraphs = desc.split(/\n\s*\n/);

  return (
    <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 shadow-inner">
      {paragraphs.map((p, pIdx) => {
        const parts = p.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
        return (
          <p key={pIdx} className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal">
            {parts.map((part, idx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={idx} className="font-extrabold text-amber-300">
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

export function CharacterGallery({
  characters: initialCharacters,
  storySlug,
  storyId,
  totalCharacters,
}: CharacterGalleryProps) {
  const [mounted, setMounted] = useState(false);
  const [characters, setCharacters] = useState<CharacterItem[]>(initialCharacters);
  const [total, setTotal] = useState<number>(totalCharacters ?? initialCharacters.length);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedChar = selectedIndex !== null ? characters[selectedIndex] : null;
  const hasMore = characters.length < total;
  const remainingCount = total - characters.length;

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    if (!storyId) return;

    setLoadingMore(true);
    const res = await getPublicCharacters({
      storyId,
      skip: characters.length,
      take: 4,
    });
    if (res.success && res.characters.length > 0) {
      setCharacters((prev) => [...prev, ...res.characters]);
      setTotal(res.total);
    }
    setLoadingMore(false);
  };

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
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 sm:pb-5">
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 shadow-[0_0_20px_rgba(212,175,55,0.2)] shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 truncate">
              <span>Hồ Sơ Nhân Vật</span>
              <span className="text-xs sm:text-base font-bold text-amber-400">({total})</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal mt-0.5 truncate">
              Chiêm ngưỡng chân dung minh họa 9:16 và khám phá hồ sơ nhân vật.
            </p>
          </div>
        </div>

        <span className="text-xs sm:text-sm text-amber-200/90 font-semibold bg-white/5 px-3 py-1.5 rounded-full border border-white/10 shrink-0 hidden xs:inline">
          Chạm để mở hồ sơ
        </span>
      </div>

      {/* Grid Danh Sách Nhân Vật (2 Cột Mobile, 4 Cột Desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
        {characters.map((char, index) => {
          const shortRole = getCardRole(char.role);

          return (
            <div
              key={char.id}
              onClick={() => handleOpenChar(index)}
              className="group relative cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900/90 border border-white/10 hover:border-[#d4af37]/70 hover:shadow-[0_12px_35px_rgba(212,175,55,0.25)] transition-all duration-300 transform active:scale-98"
            >
              {/* Khung Tranh Chuẩn 9:16 */}
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-slate-950">
                {(() => {
                  const avatar = getCharacterAvatarUrl(char.avatarUrl, storySlug, char.name);
                  return avatar ? (
                    <img
                      src={avatar}
                      alt={char.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/characters/default-avatar.jpeg';
                        (e.target as HTMLImageElement).onerror = null;
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <DefaultSilhouette showText={true} />
                  );
                })()}

                {/* Shimmer Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />

                {/* Role Badge Floating on Top Left */}
                {shortRole && (
                  <div className="absolute top-2.5 left-2.5 right-2.5 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] sm:text-xs font-extrabold bg-black/80 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/40 shadow-sm max-w-full">
                      <Shield className="w-3 h-3 shrink-0" />
                      <span className="truncate">{shortRole}</span>
                    </span>
                  </div>
                )}

                {/* Bottom Character Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 space-y-1">
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug group-hover:text-amber-200 transition-colors line-clamp-2">
                    {char.name}
                  </h3>

                  {char.aliases && (
                    <p className="text-[11px] sm:text-xs text-amber-300/80 font-medium line-clamp-1">
                      {char.aliases}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1.5 border-t border-white/15 text-[11px] sm:text-xs font-extrabold text-[#d4af37] group-hover:text-amber-300 transition-colors">
                    <span>Xem hồ sơ</span>
                    <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-white/10">
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Đang hiển thị <span className="text-[#d4af37] font-bold">{characters.length}</span> / {total} nhân vật
          </p>
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#d4af37]/15 via-[#d4af37]/25 to-amber-500/15 hover:from-[#d4af37]/25 hover:to-amber-500/25 text-amber-200 hover:text-white border border-[#d4af37]/40 hover:border-[#d4af37] font-bold text-xs sm:text-sm md:text-base shadow-lg shadow-black/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 group disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin" />
                <span>Đang tải thêm...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#d4af37] group-hover:rotate-12 transition-transform" />
                <span>Xem thêm nhân vật (còn {remainingCount} nhân vật)</span>
                <ChevronDown className="w-4 h-4 text-[#d4af37] group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* UNIVERSAL CHARACTER DOSSIER MODAL (PORTALED TO BODY) */}
      {/* ========================================================================= */}
      {mounted && selectedChar && !isFullscreenImage && createPortal(
        <div
          className="fixed inset-0 top-0 left-0 w-full h-full z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          {/* ========================================================================= */}
          {/* DESKTOP SPLIT-SCREEN VIEW (>= md screens) */}
          {/* ========================================================================= */}
          <div
            className="hidden md:flex relative w-full md:max-w-5xl lg:max-w-6xl h-[86vh] bg-gradient-to-br from-slate-900 via-slate-950 to-black border-2 border-[#d4af37]/50 rounded-3xl shadow-[0_0_90px_rgba(212,175,55,0.25)] overflow-hidden animate-in zoom-in-95 duration-200 m-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Desktop */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-2xl bg-black/60 hover:bg-[#d4af37] text-slate-300 hover:text-slate-950 border border-white/15 backdrop-blur-md transition-all shadow-xl cursor-pointer"
              title="Đóng (Esc)"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cột 1 (Desktop Trái): Chân dung 9:16 */}
            <div className="w-5/12 lg:w-9/20 h-full bg-black/60 border-r border-white/10 p-5 flex flex-col items-center justify-between relative shrink-0 group overflow-hidden">
              {/* Prev / Next Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-2xl bg-black/80 hover:bg-[#d4af37] text-white hover:text-slate-950 border border-white/20 transition-all shadow-xl items-center justify-center cursor-pointer active:scale-95"
                title="Nhân vật trước (Mũi tên trái)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-2xl bg-black/80 hover:bg-[#d4af37] text-white hover:text-slate-950 border border-white/20 transition-all shadow-xl items-center justify-center cursor-pointer active:scale-95"
                title="Nhân vật tiếp theo (Mũi tên phải)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div
                onClick={() => setIsFullscreenImage(true)}
                className="relative flex-1 w-full max-h-[64vh] flex items-center justify-center cursor-pointer my-auto"
              >
                {(() => {
                  const avatar = getCharacterAvatarUrl(selectedChar.avatarUrl, storySlug, selectedChar.name);
                  return avatar ? (
                    <div className="relative h-full aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-2 border-[#d4af37]/40 group-hover:border-[#d4af37] transition-all">
                      <img
                        src={avatar}
                        alt={selectedChar.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/characters/default-avatar.jpeg';
                          (e.target as HTMLImageElement).onerror = null;
                        }}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#d4af37] text-slate-950 text-xs font-extrabold shadow-xl">
                          <Maximize2 className="w-4 h-4" /> Phóng to HD
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full aspect-[9/16] rounded-2xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                      <User className="w-16 h-16 text-[#d4af37]/40 mb-2" />
                      <span className="text-xs text-slate-400">Chưa có ảnh chân dung</span>
                    </div>
                  );
                })()}
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-400 shrink-0">
                <span className="text-slate-300 font-bold">{selectedIndex! + 1} / {characters.length} nhân vật</span>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => setIsFullscreenImage(true)}
                  className="text-amber-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" /> Xem ảnh gốc 9:16
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
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-amber-200 tracking-tight leading-tight font-serif">
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
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${i === selectedIndex
                        ? "bg-[#d4af37] text-slate-950 shadow-md shadow-[#d4af37]/20 font-extrabold scale-105"
                        : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5"
                        }`}
                    >
                      <span>{c.name.split(" ")[0]}</span>
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
          {/* MOBILE LUXURY IMMERSIVE DOSSIER VIEW (< md screens) */}
          {/* ========================================================================= */}
          <div
            className="md:hidden relative w-full max-w-lg bg-gradient-to-b from-slate-900/95 via-slate-950 to-black border-2 border-[#d4af37]/50 rounded-3xl p-4 xs:p-5 shadow-[0_0_80px_rgba(0,0,0,0.95)] max-h-[88vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 m-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pull Bar Indicator */}
            <div className="w-12 h-1.5 rounded-full bg-white/25 mx-auto mb-3 shrink-0" />

            {/* Mobile Hero Header: Large 9:16 Portrait Card + Details */}
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* 9:16 Avatar Thumbnail with Glowing Golden Border */}
                <div
                  onClick={() => setIsFullscreenImage(true)}
                  className="group relative w-20 xs:w-24 aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border-2 border-[#d4af37] shrink-0 shadow-[0_10px_25px_rgba(212,175,55,0.3)] cursor-pointer active:scale-95 transition-all"
                  title="Chạm để xem ảnh toàn màn hình"
                >
                  {(() => {
                    const avatar = getCharacterAvatarUrl(selectedChar.avatarUrl, storySlug, selectedChar.name);
                    return avatar ? (
                      <img
                        src={avatar}
                        alt={selectedChar.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/characters/default-avatar.jpeg';
                          (e.target as HTMLImageElement).onerror = null;
                        }}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <DefaultSilhouette />
                    );
                  })()}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Name, Role & Quick Actions */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  {selectedChar.role && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] xs:text-[11px] font-extrabold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 shadow-sm max-w-full">
                      <Shield className="w-3 h-3 shrink-0" />
                      <span className="truncate">{getCardRole(selectedChar.role)}</span>
                    </div>
                  )}

                  <h3 className="text-base xs:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-amber-200 tracking-tight leading-snug line-clamp-2 font-serif">
                    {selectedChar.name}
                  </h3>

                  {selectedChar.aliases && (
                    <div className="flex items-start gap-1 text-xs text-amber-200/90 font-medium line-clamp-2">
                      <Tag className="w-3 h-3 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>{selectedChar.aliases}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsFullscreenImage(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4af37] hover:text-amber-300 pt-1 cursor-pointer bg-[#d4af37]/10 hover:bg-[#d4af37]/20 px-2.5 py-1 rounded-lg border border-[#d4af37]/30 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem ảnh 9:16 HD</span>
                  </button>
                </div>
              </div>

              {/* Close Button Mobile */}
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors shrink-0 cursor-pointer"
                title="Đóng"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Body Content (Scrollable) */}
            <div className="space-y-3 flex-1 overflow-y-auto py-3.5 pr-0.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tóm Tắt Nhân Vật</span>
              </div>
              {renderFormattedDescription(selectedChar.description)}
            </div>

            {/* Mobile Thumb Navigation (Switch Between Characters) */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 min-w-0 flex-1">
                {characters.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedIndex(i)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${i === selectedIndex
                      ? "bg-[#d4af37] text-slate-950 font-extrabold shadow-sm"
                      : "bg-white/5 text-slate-300 border border-white/5 hover:bg-white/10"
                      }`}
                  >
                    {c.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold shrink-0 cursor-pointer border border-white/10 transition-colors"
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
          className="fixed inset-0 top-0 left-0 w-full h-full z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsFullscreenImage(false)}
        >
          {/* Top Bar inside Fullscreen Lightbox */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none max-w-5xl mx-auto">
            <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#d4af37]/40 pointer-events-auto shadow-xl">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>{selectedChar.name}</span>
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
              className="p-3 rounded-2xl bg-black/80 hover:bg-white/20 text-white border border-white/20 transition-colors pointer-events-auto shadow-2xl cursor-pointer"
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
            {(() => {
              const avatar = getCharacterAvatarUrl(selectedChar.avatarUrl, storySlug, selectedChar.name);
              return avatar ? (
                <img
                  src={avatar}
                  alt={selectedChar.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/characters/default-avatar.jpeg';
                    (e.target as HTMLImageElement).onerror = null;
                  }}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <DefaultSilhouette showText={true} text="Chưa có ảnh chân dung" />
              );
            })()}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
