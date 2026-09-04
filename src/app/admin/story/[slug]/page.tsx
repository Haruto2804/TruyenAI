import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, List as ListIcon, Edit, Users, Settings, BookOpen } from "lucide-react";
import { deleteChapter } from "@/app/admin/actions";
import { DeleteButton } from "@/components/DeleteButton";

export default async function AdminStoryDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await prisma.story.findUnique({
    where: { slug: slug },
    include: {
      chapters: {
        orderBy: { chapterNo: 'asc' }
      },
      characters: {
        select: { id: true }
      },
      lores: {
        select: { id: true }
      }
    }
  });

  if (!story) {
    notFound();
  }

  // Determine next chapter number
  const nextChapterNo = story.chapters.length > 0 
    ? story.chapters[story.chapters.length - 1].chapterNo + 1 
    : 1;

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
              {story.chapters.length} chương đã phát hành
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
            <span className="truncate">Nhân Vật ({story.characters.length})</span>
          </Link>

          <Link
            href={`/admin/story/${story.slug}/lore`}
            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 min-h-[46px] px-2.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 text-center"
          >
            <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">Chú Giải ({story.lores.length})</span>
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

      {/* Chapters Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Container Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="font-bold text-slate-100 flex items-center gap-2 text-sm sm:text-base">
            <ListIcon className="w-4 h-4 text-[#d4af37]" /> 
            <span>Danh Sách Chương ({story.chapters.length})</span>
          </h4>
          <Link 
            href={`/admin/story/${story.slug}/chapter/new?next=${nextChapterNo}`}
            className="bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 shadow-sm min-h-[44px] w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 shrink-0" /> 
            <span>Đăng Chương Mới</span>
          </Link>
        </div>

        {/* MOBILE VIEW: Cards for touchscreens (< md) */}
        <div className="block md:hidden divide-y divide-slate-800/80">
          {story.chapters.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Chưa có chương nào. Bấm "Đăng Chương Mới" để bắt đầu.
            </div>
          ) : (
            story.chapters.map((chapter) => (
              <div key={chapter.id} className="p-4 space-y-2.5 hover:bg-slate-800/20 transition-colors">
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 px-2 py-0.5 rounded-md bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 text-xs font-bold font-mono">
                    #{chapter.chapterNo}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-slate-100 font-semibold text-sm leading-snug">
                      {chapter.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>{chapter.content.length.toLocaleString('vi-VN')} ký tự</span>
                      <span>•</span>
                      <span>{chapter.createdAt.toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Actions: Touch Targets */}
                <div className="flex items-center gap-2 pt-1">
                  <Link 
                    href={`/admin/story/${story.slug}/chapter/${chapter.id}/edit`}
                    className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Sửa Chương</span>
                  </Link>

                  <form action={deleteChapter} className="shrink-0">
                    <input type="hidden" name="id" value={chapter.id} />
                    <input type="hidden" name="storySlug" value={story.slug} />
                    <DeleteButton 
                      message="Bạn có chắc muốn xóa chương này không?" 
                      className="min-h-[40px] px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    />
                  </form>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP VIEW: High density table (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-3.5 font-medium w-24">Chương</th>
                <th className="px-6 py-3.5 font-medium">Tiêu đề</th>
                <th className="px-6 py-3.5 font-medium">Độ dài</th>
                <th className="px-6 py-3.5 font-medium">Ngày đăng</th>
                <th className="px-6 py-3.5 font-medium text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {story.chapters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Chưa có chương nào. Bấm "Đăng Chương Mới" để bắt đầu.
                  </td>
                </tr>
              ) : (
                story.chapters.map((chapter) => (
                  <tr key={chapter.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-[#d4af37] font-semibold">#{chapter.chapterNo}</td>
                    <td className="px-6 py-3.5 font-medium text-slate-200">{chapter.title}</td>
                    <td className="px-6 py-3.5 text-slate-400">{chapter.content.length.toLocaleString('vi-VN')} ký tự</td>
                    <td className="px-6 py-3.5 text-slate-400 text-xs">{chapter.createdAt.toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/story/${story.slug}/chapter/${chapter.id}/edit`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-medium flex items-center gap-1 transition-all"
                          title="Sửa chương"
                        >
                          <Edit className="w-3.5 h-3.5" /> Sửa
                        </Link>
                        <form action={deleteChapter}>
                          <input type="hidden" name="id" value={chapter.id} />
                          <input type="hidden" name="storySlug" value={story.slug} />
                          <DeleteButton 
                            message="Bạn có chắc muốn xóa chương này không?" 
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium inline-flex items-center gap-1 transition-all"
                          />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
