import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  BookOpen, Clock, List, ChevronRight, Sparkles, BookMarked, 
  MessageSquare, Feather, Users, Crown 
} from "lucide-react";
import { auth } from "@/auth";
import { BookmarkButton } from "@/components/BookmarkButton";
import { CommentSection } from "@/components/CommentSection";
import { CharacterGallery } from "@/components/CharacterGallery";
import { LoreGallery } from "@/components/LoreGallery";
import { StorySummary } from "@/components/StorySummary";

interface StorySpecsCardProps {
  className?: string;
  chapterCount: number;
  characterCount: number;
  loreCount: number;
}

function StorySpecsCard({ className = "", chapterCount, characterCount, loreCount }: StorySpecsCardProps) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black border border-[#d4af37]/30 hover:border-[#d4af37]/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-[0_15px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 group flex flex-col justify-between space-y-3.5 ${className}`}>
      {/* Subtle top-right golden aurora ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#d4af37]/10 rounded-full blur-2xl group-hover:bg-[#d4af37]/20 transition-all duration-500" />
      </div>

      {/* Author & Studio Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-amber-500/10 text-[#d4af37] border border-[#d4af37]/30 shadow-inner shrink-0">
            <Feather className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Tác giả</p>
            <p className="font-extrabold text-xs sm:text-sm md:text-base text-slate-100 truncate">Thiên Thư AI</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 shadow-sm shrink-0">
          <Crown className="w-3 h-3 text-[#d4af37]" />
          <span>Admin</span>
        </span>
      </div>

      {/* 2x2 Feature Highlights Grid (100% Real Database Stats) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-left flex-1 items-stretch">
        {/* 1. Tình trạng */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between min-w-0">
          <span className="text-[10px] text-slate-400 font-medium">Tình trạng</span>
          <div className="flex items-center gap-1.5 mt-1 min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-extrabold text-[11px] sm:text-xs text-emerald-400 whitespace-nowrap">Đang ra</span>
          </div>
        </div>

        {/* 2. Số chương (Từ DB) */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between min-w-0">
          <span className="text-[10px] text-slate-400 font-medium">Quy mô</span>
          <div className="flex items-center gap-1.5 mt-1 min-w-0">
            <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-extrabold text-[11px] sm:text-xs text-slate-200 whitespace-nowrap">{chapterCount} chương</span>
          </div>
        </div>

        {/* 3. Hồ sơ nhân vật (Từ DB) */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between min-w-0">
          <span className="text-[10px] text-slate-400 font-medium">Nhân vật</span>
          <div className="flex items-center gap-1.5 mt-1 min-w-0">
            <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-extrabold text-[11px] sm:text-xs text-cyan-300 whitespace-nowrap">{characterCount} nhân vật</span>
          </div>
        </div>

        {/* 4. Bách khoa tra cứu / Lore (Từ DB) */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all flex flex-col justify-between min-w-0">
          <span className="text-[10px] text-slate-400 font-medium">Bách khoa</span>
          <div className="flex items-center gap-1.5 mt-1 min-w-0">
            <BookMarked className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="font-extrabold text-[11px] sm:text-xs text-purple-300 whitespace-nowrap">{loreCount} thuật ngữ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function StoryDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [session, story] = await Promise.all([
    auth(),
    prisma.story.findUnique({
      where: { slug: slug },
      include: {
        chapters: {
          orderBy: { chapterNo: 'asc' },
          select: { 
            id: true, 
            chapterNo: true, 
            title: true, 
            createdAt: true,
            isVip: true,
            price: true
          }
        },
        characters: {
          orderBy: { createdAt: 'asc' }
        },
        lores: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })
  ]);

  if (!story) {
    notFound();
  }

  const userId = session?.user?.id;

  let isBookmarked = false;
  let lastReadChapter = null;

  if (userId) {
    const bookmark = await prisma.bookmark.findUnique({
      where: { userId_storyId: { userId, storyId: story.id } }
    });
    isBookmarked = !!bookmark;

    const progress = await prisma.readingProgress.findUnique({
      where: { userId_storyId: { userId, storyId: story.id } },
      include: { chapter: true }
    });
    if (progress) {
      lastReadChapter = progress.chapter;
    }
  }

  return (
    <div className="relative max-w-5xl mx-auto space-y-5 sm:space-y-8 pb-28 md:pb-12 overflow-x-hidden w-full">
      {/* Background ambient lighting for page */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10 w-full h-full">
        <div className="absolute -top-10 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#d4af37]/10 blur-[130px] rounded-full max-w-full" />
      </div>

      {/* Story Header Hero Card */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-3.5 xs:p-4.5 sm:p-8 md:p-10 shadow-2xl transition-all">
        
        {/* ========================================================================= */}
        {/* UPPER HERO ROW: Cover Poster + Title, Meta & Action Buttons */}
        {/* ========================================================================= */}
        <div className="space-y-3.5 sm:space-y-0 sm:flex sm:flex-row sm:gap-8 lg:gap-10 sm:items-start">
          {/* Top Header Group: Side-by-side on mobile, left-column on desktop */}
          <div className="flex flex-row gap-3 xs:gap-4 sm:contents items-start">
            {/* Story Cover Poster */}
            <div className="relative aspect-[2/3] w-24 xs:w-28 sm:w-56 md:w-64 lg:w-72 rounded-xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] border-2 border-[#d4af37]/40 hover:border-[#d4af37] group bg-slate-950 shrink-0 transition-all duration-300">
              <img
                src={story.coverUrl || `/covers/${story.slug}.jpg`}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50 pointer-events-none" />
            </div>

            {/* Story Title, Category & Meta */}
            <div className="flex-1 space-y-2 sm:space-y-3 text-left min-w-0">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2.5">
                  {(story.genre || 'Tiên Hiệp')
                    .split(/[,/|]+/)
                    .map(g => g.trim())
                    .filter(Boolean)
                    .slice(0, 3)
                    .map((g, idx) => (
                      <div key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
                        {idx === 0 && <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                        {g}
                      </div>
                    ))}
                </div>
                <h1 className="text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug line-clamp-3 sm:line-clamp-none">
                  {story.title}
                </h1>
              </div>

              {/* Badges / Meta row */}
              <div className="flex flex-wrap items-center justify-start gap-1.5 sm:gap-2.5 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl shadow-sm">
                  <List className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="font-bold text-slate-100">{story.chapters.length}</span> chương
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl text-slate-400 shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{story.updatedAt.toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              {/* Action Buttons Desktop: Inside right column */}
              {story.chapters.length > 0 && (
                <div className="hidden sm:flex pt-2 sm:pt-3 flex-wrap items-center gap-2.5">
                  {lastReadChapter ? (
                    <>
                      <Link 
                        href={`/truyen/${story.slug}/${lastReadChapter.chapterNo}`}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-extrabold h-11 sm:h-12 px-5 sm:px-7 rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.35)] transition-all transform hover:-translate-y-0.5 active:scale-98 text-xs sm:text-sm cursor-pointer whitespace-nowrap min-w-0 max-w-xs"
                      >
                        <span className="truncate">Đọc Tiếp #{lastReadChapter.chapterNo}</span>
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      </Link>
                      <Link
                        href={`/truyen/${story.slug}/${story.chapters[0].chapterNo}`}
                        className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 hover:border-white/25 font-bold h-11 sm:h-12 px-4 sm:px-5 rounded-xl transition-all active:scale-98 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                      >
                        Đọc Từ Đầu
                      </Link>
                    </>
                  ) : (
                    <Link 
                      href={`/truyen/${story.slug}/${story.chapters[0].chapterNo}`}
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-extrabold h-11 sm:h-12 px-6 sm:px-7 rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.35)] transition-all transform hover:-translate-y-0.5 active:scale-98 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                    >
                      <span>Đọc Từ Đầu</span>
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </Link>
                  )}
                  
                  <div>
                    <BookmarkButton storyId={story.id} initialBookmarked={isBookmarked} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Mobile: Clean 2-Tier Full-Width Layout */}
          {story.chapters.length > 0 && (
            <div className="flex flex-col sm:hidden gap-2 pt-1.5 w-full">
              {lastReadChapter ? (
                <>
                  {/* Primary: Full-width Continue Reading button with truncate protection */}
                  <Link 
                    href={`/truyen/${story.slug}/${lastReadChapter.chapterNo}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#d4af37] via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-extrabold h-12 px-3.5 rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all text-xs xs:text-sm cursor-pointer min-w-0"
                  >
                    <span className="truncate flex-1 text-center">
                      Đọc Tiếp #{lastReadChapter.chapterNo}{lastReadChapter.title ? `: ${lastReadChapter.title}` : ''}
                    </span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </Link>

                  {/* Secondary: Read from Start (50%) + Bookmark (50%) */}
                  <div className="flex items-center gap-2 w-full">
                    <Link 
                      href={`/truyen/${story.slug}/${story.chapters[0].chapterNo}`}
                      className="flex-1 inline-flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 font-bold h-11 px-3 rounded-xl transition-all text-xs cursor-pointer whitespace-nowrap min-w-0"
                      title="Đọc từ chương 1"
                    >
                      Đọc Từ Đầu
                    </Link>
                    <div className="flex-1 min-w-0">
                      <BookmarkButton storyId={story.id} initialBookmarked={isBookmarked} className="w-full h-11" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <Link 
                    href={`/truyen/${story.slug}/${story.chapters[0].chapterNo}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-extrabold h-12 px-4 rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all text-sm cursor-pointer whitespace-nowrap min-w-0"
                  >
                    <span className="truncate">Đọc Từ Đầu</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </Link>
                  <div className="shrink-0">
                    <BookmarkButton storyId={story.id} initialBookmarked={isBookmarked} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* LOWER HERO ROW: 2 CONTAINERS NGANG HÀNG NHAU (Tác Giả & Tóm Tắt) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch pt-6 sm:pt-8 border-t border-white/10 mt-6 sm:mt-8">
          {/* Container 1: Thẻ Tác Giả & Thông Số Đặc Sắc (100% Real DB Data) */}
          <StorySpecsCard 
            className="w-full h-full" 
            chapterCount={story.chapters.length}
            characterCount={story.characters.length}
            loreCount={story.lores.length}
          />

          {/* Container 2: Thẻ Tóm Tắt Nội Dung (Ngang hàng) */}
          {story.summary && (
            <StorySummary summary={story.summary} className="w-full h-full" />
          )}
        </div>
      </div>

      {/* Character Gallery Section (if story has characters) */}
      <CharacterGallery characters={story.characters} />

      {/* Lore & Concepts Glossary Section - Generous Spacing */}
      <div className="pt-6 sm:pt-10">
        <LoreGallery lores={story.lores} />
      </div>

      {/* Chapters Grid / List Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 sm:gap-2.5">
            <List className="w-5 h-5 text-[#d4af37]" /> Danh Sách Chương
          </h2>
          <span className="text-xs sm:text-sm text-slate-400 font-medium">
            {story.chapters.length} chương đã phát hành
          </span>
        </div>

        {story.chapters.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Truyện chưa có chương nào được đăng tải.
          </div>
        ) : (
          <div className="divide-y divide-white/5 max-h-[550px] overflow-y-auto">
            {story.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/truyen/${story.slug}/${chapter.chapterNo}`}
                className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-white/5 transition-colors group min-h-[48px]"
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-[#d4af37] shrink-0">
                    #{chapter.chapterNo}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                    {chapter.title}
                  </span>
                  {chapter.isVip && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                      VIP ({chapter.price}💎)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] sm:text-xs text-slate-400 hidden xs:inline">
                    {chapter.createdAt.toLocaleDateString('vi-VN')}
                  </span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Comment Section */}
      <CommentSection storyId={story.id} />
    </div>
  );
}
