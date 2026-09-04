import Link from "next/link";
import { Compass, BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="relative max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-slate-950/80 border border-[#d4af37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl text-center space-y-6">
        {/* Mystic Aura */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-amber-500/10 border border-[#d4af37]/40 text-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.2)]">
          <Compass className="w-12 h-12 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-bold">
            Bí Cảnh Không Tồn Tại (404)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
            Lạc Vào Hư Vô Giới
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            Không gian điên đảo, tọa độ này không tìm thấy bất kỳ bí tịch hay đạo tích nào. Có thể chương truyện chưa khai mở hoặc đã tan biến vào hư không.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-500 text-slate-950 font-bold text-sm hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Về Tàng Kinh Các</span>
          </Link>
          <Link
            href="/tu-truyen"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm border border-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tủ Truyện Đã Lưu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
