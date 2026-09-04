"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Tag, Search, X, Loader2, Sparkles, Check, AlertCircle } from "lucide-react";
import { createGenre, updateGenre, deleteGenre } from "@/app/admin/actions/genre_actions";

export interface GenreItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date | string;
  storyCount?: number;
}

interface GenreManagementProps {
  initialGenres: GenreItem[];
}

export function GenreManagement({ initialGenres }: GenreManagementProps) {
  const [genres, setGenres] = useState<GenreItem[]>(initialGenres);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<GenreItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const filteredGenres = genres.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.slug.toLowerCase().includes(search.toLowerCase()) ||
    (g.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await createGenre(formData);
      if (res.success) {
        setSuccessMsg("Đã thêm thể loại mới thành công!");
        setIsAddOpen(false);
        form.reset();
        // Optimistic refresh
        window.location.reload();
      } else {
        setErrorMsg(res.error || "Có lỗi xảy ra.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Không thể kết nối.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingGenre) return;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await updateGenre(formData);
      if (res.success) {
        setSuccessMsg("Đã cập nhật thể loại thành công!");
        setEditingGenre(null);
        window.location.reload();
      } else {
        setErrorMsg(res.error || "Có lỗi xảy ra.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Không thể kết nối.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa thể loại "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await deleteGenre(id);
      if (res.success) {
        setGenres((prev) => prev.filter((g) => g.id !== id));
        setSuccessMsg(`Đã xóa thể loại "${name}".`);
      } else {
        alert(res.error || "Lỗi xóa thể loại.");
      }
    } catch (err: any) {
      alert(err.message || "Lỗi xóa thể loại.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#d4af37]" />
            <span>Hệ Thống Thể Loại Cố Định</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] font-bold border border-[#d4af37]/30">
              {genres.length} thể loại
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quản lý danh mục thể loại chuẩn cho toàn bộ tiểu thuyết trên Thiên Thư AI.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAddOpen(true);
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-[#d4af37]/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Thể Loại Mới</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Lọc theo tên hoặc slug thể loại..."
          className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Genres Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {filteredGenres.map((genre) => (
          <div
            key={genre.id}
            className="group relative bg-slate-900/80 border border-white/10 hover:border-[#d4af37]/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-[#d4af37]/10"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white group-hover:text-[#d4af37] transition-colors">
                  {genre.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5">
                  {genre.slug}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {genre.description || "Chưa có mô tả chi tiết."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
              <span className="text-[11px] font-medium text-amber-200/80">
                {genre.storyCount !== undefined ? `${genre.storyCount} truyện` : "Cố định"}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditingGenre(genre);
                    setErrorMsg("");
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Sửa thể loại"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(genre.id, genre.name)}
                  disabled={deletingId === genre.id}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-40"
                  title="Xóa thể loại"
                >
                  {deletingId === genre.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGenres.length === 0 && (
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl space-y-2">
          <Tag className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm text-slate-300 font-bold">Không tìm thấy thể loại nào</p>
          <p className="text-xs text-slate-500">Hãy thử nhập từ khóa khác hoặc bấm Thêm Thể Loại Mới.</p>
        </div>
      )}

      {/* Modal: Thêm Thể Loại Mới */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-950 border border-[#d4af37]/40 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#d4af37]" />
                <span>Thêm Thể Loại Mới</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Tên thể loại <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="VD: Cổ Tiên, Mạt Thế, Vô Địch Lưu..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Mô tả thể loại (Tùy chọn)
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Đặc điểm, bối cảnh, phong cách của thể loại này..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Lưu Thể Loại</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Sửa Thể Loại */}
      {editingGenre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-950 border border-[#d4af37]/40 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#d4af37]" />
                <span>Chỉnh Sửa Thể Loại</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingGenre(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input type="hidden" name="id" value={editingGenre.id} />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Tên thể loại <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingGenre.name}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Mô tả thể loại
                </label>
                <textarea
                  name="description"
                  defaultValue={editingGenre.description || ""}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingGenre(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Cập Nhật</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
