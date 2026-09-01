import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  BookOpen, Clock, List, ChevronRight, Sparkles, BookMarked, 
  MessageSquare, Feather, Palette, ShieldCheck, Crown 
} from "lucide-react";
import { auth } from "@/auth";
import { BookmarkButton } from "@/components/BookmarkButton";
import { CommentSection } from "@/components/CommentSection";
import { CharacterGallery } from "@/components/CharacterGallery";
import { LoreGallery } from "@/components/LoreGallery";
import { StorySummary } from "@/components/StorySummary";

export default async function StoryDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const story = await prisma.story.findUnique({
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
  });

  if (!story) {
    notFound();
  }

  const session = await auth();
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
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10 pb-28 md:pb-12">
      {/* Background ambient lighting for page */}
      <div className="relative">
        <div className="absolute -top-10 left-1/4 w-96 h-96 bg-[#d4af37]/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      {/* Story Header Hero Card */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl transition-all">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-10 items-center sm:items-start">
          
          {/* Left Column: Story Cover Poster + Quick Specs Panel */}
          <div className="w-48 xs:w-56 sm:w-64 md:w-72 lg:w-80 flex flex-col gap-4 shrink-0">
            {/* Story Cover Poster */}
            <div className="relative aspect-[2/3] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] border-2 border-[#d4af37]/40 hover:border-[#d4af37] group bg-slate-950 transition-all duration-300">
              {story.coverUrl ? (
                <img
                  src={story.coverUrl}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 p-4 text-center">
                  <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 mb-2 sm:mb-3 shadow-inner">
                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37]" />
                  </div>
                  <span className="text-xs font-semibold text-amber-200/80 uppercase tracking-widest">
                    {story.genre || 'Tiên Hiệp'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50 pointer-events-none" />
            </div>

            {/* Quick Specs / Luxury Attributes Card (Below Story Cover) */}
            <div className="relative overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black border border-[#d4af37]/30 hover:border-[#d4af37]/60 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 group space-y-3 sm:space-y-3.5">
              {/* Subtle top-right golden aurora ambient */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#d4af37]/20 transition-all duration-500" />

              {/* Author & Studio Header */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 sm:pb-3">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-amber-500/10 text-[#d4af37] border border-[#d4af37]/30 shadow-inner shrink-0">
                    <Feather className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Tác giả</p>
                    <p className="font-extrabold text-xs sm:text-sm md:text-base text-slate-100 truncate">Thiên Thư AI</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 shadow-sm shrink-0">
                  <Crown className="w-3 h-3 text-[#d4af37]" />
                  <span>Chính Hãng</span>
                </span>
              </div>

              {/* 2x2 Feature Highlights Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 text-left">
                {/* 1. Tình trạng */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">Tình trạng</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="font-extrabold text-[11px] sm:text-xs text-emerald-400">Đang ra</span>
                  </div>
                </div>

                {/* 2. Họa phẩm */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">Họa phẩm</span>
                  <div className="flex items-center gap-1.5 mt-1 min-w-0">
                    <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                    <span className="font-extrabold text-[11px] sm:text-xs text-slate-200 truncate">Manhwa 9:16</span>
                  </div>
                </div>

                {/* 3. Tương tác X-Ray */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">Đặc sắc</span>
                  <div className="flex items-center gap-1.5 mt-1 min-w-0">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-extrabold text-[11px] sm:text-xs text-cyan-300 truncate">X-Ray Tra Cứu</span>
                  </div>
                </div>

                {/* 4. Bản quyền */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">Bản quyền</span>
                  <div className="flex items-center gap-1.5 mt-1 min-w-0">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400 shrink-0" />
                    <span className="font-extrabold text-[11px] sm:text-xs text-purple-300 truncate">Độc Quyền AI</span>
                  </div>
                </div>
              </div>

              {/* Bottom Feature Tagline */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-300 font-medium text-center">
                <span className="text-[#d4af37] font-bold">★</span>
                <span>Chạm tra cứu nhân vật & bách khoa</span>
              </div>
            </div>
          </div>

          {/* Right Column: Story Info Details & Expandable Summary */}
          <div className="flex-1 space-y-4 sm:space-y-5 text-center sm:text-left w-full">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-xs sm:text-sm font-bold uppercase tracking-wider mb-2.5 sm:mb-3.5 shadow-sm">
                <Sparkles className="w-4 h-4" />
                {story.genre || 'Tiên Hiệp'}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight">
                {story.title}
              </h1>
            </div>

            {/* Badges / Meta row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-sm sm:text-base text-slate-300">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl shadow-sm">
                <List className="w-4 h-4 text-[#d4af37]" />
                <span className="font-bold text-slate-100">{story.chapters.length}</span> chương
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl text-slate-400 shadow-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{story.updatedAt.toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            {/* Action Buttons: Above summary for easy access */}
            {story.chapters.length > 0 && (
              <div className="pt-1 flex flex-col xs:flex-row items-center gap-3">
                {lastReadChapter ? (
                  <Link 
                    href={`/truyen/${story.slug}/${lastReadChapter.chapterNo}`}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-extrabold h-13 sm:h-14 min-h-[52px] px-8 rounded-2xl shadow-[0_4px_25px_rgba(212,175,55,0.35)] transition-all transform hover:-translate-y-0.5 active:scale-98 w-full xs:w-auto text-base sm:text-lg cursor-pointer"
                  >
                    Đọc tiếp #{lastReadChapter.chapterNo}
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link 
                    href={`/truyen/${story.slug}/${story.chapters[0].chapterNo}`}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-extrabold h-13 sm:h-14 min-h-[52px] px-8 rounded-2xl shadow-[0_4px_25px_rgba(212,175,55,0.35)] transition-all transform hover:-translate-y-0.5 active:scale-98 w-full xs:w-auto text-base sm:text-lg cursor-pointer"
                  >
                    Đọc Từ Đầu (Chương 1)
                  </Link>
                )}
                
                <div className="w-full xs:w-auto">
                  <BookmarkButton storyId={story.id} initialBookmarked={isBookmarked} />
                </div>
              </div>
            )}

            {/* Story Summary with Interactive Expand / Collapse */}
            {story.summary && (
              <StorySummary summary={story.summary} />
            )}
          </div>
        </div>
      </div>

      {/* Character Gallery Section (if story has characters) */}
      <CharacterGallery characters={story.characters} />

      {/* Lore & Concepts Glossary Section - Generous Spacing */}
      <div className="pt-6 sm:pt-10">
        <LoreGallery lores={story.lores} />
      </div>

      {/* Chapters Grid / List Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 sm:p-7 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <List className="w-6 h-6 text-[#d4af37]" /> Danh Sách Chương
          </h2>
          <span className="text-xs sm:text-sm text-slate-400 font-medium">
            {story.chapters.length} chương đã phát hành
          </span>
        </div>

        {story.chapters.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-base">
            Truyện chưa có chương nào được đăng tải.
          </div>
        ) : (
          <div className="divide-y divide-white/5 max-h-[550px] overflow-y-auto">
            {story.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/truyen/${story.slug}/${chapter.chapterNo}`}
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-white/5 transition-colors group min-h-[52px]"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span className="font-mono text-sm sm:text-base font-extrabold text-[#d4af37] shrink-0">
                    #{chapter.chapterNo}
                  </span>
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                    {chapter.title}
                  </span>
                  {chapter.isVip && (
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                      VIP ({chapter.price}💎)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs sm:text-sm text-slate-400 hidden xs:inline">
                    {chapter.createdAt.toLocaleDateString('vi-VN')}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
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
