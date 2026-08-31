import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, List, Clock, ChevronRight, Sparkles, Crown } from "lucide-react";
import { auth } from "@/auth";
import { BookmarkButton } from "@/components/BookmarkButton";
import { CommentSection } from "@/components/CommentSection";
import { CharacterGallery } from "@/components/CharacterGallery";
import { LoreGallery } from "@/components/LoreGallery";

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
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Background ambient lighting for page */}
      <div className="relative">
        <div className="absolute -top-10 left-1/4 w-96 h-96 bg-[#d4af37]/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      {/* Story Header Hero Card */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl transition-all">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          
          {/* Story Cover Poster */}
          <div className="relative w-44 sm:w-52 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.6)] border border-white/15 shrink-0 group bg-slate-950">
            {story.coverUrl ? (
              <img
                src={story.coverUrl}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 p-4 text-center">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-3 shadow-inner">
                  <BookOpen className="w-10 h-10 text-[#d4af37]" />
                </div>
                <span className="text-xs font-semibold text-amber-200/80 uppercase tracking-widest">
                  {story.genre || 'Tiên Hiệp'}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
          </div>

          {/* Story Info Details */}
          <div className="flex-1 space-y-5 text-center md:text-left w-full">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                {story.genre || 'Tiên Hiệp'}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {story.title}
              </h1>
            </div>

            {/* Badges / Meta row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3.5 py-1.5 rounded-xl">
                <List className="w-4 h-4 text-[#d4af37]" />
                <span className="font-semibold text-slate-100">{story.chapters.length}</span> chương
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3.5 py-1.5 rounded-xl text-slate-400">
                <Clock className="w-4 h-4 text-slate-400" />
                Cập nhật: <span className="text-slate-200">{story.updatedAt.toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            {/* Story Summary Description */}
            {story.summary && (
              <div className="bg-black/30 border border-white/5 rounded-2xl p-5 text-left">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-2 flex items-center gap-2">
                  <span>📖</span> Tóm Tắt Nội Dung
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal">
                  {story.summary}
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            {story.chapters.length > 0 && (
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                {lastReadChapter ? (
                  <Link 
                    href={`/truyen/${story.slug}/${lastReadChapter.chapterNo}`}
                    className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#d4af37] via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
                  >
                    Đọc tiếp Chương {lastReadChapter.chapterNo}
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link 
                    href={`/truyen/${story.slug}/${story.chapters[0].chapterNo}`}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
                  >
                    Đọc Từ Đầu (Chương 1)
                  </Link>
                )}
                
                <div className="w-full sm:w-auto">
                  <BookmarkButton storyId={story.id} initialBookmarked={isBookmarked} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Character Gallery Section (if story has characters) */}
      <CharacterGallery characters={story.characters} />

      {/* Lore & Concepts Glossary Section */}
      <LoreGallery lores={story.lores} />


      {/* Chapters Grid / List Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-3">
            <div className="p-2 bg-[#d4af37]/10 rounded-xl">
              <List className="w-5 h-5 text-[#d4af37]" />
            </div>
            Danh Sách Chương
          </h2>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/5">
            {story.chapters.length} chương đã phát hành
          </span>
        </div>
        
        {story.chapters.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            Truyện chưa có chương nào được đăng tải.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:gap-x-1 md:gap-y-1 p-2 sm:p-4">
            {story.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/truyen/${story.slug}/${chapter.chapterNo}`}
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="text-xs font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-md shrink-0">
                    #{chapter.chapterNo}
                  </span>
                  <span className="text-slate-200 group-hover:text-[#d4af37] transition-colors text-sm sm:text-base font-medium truncate">
                    {chapter.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {chapter.isVip && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Crown className="w-3 h-3 text-amber-400" />
                      {chapter.price > 0 ? `${chapter.price} LT` : 'VIP'}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Comment / Community Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <CommentSection storyId={story.id} />
      </div>
    </div>
  );
}
