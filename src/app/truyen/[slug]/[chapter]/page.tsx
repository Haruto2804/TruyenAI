import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { ExpTracker } from "@/components/ExpTracker";
import { ProgressTracker } from "@/components/ProgressTracker";
import { CommentSection } from "@/components/CommentSection";
import { UnlockButton, DonateButton } from "@/components/EconomyButtons";
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

  const story = await prisma.story.findUnique({
    where: { slug: slug },
    include: {
      characters: true,
    },
  });

  if (!story) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id;

  const chapter = await prisma.chapter.findUnique({
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
  });

  if (!chapter) {
    notFound();
  }

  // Nếu chương là VIP, kiểm tra xem đã được người dùng này mua chưa
  const isUnlocked = chapter.isVip ? (chapter.unlockedBy.length > 0) : true;

  // Fetch previous and next chapters for navigation
  const prevChapter = await prisma.chapter.findUnique({
    where: { storyId_chapterNo: { storyId: story.id, chapterNo: chapterNo - 1 } },
  });

  const nextChapter = await prisma.chapter.findUnique({
    where: { storyId_chapterNo: { storyId: story.id, chapterNo: chapterNo + 1 } },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Chapter Header / Nav */}
      <div className="flex flex-col items-center text-center space-y-4 pt-2">
        <Link 
          href={`/truyen/${story.slug}`}
          className="inline-flex items-center gap-1.5 text-[#d4af37] hover:text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors py-1 px-3 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20"
        >
          {story.title}
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-2xl">
          Chương {chapter.chapterNo}: {chapter.title}
        </h1>
        
        {/* Top Navigation Bar */}
        <div className="flex items-center gap-3 py-3 w-full justify-center">
          <Link
            href={prevChapter ? `/truyen/${story.slug}/${prevChapter.chapterNo}` : '#'}
            className={`flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-xl border transition-all duration-200 ${
              prevChapter 
                ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-[#d4af37]/40 hover:text-[#d4af37]' 
                : 'border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed pointer-events-none opacity-40'
            }`}
            aria-label="Chương trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <Link
            href={`/truyen/${story.slug}`}
            className="flex items-center justify-center h-10 sm:h-11 px-4 sm:px-6 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-[#d4af37]/40 hover:text-[#d4af37] text-xs sm:text-sm font-bold transition-all duration-200 gap-2"
          >
            <Menu className="w-4 h-4 text-[#d4af37]" /> Mục Lục
          </Link>

          <Link
            href={nextChapter ? `/truyen/${story.slug}/${nextChapter.chapterNo}` : '#'}
            className={`flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-xl border transition-all duration-200 ${
              nextChapter 
                ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-[#d4af37]/40 hover:text-[#d4af37]' 
                : 'border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed pointer-events-none opacity-40'
            }`}
            aria-label="Chương sau"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Chapter Content Section with X-Ray Character Highlighter */}
      <div className="py-4 sm:py-6 px-1 sm:px-2">
        {!isUnlocked ? (
          <UnlockButton chapterId={chapter.id} price={chapter.price} />
        ) : (
          <InteractiveReader
            content={chapter.content}
            characters={story.characters}
          />
        )}
      </div>

      {/* Tặng thưởng tác giả (chỉ hiện khi đã mở khóa hoặc chương free) */}
      {isUnlocked && <DonateButton storyId={story.id} />}

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
