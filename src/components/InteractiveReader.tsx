"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  User, X, Sparkles, BookOpen, Shield, Scroll, Tag, 
  BookMarked, ShieldAlert, Flame, Compass, Gem, Layers,
  Type, Sun, Moon, Coffee, Sliders, ChevronDown, Check,
  Maximize2, Minimize2
} from "lucide-react";

export interface CharacterInfo {
  id: string;
  name: string;
  aliases: string | null;
  role: string | null;
  avatarUrl: string | null;
  description: string | null;
}

export interface LoreInfo {
  id: string;
  term: string;
  category: string | null;
  definition: string;
  aliases: string | null;
}

interface InteractiveReaderProps {
  content: string;
  characters?: CharacterInfo[];
  lores?: LoreInfo[];
  storySlug?: string;
}

type MatchedItem = 
  | { type: "character"; data: CharacterInfo }
  | { type: "lore"; data: LoreInfo };

type ReadingTheme = "dark" | "sepia" | "oled";
type FontFamily = "serif" | "sans";

const CATEGORY_EMOJIS: Record<string, string> = {
  "Độc Dược": "🧪",
  "Bí Thuật": "🔮",
  "Địa Danh": "🏰",
  "Bảo Vật": "💎",
  "Thế Lực": "🛡️",
  "Cảnh Giới": "⚡",
  "Công Pháp": "📜",
  "default": "📖"
};

