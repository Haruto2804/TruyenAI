import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

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
  });

  if (!story) {
    notFound();
  }

  const chapter = await prisma.chapter.findUnique({
    where: {
      storyId_chapterNo: {
        storyId: story.id,
        chapterNo: chapterNo,
      },
    },
  });

  if (!chapter) {
    notFound();
  }

  // Fetch previous and next chapters for navigation
  const prevChapter = await prisma.chapter.findUnique({
    where: { storyId_chapterNo: { storyId: story.id, chapterNo: chapterNo - 1 } },
  });

  const nextChapter = await prisma.chapter.findUnique({
    where: { storyId_chapterNo: { storyId: story.id, chapterNo: chapterNo + 1 } },
  });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Chapter Header / Nav */}
      <div className="mb-8 flex flex-col items-center text-center space-y-4">
        <Link 
          href={`/truyen/${story.slug}`}
          className="text-[#d4af37] hover:underline text-sm font-medium uppercase tracking-wider"
        >
          {story.title}
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
          Chương {chapter.chapterNo}: {chapter.title}
        </h1>
        
        {/* Navigation Bar */}
        <div className="flex items-center gap-4 py-4 w-full justify-center">
          <Link
            href={prevChapter ? `/truyen/${story.slug}/${prevChapter.chapterNo}` : '#'}
            className={`flex items-center justify-center p-2 rounded border ${
              prevChapter 
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' 
                : 'border-slate-800 bg-slate-900 text-slate-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <Link
            href={`/truyen/${story.slug}`}
            className="flex items-center justify-center p-2 rounded border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 px-4"
          >
            <Menu className="w-5 h-5 mr-2" /> Mục Lục
          </Link>

          <Link
            href={nextChapter ? `/truyen/${story.slug}/${nextChapter.chapterNo}` : '#'}
            className={`flex items-center justify-center p-2 rounded border ${
              nextChapter 
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' 
                : 'border-slate-800 bg-slate-900 text-slate-600 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="bg-slate-900 md:bg-slate-800/20 md:border border-slate-800 rounded-2xl md:p-8 p-0">
        <div 
          className="prose prose-invert prose-lg max-w-none text-slate-300 leading-loose"
          style={{ 
            fontSize: '1.125rem', 
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          {chapter.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center gap-4 py-8 mt-4 w-full justify-center border-t border-slate-800">
        <Link
          href={prevChapter ? `/truyen/${story.slug}/${prevChapter.chapterNo}` : '#'}
          className={`flex items-center justify-center p-3 rounded-lg border flex-1 md:flex-none md:w-32 ${
            prevChapter 
              ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' 
              : 'border-slate-800 bg-slate-900 text-slate-600 cursor-not-allowed pointer-events-none'
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Trước
        </Link>

        <Link
          href={nextChapter ? `/truyen/${story.slug}/${nextChapter.chapterNo}` : '#'}
          className={`flex items-center justify-center p-3 rounded-lg border flex-1 md:flex-none md:w-32 ${
            nextChapter 
              ? 'border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 hover:border-[#d4af37]/50' 
              : 'border-slate-800 bg-slate-900 text-slate-600 cursor-not-allowed pointer-events-none'
          }`}
        >
          Tiếp <ChevronRight className="w-5 h-5 ml-1" />
        </Link>
      </div>
    </div>
  );
}
