import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Edit2 } from "lucide-react";
import { updateCharacter } from "@/app/admin/actions";
import { ImageUpload } from "@/components/ImageUpload";

export default async function EditCharacterPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  const character = await prisma.character.findUnique({
    where: { id },
    include: {
      story: true,
    },
  });

  if (!character || character.story.slug !== slug) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        <Link
          href={`/admin/story/${slug}/characters`}
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5 flex items-center justify-center shrink-0"
          title="Quay lại danh sách nhân vật"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-2xl font-bold text-white flex flex-wrap items-center gap-2">
            <Edit2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#d4af37] shrink-0" />
            <span>Sửa Hồ Sơ Nhân Vật:</span>
            <span className="text-[#d4af37] truncate">{character.name}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cập nhật chân dung, vai trò và bối cảnh cho nhân vật trong bộ truyện {character.story.title}.
          </p>
        </div>
      </div>

      <div className="bg-black/30 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-xl shadow-xl">
        <form action={updateCharacter} className="space-y-5 sm:space-y-6">
          <input type="hidden" name="id" value={character.id} />
          <input type="hidden" name="storySlug" value={slug} />

          {/* Character Avatar Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Ảnh Chân Dung / Avatar Nhân Vật
            </label>
            <ImageUpload name="avatarUrl" initialValue={character.avatarUrl || ""} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Tên Nhân Vật <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={character.name}
                placeholder="VD: Lâm Phong"
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Vai Trò / Thân Phận
              </label>
              <input
                type="text"
                name="role"
                defaultValue={character.role || ""}
                placeholder="VD: Nam chính / Chủ tịch tập đoàn / Thánh nữ"
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
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
              defaultValue={character.aliases || ""}
              placeholder="VD: Phong ca, Lâm Thánh Tử, Tiểu Phong, Phong thiếu"
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
            />
            <p className="text-[11px] text-slate-500">
              Hệ thống sẽ tự động quét cả tên chính và các biệt danh này khi độc giả đọc chương truyện.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Tóm Tắt Nhân Vật
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={character.description || ""}
              placeholder="VD: Đệ nhất thánh tử Thái Sơ Thánh Địa. Tính cách quyết đoán, sắc bén..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm resize-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-white/10">
            <Link
              href={`/admin/story/${slug}/characters`}
              className="w-full sm:w-auto min-h-[44px] px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-colors flex items-center justify-center"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="w-full sm:w-auto min-h-[48px] bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_2px_15px_rgba(212,175,55,0.25)] text-sm flex items-center justify-center"
            >
              Cập Nhật Nhân Vật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
