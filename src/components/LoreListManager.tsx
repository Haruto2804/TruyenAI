"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BookMarked, Edit2, Trash2, X, Sparkles, Tag, ShieldAlert, Compass, Gem, Flame, Layers } from "lucide-react";
import { DeleteButton } from "@/components/DeleteButton";
import { updateLore, deleteLore } from "@/app/admin/actions";

export interface LoreItem {
  id: string;
  term: string;
  category: string | null;
  definition: string;
  aliases: string | null;
  storyId: string;
}

interface LoreListManagerProps {
  lores: LoreItem[];
  storySlug: string;
}

const CATEGORY_ICONS: Record<string, any> = {
  "Độc Dược": ShieldAlert,
  "Bí Thuật": Flame,
  "Địa Danh": Compass,
  "Bảo Vật": Gem,
  "Thế Lực": Layers,
  "Cảnh Giới": Sparkles,
};

export function LoreListManager({ lores, storySlug }: LoreListManagerProps) {
  const [editingLore, setEditingLore] = useState<LoreItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      {lores.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          Chưa có khái niệm/thuật ngữ nào được tạo. Hãy thêm chú giải đầu tiên ở biểu mẫu trên!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6">
          {lores.map((lore) => {
            const Icon = (lore.category && CATEGORY_ICONS[lore.category]) || BookMarked;
            return (
              <div
                key={lore.id}
                className="p-5 bg-black/50 border border-white/10 rounded-2xl relative group hover:border-[#d4af37]/50 hover:shadow-[0_4px_25px_rgba(212,175,55,0.12)] transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/5 text-[#d4af37] border border-white/5 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base sm:text-lg text-slate-100 group-hover:text-[#d4af37] transition-colors leading-snug">
                          {lore.term}
                        </h4>
                        {lore.category && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                            {lore.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: Edit + Delete */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingLore(lore)}
                        className="min-h-[40px] min-w-[40px] px-3 py-2 rounded-xl bg-white/5 hover:bg-[#d4af37]/20 active:bg-[#d4af37]/30 text-slate-300 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/30 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
                        title="Chỉnh sửa chú giải"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="inline">Sửa</span>
                      </button>

                      <form action={deleteLore}>
                        <input type="hidden" name="id" value={lore.id} />
                        <input type="hidden" name="storySlug" value={storySlug} />
                        <DeleteButton message={`Bạn có chắc muốn xóa chú giải ${lore.term}?`} />
                      </form>
                    </div>
                  </div>

                  {lore.aliases && (
                    <p className="text-xs text-slate-400">
                      <span className="text-slate-500 font-medium">Từ đồng nghĩa/Biệt danh:</span> {lore.aliases}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-light whitespace-pre-wrap pt-2 border-t border-white/5">
                    {lore.definition}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Lore Modal */}
      {mounted && editingLore && createPortal(
        <div className="fixed inset-0 top-0 left-0 w-full h-full z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6 max-h-[92vh] overflow-y-auto m-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#d4af37]/10 rounded-xl text-[#d4af37] shrink-0">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white truncate">
                    Sửa Chú Giải / Khái Niệm
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    Cập nhật định nghĩa cho <span className="text-[#d4af37] font-semibold">{editingLore.term}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingLore(null)}
                className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center justify-center shrink-0"
                title="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Form */}
            <form action={updateLore} className="space-y-4">
              <input type="hidden" name="id" value={editingLore.id} />
              <input type="hidden" name="storySlug" value={storySlug} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Tên Thuật Ngữ / Khái Niệm <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="term"
                    required
                    defaultValue={editingLore.term}
                    placeholder="VD: Hắc Tử La Lan"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Phân Loại
                  </label>
                  <input
                    type="text"
                    name="category"
                    defaultValue={editingLore.category || ""}
                    placeholder="VD: Độc Dược / Bí Thuật / Địa Danh"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Biệt Danh / Từ Đồng Nghĩa (Cách nhau bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  name="aliases"
                  defaultValue={editingLore.aliases || ""}
                  placeholder="VD: Độc hoa tử la, Cực độc La Lan"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
                />
                <p className="text-[11px] text-slate-500">
                  Hệ thống sẽ tự động bắt từ khóa và hiển thị chú giải khi độc giả đọc chương truyện.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Lời Chú Giải / Định Nghĩa Chi Tiết <span className="text-rose-400">*</span>
                </label>
                <textarea
                  name="definition"
                  rows={4}
                  required
                  defaultValue={editingLore.definition}
                  placeholder="Giải thích cặn kẽ ý nghĩa để độc giả hiểu ngay khi tra cứu..."
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm resize-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingLore(null)}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-slate-300 text-sm font-semibold transition-colors flex items-center justify-center"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[44px] bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_2px_15px_rgba(212,175,55,0.25)] text-sm flex items-center justify-center"
                >
                  Cập Nhật Chú Giải
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
