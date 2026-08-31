import { signIn, signOut, auth } from "@/auth";
import { getUserLevel, getNextLevelExp, getUserTitle, PathType } from "@/lib/levels";
import Link from "next/link";
import { UserCircle } from "lucide-react";

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
  
  const currentLevel = getUserLevel(exp);
  const nextLevelExp = getNextLevelExp(exp);
  const title = getUserTitle(exp, path);
  
  // Calculate progress percentage
  let progress = 100;
  if (nextLevelExp) {
    const prevLevelExp = currentLevel.expRequired;
    progress = Math.max(0, Math.min(100, ((exp - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100));
  }

  return (
    <div className="flex items-center gap-4">
      {/* Level Info */}
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-xs font-semibold text-emerald-400">{title}</span>
        <div className="flex items-center gap-2 w-32">
          <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
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
      <Link href="/profile" className="flex items-center gap-2 group">
        {session.user.image ? (
          <img 
            src={session.user.image} 
            alt={session.user.name || "User"} 
            className="w-8 h-8 rounded-full border border-slate-700 group-hover:border-indigo-500 transition-colors"
          />
        ) : (
          <UserCircle className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors" />
        )}
      </Link>
    </div>
  );
}
