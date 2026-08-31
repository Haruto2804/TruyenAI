import { createStory } from "@/app/admin/actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewStoryPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h3 className="text-xl font-semibold text-white">Thêm Truyện Mới</h3>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <form action={createStory} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-300">Tên Truyện</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              placeholder="VD: Phàm Nhân Tu Tiên"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="genre" className="block text-sm font-medium text-slate-300">Thể Loại</label>
            <input 
              type="text" 
              id="genre" 
              name="genre" 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              placeholder="VD: Tiên Hiệp"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="summary" className="block text-sm font-medium text-slate-300">Giới Thiệu (Tóm tắt)</label>
            <textarea 
              id="summary" 
              name="summary" 
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              placeholder="Nhập tóm tắt truyện..."
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
            >
              Tạo Truyện
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
