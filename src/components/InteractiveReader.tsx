"use client";

import { useState, useMemo, useEffect } from "react";
import { User, X, Sparkles, BookOpen } from "lucide-react";

export interface CharacterInfo {
  id: string;
  name: string;
  aliases: string | null;
  role: string | null;
  avatarUrl: string | null;
  description: string | null;
}

interface InteractiveReaderProps {
  content: string;
  characters: CharacterInfo[];
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function InteractiveReader({ content, characters }: InteractiveReaderProps) {
  const [selectedChar, setSelectedChar] = useState<CharacterInfo | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedChar(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Build lookup dictionary & sorted regex patterns
  const { termMap, regex } = useMemo(() => {
    if (!characters || characters.length === 0) {
      return { termMap: new Map<string, CharacterInfo>(), regex: null };
    }

    const map = new Map<string, CharacterInfo>();
    const termsSet = new Set<string>();

    characters.forEach((char) => {
      if (char.name && char.name.trim().length >= 2) {
        const cleanName = char.name.trim();
        map.set(cleanName.toLowerCase(), char);
        termsSet.add(cleanName);
      }

      if (char.aliases) {
        const aliases = char.aliases.split(",");
        aliases.forEach((alias) => {
          const cleanAlias = alias.trim();
          if (cleanAlias.length >= 2) {
            map.set(cleanAlias.toLowerCase(), char);
            termsSet.add(cleanAlias);
          }
        });
      }
    });

    // Sort terms by length descending to match longest phrases first
    const sortedTerms = Array.from(termsSet).sort((a, b) => b.length - a.length);

    if (sortedTerms.length === 0) {
      return { termMap: map, regex: null };
    }

    const pattern = `(${sortedTerms.map(escapeRegExp).join("|")})`;
    const reg = new RegExp(pattern, "gi");

    return { termMap: map, regex: reg };
  }, [characters]);

  // Render paragraphs with highlighted character mentions
  const paragraphs = useMemo(() => {
    return content.split("\n").filter((p) => p.trim() !== "");
  }, [content]);

  return (
    <div className="relative">
      {/* Chapter Text Body */}
      <div className="prose prose-invert prose-lg max-w-none text-slate-100 select-text">
        {paragraphs.map((paragraph, pIdx) => {
          if (!regex) {
            return (
              <p
                key={pIdx}
                className="mb-7 text-[18px] sm:text-[19px] md:text-[20px] text-slate-200/95 leading-[2.2] font-normal tracking-wide"
              >
                {paragraph}
              </p>
            );
          }

          // Split paragraph by character names
          const parts = paragraph.split(regex);

          return (
            <p
              key={pIdx}
              className="mb-7 text-[18px] sm:text-[19px] md:text-[20px] text-slate-200/95 leading-[2.2] font-normal tracking-wide"
            >
              {parts.map((part, partIdx) => {
                const matchedChar = termMap.get(part.toLowerCase());

                if (matchedChar) {
                  return (
                    <button
                      key={partIdx}
                      type="button"
                      onClick={() => setSelectedChar(matchedChar)}
                      className="inline-flex items-center text-amber-200/95 font-medium underline decoration-dotted decoration-[#d4af37]/60 underline-offset-4 hover:decoration-solid hover:text-[#d4af37] hover:bg-[#d4af37]/15 px-1 py-0.5 rounded transition-all cursor-pointer select-none"
                      title={`Xem thông tin: ${matchedChar.name}`}
                    >
                      {part}
                    </button>
                  );
                }

                return part;
              })}
            </p>
          );
        })}
      </div>

      {/* X-Ray Character Popover Modal */}
      {selectedChar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedChar(null)}
        >
          <div
            className="relative w-full max-w-md bg-[#0e0e11] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient gold glow */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setSelectedChar(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Character Header */}
            <div className="flex gap-4 items-center">
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-slate-950 border border-white/20 shrink-0 shadow-lg relative">
                {selectedChar.avatarUrl ? (
                  <img
                    src={selectedChar.avatarUrl}
                    alt={selectedChar.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                    <User className="w-10 h-10 text-[#d4af37]/50" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tra Cứu Nhân Vật (X-Ray)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white truncate">
                  {selectedChar.name}
                </h3>
                {selectedChar.role && (
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#d4af37]/20 text-amber-200 border border-[#d4af37]/30">
                    {selectedChar.role}
                  </span>
                )}
              </div>
            </div>

            {/* Character Aliases */}
            {selectedChar.aliases && (
              <div className="bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-slate-300">
                <span className="text-slate-400 font-semibold">Tên gọi khác:</span>{" "}
                <span className="text-amber-200/90">{selectedChar.aliases}</span>
              </div>
            )}

            {/* Character Description */}
            {selectedChar.description ? (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tính cách & Thân phận:
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed max-h-48 overflow-y-auto pr-1">
                  {selectedChar.description}
                </p>
              </div>
            ) : (
              <p className="text-xs italic text-slate-500">Chưa có thông tin mô tả chi tiết.</p>
            )}

            {/* Footer Tip */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
              <span>Chạm ra ngoài để tiếp tục đọc</span>
              <span className="font-mono text-[#d4af37]/80">Thiên Thư X-Ray</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
