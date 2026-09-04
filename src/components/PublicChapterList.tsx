"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { List, ChevronRight, Loader2, ArrowUpDown, Search, Sparkles } from "lucide-react";
import { getPublicChapters, PublicChapterItem } from "@/app/actions/chapter";

interface PublicChapterListProps {
  storyId: string;
  storySlug: string;
  initialChapters: PublicChapterItem[];
  totalChapters: number;
}

export function PublicChapterList({
  storyId,
  storySlug,
  initialChapters,
  totalChapters,
}: PublicChapterListProps) {
  const [chapters, setChapters] = useState<PublicChapterItem[]>(initialChapters);
  const [total, setTotal] = useState<number>(totalChapters);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState<string>("");
  const [isLoadingMore, startLoadMore] = useTransition();
  const [isSearching, startSearch] = useTransition();

  const handleToggleOrder = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);
    startSearch(async () => {
      const res = await getPublicChapters({
        storyId,
        skip: 0,
        take: 30,
        order: newOrder,
        search
      });
      if (res.success) {
        setChapters(res.chapters);
        setTotal(res.total);
      }
    });
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    startSearch(async () => {
      const res = await getPublicChapters({
        storyId,
        skip: 0,
        take: 30,
        order,
        search: query
      });
      if (res.success) {
        setChapters(res.chapters);
        setTotal(res.total);
      }
    });
  };

  const handleLoadMore = (takeCount: number = 30) => {
    startLoadMore(async () => {
      const res = await getPublicChapters({
        storyId,
        skip: chapters.length,
        take: takeCount,
        order,
        search
      });
      if (res.success && res.chapters.length > 0) {
        setChapters((prev) => [...prev, ...res.chapters]);
        setTotal(res.total);
      }
    });
  };

  const hasMore = chapters.length < total;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transition-all">
      {/* Container Header */}
      <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 sm:gap-2.5">
              <List className="w-5 h-5 text-[#d4af37]" /> Danh Sách Chương
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
              Đang hiển thị {chapters.length} / {total} chương
            </p>
          </div>

          {/* Quick Actions: Sort Order Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleOrder}
              disabled={isSearching}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Đảo thứ tự chương"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{order === "asc" ? "Cũ nhất trước (#1)" : "Mới nhất trước"}</span>
            </button>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm theo số chương (VD: 15) hoặc tên chương..."
            className="w-full bg-black/30 border border-white/10 focus:border-[#d4af37]/60 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
          />
          {isSearching && (
            <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37] animate-spin" />
          )}
        </div>
      </div>

      {/* Chapters List */}
      {chapters.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          {search ? "Không tìm thấy chương nào phù hợp với từ khóa." : "Truyện chưa có chương nào được đăng tải."}
        </div>
      ) : (
        <div className="divide-y divide-white/5 max-h-[580px] overflow-y-auto overscroll-contain">
          {chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/truyen/${storySlug}/${chapter.chapterNo}`}
              className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-white/5 transition-colors group min-h-[50px]"
            >
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                <span className="font-mono text-xs sm:text-sm font-extrabold text-[#d4af37] shrink-0 min-w-[42px]">
                  #{chapter.chapterNo}
                </span>
                <span className="text-xs sm:text-sm md:text-base font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                  {chapter.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] sm:text-xs text-slate-400 hidden xs:inline">
                  {new Date(chapter.createdAt).toLocaleDateString("vi-VN")}
                </span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Footer / Load More Section */}
      <div className="p-4 sm:p-5 border-t border-white/5 bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <span className="text-xs text-slate-400">
          {hasMore
            ? `Còn ${total - chapters.length} chương chưa tải`
            : `Đã tải đầy đủ toàn bộ ${total} chương`}
        </span>

        {hasMore && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleLoadMore(30)}
              disabled={isLoadingMore}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37]/20 to-amber-500/20 hover:from-[#d4af37]/30 hover:to-amber-500/30 text-amber-300 hover:text-amber-200 border border-[#d4af37]/40 text-xs sm:text-sm font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                  <span>Đang tải chương...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Tải thêm 30 chương</span>
                </>
              )}
            </button>

            {total - chapters.length > 30 && (
              <button
                onClick={() => handleLoadMore(100)}
                disabled={isLoadingMore}
                className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Tải nhanh 100 chương"
              >
                +100
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
