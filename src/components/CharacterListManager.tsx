"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { User, Edit2, Trash2, X, Sparkles, AlertCircle, Search, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { DeleteButton } from "@/components/DeleteButton";
import { updateCharacter, deleteCharacter } from "@/app/admin/actions";
import { getAdminCharacters } from "@/app/actions/character_loader";
import { getCharacterAvatarUrl } from "@/lib/images";

export interface CharacterItem {
  id: string;
  name: string;
  aliases: string | null;
  role: string | null;
  avatarUrl: string | null;
  description: string | null;
  storyId: string;
}

interface CharacterListManagerProps {
  characters: CharacterItem[];
  storySlug: string;
  storyId?: string;
  totalCharacters?: number;
}

export function CharacterListManager({
  characters: initialCharacters,
  storySlug,
  storyId,
  totalCharacters,
}: CharacterListManagerProps) {
  const [characters, setCharacters] = useState<CharacterItem[]>(initialCharacters);
  const [total, setTotal] = useState<number>(totalCharacters ?? initialCharacters.length);
  const [search, setSearch] = useState<string>("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [editingChar, setEditingChar] = useState<CharacterItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = async (q: string) => {
    setSearch(q);
    if (!storyId) return;
    setSearching(true);
    const res = await getAdminCharacters({
      storyId,
      skip: 0,
      take: 12,
      search: q
    });
    if (res.success) {
      setCharacters(res.characters);
      setTotal(res.total);
    }
    setSearching(false);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || !storyId) return;
    setLoadingMore(true);
    const res = await getAdminCharacters({
      storyId,
      skip: characters.length,
      take: 12,
      search
    });
    if (res.success && res.characters.length > 0) {
      setCharacters((prev) => [...prev, ...res.characters]);
      setTotal(res.total);
    }
    setLoadingMore(false);
  };

  const hasMore = characters.length < total;
  const remainingCount = total - characters.length;

  return (
    <div>
      {/* Search Bar & Counter */}
      <div className="p-3.5 sm:p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/20">
        <span className="text-xs text-slate-400 font-medium">
          Đang hiển thị {characters.length} / {total} nhân vật
        </span>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm theo tên, vai trò, biệt danh..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-[#d4af37]/60 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
          />
          {searching && (
            <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37] animate-spin" />
          )}
        </div>
      </div>

      {characters.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          {search ? "Không tìm thấy nhân vật nào phù hợp." : "Chưa có nhân vật nào được tạo cho bộ truyện này. Hãy thêm nhân vật đầu tiên ở form trên!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 p-3.5 sm:p-6">
          {characters.map((char) => (
            <div
              key={char.id}
              className="flex gap-3.5 sm:gap-5 p-3.5 sm:p-5 bg-black/50 border border-white/10 rounded-2xl relative group hover:border-[#d4af37]/50 hover:shadow-[0_4px_25px_rgba(212,175,55,0.12)] transition-all"
            >
              {/* Character Avatar - Responsive Size */}
              <div className="w-20 sm:w-28 aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 border border-white/15 shrink-0 relative">
                {(() => {
                  const avatar = getCharacterAvatarUrl(char.avatarUrl, storySlug, char.name);
                  return avatar ? (
                    <img
                      src={avatar}
                      alt={char.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-600 p-2 text-center">
                      <User className="w-7 h-7 sm:w-8 sm:h-8 text-[#d4af37]/40 mb-1" />
                      <span className="text-[10px] text-slate-500">Chưa có ảnh</span>
                    </div>
                  );
                })()}
              </div>

              {/* Character Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-base sm:text-lg text-slate-100 group-hover:text-[#d4af37] transition-colors leading-snug truncate">
                        {char.name}
                      </h4>
                      {char.role && (
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/25 truncate max-w-full">
                          {char.role}
                        </span>
                      )}
                    </div>

                    {/* Actions: Edit + Delete */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingChar(char)}
                        className="min-h-[40px] min-w-[40px] px-3 py-2 rounded-xl bg-white/5 hover:bg-[#d4af37]/20 active:bg-[#d4af37]/30 text-slate-300 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/30 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
                        title="Chỉnh sửa nhân vật"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="inline">Sửa</span>
                      </button>

                      <form action={deleteCharacter}>
                        <input type="hidden" name="id" value={char.id} />
                        <input type="hidden" name="storySlug" value={storySlug} />
                        <DeleteButton message={`Bạn có chắc muốn xóa nhân vật ${char.name}?`} />
                      </form>
                    </div>
                  </div>

                  {char.aliases && (
                    <p className="text-xs text-slate-400">
                      <span className="text-slate-500 font-medium">Biệt danh:</span> {char.aliases}
                    </p>
                  )}
                </div>

                {char.description && (
                  <p className="text-xs text-slate-300/80 line-clamp-3 leading-relaxed font-light pt-1.5 border-t border-white/5">
                    {char.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="p-4 sm:p-5 border-t border-white/5 bg-black/20 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2.5 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/30 text-xs sm:text-sm font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer inline-flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                <span>Đang tải thêm...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Tải thêm nhân vật (còn {remainingCount})</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Edit Character Modal */}
      {mounted && editingChar && createPortal(
        <div className="fixed inset-0 top-0 left-0 w-full h-full z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6 max-h-[92vh] overflow-y-auto m-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#d4af37]/10 rounded-xl text-[#d4af37] shrink-0">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white truncate">
                    Sửa Hồ Sơ Nhân Vật
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    Cập nhật thông tin cho <span className="text-[#d4af37] font-semibold">{editingChar.name}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingChar(null)}
                className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center justify-center shrink-0"
                title="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Form */}
            <form action={updateCharacter} className="space-y-5">
              <input type="hidden" name="id" value={editingChar.id} />
              <input type="hidden" name="storySlug" value={storySlug} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Tên Nhân Vật <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingChar.name}
                    placeholder="VD: Caelen Von Ravenwood"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Vai Trò / Danh Phận
                  </label>
                  <input
                    type="text"
                    name="role"
                    defaultValue={editingChar.role || ""}
                    placeholder="VD: Nhân vật chính / Tam công tử"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Biệt Danh / Cách Gọi (Phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  name="aliases"
                  defaultValue={editingChar.aliases || ""}
                  placeholder="VD: Đống rác Bắc Cảnh, Công tử phế vật, Caelen"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Ảnh Chân Dung / Avatar
                </label>
                <ImageUpload
                  defaultValue={editingChar.avatarUrl}
                  inputName="avatarUrl"
                  folder="characters"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Tóm Tắt Nhân Vật
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editingChar.description || ""}
                  placeholder="VD: Chiến thuật gia hiện đại chuyển sinh..."
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm resize-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingChar(null)}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-slate-300 text-sm font-semibold transition-colors flex items-center justify-center"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[44px] bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_2px_15px_rgba(212,175,55,0.25)] text-sm flex items-center justify-center"
                >
                  Cập Nhật Nhân Vật
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
