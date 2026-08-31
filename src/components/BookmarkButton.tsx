"use client";

import { useState } from "react";
import { toggleBookmark } from "@/app/actions/library";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";

export function BookmarkButton({ storyId, initialBookmarked }: { storyId: string, initialBookmarked: boolean }) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const res = await toggleBookmark(storyId);
    if (res.success) {
      setIsBookmarked(res.isBookmarked ?? false);
      router.refresh();
    } else {
      if (res.message === "Yêu cầu đăng nhập") {
        alert("Vui lòng đăng nhập để lưu truyện!");
      }
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center justify-center gap-2 h-12 min-h-[48px] px-6 rounded-xl font-extrabold text-sm sm:text-base border transition-all duration-300 w-full xs:w-auto active:scale-98 cursor-pointer ${
        isBookmarked 
          ? "bg-[#d4af37]/20 border-[#d4af37]/60 text-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.25)]" 
          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
      }`}
    >
      <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? "fill-current" : ""}`} />
      {isBookmarked ? "Đã Lưu Tủ Sách" : "Lưu Vào Tủ Sách"}
    </button>
  );
}
