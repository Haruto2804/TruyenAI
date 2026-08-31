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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/story/${story.slug}`} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h3 className="text-xl font-semibold text-white">
          Đăng Chương Mới: <span className="text-indigo-400">{story.title}</span>
        </h3>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <form action={createChapter} className="space-y-6">
          <input type="hidden" name="storyId" value={story.id} />
          <input type="hidden" name="storySlug" value={story.slug} />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2 md:col-span-1">
              <label htmlFor="chapterNo" className="block text-sm font-medium text-slate-300">Chương số</label>
              <input 
                type="number" 
                id="chapterNo" 
                name="chapterNo" 
                defaultValue={nextChapterNo}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-slate-300">Tiêu đề chương</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="VD: Bí cảnh xuất thế..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-slate-300">Nội dung chương (Dán từ AI vào đây)</label>
            <textarea 
              id="content" 
              name="content" 
              required
              rows={25}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-4 text-slate-300 leading-loose focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-serif"
              placeholder="Nhập nội dung truyện..."
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
            >
              Đăng Chương
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
