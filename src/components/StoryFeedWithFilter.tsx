"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Sparkles, PackageOpen, Filter } from "lucide-react";
import { getStoryCoverUrl } from "@/lib/images";

export interface StoryItem {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  summary: string | null;
  genre: string | null;
  updatedAt: Date | string;
  _count: {
    chapters: number;
  };
  chapters: {
    id: string;
    chapterNo: number;
    title: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }[];
}

interface StoryFeedWithFilterProps {
  stories: StoryItem[];
  now: number;
}

const ONE_HOUR_MS = 60 * 60 * 1000;

export function StoryFeedWithFilter({ stories, now }: StoryFeedWithFilterProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  // Extract distinct primary genres from stories
  const genres = useMemo(() => {
    const genreSet = new Set<string>();
    stories.forEach((s) => {
      if (s.genre) {
        const primary = s.genre.split(/[,/|]+/)[0]?.trim();
        if (primary) genreSet.add(primary);
      }
    });
    return Array.from(genreSet);
  }, [stories]);

  // Filtered stories list
  const filteredStories = useMemo(() => {
    if (selectedGenre === "all") return stories;
    return stories.filter((s) => {
      const g = (s.genre || "").toLowerCase();
      return g.includes(selectedGenre.toLowerCase());
    });
  }, [stories, selectedGenre]);

  return (
    <div className="space-y-6">
      {/* Header & Genre Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <div className="p-2 bg-[#d4af37]/10 rounded-xl text-[#d4af37] border border-[#d4af37]/25">
              <BookOpen className="h-5 w-5 text-[#d4af37]" />
            </div>
            <span>Mới Cập Nhật</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-amber-200 border border-white/10 font-bold">
              {filteredStories.length} bộ
            </span>
          </h2>

          {/* Genre Scrollable Filter Tabs */}
          {genres.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedGenre("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedGenre === "all"
                    ? "bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 shadow-md shadow-[#d4af37]/20"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                }`}
              >
                Tất cả
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedGenre === genre
                      ? "bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 shadow-md shadow-[#d4af37]/20"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Story Cards Grid */}
      {filteredStories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-3">
          <PackageOpen className="w-12 h-12 text-slate-500 opacity-60" />
          <h3 className="text-base font-bold text-slate-200">Không tìm thấy truyện trong thể loại này</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Hiện tại chưa có tác phẩm thuộc thể loại đã chọn. Hãy thử chọn thể loại khác.
          </p>
          <button
            type="button"
            onClick={() => setSelectedGenre("all")}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl text-xs font-bold transition-all border border-white/10 cursor-pointer"
          >
            Xem tất cả truyện
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredStories.map((story) => {
            const latestChapter = story.chapters[0];
            const storyUpdatedTime = new Date(story.updatedAt).getTime();
            const isUpdatedWithinOneHour =
              now - storyUpdatedTime <= ONE_HOUR_MS && now - storyUpdatedTime >= 0;

            return (
              <Link
                key={story.id}
                href={`/truyen/${story.slug}`}
                className="group block outline-none"
                aria-label={`Đọc truyện ${story.title}`}
              >
                <div className="relative flex flex-col h-full overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-2 xs:p-2.5 sm:p-3 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[#d4af37]/60 group-hover:shadow-[0_15px_40px_rgba(212,175,55,0.2)] group-focus-visible:ring-2 group-focus-visible:ring-[#d4af37]">
                  {/* Cover Image Thumbnail */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-950 shadow-lg border border-white/10">
                    <Image
                      src={getStoryCoverUrl(story.coverUrl, story.slug)}
                      alt={story.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />

                    {/* Genre Badge */}
                    <div className="absolute top-2.5 left-2.5 max-w-[55%]">
                      <span className="inline-block max-w-full truncate rounded-lg border border-white/10 bg-black/80 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-amber-200 backdrop-blur-md shadow-sm">
                        {(story.genre || "Tiên Hiệp").split(/[,/|]+/)[0]?.trim() || "Tiên Hiệp"}
                      </span>
                    </div>

                    {/* Nhãn "Mới Cập Nhật" */}
                    {isUpdatedWithinOneHour && (
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-950/90 px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-950/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <span>Mới Cập Nhật</span>
                        </span>
                      </div>
                    )}

                    {/* Chapter Count Badge */}
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg border border-white/10 bg-black/80 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-slate-200 backdrop-blur-md shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                        {story._count.chapters} chương
                      </span>
                    </div>

                    {/* Shimmer Light Reflection on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none" />
                  </div>

                  {/* Story Details */}
                  <div className="flex flex-1 flex-col pt-3 pb-1 px-1">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-100 group-hover:text-[#d4af37] transition-colors line-clamp-2 leading-snug mb-1">
                      {story.title}
                    </h3>

                    {/* Latest chapter */}
                    {latestChapter && (
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-amber-300/90 mb-1.5 py-0.5 border-b border-white/5 truncate">
                        <Sparkles className="w-3 h-3 text-[#d4af37] shrink-0" />
                        <span className="truncate">
                          {latestChapter.title || `Chương ${latestChapter.chapterNo}`}
                        </span>
                      </div>
                    )}

                    {/* Summary Excerpt */}
                    <p className="text-xs text-slate-400 line-clamp-2 mt-auto leading-relaxed">
                      {story.summary || "Đang cập nhật tóm tắt kỳ thư..."}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
