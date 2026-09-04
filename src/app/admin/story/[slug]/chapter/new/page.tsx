import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createChapter } from "@/app/admin/actions";

export default async function NewChapterPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  
  const story = await prisma.story.findUnique({
    where: { slug: slug },
  });

  if (!story) {
    notFound();
  }

  const nextChapterNo = resolvedSearchParams.next ? parseInt(resolvedSearchParams.next, 10) : 1;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link 
          href={`/admin/story/${story.slug}`} 
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10 active:scale-95 shrink-0"
          title="Quay lại danh sách chương"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h3 className="text-lg sm:text-xl font-bold text-white truncate">
          Đăng Chương Mới: <span className="text-[#d4af37]">{story.title}</span>
        </h3>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <form action={createChapter} className="space-y-5">
          <input type="hidden" name="storyId" value={story.id} />
          <input type="hidden" name="storySlug" value={story.slug} />

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-5">
            <div className="space-y-2 sm:col-span-1">
              <label htmlFor="chapterNo" className="block text-sm font-medium text-slate-300">
                Chương số <span className="text-rose-400">*</span>
              </label>
              <input 
                type="number" 
                id="chapterNo" 
                name="chapterNo" 
                defaultValue={nextChapterNo}
                required
                className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-base sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-2 sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-slate-300">
                Tiêu đề chương <span className="text-rose-400">*</span>
              </label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required
                className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37]"
                placeholder="VD: Huyết Vực Tranh Phong..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-slate-300">
              Nội dung chương (Dán từ AI vào đây) <span className="text-rose-400">*</span>
            </label>
            <textarea 
              id="content" 
              name="content" 
              required
              rows={14}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 leading-relaxed text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] font-serif"
              placeholder="Nhập nội dung truyện..."
            />
          </div>

          <div className="pt-3">
            <button 
              type="submit"
              className="w-full sm:w-auto min-h-[48px] bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold py-3 px-8 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_2px_15px_rgba(212,175,55,0.25)] text-sm sm:text-base ml-auto flex items-center justify-center"
            >
              Đăng Chương Mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
