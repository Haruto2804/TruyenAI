import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateChapter } from "@/app/admin/actions";

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapterId: string }>;
}) {
  const { slug, chapterId } = await params;

  const story = await prisma.story.findUnique({
    where: { slug: slug },
  });

  if (!story) {
    notFound();
  }

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
  });

  if (!chapter || chapter.storyId !== story.id) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/story/${story.slug}`} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h3 className="text-xl font-semibold text-white">
          Sửa Chương: <span className="text-indigo-400">{story.title}</span>
        </h3>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <form action={updateChapter} className="space-y-6">
          <input type="hidden" name="id" value={chapter.id} />
          <input type="hidden" name="storySlug" value={story.slug} />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2 md:col-span-1">
              <label htmlFor="chapterNo" className="block text-sm font-medium text-slate-300">Chương số</label>
              <input 
                type="number" 
                id="chapterNo" 
                name="chapterNo" 
                defaultValue={chapter.chapterNo}
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
                defaultValue={chapter.title}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-slate-300">Nội dung chương</label>
            <textarea 
              id="content" 
              name="content" 
              defaultValue={chapter.content}
              required
              rows={25}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-4 text-slate-300 leading-loose focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-serif"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
            >
              Cập Nhật Chương
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
