import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Settings, BookOpen } from "lucide-react";
import { AdminChapterList } from "@/components/AdminChapterList";

export default async function AdminStoryDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await prisma.story.findUnique({
    where: { slug: slug },
    include: {
      _count: {
        select: { chapters: true, characters: true, lores: true }
      }
    }
  });

  if (!story) {
    notFound();
  }

  // ⚡ DATABASE-LEVEL OPTIMIZATION: Query O(1) for nextChapterNo and load only initial 30 chapters
  const [latestChapter, initialChaptersRaw] = await Promise.all([
    prisma.chapter.findFirst({
      where: { storyId: story.id },
      orderBy: { chapterNo: "desc" },
      select: { chapterNo: true }
    }),
    prisma.chapter.findMany({
      where: { storyId: story.id },
      orderBy: { chapterNo: "desc" },
      take: 30,
      select: {
        id: true,
        chapterNo: true,
        title: true,
        createdAt: true,
        content: true
      }
    })
  ]);

  const nextChapterNo = (latestChapter?.chapterNo ?? 0) + 1;
  const initialChapters = initialChaptersRaw.map((c) => ({
    id: c.id,
    chapterNo: c.chapterNo,
    title: c.title,
    createdAt: c.createdAt,
    contentLength: c.content.length
  }));

  return (
    <div className="space-y-6">
      {/* Header & Quick Navigation */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin" 
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10 active:scale-95 shrink-0"
            title="Quay lại danh sách truyện"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white truncate">
              Truyện: <span className="text-[#d4af37]">{story.title}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {story._count.chapters} chương đã phát hành
            </p>
          </div>
        </div>

        {/* Action Hub: 3 Quick Sub-Module Buttons */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <Link
            href={`/admin/story/${story.slug}/characters`}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 min-h-[46px] px-2.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 text-center"
          >
            <Users className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span className="truncate">Nhân Vật ({story._count.characters})</span>
          </Link>

          <Link
            href={`/admin/story/${story.slug}/lore`}
            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 min-h-[46px] px-2.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 text-center"
          >
            <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">Chú Giải ({story._count.lores})</span>
          </Link>

          <Link
            href={`/admin/story/${story.slug}/edit`}
            className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 min-h-[46px] px-2.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 active:scale-95 text-center"
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className="truncate">Sửa Truyện</span>
          </Link>
        </div>
      </div>

      {/* Chapters Container with On-Demand Incremental Loading */}
      <AdminChapterList
        storyId={story.id}
        storySlug={story.slug}
        initialChapters={initialChapters}
        totalChapters={story._count.chapters}
        nextChapterNo={nextChapterNo}
      />
    </div>
  );
}
