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
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium border w-full md:w-auto ${
        isBookmarked 
          ? "bg-slate-800 border-indigo-500 text-indigo-400 hover:bg-slate-700" 
          : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
      }`}
    >
      <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
      {isBookmarked ? "Đã lưu tủ" : "Thêm vào tủ"}
    </button>
  );
}
