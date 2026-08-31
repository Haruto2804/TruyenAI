import Link from "next/link";
import { Settings, BookOpen, ShieldAlert } from "lucide-react";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Role-Based Authorization Guard
  if (!session?.user || (session.user as any).role !== "ADMIN") {
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
    <div className="min-h-full bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="bg-black/40 border-b border-white/10 p-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
          <div className="p-1.5 bg-[#d4af37]/10 rounded-lg">
            <Settings className="w-5 h-5 text-[#d4af37]" />
          </div>
          <span>Admin Studio</span>
        </h2>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/admin" className="text-slate-400 hover:text-[#d4af37] transition-colors font-medium">
            Quản lý truyện
          </Link>
          <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
            <BookOpen className="w-4 h-4 text-[#d4af37]" /> Xem Website
          </Link>
        </div>
      </div>
      <div className="p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
