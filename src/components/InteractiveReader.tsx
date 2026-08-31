"use client";

import { useState, useMemo, useEffect } from "react";
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

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const CATEGORY_ICONS: Record<string, any> = {
  "Độc Dược": ShieldAlert,
  "Bí Thuật": Flame,
  "Địa Danh": Compass,
  "Bảo Vật": Gem,
  "Thế Lực": Layers,
  "Cảnh Giới": Sparkles,
};

export function InteractiveReader({
  content,
  characters = [],
  lores = [],
}: InteractiveReaderProps) {
  // Popover State
  const [selectedItem, setSelectedItem] = useState<MatchedItem | null>(null);

  // Reader Customization State (Stored in localStorage)
  const [fontSize, setFontSize] = useState<number>(19); // 16 to 24px
  const [fontFamily, setFontFamily] = useState<FontFamily>("serif");
  const [theme, setTheme] = useState<ReadingTheme>("dark");
  const [lineHeight, setLineHeight] = useState<number>(2.2); // 1.8 to 2.5
  const [showToolbar, setShowToolbar] = useState<boolean>(false);

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
      const next = Math.min(26, Math.max(15, prev + delta));
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
      if (e.key === "Escape") setSelectedItem(null);
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

    // Sort terms by length descending to match longest phrases first (e.g. "Caelen Von Ravenwood" before "Caelen")
    const sortedTerms = Array.from(termsSet).sort((a, b) => b.length - a.length);

    if (sortedTerms.length === 0) {
      return { termMap: map, regex: null };
    }

    const pattern = `(${sortedTerms.map(escapeRegExp).join("|")})`;
    const reg = new RegExp(pattern, "gi");

    return { termMap: map, regex: reg };
  }, [characters, lores]);

  // Render paragraphs with highlighted mentions
  const paragraphs = useMemo(() => {
    return content.split("\n").filter((p) => p.trim() !== "");
  }, [content]);

  // Dynamic style themes for eye comfort
  const themeStyles = {
    dark: {
      wrapper: "bg-slate-950/80 border-white/10 text-slate-100",
      pColor: "text-slate-200/95",
      accent: "#d4af37",
    },
    sepia: {
      wrapper: "bg-[#181512] border-[#362e26] text-[#e8ded1]",
      pColor: "text-[#ded1c0]",
      accent: "#e5a93c",
    },
    oled: {
      wrapper: "bg-black border-neutral-900 text-neutral-200",
      pColor: "text-neutral-300",
      accent: "#eab308",
    },
  }[theme];

  return (
    <div className="space-y-6 select-text">
      {/* Reader Customization Floating Toolbar (Mobile & Desktop) */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 sm:p-3.5 transition-all">
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs sm:text-sm">
          {/* Quick Font Info */}
          <div className="flex items-center gap-2 text-slate-300 shrink-0">
            <div className="p-1.5 rounded-lg bg-[#d4af37]/15 text-[#d4af37]">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] sm:text-xs text-slate-300 font-medium whitespace-nowrap">
              {fontFamily === "serif" ? "Lora Serif" : "Modern Sans"} • {fontSize}px
            </span>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Font Size A- / A+ */}
            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5 shadow-inner">
              <button
                type="button"
                onClick={() => updateFontSize(-1)}
                className="px-2 py-1 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer active:scale-95"
                title="Giảm cỡ chữ"
              >
                A-
              </button>
              <span className="px-1.5 text-xs font-mono text-[#d4af37] font-bold">{fontSize}</span>
              <button
                type="button"
                onClick={() => updateFontSize(1)}
                className="px-2 py-1 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer active:scale-95"
                title="Tăng cỡ chữ"
              >
                A+
              </button>
            </div>

            {/* Font Family Toggle */}
            <button
              type="button"
              onClick={() => updateFontFamily(fontFamily === "serif" ? "sans" : "serif")}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 hover:border-[#d4af37]/40 text-xs font-semibold transition-all flex items-center gap-1 min-h-[32px] cursor-pointer active:scale-95"
              title="Đổi kiểu chữ (Serif / Sans)"
            >
              <Type className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] sm:text-xs">{fontFamily === "serif" ? "Serif" : "Sans"}</span>
            </button>

            {/* Theme Toggle Buttons */}
            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5 gap-0.5 shadow-inner">
              <button
                type="button"
                onClick={() => updateTheme("dark")}
                className={`p-1.5 rounded-lg transition-all min-h-[30px] min-w-[30px] flex items-center justify-center cursor-pointer ${
                  theme === "dark" ? "bg-white/20 text-[#d4af37]" : "text-slate-400 hover:text-white"
                }`}
                title="Giao diện Deep Dark"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateTheme("sepia")}
                className={`p-1.5 rounded-lg transition-all min-h-[30px] min-w-[30px] flex items-center justify-center cursor-pointer ${
                  theme === "sepia" ? "bg-amber-600/30 text-amber-300" : "text-slate-400 hover:text-white"
                }`}
                title="Giao diện Sepia ấm áp chống mỏi mắt"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateTheme("oled")}
                className={`p-1.5 rounded-lg transition-all min-h-[30px] min-w-[30px] flex items-center justify-center cursor-pointer ${
                  theme === "oled" ? "bg-white/20 text-yellow-300" : "text-slate-400 hover:text-white"
                }`}
                title="Giao diện AMOLED Black"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

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
        {paragraphs.map((paragraph, pIdx) => {
          if (!regex) {
            return (
              <p
                key={pIdx}
                className={`mb-7 sm:mb-8 ${themeStyles.pColor} tracking-wide font-normal`}
              >
                {paragraph}
              </p>
            );
          }

          // Split paragraph by character names and lore terms
          const parts = paragraph.split(regex);

          return (
            <p
              key={pIdx}
              className={`mb-7 sm:mb-8 ${themeStyles.pColor} tracking-wide font-normal`}
            >
              {parts.map((part, partIdx) => {
                const matched = termMap.get(part.toLowerCase());

                if (matched) {
                  if (matched.type === "character") {
                    return (
                      <button
                        key={partIdx}
                        type="button"
                        onClick={() => setSelectedItem(matched)}
                        className="inline font-medium text-amber-200 underline decoration-dotted decoration-[#d4af37]/80 underline-offset-[4px] hover:decoration-solid hover:text-[#d4af37] hover:bg-[#d4af37]/20 px-0.5 rounded transition-all cursor-pointer select-none"
                        title={`Tra cứu nhân vật: ${matched.data.name}`}
                      >
                        {part}
                      </button>
                    );
                  }

                  if (matched.type === "lore") {
                    return (
                      <button
                        key={partIdx}
                        type="button"
                        onClick={() => setSelectedItem(matched)}
                        className="inline font-medium text-cyan-200 underline decoration-dotted decoration-cyan-400/80 underline-offset-[4px] hover:decoration-solid hover:text-cyan-300 hover:bg-cyan-500/20 px-0.5 rounded transition-all cursor-pointer select-none"
                        title={`Tra cứu chú giải: ${matched.data.term}`}
                      >
                        {part}
                      </button>
                    );
                  }

                }

                return part;
              })}
            </p>
          );
        })}
      </div>

      {/* Responsive Split-Screen: Desktop Side Dossier Panel (Bên Phải) / Mobile Bottom-Sheet */}
      {selectedItem && (
        <div
          className="fixed inset-0 md:inset-auto md:top-20 md:right-6 md:w-[420px] md:max-w-[calc(100vw-3rem)] z-50 flex items-end md:block p-0 bg-black/70 md:bg-transparent backdrop-blur-md md:backdrop-blur-none animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          {/* Modal / Side-Panel Container */}
          <div
            className="w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black border-t md:border border-[#d4af37]/40 rounded-t-3xl md:rounded-3xl p-5 sm:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] md:shadow-[0_15px_50px_rgba(0,0,0,0.9)] space-y-4 max-h-[85vh] md:max-h-[calc(100vh-6.5rem)] overflow-y-auto animate-in slide-in-from-bottom-5 md:slide-in-from-right-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Handle */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-2 md:hidden" />


            {/* Character Dossier Popover */}
            {selectedItem.type === "character" && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3.5">
                    {/* Avatar 9:16 Portrait Canvas */}
                    <div className="w-20 aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border border-[#d4af37]/40 shrink-0 shadow-2xl relative">
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

                    {/* Titles */}
                    <div className="space-y-1">
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
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                          {selectedItem.data.role}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
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
                    <p className="text-sm text-slate-200 leading-relaxed font-light whitespace-pre-wrap bg-black/40 border border-white/5 rounded-xl p-3.5 max-h-48 overflow-y-auto">
                      {selectedItem.data.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Lore / Glossary Popover */}
            {selectedItem.type === "lore" && (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                      {selectedItem.data.category && CATEGORY_ICONS[selectedItem.data.category] ? (
                        (() => {
                          const Icon = CATEGORY_ICONS[selectedItem.data.category];
                          return <Icon className="w-6 h-6" />;
                        })()
                      ) : (
                        <BookMarked className="w-6 h-6" />
                      )}
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
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
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
                  <p className="text-sm text-slate-200 leading-relaxed font-light whitespace-pre-wrap bg-black/40 border border-white/5 rounded-xl p-3.5 max-h-48 overflow-y-auto">
                    {selectedItem.data.definition}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-semibold transition-colors border border-white/10 text-center"
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
