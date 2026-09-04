import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Plus, Sparkles } from "lucide-react";
import { createCharacter } from "@/app/admin/actions";
import { ImageUpload } from "@/components/ImageUpload";
import { CharacterListManager } from "@/components/CharacterListManager";

export default async function StoryCharactersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const story = await prisma.story.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { characters: true }
      },
      characters: {
        orderBy: { createdAt: "desc" },
        take: 12,
      },
    },
  });

  if (!story) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/story/${story.slug}`}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10 active:scale-95 shrink-0"
            title="Quay lại chi tiết truyện"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 truncate">
              <Users className="w-5 h-5 text-[#d4af37] shrink-0" />
              <span>Hồ Sơ Nhân Vật</span>
            </h2>
            <p className="text-xs text-slate-400 truncate">
              Tác phẩm: <span className="text-[#d4af37] font-semibold">{story.title}</span>
            </p>
          </div>
        </div>

        <Link
          href={`/truyen/${story.slug}`}
          className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 min-h-[42px] flex items-center justify-center active:scale-95 w-full sm:w-auto"
        >
          Xem Trang Truyện
        </Link>
      </div>

      {/* Form: Add New Character */}
      <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-xl">
        <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-5 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#d4af37]" /> Thêm Nhân Vật Mới
        </h3>

        <form action={createCharacter} className="space-y-5">
          <input type="hidden" name="storyId" value={story.id} />
          <input type="hidden" name="storySlug" value={story.slug} />

          {/* Character Avatar Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Ảnh Chân Dung / Avatar Nhân Vật
            </label>
            <ImageUpload name="avatarUrl" />
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
                placeholder="VD: Lâm Phong"
                className="w-full min-h-[44px] bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Vai Trò / Thân Phận
              </label>
              <input
                type="text"
                name="role"
                placeholder="VD: Nam chính / Chủ tịch / Thánh nữ"
                className="w-full min-h-[44px] bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
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
              placeholder="VD: Phong ca, Lâm Thánh Tử, Tiểu Phong"
              className="w-full min-h-[44px] bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
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
              rows={3}
              placeholder="VD: Đệ nhất thánh tử Thái Sơ Thánh Địa. Tính cách quyết đoán, sắc bén..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm resize-none leading-relaxed"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto min-h-[48px] bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold py-3 px-8 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_2px_15px_rgba(212,175,55,0.25)] text-sm sm:text-base ml-auto flex items-center justify-center"
            >
              Lưu Nhân Vật
            </button>
          </div>
        </form>
      </div>

      {/* Characters List Table */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>Danh Sách Nhân Vật Đã Tạo ({story._count.characters})</span>
          </h3>
        </div>

        <CharacterListManager
          characters={story.characters}
          storySlug={story.slug}
          storyId={story.id}
          totalCharacters={story._count.characters}
        />
      </div>
    </div>
  );
}

