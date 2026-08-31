"use client";

import { useState } from "react";
import { User, Edit2, Trash2, X, Sparkles, AlertCircle } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { DeleteButton } from "@/components/DeleteButton";
import { updateCharacter, deleteCharacter } from "@/app/admin/actions";

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

  return (
    <div>
      {characters.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          Chưa có nhân vật nào được tạo cho bộ truyện này. Hãy thêm nhân vật đầu tiên ở form trên!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6">
          {characters.map((char) => (
            <div
              key={char.id}
              className="flex gap-4 p-4 bg-black/40 border border-white/10 rounded-2xl relative group hover:border-[#d4af37]/40 transition-all"
            >
              {/* Character Avatar */}
              <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-slate-950 border border-white/10 shrink-0">
                {char.avatarUrl ? (
                  <img
                    src={char.avatarUrl}
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                    <User className="w-8 h-8 text-[#d4af37]/40" />
                  </div>
                )}
              </div>

              {/* Character Info */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-base text-slate-100 group-hover:text-[#d4af37] transition-colors truncate">
                    {char.name}
                  </h4>

                  {/* Actions: Edit + Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingChar(char)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 text-slate-400 hover:text-[#d4af37] border border-white/5 hover:border-[#d4af37]/30 transition-colors"
                      title="Chỉnh sửa nhân vật"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <form action={deleteCharacter}>
                      <input type="hidden" name="id" value={char.id} />
                      <input type="hidden" name="storySlug" value={storySlug} />
                      <DeleteButton message={`Bạn có chắc muốn xóa nhân vật ${char.name}?`} />
                    </form>
                  </div>
                </div>

                {char.role && (
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/20">
                    {char.role}
                  </span>
                )}

                {char.aliases && (
                  <p className="text-xs text-slate-400 truncate">
                    <span className="text-slate-500">Biệt danh:</span> {char.aliases}
                  </p>
                )}

                {char.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light">
                    {char.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Character Modal */}
      {editingChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
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

              {/* Character Avatar Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Ảnh Chân Dung / Avatar Nhân Vật
                </label>
                <ImageUpload
                  name="avatarUrl"
                  initialValue={editingChar.avatarUrl || ""}
                />
              </div>

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
                    Vai Trò / Thân Phận
                  </label>
                  <input
                    type="text"
                    name="role"
                    defaultValue={editingChar.role || ""}
                    placeholder="VD: Nhân vật chính / Đệ tam công tử"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Biệt Danh / Tên Gọi Khác (Cách nhau bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  name="aliases"
                  defaultValue={editingChar.aliases || ""}
                  placeholder="VD: Đống rác Bắc Cảnh, Công tử phế vật"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-sm"
                />
                <p className="text-[11px] text-slate-500">
                  Hệ thống sẽ tự động quét cả tên chính và các biệt danh này khi độc giả đọc chương truyện.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Mô Tả Tính Cách / Tiểu Sử Ngắn
                </label>
                <textarea
                  name="description"
                  rows={3}
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
        </div>
      )}
    </div>
  );
}
