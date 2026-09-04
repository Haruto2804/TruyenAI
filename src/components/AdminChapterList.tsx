"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, List as ListIcon, Edit, Loader2, ArrowUpDown, Search, Sparkles } from "lucide-react";
import { getAdminChapters, AdminChapterItem } from "@/app/actions/chapter";
import { deleteChapter } from "@/app/admin/actions";
import { DeleteButton } from "@/components/DeleteButton";

interface AdminChapterListProps {
  storyId: string;
  storySlug: string;
  initialChapters: AdminChapterItem[];
  totalChapters: number;
  nextChapterNo: number;
}

export function AdminChapterList({
  storyId,
  storySlug,
  initialChapters,
  totalChapters,
  nextChapterNo,
}: AdminChapterListProps) {
  const [chapters, setChapters] = useState<AdminChapterItem[]>(initialChapters);
  const [total, setTotal] = useState<number>(totalChapters);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState<string>("");
  const [isLoadingMore, startLoadMore] = useTransition();
  const [isSearching, startSearch] = useTransition();

  const handleToggleOrder = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);
    startSearch(async () => {
      const res = await getAdminChapters({
        storyId,
        skip: 0,
        take: 30,
        order: newOrder,
        search,
      });
      if (res.success) {
        setChapters(res.chapters);
        setTotal(res.total);
      }
    });
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    startSearch(async () => {
      const res = await getAdminChapters({
        storyId,
        skip: 0,
        take: 30,
        order,
        search: query,
      });
      if (res.success) {
        setChapters(res.chapters);
        setTotal(res.total);
      }
    });
  };

  const handleLoadMore = (takeCount: number = 30) => {
    startLoadMore(async () => {
      const res = await getAdminChapters({
        storyId,
        skip: chapters.length,
        take: takeCount,
        order,
        search,
      });
      if (res.success && res.chapters.length > 0) {
        setChapters((prev) => [...prev, ...res.chapters]);
        setTotal(res.total);
      }
    });
  };

  const hasMore = chapters.length < total;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all">
      {/* Container Header */}
      <div className="p-3.5 sm:p-5 border-b border-slate-800 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-slate-100 flex items-center gap-2 text-sm sm:text-base">
              <ListIcon className="w-4 h-4 text-[#d4af37]" />
              <span>Danh Sách Chương ({total})</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Đang tải {chapters.length} / {total} chương
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort Toggle Button */}
            <button
              onClick={handleToggleOrder}
              disabled={isSearching}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Đảo thứ tự hiển thị chương"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{order === "desc" ? "Mới nhất trước" : "Cũ nhất trước (#1)"}</span>
            </button>

            {/* Create Chapter Link */}
            <Link
              href={`/admin/story/${storySlug}/chapter/new?next=${nextChapterNo}`}
              className="bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 shadow-sm min-h-[38px]"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Đăng Chương Mới</span>
            </Link>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm theo số chương (VD: 10) hoặc tiêu đề..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-[#d4af37]/60 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
          />
          {isSearching && (
            <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37] animate-spin" />
          )}
        </div>
      </div>

      {/* MOBILE VIEW: Cards for touchscreens (< md) */}
      <div className="block md:hidden divide-y divide-slate-800/80">
        {chapters.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            {search ? "Không tìm thấy chương nào." : "Chưa có chương nào. Bấm 'Đăng Chương Mới' để bắt đầu."}
          </div>
        ) : (
          chapters.map((chapter) => (
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
                    <span>{chapter.contentLength.toLocaleString("vi-VN")} ký tự</span>
                    <span>•</span>
                    <span>{new Date(chapter.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Actions: Touch Targets */}
              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={`/admin/story/${storySlug}/chapter/${chapter.id}/edit`}
                  className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Sửa Chương</span>
                </Link>

                <form action={deleteChapter} className="shrink-0">
                  <input type="hidden" name="id" value={chapter.id} />
                  <input type="hidden" name="storySlug" value={storySlug} />
                  <DeleteButton
                    message="Bạn có chắc muốn xóa chương này không?"
                    className="min-h-[40px] px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
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
            {chapters.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  {search ? "Không tìm thấy chương nào." : "Chưa có chương nào. Bấm 'Đăng Chương Mới' để bắt đầu."}
                </td>
              </tr>
            ) : (
              chapters.map((chapter) => (
                <tr key={chapter.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-[#d4af37] font-semibold">#{chapter.chapterNo}</td>
                  <td className="px-6 py-3.5 font-medium text-slate-200">{chapter.title}</td>
                  <td className="px-6 py-3.5 text-slate-400">
                    {chapter.contentLength.toLocaleString("vi-VN")} ký tự
                  </td>
                  <td className="px-6 py-3.5 text-slate-400 text-xs">
                    {new Date(chapter.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/story/${storySlug}/chapter/${chapter.id}/edit`}
                        className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all"
                        title="Chỉnh sửa chương"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Sửa</span>
                      </Link>

                      <form action={deleteChapter} className="inline-block">
                        <input type="hidden" name="id" value={chapter.id} />
                        <input type="hidden" name="storySlug" value={storySlug} />
                        <DeleteButton
                          message="Bạn có chắc muốn xóa chương này không?"
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
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

      {/* Footer / Load More Controls */}
      <div className="p-3.5 sm:p-5 border-t border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <span className="text-xs text-slate-400">
          {hasMore
            ? `Còn ${total - chapters.length} chương chưa tải`
            : `Đã tải đầy đủ toàn bộ ${total} chương`}
        </span>

        {hasMore && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleLoadMore(30)}
              disabled={isLoadingMore}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/30 text-xs sm:text-sm font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                  <span>Đang tải...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Tải thêm 30 chương</span>
                </>
              )}
            </button>

            {total - chapters.length > 30 && (
              <button
                onClick={() => handleLoadMore(100)}
                disabled={isLoadingMore}
                className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Tải nhanh 100 chương"
              >
                +100
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
