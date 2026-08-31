import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { getUserLevel, getNextLevelExp, getUserTitle, PathType } from "@/lib/levels";
import { PathSelector } from "@/components/PathSelector";
import { DisplayNameForm } from "@/components/DisplayNameForm";
import { LogOut } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const exp = (session.user as any).exp || 0;
  const path = ((session.user as any).path as PathType) || "TIEN_HIEP";
  
  const currentLevel = getUserLevel(exp);
  const nextLevelExp = getNextLevelExp(exp);
  const title = getUserTitle(exp, path);
  
  let progress = 100;
  if (nextLevelExp) {
    const prevLevelExp = currentLevel.expRequired;
    progress = Math.max(0, Math.min(100, ((exp - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Hồ Sơ Đạo Hữu</h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className="text-slate-400 hover:text-red-400 flex items-center gap-2 transition-colors">
            <LogOut className="w-5 h-5" /> Đăng xuất
          </button>
        </form>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
        {session.user.image && (
          <img 
            src={session.user.image} 
            alt="Avatar" 
            className="w-32 h-32 rounded-full border-4 border-slate-800 shadow-xl"
          />
        )}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <DisplayNameForm initialName={(session.user as any).displayName || session.user.name || "User"} />
            <p className="text-slate-400 mt-1">{session.user.email}</p>
          </div>
          
          <div className="inline-block bg-slate-950 border border-slate-800 rounded-lg px-4 py-2">
            <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Danh hiệu hiện tại</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">{title} (Cấp {currentLevel.level})</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-semibold text-white border-b border-slate-800 pb-4">Tiến độ Tu Luyện</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">EXP hiện tại: <strong className="text-emerald-400">{exp}</strong></span>
            <span className="text-slate-400">Cần đạt: <strong>{nextLevelExp || 'Tối đa'}</strong></span>
          </div>
          <div className="h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          {nextLevelExp && (
            <p className="text-sm text-slate-500 mt-2">
              Bạn cần đọc thêm {Math.ceil((nextLevelExp - exp) / 10)} chương nữa để thăng cấp.
            </p>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-semibold text-white border-b border-slate-800 pb-4">Đổi Hệ Tu Luyện</h3>
        <p className="text-slate-400 text-sm">
          Danh hiệu của bạn sẽ thay đổi tương ứng với Hệ mà bạn chọn. Việc đổi Hệ không làm mất EXP hiện tại của bạn.
        </p>
        <PathSelector currentPath={path} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-semibold text-white border-b border-slate-800 pb-4">Sơ đồ Phân cấp Tu luyện</h3>
        <p className="text-slate-400 text-sm">
          Bảng xếp hạng cảnh giới dành cho các bậc đại năng thiên kiêu trên con đường chinh phục đỉnh cao.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
          <img 
            src="/image.png" 
            alt="Sơ đồ Phân cấp Tu luyện" 
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>
    </div>
  );
}
