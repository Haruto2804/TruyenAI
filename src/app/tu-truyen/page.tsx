import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookMarked, History, ChevronRight } from "lucide-react";

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
      story: true,
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
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Tủ Truyện Cá Nhân</h1>
        <p className="text-slate-400 mt-2">Nơi lưu giữ những chuyến phiêu lưu tu tiên kỳ ảo của bạn.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Bookmarks Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
            <BookMarked className="text-indigo-400 w-6 h-6" />
            <h2 className="text-xl font-semibold text-white">Truyện Đánh Dấu</h2>
          </div>
          
          {bookmarks.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              Chưa có truyện nào trong tủ.
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((bm) => (
                <div key={bm.id} className="flex gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="w-16 h-20 bg-slate-800 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {bm.story.coverUrl ? (
                      <img src={bm.story.coverUrl} alt={bm.story.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-600 text-xs text-center p-1">No Cover</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/truyen/${bm.story.slug}`} className="text-lg font-medium text-slate-200 hover:text-indigo-400 truncate block">
                      {bm.story.title}
                    </Link>
                    <p className="text-sm text-slate-500 truncate mt-1">{bm.story.genre}</p>
                    <Link href={`/truyen/${bm.story.slug}`} className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 mt-3 group">
                      Đọc truyện <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
            <History className="text-emerald-400 w-6 h-6" />
            <h2 className="text-xl font-semibold text-white">Đang Đọc (Lịch Sử)</h2>
          </div>

          {history.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              Chưa có lịch sử đọc truyện.
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((hist) => (
                <div key={hist.id} className="flex gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="w-16 h-20 bg-slate-800 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {hist.story.coverUrl ? (
                      <img src={hist.story.coverUrl} alt={hist.story.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-600 text-xs text-center p-1">No Cover</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/truyen/${hist.story.slug}`} className="text-lg font-medium text-slate-200 hover:text-indigo-400 truncate block">
                      {hist.story.title}
                    </Link>
                    <p className="text-sm text-slate-500 truncate mt-1">Đã xem tới: {hist.chapter.title}</p>
                    <Link 
                      href={`/truyen/${hist.story.slug}/${hist.chapter.chapterNo}`} 
                      className="inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 mt-3 bg-indigo-500/10 px-3 py-1 rounded-full group"
                    >
                      Đọc tiếp <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
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
