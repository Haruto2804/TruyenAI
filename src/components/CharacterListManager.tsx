"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { User, Edit2, Trash2, X, Sparkles, AlertCircle } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { DeleteButton } from "@/components/DeleteButton";
import { updateCharacter, deleteCharacter } from "@/app/admin/actions";
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
}

export function CharacterListManager({
  characters,
  storySlug,
}: CharacterListManagerProps) {
  const [editingChar, setEditingChar] = useState<CharacterItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      {characters.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          Chưa có nhân vật nào được tạo cho bộ truyện này. Hãy thêm nhân vật đầu tiên ở form trên!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 sm:p-6">
          {characters.map((char) => (
            <div
              key={char.id}
              className="flex gap-4 sm:gap-5 p-4 sm:p-5 bg-black/50 border border-white/10 rounded-2xl relative group hover:border-[#d4af37]/50 hover:shadow-[0_4px_25px_rgba(212,175,55,0.12)] transition-all"
            >
              {/* Character Avatar - Enhanced Size */}
              <div className="w-24 sm:w-28 aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 border border-white/15 shrink-0 relative">
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
                      <User className="w-8 h-8 text-[#d4af37]/40 mb-1" />
                      <span className="text-[10px] text-slate-500">Chưa có ảnh</span>
                    </div>
                  );
                })()}
              </div>

              {/* Character Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-slate-100 group-hover:text-[#d4af37] transition-colors leading-snug">
                        {char.name}
                      </h4>
                      {char.role && (
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/25">
                          {char.role}
                        </span>
                      )}
                    </div>

                    {/* Actions: Edit + Delete */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingChar(char)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-[#d4af37]/20 text-slate-300 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/30 transition-all flex items-center gap-1 text-xs font-semibold"
                        title="Chỉnh sửa nhân vật"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Sửa</span>
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

      {/* Edit Character Modal */}
      {mounted && editingChar && createPortal(
        <div className="fixed inset-0 top-0 left-0 w-full h-full z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto m-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#d4af37]/10 rounded-xl text-[#d4af37]">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Sửa Hồ Sơ Nhân Vật
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cập nhật thông tin cho <span className="text-[#d4af37] font-semibold">{editingChar.name}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingChar(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
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
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-sm"
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
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-sm"
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
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-sm"
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
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingChar(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl hover:brightness-110 transition-all shadow-[0_2px_15px_rgba(212,175,55,0.25)] text-sm"
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
