import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateStory } from "@/app/admin/actions";

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const story = await prisma.story.findUnique({
    where: { slug: slug },
  });

  if (!story) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h3 className="text-xl font-semibold text-white">Sửa Truyện</h3>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <form action={updateStory} className="space-y-6">
          <input type="hidden" name="id" value={story.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-slate-300">Tên truyện</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                defaultValue={story.title}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="genre" className="block text-sm font-medium text-slate-300">Thể loại</label>
              <input 
                type="text" 
                id="genre" 
                name="genre"
                defaultValue={story.genre || ""}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="summary" className="block text-sm font-medium text-slate-300">Tóm tắt / Giới thiệu</label>
            <textarea 
              id="summary" 
              name="summary" 
              defaultValue={story.summary || ""}
              required
              rows={5}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
            >
              Cập Nhật Truyện
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
