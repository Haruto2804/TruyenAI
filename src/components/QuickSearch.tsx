"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Sparkles, BookOpen, Command, Loader2 } from "lucide-react";
import { getStoryCoverUrl } from "@/lib/images";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  genre: string | null;
  coverUrl: string | null;
  _count: {
    chapters: number;
  };
}

export function QuickSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.stories || []);
        }
      } catch (err) {
        console.error("Failed to query stories:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      {/* Search trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#d4af37]/40 text-slate-400 hover:text-white transition-all text-xs sm:text-sm font-medium cursor-pointer shadow-sm group"
        aria-label="Tìm kiếm truyện"
      >
        <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#d4af37] transition-colors" />
        <span className="hidden sm:inline">Tìm kiếm...</span>
        <span className="sm:hidden">Tìm</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-black/40 rounded border border-white/10 text-slate-400 font-mono">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      {/* Modal dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Search box */}
          <div className="relative w-full max-w-lg bg-slate-950/95 border border-[#d4af37]/40 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10">
            {/* Input Row */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
              <Search className="w-5 h-5 text-[#d4af37] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nhập tên truyện, thể loại, từ khóa..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base outline-none font-medium"
              />
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin shrink-0" />
              ) : query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-white/5">
              {results.length > 0 ? (
                results.map((story) => (
                  <Link
                    key={story.id}
                    href={`/truyen/${story.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <div className="relative w-11 h-15 rounded-lg overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                      <Image
                        src={getStoryCoverUrl(story.coverUrl, story.slug)}
                        alt={story.title}
                        fill
                        sizes="44px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-200 group-hover:text-[#d4af37] transition-colors truncate">
                        {story.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-white/5 text-amber-200/90 font-medium">
                          {story.genre || "Tiên Hiệp"}
                        </span>
                        <span>•</span>
                        <span>{story._count.chapters} chương</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : query.trim() && !isLoading ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm">Không tìm thấy tiểu thuyết nào khớp với từ khóa</p>
                  <p className="text-xs text-slate-500">Hãy thử tìm theo tên ngắn hơn hoặc thể loại</p>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs space-y-1">
                  <p className="font-medium text-slate-400">Gợi ý tìm kiếm:</p>
                  <p>Nhập &quot;Tiên&quot;, &quot;Kiếm&quot;, &quot;Đạo&quot; hoặc tên truyện để tra cứu tức thì</p>
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#d4af37]" /> Thiên Thư AI
              </span>
              <span>Bấm <kbd className="px-1 py-0.5 bg-white/10 rounded font-mono text-[10px]">ESC</kbd> để đóng</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
