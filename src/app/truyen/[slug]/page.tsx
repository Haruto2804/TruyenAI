import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, List, Clock, ChevronRight } from "lucide-react";
import { auth } from "@/auth";
import { BookmarkButton } from "@/components/BookmarkButton";

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
        select: { id: true, chapterNo: true, title: true, createdAt: true }
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Story Header */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
        <div className="w-32 h-44 bg-slate-800 rounded-lg shrink-0 flex items-center justify-center border border-slate-700">
          <BookOpen className="w-12 h-12 text-slate-600" />
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {story.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="bg-[#d4af37]/20 text-[#d4af37] px-3 py-1 rounded-full font-medium">
              {story.genre || 'Tiên Hiệp'}
            </span>
            <span className="flex items-center gap-1">
              <List className="w-4 h-4" /> {story.chapters.length} chương
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> Cập nhật: {story.updatedAt.toLocaleDateString('vi-VN')}
            </span>
          </div>
          {story.summary && (
            <div className="pt-2 border-t border-slate-700/50 mt-4">
              <h3 className="font-semibold text-slate-300 mb-2">Giới thiệu:</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                {story.summary}
              </p>
            </div>
          )}
          
          {story.chapters.length > 0 && (
            <div className="pt-4 flex flex-col md:flex-row gap-3">
              {lastReadChapter ? (
                <Link 
                  href={`/truyen/${story.slug}/${lastReadChapter.chapterNo}`}
                  className="inline-flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#b5952f] text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors w-full md:w-auto"
                >
                  Đọc tiếp Ch. {lastReadChapter.chapterNo} <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link 
                  href={`/truyen/${story.slug}/${story.chapters[0].chapterNo}`}
                  className="inline-flex items-center justify-center bg-[#d4af37] hover:bg-[#b5952f] text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors w-full md:w-auto"
                >
                  Đọc Từ Đầu
                </Link>
              )}
              
              <BookmarkButton storyId={story.id} initialBookmarked={isBookmarked} />
            </div>
          )}
        </div>
      </div>

      {/* Chapters List */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 bg-slate-800/80">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <List className="w-5 h-5 text-[#d4af37]" /> Danh sách chương
          </h2>
        </div>
        
        {story.chapters.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            Truyện chưa có chương nào.
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {story.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/truyen/${story.slug}/${chapter.chapterNo}`}
                className="block p-4 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono text-sm w-12 shrink-0">
                    Ch. {chapter.chapterNo}
                  </span>
                  <span className="text-slate-200 group-hover:text-[#d4af37] transition-colors truncate">
                    {chapter.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
