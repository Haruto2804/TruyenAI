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
      characters: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!story) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/story/${story.slug}`}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-[#d4af37]" />
              <span>Hồ Sơ Nhân Vật:</span>
              <span className="text-[#d4af37]">{story.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Thêm chân dung và tính cách nhân vật để kích hoạt tính năng tra cứu X-Ray khi đọc truyện.
            </p>
          </div>
        </div>

        <Link
          href={`/truyen/${story.slug}`}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 w-fit"
        >
          Xem Trang Truyện
        </Link>
      </div>

      {/* Form: Add New Character */}
      <div className="bg-black/30 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#d4af37]" /> Thêm Nhân Vật Mới
        </h3>

        <form action={createCharacter} className="space-y-6">
          <input type="hidden" name="storyId" value={story.id} />
          <input type="hidden" name="storySlug" value={story.slug} />

          {/* Character Avatar Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Ảnh Chân Dung / Avatar Nhân Vật
            </label>
            <ImageUpload name="avatarUrl" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Tên Nhân Vật <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="VD: Lâm Phong"
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
                placeholder="VD: Nam chính / Chủ tịch tập đoàn / Thánh nữ"
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
              placeholder="VD: Phong ca, Lâm Thánh Tử, Tiểu Phong, Phong thiếu"
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-sm"
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
              placeholder="VD: Đệ nhất thánh tử Thái Sơ Thánh Địa. Tính cách quyết đoán, sắc bén, không chịu luồn cúi..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-sm resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl hover:brightness-110 transition-all shadow-[0_2px_15px_rgba(212,175,55,0.25)] text-sm"
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
            <span>Danh Sách Nhân Vật Đã Tạo ({story.characters.length})</span>
          </h3>
        </div>

        <CharacterListManager
          characters={story.characters}
          storySlug={story.slug}
        />
      </div>
    </div>
  );
}

