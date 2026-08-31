import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bookmark, History, ChevronRight, BookOpen, Sparkles, PackageOpen } from "lucide-react";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id;

  // Fetch Bookmarks
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      story: {
        include: {
          _count: { select: { chapters: true } }
        }
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch Reading History (with latest chapter read)
  const history = await prisma.readingProgress.findMany({
    where: { userId },
    include: {
      story: true,
      chapter: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Tàng Thư Các Cá Nhân
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Tủ Truyện Của Bạn
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Theo dõi tiến độ đọc và lưu trữ các bộ kỳ thư yêu thích.
          </p>
        </div>

        <Link
          href="/"
          className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 w-fit transition-colors"
        >
          Khám Phá Truyện Mới
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Bookmarks Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20">
                <Bookmark className="w-5 h-5 fill-current" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Truyện Đã Đánh Dấu
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-amber-300 border border-white/5">
              {bookmarks.length} bộ
            </span>
          </div>
          
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-black/30 rounded-2xl border border-white/5">
              <PackageOpen className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400 text-xs sm:text-sm font-medium">
                Bạn chưa lưu bộ truyện nào vào tủ sách.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="flex gap-3.5 sm:gap-4 p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-[#d4af37]/40 transition-all group"
                >
                  <div className="w-16 h-22 sm:w-18 sm:h-24 bg-slate-950 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10 shadow-md">
                    {bm.story.coverUrl ? (
                      <img
                        src={bm.story.coverUrl}
                        alt={bm.story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <BookOpen className="w-7 h-7 text-[#d4af37]/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/truyen/${bm.story.slug}`}
                        className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-[#d4af37] transition-colors truncate block"
                      >
                        {bm.story.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-amber-200/80 font-medium">
                          {bm.story.genre || "Tiên Hiệp"}
                        </span>
                        <span className="text-slate-600 text-xs">•</span>
                        <span className="text-[11px] text-slate-400">
                          {bm.story._count?.chapters || 0} chương
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/truyen/${bm.story.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#d4af37] hover:text-amber-300 mt-2 self-start"
                    >
                      Đọc truyện <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <History className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Tiến Độ Đang Đọc
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-cyan-300 border border-white/5">
              {history.length} bộ
            </span>
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-black/30 rounded-2xl border border-white/5">
              <PackageOpen className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400 text-xs sm:text-sm font-medium">
                Chưa có lịch sử đọc truyện gần đây.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((hist) => (
                <div
                  key={hist.id}
                  className="flex gap-3.5 sm:gap-4 p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/40 transition-all group"
                >
                  <div className="w-16 h-22 sm:w-18 sm:h-24 bg-slate-950 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10 shadow-md">
                    {hist.story.coverUrl ? (
                      <img
                        src={hist.story.coverUrl}
                        alt={hist.story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <BookOpen className="w-7 h-7 text-cyan-400/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/truyen/${hist.story.slug}`}
                        className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors truncate block"
                      >
                        {hist.story.title}
                      </Link>
                      <p className="text-[11px] text-slate-400 truncate mt-1">
                        Đang đọc: <span className="text-cyan-200/90 font-medium">#{hist.chapter.chapterNo} - {hist.chapter.title}</span>
                      </p>
                    </div>

                    <Link 
                      href={`/truyen/${hist.story.slug}/${hist.chapter.chapterNo}`} 
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:brightness-110 px-3.5 py-1.5 rounded-xl shadow-sm self-start mt-2 transition-all"
                    >
                      Đọc Tiếp <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
