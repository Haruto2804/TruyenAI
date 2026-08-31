import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { getUserLevel, getNextLevelExp, getUserTitle, PathType } from "@/lib/levels";
import { PathSelector } from "@/components/PathSelector";
import { DisplayNameForm } from "@/components/DisplayNameForm";
import { LogOut, Sparkles, Trophy, Flame, User } from "lucide-react";

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
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Hồ Sơ Tu Giả
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Thông Tin Đạo Hữu
          </h1>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 border border-white/10 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all min-h-[44px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng Xuất</span>
          </button>
        </form>
      </div>

      {/* User Hero Profile Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start shadow-xl">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-[#d4af37]/40 shadow-[0_0_30px_rgba(212,175,55,0.2)] shrink-0 bg-slate-950">
          {session.user.image ? (
            <img 
              src={session.user.image} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#d4af37]">
              <User className="w-12 h-12 opacity-60" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        <div className="flex-1 space-y-4 text-center sm:text-left w-full">
          <div className="flex flex-col items-center sm:items-start">
            <DisplayNameForm initialName={(session.user as any).displayName || session.user.name || "User"} />
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{session.user.email}</p>
          </div>
          
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-black/40 border border-white/10 rounded-2xl px-4 py-3 shadow-inner">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Cảnh Giới Hiện Tại:
            </span>
            <div className="text-base sm:text-lg font-extrabold text-[#d4af37] flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{title} (Cấp {currentLevel.level})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tu Luyện Progress Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Tiến Độ Tu Luyện
          </h3>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {Math.round(progress)}% Hoàn Thành
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs sm:text-sm text-slate-300 font-medium">
            <span>Điểm EXP: <strong className="text-emerald-400 font-mono text-sm">{exp}</strong></span>
            <span>Cần đạt: <strong className="text-slate-100 font-mono text-sm">{nextLevelExp || 'Tối Đa'}</strong></span>
          </div>

          <div className="h-4 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-[#d4af37] rounded-full transition-all duration-1000 shadow-md"
              style={{ width: `${progress}%` }}
            />
          </div>

          {nextLevelExp && (
            <p className="text-xs text-slate-400 mt-2">
              Đạo hữu cần đọc thêm <strong className="text-amber-300">{Math.ceil((nextLevelExp - exp) / 10)}</strong> chương truyện nữa để đột phá cảnh giới tiếp theo.
            </p>
          )}
        </div>
      </div>

      {/* Path Selector Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
        <h3 className="text-lg sm:text-xl font-bold text-white border-b border-white/5 pb-4">
          Đổi Hệ Tu Luyện
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Danh hiệu của bạn sẽ thay đổi tương ứng với Hệ tu chân mà bạn chọn. Việc đổi Hệ không làm mất điểm EXP đã tích lũy.
        </p>
        <PathSelector currentPath={path} />
      </div>

      {/* Cultivation Hierarchy Chart */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
        <h3 className="text-lg sm:text-xl font-bold text-white border-b border-white/5 pb-4">
          Sơ Đồ Phân Cấp Tu Luyện
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          Bảng xếp hạng cảnh giới dành cho các bậc đại năng thiên kiêu trên con đường chinh phục đỉnh cao.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black/40">
          <img 
            src="/image.png" 
            alt="Sơ đồ Phân cấp Tu luyện" 
            className="w-full h-auto object-cover hover:scale-102 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
}
