import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { ExpTracker } from "@/components/ExpTracker";
import { ProgressTracker } from "@/components/ProgressTracker";
import { CommentSection } from "@/components/CommentSection";
import { UnlockButton } from "@/components/EconomyButtons";
import { InteractiveReader } from "@/components/InteractiveReader";
import { auth } from "@/auth";

export default async function ChapterDetail({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter: chapterParam } = await params;
  const chapterNo = parseInt(chapterParam, 10);
  if (isNaN(chapterNo)) {
    notFound();
  }

  const [session, story] = await Promise.all([
    auth(),
    prisma.story.findUnique({
      where: { slug: slug },
      include: {
        characters: true,
        lores: true,
      },
    })
  ]);

  if (!story) {
    notFound();
  }

  const userId = session?.user?.id;

  const [chapter, prevChapter, nextChapter] = await Promise.all([
    prisma.chapter.findUnique({
      where: {
        storyId_chapterNo: {
          storyId: story.id,
          chapterNo: chapterNo,
        },
      },
      include: {
        unlockedBy: {
          where: { userId: userId || "no-user" }
        }
      }
    }),
    prisma.chapter.findUnique({
      where: { storyId_chapterNo: { storyId: story.id, chapterNo: chapterNo - 1 } },
      select: { chapterNo: true, title: true }
    }),
    prisma.chapter.findUnique({
      where: { storyId_chapterNo: { storyId: story.id, chapterNo: chapterNo + 1 } },
      select: { chapterNo: true, title: true }
    })
  ]);

  if (!chapter) {
    notFound();
  }

  // Nếu chương là VIP, kiểm tra xem đã được người dùng này mua chưa
  const isUnlocked = chapter.isVip ? (chapter.unlockedBy.length > 0) : true;

  return (
    <div className="relative max-w-4xl mx-auto space-y-8 overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10 w-full h-full">
        <div className="absolute -top-10 left-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-[#d4af37]/5 blur-[120px] rounded-full max-w-full" />
      </div>

      {/* Gamification: Track EXP on reading */}
      <ExpTracker chapterId={chapter.id} />
      
      {/* Tracking: Lưu tiến độ đọc tiếp (Continue Reading) */}
      <ProgressTracker storyId={story.id} chapterId={chapter.id} />

      {/* Chapter Reader Header Nav */}
      <div className="sticky top-20 z-40 bg-slate-950/85 backdrop-blur-xl border border-white/10 p-2.5 sm:p-4 rounded-2xl flex items-center justify-between gap-2 sm:gap-4 shadow-2xl transition-all">
        {/* Left: Back Button & Title Info */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <Link
            href={`/truyen/${story.slug}`}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-[#d4af37]/40 transition-colors shrink-0 flex items-center justify-center"
            title="Trở về trang thông tin truyện"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-100 flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="text-[#d4af37] font-extrabold shrink-0">#{chapter.chapterNo}</span>
              <span className="truncate min-w-0 flex-1 block" title={chapter.title}>
                {chapter.title}
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate" title={story.title}>
              {story.title}
            </p>
          </div>
        </div>

        {/* Quick Chapter Switcher Buttons (Always Fixed & Never Squashed) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href={prevChapter ? `/truyen/${story.slug}/${prevChapter.chapterNo}` : '#'}
            className={`flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-xl border transition-all duration-200 shrink-0 ${
              prevChapter 
                ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-[#d4af37]/40 hover:text-[#d4af37]' 
                : 'border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed pointer-events-none opacity-40'
            }`}
            title={prevChapter ? `Chương trước (#${prevChapter.chapterNo})` : "Không có chương trước"}
            aria-label="Chương trước"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          <Link
            href={`/truyen/${story.slug}`}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 h-9 sm:h-10 md:h-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#d4af37]/40 text-xs font-semibold text-slate-200 hover:text-[#d4af37] transition-colors shrink-0"
            title="Xem toàn bộ mục lục chương"
            aria-label="Mục Lục"
          >
            <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d4af37]" />
            <span className="hidden sm:inline">Mục Lục</span>
          </Link>

          <Link
            href={nextChapter ? `/truyen/${story.slug}/${nextChapter.chapterNo}` : '#'}
            className={`flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-xl border transition-all duration-200 shrink-0 ${
              nextChapter 
                ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-[#d4af37]/40 hover:text-[#d4af37]' 
                : 'border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed pointer-events-none opacity-40'
            }`}
            title={nextChapter ? `Chương tiếp theo (#${nextChapter.chapterNo})` : "Không có chương tiếp"}
            aria-label="Chương sau"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>

      {/* Chapter Content Section with X-Ray Character & Lore Highlighter */}
      <div className="py-2 sm:py-4 px-0 sm:px-2">
        {!isUnlocked ? (
          <UnlockButton chapterId={chapter.id} price={chapter.price} />
        ) : (
          <InteractiveReader
            content={chapter.content}
            characters={story.characters}
            lores={story.lores}
            storySlug={story.slug}
          />
        )}
      </div>


      {/* Bottom Navigation Bar */}
      <div className="flex items-center gap-3 sm:gap-4 py-8 mt-4 w-full justify-center border-t border-white/5">
        <Link
          href={prevChapter ? `/truyen/${story.slug}/${prevChapter.chapterNo}` : '#'}
          className={`flex items-center justify-center py-3.5 px-6 rounded-xl border text-sm font-bold transition-all flex-1 sm:flex-none sm:w-40 ${
            prevChapter 
              ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/20' 
              : 'border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed pointer-events-none opacity-40'
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-1.5" /> Chương Trước
        </Link>

        <Link
          href={nextChapter ? `/truyen/${story.slug}/${nextChapter.chapterNo}` : '#'}
          className={`flex items-center justify-center py-3.5 px-6 rounded-xl text-sm font-extrabold transition-all flex-1 sm:flex-none sm:w-40 ${
            nextChapter 
              ? 'bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.25)]' 
              : 'border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed pointer-events-none opacity-40'
          }`}
        >
          Chương Tiếp <ChevronRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>
      
      <ExpTracker chapterId={chapter.id} />
      <ProgressTracker storyId={story.id} chapterId={chapter.id} />

      {/* Chapter Comments */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl mt-10">
        <CommentSection storyId={story.id} chapterId={chapter.id} />
      </div>
    </div>
  );
}
