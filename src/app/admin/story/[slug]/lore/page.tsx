import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookMarked, Plus, Sparkles, Tag } from "lucide-react";
import { createLore } from "@/app/admin/actions";
import { LoreListManager } from "@/components/LoreListManager";

export default async function StoryLorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const story = await prisma.story.findUnique({
    where: { slug },
    include: {
      lores: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!story) {
    notFound();
  }

  const categoryPresets = ["Độc Dược", "Bí Thuật", "Địa Danh", "Bảo Vật", "Thế Lực", "Cảnh Giới", "Huyết Mạch"];

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            href={`/admin/story/${story.slug}`}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5 flex items-center justify-center shrink-0"
            title="Quay lại chi tiết truyện"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-white flex flex-wrap items-center gap-2">
              <BookMarked className="w-5 h-5 sm:w-6 sm:h-6 text-[#d4af37] shrink-0" />
              <span>Bách Khoa Chú Giải:</span>
              <span className="text-[#d4af37] truncate">{story.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Thêm giải thích cho các khái niệm lạ, bí thuật, địa danh, độc dược để độc giả tra cứu X-Ray ngay khi đọc chương.
            </p>
          </div>
        </div>

        <Link
          href={`/truyen/${story.slug}`}
          className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 w-fit min-h-[40px] flex items-center shrink-0 self-end sm:self-auto"
        >
          Xem Trang Truyện
        </Link>
      </div>

      {/* Form: Add New Lore */}
      <div className="bg-black/30 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-xl shadow-xl">
        <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-5 sm:mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#d4af37]" /> Thêm Chú Giải / Khái Niệm Mới
        </h3>

        <form action={createLore} className="space-y-5 sm:space-y-6">
          <input type="hidden" name="storyId" value={story.id} />
          <input type="hidden" name="storySlug" value={story.slug} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Tên Khái Niệm / Thuật Ngữ <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="term"
                required
                placeholder="VD: Hắc Tử La Lan, Ma Đồng Giải Cấu..."
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
                list="category-suggestions"
                placeholder="VD: Độc Dược, Bí Thuật, Địa Danh..."
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
              />
              <datalist id="category-suggestions">
                {categoryPresets.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Từ Đồng Nghĩa / Biệt Danh Khác (Cách nhau bằng dấu phẩy)
            </label>
            <input
              type="text"
              name="aliases"
              placeholder="VD: Độc hoa tử la, Cực độc La Lan"
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm"
            />
            <p className="text-[11px] text-slate-500">
              Hệ thống sẽ tự động gạch chân tra cứu mọi từ khóa này trong nội dung chương đọc.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Lời Chú Giải / Định Nghĩa Dễ Hiểu <span className="text-rose-400">*</span>
            </label>
            <textarea
              name="definition"
              rows={3}
              required
              placeholder="VD: Loại độc dược ma thuật mạn tính làm tắc nghẽn kinh mạch và phân rã ma hạch một cách êm ái qua năm tháng..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 text-base sm:text-sm resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold px-8 py-3.5 min-h-[48px] rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_2px_15px_rgba(212,175,55,0.25)] text-sm flex items-center justify-center gap-2"
            >
              Lưu Chú Giải
            </button>
          </div>
        </form>
      </div>

      {/* Lore List Table */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>Danh Sách Chú Giải Đã Tạo ({story.lores.length})</span>
          </h3>
        </div>

        <LoreListManager
          lores={story.lores}
          storySlug={story.slug}
        />
      </div>
    </div>
  );
}
