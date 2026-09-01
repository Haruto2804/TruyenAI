"use client";

import { useState } from "react";
import { purchaseChapter } from "@/app/actions/economy";
import { useRouter } from "next/navigation";
import { Lock, Gem } from "lucide-react";

export function UnlockButton({ chapterId, price }: { chapterId: string, price: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleUnlock = async () => {
    setLoading(true);
    setError("");
    const res = await purchaseChapter(chapterId, price);
    setLoading(false);
    
    if (res.success) {
      router.refresh();
    } else {
      setError(res.message || "Lỗi mở khóa");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-black/40 rounded-2xl border border-[#d4af37]/30 text-center my-4">
      <div className="p-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20 mb-4">
        <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37]" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Chương Khóa (VIP)</h3>
      <p className="text-slate-400 text-xs sm:text-base mb-6 max-w-md">
        Nội dung chương này thuộc bản quyền tác giả. Mở khóa bằng Linh Thạch để tiếp tục thưởng thức và ủng hộ tác phẩm.
      </p>
      
      <button 
        onClick={handleUnlock}
        disabled={loading}
        className="flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-amber-400 hover:brightness-110 text-slate-950 font-black py-3.5 px-6 sm:px-8 rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.3)] transition-all active:scale-95 disabled:opacity-50 text-sm sm:text-base"
      >
        <span>{loading ? "Đang mở khóa..." : "Mở khóa ngay"}</span>
        <span className="font-mono text-base sm:text-lg font-extrabold ml-1">{price}</span>
        <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 fill-current" />
      </button>
      {error && <p className="text-red-400 mt-4 text-xs sm:text-sm font-medium">{error}</p>}
    </div>
  );
}
