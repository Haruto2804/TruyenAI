import Link from "next/link";
import { Settings, BookOpen, ShieldAlert } from "lucide-react";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const isDev = process.env.NODE_ENV === "development";
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  // Role-Based Authorization Guard (Enforced in production)
  if (!isAdmin && !isDev) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-black/40 border border-rose-500/30 rounded-3xl text-center space-y-4 backdrop-blur-xl shadow-2xl">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 w-fit mx-auto">
          <ShieldAlert className="w-12 h-12 text-rose-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Quyền Truy Cập Bị Từ Chối (403)</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Khu vực Quản trị chỉ dành riêng cho Quản Trị Viên (Admin). Vui lòng đăng nhập bằng tài khoản được cấp quyền để tiếp tục.
        </p>
        <div className="pt-2">
          <Link 
            href="/"
            className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-slate-200 font-bold px-6 py-2.5 rounded-xl border border-white/10 transition-all text-sm"
          >
            Quay Về Trang Chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-950/70 sm:bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="bg-black/50 border-b border-white/10 p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2.5 group">
            <div className="p-2 bg-[#d4af37]/15 rounded-xl border border-[#d4af37]/30 group-hover:bg-[#d4af37]/25 transition-all">
              <Settings className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight">Admin Studio</span>
              <span className="text-[10px] text-slate-400 font-normal sm:hidden">Hệ thống quản trị di động</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link 
            href="/admin" 
            className="flex-1 sm:flex-none justify-center inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#d4af37]/15 text-slate-200 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/30 transition-all text-xs sm:text-sm font-semibold active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span>Quản lý truyện</span>
          </Link>
          <Link 
            href="/" 
            className="flex-1 sm:flex-none justify-center inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all text-xs sm:text-sm font-semibold active:scale-95"
          >
            <span>Xem Website</span>
          </Link>
        </div>
      </div>
      <div className="p-3.5 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
