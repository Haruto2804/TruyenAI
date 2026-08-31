"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, Gem, User, ShieldAlert } from "lucide-react";

interface MobileBottomNavProps {
  isAdmin?: boolean;
}

export function MobileBottomNav({ isAdmin = false }: MobileBottomNavProps) {
  const pathname = usePathname();

  // Hide bottom nav when in full chapter reading mode to maximize screen space for text
  const isReadingChapter = /^\/truyen\/[^/]+\/\d+$/.test(pathname);
  if (isReadingChapter) {
    return null;
  }

  const navItems = [
    {
      label: "Trang Chủ",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Tủ Truyện",
      href: "/tu-truyen",
      icon: Library,
      isActive: pathname.startsWith("/tu-truyen"),
    },
    {
      label: "Hồ Sơ",
      href: "/profile",
      icon: User,
      isActive: pathname.startsWith("/profile"),
    },
  ];

  if (isAdmin) {
    navItems.push({
      label: "Admin",
      href: "/admin",
      icon: ShieldAlert,
      isActive: pathname.startsWith("/admin"),
    });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#09090b]/85 backdrop-blur-2xl border-t border-white/10 px-2 py-1 shadow-[0_-10px_30px_rgba(0,0,0,0.7)] safe-area-bottom">
      <nav className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] px-1 py-1 rounded-xl transition-all duration-200 outline-none select-none ${
                item.isActive
                  ? "text-[#d4af37] font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    item.isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.75]"
                  }`}
                />
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#d4af37] rounded-full shadow-[0_0_8px_#d4af37]" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
