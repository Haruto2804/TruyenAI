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
      className={`flex items-center justify-center gap-1.5 sm:gap-2 h-12 min-h-[48px] px-3.5 sm:px-6 rounded-xl font-extrabold text-xs sm:text-base border transition-all duration-300 active:scale-98 cursor-pointer whitespace-nowrap shrink-0 ${
        isBookmarked 
          ? "bg-[#d4af37]/20 border-[#d4af37]/60 text-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.25)]" 
          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
      }`}
      title={isBookmarked ? "Đã lưu vào tủ sách" : "Lưu vào tủ sách"}
    >
      <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isBookmarked ? "fill-current" : ""}`} />
      <span>{isBookmarked ? "Đã Lưu" : "Lưu Tủ Sách"}</span>
    </button>
  );
}