function getRoleEmoji(role?: string | null): string {
  if (!role) return "👤";
  if (role.includes("Nhân vật chính")) return "👑";
  if (role.includes("Công chúa") || role.includes("Công Chúa")) return "👸";
  if (role.includes("Kiếm") || role.includes("Chiến")) return "⚔️";
  if (role.includes("Hầu nữ")) return "🥀";
  if (role.includes("Sát thủ") || role.includes("Ám")) return "🗡️";
  return "🛡️";
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderInteractiveSegment(
  text: string,
  termMap: Map<string, MatchedItem>,
  regex: RegExp | null,
  onSelectItem: (item: MatchedItem) => void,
  onHoverItem: (item: MatchedItem, rect: DOMRect) => void,
  onLeaveHover: () => void,
  keyPrefix: number | string = 0
) {
  if (!regex) return text;

  const parts = text.split(regex);
  if (parts.length <= 1) return text;

  return parts.map((part, partIdx) => {
    const matched = termMap.get(part.toLowerCase());
    if (matched) {
      if (matched.type === "character") {
        return (
          <button
            key={`${keyPrefix}-${partIdx}`}
            type="button"
            onClick={() => onSelectItem(matched)}
            onMouseEnter={(e) => onHoverItem(matched, e.currentTarget.getBoundingClientRect())}
            onMouseLeave={onLeaveHover}
            className="inline font-semibold text-amber-200 underline decoration-dotted decoration-[#d4af37]/90 underline-offset-[4px] hover:decoration-solid hover:text-[#d4af37] hover:bg-[#d4af37]/20 px-0.5 rounded transition-all cursor-pointer select-none"
            title={`Tra cứu nhân vật: ${matched.data.name}`}
          >
            {part}
          </button>
        );
      }
      if (matched.type === "lore") {
        return (
          <button
            key={`${keyPrefix}-${partIdx}`}
            type="button"
            onClick={() => onSelectItem(matched)}
            onMouseEnter={(e) => onHoverItem(matched, e.currentTarget.getBoundingClientRect())}
            onMouseLeave={onLeaveHover}
            className="inline font-semibold text-cyan-200 underline decoration-dotted decoration-cyan-400/90 underline-offset-[4px] hover:decoration-solid hover:text-cyan-300 hover:bg-cyan-500/20 px-0.5 rounded transition-all cursor-pointer select-none"
            title={`Tra cứu chú giải: ${matched.data.term}`}
          >
            {part}
          </button>
        );
      }
    }
    return part;
  });
}

function renderInteractiveParagraph(
  rawText: string,
  termMap: Map<string, MatchedItem>,
  regex: RegExp | null,
  onSelectItem: (item: MatchedItem) => void,
  onHoverItem: (item: MatchedItem, rect: DOMRect) => void,
  onLeaveHover: () => void
) {
  if (!rawText) return null;

  // Completely strip all markdown asterisks (**, *, ***) from prose text
  const cleanText = rawText.replace(/\*+/g, "");

  return renderInteractiveSegment(cleanText, termMap, regex, onSelectItem, onHoverItem, onLeaveHover);
}

export function InteractiveReader({
  content,
  characters = [],
  lores = [],
}: InteractiveReaderProps) {
  // Popover State (Click/Tap to Pin)
  const [selectedItem, setSelectedItem] = useState<MatchedItem | null>(null);

  // PC Hover Tooltip State
  const [hoveredInfo, setHoveredInfo] = useState<{
    item: MatchedItem;
    x: number;
    y: number;
  } | null>(null);

  const handleHoverItem = (item: MatchedItem, rect: DOMRect) => {
    setHoveredInfo({
      item,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleLeaveHover = () => {
    setHoveredInfo(null);
  };

  // Reader Customization State (Stored in localStorage)
  const [fontSize, setFontSize] = useState<number>(23); // 16 to 34px
  const [fontFamily, setFontFamily] = useState<FontFamily>("serif");
  const [theme, setTheme] = useState<ReadingTheme>("dark");
  const [lineHeight, setLineHeight] = useState<number>(2.2); // 1.8 to 2.5
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when pinned modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedItem]);

  // Load reader preferences from localStorage
  useEffect(() => {
    try {
      const savedFontSize = localStorage.getItem("reader_fontSize");
      const savedFontFamily = localStorage.getItem("reader_fontFamily") as FontFamily;
      const savedTheme = localStorage.getItem("reader_theme") as ReadingTheme;
      const savedLineHeight = localStorage.getItem("reader_lineHeight");

      if (savedFontSize) setFontSize(Number(savedFontSize));
      if (savedFontFamily) setFontFamily(savedFontFamily);
      if (savedTheme) setTheme(savedTheme);
      if (savedLineHeight) setLineHeight(Number(savedLineHeight));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const updateFontSize = (delta: number) => {
    setFontSize((prev) => {
      const next = Math.min(34, Math.max(16, prev + delta));
      localStorage.setItem("reader_fontSize", String(next));
      return next;
    });
  };

  const updateTheme = (newTheme: ReadingTheme) => {
    setTheme(newTheme);
    localStorage.setItem("reader_theme", newTheme);
  };

  const updateFontFamily = (newFont: FontFamily) => {
    setFontFamily(newFont);
    localStorage.setItem("reader_fontFamily", newFont);
  };

  const updateLineHeight = (newLineHeight: number) => {
    setLineHeight(newLineHeight);
    localStorage.setItem("reader_lineHeight", String(newLineHeight));
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
        setHoveredInfo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Build unified lookup dictionary for Characters and Lores
  const { termMap, regex } = useMemo(() => {
    const map = new Map<string, MatchedItem>();
    const termsSet = new Set<string>();

    // 1. Process Characters
    characters.forEach((char) => {
      if (char.name && char.name.trim().length >= 2) {
        const cleanName = char.name.trim();
        map.set(cleanName.toLowerCase(), { type: "character", data: char });
        termsSet.add(cleanName);
      }

      if (char.aliases) {
        char.aliases.split(",").forEach((alias) => {
          const cleanAlias = alias.trim();
          if (cleanAlias.length >= 2) {
            map.set(cleanAlias.toLowerCase(), { type: "character", data: char });
            termsSet.add(cleanAlias);
          }
        });
      }
    });

    // 2. Process Lores / Glossaries
    lores.forEach((lore) => {
      if (lore.term && lore.term.trim().length >= 2) {
        const cleanTerm = lore.term.trim();
        map.set(cleanTerm.toLowerCase(), { type: "lore", data: lore });
        termsSet.add(cleanTerm);
      }

      if (lore.aliases) {
        lore.aliases.split(",").forEach((alias) => {
          const cleanAlias = alias.trim();
          if (cleanAlias.length >= 2) {
            map.set(cleanAlias.toLowerCase(), { type: "lore", data: lore });
            termsSet.add(cleanAlias);
          }
        });
      }
    });

    if (termsSet.size === 0) {
      return { termMap: map, regex: null };
    }

    // Sort terms descending by length so longer phrases match before substrings
    const sortedTerms = Array.from(termsSet).sort((a, b) => b.length - a.length);
    const escapedTerms = sortedTerms.map((t) => escapeRegExp(t));
    const combinedRegex = new RegExp(`(${escapedTerms.join("|")})`, "gi");

    return { termMap: map, regex: combinedRegex };
  }, [characters, lores]);

  // Split chapter content by double newline
  const paragraphs = useMemo(() => {
    return content.split(/\n\s*\n/).filter(Boolean);
  }, [content]);

  // Theme styling definitions
  const themeStyles = {
    dark: {
      wrapper: "bg-slate-950/80 border-white/10 text-slate-200",
      pColor: "text-slate-200",
      activeThemeBtn: "bg-[#d4af37] text-slate-950 font-bold",
      inactiveThemeBtn: "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5",
    },
    sepia: {
      wrapper: "bg-[#181410] border-amber-900/30 text-[#e6d7be]",
      pColor: "text-[#e6d7be]",
      activeThemeBtn: "bg-amber-600 text-white font-bold",
      inactiveThemeBtn: "bg-white/5 hover:bg-white/10 text-amber-300/60 hover:text-amber-200 border-white/5",
    },
    oled: {
      wrapper: "bg-black border-neutral-900 text-neutral-300",
      pColor: "text-neutral-300",
      activeThemeBtn: "bg-white text-black font-bold",
      inactiveThemeBtn: "bg-neutral-900 hover:bg-neutral-800 text-neutral-500 hover:text-neutral-200 border-neutral-800",
    },
  }[theme];

  return (
    <div className="relative space-y-6">
      {/* Floating Reader Settings Toolbar */}
      <div className="sticky top-20 z-40 flex items-center justify-end pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-xl border border-[#d4af37]/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded-2xl p-2 flex items-center gap-2">
          {/* Quick Toggle Settings Button */}
          <button
            type="button"
            onClick={() => setShowToolbar(!showToolbar)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#d4af37] text-slate-300 hover:text-slate-950 text-xs font-bold border border-white/10 hover:border-[#d4af37] transition-all cursor-pointer"
            title="Tùy chỉnh font chữ, cỡ chữ, giao diện đọc"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tùy Chỉnh Đọc</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showToolbar ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Expanded Reader Toolbar */}
      {showToolbar && (
        <div className="bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-black border-2 border-[#d4af37]/40 rounded-3xl p-5 sm:p-6 shadow-[0_15px_45px_rgba(0,0,0,0.9)] backdrop-blur-2xl space-y-5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>Cài Đặt Trải Nghiệm Đọc</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowToolbar(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* 1. Font Size */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Cỡ chữ ({fontSize}px)</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateFontSize(-2)}
                  className="flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 text-xs font-extrabold border border-white/10 cursor-pointer"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => updateFontSize(2)}
                  className="flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 text-xs font-extrabold border border-white/10 cursor-pointer"
                >
                  A+
                </button>
              </div>
            </div>

            {/* 2. Line Height */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Giãn dòng ({lineHeight})</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateLineHeight(1.8)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    lineHeight === 1.8 ? "bg-[#d4af37] text-slate-950 border-[#d4af37]" : "bg-white/5 text-slate-300 border-white/10"
                  }`}
                >
                  Gọn
                </button>
                <button
                  type="button"
                  onClick={() => updateLineHeight(2.2)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    lineHeight === 2.2 ? "bg-[#d4af37] text-slate-950 border-[#d4af37]" : "bg-white/5 text-slate-300 border-white/10"
                  }`}
                >
                  Vừa
                </button>
                <button
                  type="button"
                  onClick={() => updateLineHeight(2.5)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    lineHeight === 2.5 ? "bg-[#d4af37] text-slate-950 border-[#d4af37]" : "bg-white/5 text-slate-300 border-white/10"
                  }`}
                >
                  Thoáng
                </button>
              </div>
            </div>

            {/* 3. Font Family */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Kiểu chữ</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateFontFamily("serif")}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-serif font-bold border cursor-pointer ${
                    fontFamily === "serif" ? "bg-[#d4af37] text-slate-950 border-[#d4af37]" : "bg-white/5 text-slate-300 border-white/10"
                  }`}
                >
                  Có chân
                </button>
                <button
                  type="button"
                  onClick={() => updateFontFamily("sans")}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-sans font-bold border cursor-pointer ${
                    fontFamily === "sans" ? "bg-[#d4af37] text-slate-950 border-[#d4af37]" : "bg-white/5 text-slate-300 border-white/10"
                  }`}
                >
                  Không chân
                </button>
              </div>
            </div>

            {/* 4. Theme Selection */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Giao diện màu</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateTheme("dark")}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 cursor-pointer ${
                    theme === "dark" ? "bg-[#d4af37] text-slate-950 border-[#d4af37]" : "bg-white/5 text-slate-300 border-white/10"
                  }`}
                  title="Giao diện Dark Night"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("sepia")}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 cursor-pointer ${
                    theme === "sepia" ? "bg-amber-600 text-white border-amber-500" : "bg-white/5 text-slate-300 border-white/10"
                  }`}
                  title="Giao diện Giấy Cũ Sepia"
                >
                  <Coffee className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("oled")}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 cursor-pointer ${
                    theme === "oled" ? "bg-white text-slate-950 border-white" : "bg-white/5 text-slate-300 border-white/10"
                  }`}
                  title="Giao diện AMOLED Black"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Text Body */}
      <div
        className={`rounded-3xl p-5 sm:p-8 md:p-12 border shadow-2xl transition-colors duration-300 ${themeStyles.wrapper} ${
          fontFamily === "serif" ? "font-serif" : "font-sans"
        }`}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
        }}
      >
        {paragraphs.map((paragraph, pIdx) => (
          <p
            key={pIdx}
            className={`mb-7 sm:mb-8 ${themeStyles.pColor} tracking-wide font-normal`}
          >
            {renderInteractiveParagraph(paragraph, termMap, regex, setSelectedItem, handleHoverItem, handleLeaveHover)}
          </p>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. PC FLOATING HOVER CARD (TOOLTIP PREVIEW ON DESKTOP) */}
      {/* ========================================================================= */}
      {hoveredInfo && !selectedItem && (
        <div
          className="hidden md:block fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full pb-3 animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: `${Math.max(200, Math.min(typeof window !== "undefined" ? window.innerWidth - 200 : 1000, hoveredInfo.x))}px`,
            top: `${Math.max(10, hoveredInfo.y - 8)}px`,
          }}
        >
          <div className="w-88 sm:w-96 max-w-[calc(100vw-2rem)] bg-gradient-to-b from-slate-900/98 via-slate-950/98 to-black border-2 border-[#d4af37]/60 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl space-y-3 overflow-hidden">
            {hoveredInfo.item.type === "character" ? (
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 aspect-[9/16] rounded-xl overflow-hidden bg-slate-950 border border-[#d4af37]/50 shrink-0 shadow-md">
                    {hoveredInfo.item.data.avatarUrl ? (
                      <img
                        src={hoveredInfo.item.data.avatarUrl}
                        alt={hoveredInfo.item.data.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-[#d4af37]/60">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex">
                      <span className="inline-flex items-center gap-1 max-w-full px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                        <span className="shrink-0">{getRoleEmoji(hoveredInfo.item.data.role)}</span>
                        <span className="truncate">{hoveredInfo.item.data.role || "Nhân vật"}</span>
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-white truncate">
                      {hoveredInfo.item.data.name}
                    </h4>
                    {hoveredInfo.item.data.aliases && (
                      <p className="text-[11px] text-amber-200/80 truncate font-medium">
                        {hoveredInfo.item.data.aliases}
                      </p>
                    )}
                  </div>
                </div>
                {hoveredInfo.item.data.description && (
                  <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 overflow-hidden">
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-normal">
                      {hoveredInfo.item.data.description.replace(/\*+/g, "")}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-base shrink-0">
                      {(hoveredInfo.item.data.category && CATEGORY_EMOJIS[hoveredInfo.item.data.category]) || CATEGORY_EMOJIS.default}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block truncate">
                        {hoveredInfo.item.data.category || "Thuật ngữ"}
                      </span>
                      <h4 className="font-extrabold text-sm text-white truncate">
                        {hoveredInfo.item.data.term}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 overflow-hidden">
                  <p className="text-xs text-slate-200 line-clamp-4 leading-relaxed font-normal">
                    {hoveredInfo.item.data.definition.replace(/\*+/g, "")}
                  </p>
                </div>
              </div>
            )}
            <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>💡 Bấm để ghim / xem chi tiết</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CLICKED PINNED MODAL (UNIVERSALLY CENTERED IN FULL VIEWPORT) */}
      {/* ========================================================================= */}
      {mounted && selectedItem && createPortal(
        <div
          className="fixed inset-0 top-0 left-0 w-full h-full z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          {/* Modal / Dialog Container */}
          <div
            className="relative w-full max-w-lg md:max-w-xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-[#d4af37]/50 rounded-3xl p-5 sm:p-7 shadow-[0_0_80px_rgba(212,175,55,0.35)] space-y-4 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200 m-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Character Dossier Popover */}
            {selectedItem.type === "character" && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3.5">
                    {/* Avatar 9:16 Portrait Canvas */}
                    <div className="w-20 aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border-2 border-[#d4af37]/50 shrink-0 shadow-2xl relative">
                      {selectedItem.data.avatarUrl ? (
                        <img
                          src={selectedItem.data.avatarUrl}
                          alt={selectedItem.data.name}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
                          <User className="w-8 h-8 text-[#d4af37]/40" />
                        </div>
                      )}
                    </div>

                    {/* Titles with Emojis */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-md bg-[#d4af37]/10 text-[#d4af37]">
                          <Sparkles className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[11px] font-bold text-amber-200/80 uppercase tracking-wider">
                          Hồ Sơ Nhân Vật
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                        {selectedItem.data.name}
                      </h3>
                      {selectedItem.data.role && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                          <span>{getRoleEmoji(selectedItem.data.role)}</span>
                          <span>{selectedItem.data.role}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Đóng (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {selectedItem.data.aliases && (
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-slate-300">
                    <span className="text-slate-500 font-semibold">Biệt danh & Cách gọi:</span>{" "}
                    <span className="text-amber-200/90 font-medium">{selectedItem.data.aliases}</span>
                  </div>
                )}

                {selectedItem.data.description && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                      <Scroll className="w-3.5 h-3.5" /> Tiểu sử & Tính cách
                    </div>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light whitespace-pre-wrap bg-black/40 border border-white/5 rounded-xl p-3.5 max-h-56 overflow-y-auto">
                      {selectedItem.data.description.replace(/\*+/g, "")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Lore / Glossary Popover with Emojis */}
            {selectedItem.type === "lore" && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 text-xl flex items-center justify-center">
                      {(selectedItem.data.category && CATEGORY_EMOJIS[selectedItem.data.category]) || CATEGORY_EMOJIS.default}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-cyan-300/80 uppercase tracking-wider">
                          Chú Giải Khái Niệm
                        </span>
                        {selectedItem.data.category && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            {selectedItem.data.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                        {selectedItem.data.term}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Đóng (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {selectedItem.data.aliases && (
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-slate-300">
                    <span className="text-slate-500 font-semibold">Từ đồng nghĩa:</span>{" "}
                    <span className="text-cyan-200/90 font-medium">{selectedItem.data.aliases}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Định nghĩa & Ý nghĩa
                  </div>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light whitespace-pre-wrap bg-black/40 border border-white/5 rounded-xl p-3.5 max-h-56 overflow-y-auto">
                    {selectedItem.data.definition.replace(/\*+/g, "")}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-semibold transition-colors border border-white/10 text-center cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
