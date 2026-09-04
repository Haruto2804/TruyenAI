import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, List, Edit, BookOpen, Clock, Layers, ArrowRight, Sparkles } from "lucide-react";
import { deleteStory } from "@/app/admin/actions";
import { DeleteButton } from "@/components/DeleteButton";

function formatTimeAgo(date: Date | string | null | undefined): string {
  if (!date) return "Mới ra";
  const now = Date.now();
  const diff = Math.max(0, now - new Date(date).getTime());
  const mins = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days === 1) return "Hôm qua";
  if (days < 7) return `${days} ngày trước`;
  return new Date(date).toLocaleDateString("vi-VN");
}

export default async function AdminPage() {
  const stories = await prisma.story.findMany({
    include: {
      _count: {
        select: { chapters: true, characters: true, lores: true }
      },
      chapters: {
        orderBy: { chapterNo: 'desc' },
        take: 1,
        select: {
          chapterNo: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        }
      }
    }
  });

  // Sắp xếp truyện nào ra chương mới nhất hoặc cập nhật gần nhất lên đầu
  const sortedStories = [...stories].sort((a, b) => {
    const aChap = a.chapters[0];
    const bChap = b.chapters[0];
    const aTime = aChap
      ? Math.max(new Date(aChap.updatedAt || aChap.createdAt).getTime(), new Date(a.updatedAt).getTime())
      : new Date(a.updatedAt).getTime();
    const bTime = bChap
      ? Math.max(new Date(bChap.updatedAt || bChap.createdAt).getTime(), new Date(b.updatedAt).getTime())
      : new Date(b.updatedAt).getTime();
    return bTime - aTime;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Quản Lý Tiểu Thuyết</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#d4af37]/15 text-[#d4af37] font-semibold border border-[#d4af37]/30">
              {stories.length} bộ
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Tự động sắp xếp theo truyện có chương mới phát hành gần nhất
          </p>
        </div>

        <Link 
          href="/admin/story/new"
          className="bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:brightness-110 active:scale-95 min-h-[44px] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 shrink-0" /> 
          <span>Thêm Truyện Mới</span>
        </Link>
      </div>

      {/* MOBILE VIEW: Touch-First Interactive Cards (< md) */}
      <div className="block md:hidden space-y-3.5">
        {sortedStories.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-400 text-sm">
            Chưa có truyện nào. Bấm nút phía trên để tạo truyện đầu tiên!
          </div>
        ) : (
          sortedStories.map((story) => {
            const latestChapter = story.chapters[0];
            const latestTime = latestChapter
              ? new Date(Math.max(new Date(latestChapter.updatedAt || latestChapter.createdAt).getTime(), new Date(story.updatedAt).getTime()))
              : new Date(story.updatedAt);

            return (
              <div 
                key={story.id} 
                className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 space-y-3.5 shadow-lg relative overflow-hidden"
              >
                {/* Header Info */}
                <div className="flex items-start gap-3">
                  {story.coverUrl ? (
                    <img 
                      src={story.coverUrl} 
                      alt={story.title} 
                      className="w-14 aspect-[3/4] object-cover rounded-lg border border-white/10 shrink-0 bg-slate-950" 
                    />
                  ) : (
                    <div className="w-14 aspect-[3/4] rounded-lg bg-slate-800/80 border border-white/10 flex items-center justify-center shrink-0 text-[#d4af37]">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-100 text-base leading-snug truncate">
                      {story.title}
                    </h4>
                    {story.genre && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 truncate max-w-full">
                        {story.genre}
                      </span>
                    )}

                    {/* Mới nhất badge */}
                    {latestChapter && (
                      <div className="flex items-center gap-1.5 text-xs text-[#d4af37] mt-1.5 font-medium truncate">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span className="truncate">Chương {latestChapter.chapterNo}: {latestChapter.title}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1 text-slate-300 font-semibold">
                        <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                        {story._count.chapters} chương
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        {formatTimeAgo(latestTime)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Thumb-Friendly Touch Targets (Min 44px) */}
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <Link 
                    href={`/admin/story/${story.slug}`}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
                  >
                    <List className="w-4 h-4 shrink-0" />
                    <span>Quản lý chương ({story._count.chapters})</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>

                  <div className="grid grid-cols-4 gap-2">
                    <Link 
                      href={`/admin/story/${story.slug}/characters`}
                      className="min-h-[44px] px-2 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-semibold flex flex-col items-center justify-center gap-1 border border-white/10 active:scale-95 transition-all text-center"
                    >
                      <span className="text-[#d4af37] font-bold">{story._count.characters}</span>
                      <span>Nhân vật</span>
                    </Link>

                    <Link 
                      href={`/admin/story/${story.slug}/lore`}
                      className="min-h-[44px] px-2 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-semibold flex flex-col items-center justify-center gap-1 border border-white/10 active:scale-95 transition-all text-center"
                    >
                      <span className="text-[#d4af37] font-bold">{story._count.lores}</span>
                      <span>Lore</span>
                    </Link>

                    <Link 
                      href={`/admin/story/${story.slug}/edit`}
                      className="min-h-[44px] px-2 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-semibold flex flex-col items-center justify-center gap-1 border border-white/10 active:scale-95 transition-all text-center"
                    >
                      <Edit className="w-4 h-4 text-emerald-400" />
                      <span>Sửa</span>
                    </Link>

                    <form action={deleteStory} className="w-full">
                      <input type="hidden" name="id" value={story.id} />
                      <DeleteButton 
                        message="Xóa truyện sẽ xóa TẤT CẢ các chương bên trong. Bạn có chắc chắn không?" 
                        className="w-full min-h-[44px] px-2 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex flex-col items-center justify-center gap-1 border border-rose-500/20 active:scale-95 transition-all text-center"
                      />
                    </form>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP VIEW: High-Density Table (>= md) */}
      <div className="hidden md:block bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-semibold">
                <th className="px-6 py-4">Tác Phẩm</th>
                <th className="px-6 py-4">Thể Loại</th>
                <th className="px-6 py-4">Số Chương</th>
                <th className="px-6 py-4">Chương Mới Nhất</th>
                <th className="px-6 py-4">Cập Nhật</th>
                <th className="px-6 py-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedStories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Chưa có dữ liệu. Hãy thêm truyện mới!
                  </td>
                </tr>
              ) : (
                sortedStories.map((story) => {
                  const latestChapter = story.chapters[0];
                  const latestTime = latestChapter
                    ? new Date(Math.max(new Date(latestChapter.updatedAt || latestChapter.createdAt).getTime(), new Date(story.updatedAt).getTime()))
                    : new Date(story.updatedAt);

                  return (
                    <tr key={story.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {story.coverUrl && (
                            <img 
                              src={story.coverUrl} 
                              alt="" 
                              className="w-8 h-10 object-cover rounded bg-slate-950 border border-white/10 shrink-0" 
                            />
                          )}
                          <span className="font-semibold text-slate-100">{story.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{story.genre || "Chưa phân loại"}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20">
                          {story._count.chapters} chương
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300 text-xs">
                        {latestChapter ? (
                          <span className="truncate max-w-[200px] block text-[#d4af37]">
                            Chương {latestChapter.chapterNo}: {latestChapter.title}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">Chưa có</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        <span className="text-emerald-400 font-medium">
                          {formatTimeAgo(latestTime)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/story/${story.slug}`}
                            className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 font-medium text-xs flex items-center gap-1 transition-all"
                          >
                            <List className="w-3.5 h-3.5" /> Chi tiết
                          </Link>
                          <Link 
                            href={`/admin/story/${story.slug}/edit`}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 font-medium text-xs flex items-center gap-1 transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" /> Sửa
                          </Link>
                          <form action={deleteStory}>
                            <input type="hidden" name="id" value={story.id} />
                            <DeleteButton 
                              message="Xóa truyện sẽ xóa TẤT CẢ các chương bên trong. Bạn có chắc chắn không?" 
                              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-medium text-xs inline-flex items-center gap-1 transition-all"
                            />
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
