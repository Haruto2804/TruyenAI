import { signIn, signOut, auth } from "@/auth";
import { getUserLevel, getNextLevelExp, getUserTitle, PathType } from "@/lib/levels";
import Link from "next/link";
import { UserCircle, Library } from "lucide-react";

export async function UserMenu() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          Đăng Nhập
        </button>
      </form>
    );
  }

  const exp = (session.user as any).exp || 0;
  const path = ((session.user as any).path as PathType) || "TIEN_HIEP";
  const displayName = (session.user as any).displayName || session.user.name || "User";
  const linhThach = (session.user as any).linhThach || 0;
  
  const currentLevel = getUserLevel(exp);
  const nextLevelExp = getNextLevelExp(exp);
  const title = getUserTitle(exp, path);
  
  // Calculate progress percentage
  let progress = 100;
  if (nextLevelExp) {
    const prevLevelExp = currentLevel.expRequired;
    progress = Math.max(0, Math.min(100, ((exp - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100));
  }

  const isAdmin = (session.user as any).role === "ADMIN";

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Admin Studio Quick Link (Only for ADMIN) */}
      {isAdmin && (
        <Link 
          href="/admin" 
          className="flex items-center gap-1.5 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/40 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:scale-105"
          title="Khu Vực Quản Trị"
        >
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
          <span>Admin</span>
        </Link>
      )}

      {/* Level Info */}
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-xs font-semibold text-emerald-400">{title}</span>
        <div className="flex items-center gap-2 w-32">
          <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 whitespace-nowrap">
            {exp}{nextLevelExp ? `/${nextLevelExp}` : ' (Max)'}
          </span>
        </div>
      </div>

      {/* Avatar & Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link 
          href="/tu-truyen" 
          className="text-slate-400 hover:text-[#d4af37] transition-colors p-2 rounded-full hover:bg-white/5"
          title="Tủ Truyện"
        >
          <Library className="w-5 h-5" />
        </Link>
        <Link href="/profile" className="flex items-center gap-2 group" title="Hồ Sơ">
          {session.user.image ? (
            <img 
              src={session.user.image} 
              alt={displayName} 
              className="w-8 h-8 rounded-full border border-white/10 group-hover:border-[#d4af37] transition-colors"
            />
          ) : (
            <UserCircle className="w-8 h-8 text-slate-400 group-hover:text-[#d4af37] transition-colors" />
          )}
        </Link>
      </div>
    </div>
  );
}
