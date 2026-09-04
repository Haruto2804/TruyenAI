import { createStory } from "@/app/admin/actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";

export default function NewStoryPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link 
          href="/admin" 
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10 active:scale-95 shrink-0"
          title="Quay lại"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h3 className="text-lg sm:text-xl font-bold text-white">Thêm Tiểu Thuyết Mới</h3>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <form action={createStory} className="space-y-5">
          
          {/* Cover Image Upload (Cloudinary) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Ảnh Bìa Truyện</label>
            <ImageUpload name="coverUrl" />
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-300">
              Tên Truyện <span className="text-rose-400">*</span>
            </label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              required
              className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37]"
              placeholder="VD: Phàm Nhân Tu Tiên"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="genre" className="block text-sm font-medium text-slate-300">Thể Loại</label>
            <input 
              type="text" 
              id="genre" 
              name="genre" 
              className="w-full min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37]"
              placeholder="VD: Tiên Hiệp, Huyền Huyễn"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="summary" className="block text-sm font-medium text-slate-300">Giới Thiệu (Tóm tắt)</label>
            <textarea 
              id="summary" 
              name="summary" 
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] leading-relaxed"
              placeholder="Nhập tóm tắt cốt truyện..."
            />
          </div>

          <div className="pt-3">
            <button 
              type="submit"
              className="w-full sm:w-auto min-h-[48px] bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold py-3 px-8 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_2px_15px_rgba(212,175,55,0.25)] text-sm sm:text-base ml-auto flex items-center justify-center"
            >
              Tạo Truyện Mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
