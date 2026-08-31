"use client";

import { useState } from "react";
import { purchaseChapter, donateToStory } from "@/app/actions/economy";
import { useRouter } from "next/navigation";
import { Lock, Heart, Gem } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-black/40 rounded-2xl border border-[#d4af37]/30 text-center my-4">
      <div className="p-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20 mb-4">
        <Lock className="w-10 h-10 text-[#d4af37]" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Chương Khóa (VIP)</h3>
      <p className="text-slate-400 text-sm sm:text-base mb-6 max-w-md">
        Nội dung chương này thuộc bản quyền tác giả. Mở khóa bằng Linh Thạch để tiếp tục thưởng thức và ủng hộ tác phẩm.
      </p>
      
      <button 
        onClick={handleUnlock}
        disabled={loading}
        className="flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-amber-400 hover:brightness-110 text-slate-950 font-black py-3.5 px-8 rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.3)] transition-all active:scale-95 disabled:opacity-50 text-base"
      >
        <span>{loading ? "Đang mở khóa..." : "Mở khóa ngay"}</span>
        <span className="font-mono text-lg font-extrabold ml-1">{price}</span>
        <Gem className="w-5 h-5 text-slate-950 fill-current" />
      </button>
      {error && <p className="text-red-400 mt-4 text-sm font-medium">{error}</p>}
    </div>
  );
}

export function DonateButton({ storyId }: { storyId: string }) {
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleDonate = async () => {
    setLoading(true);
    setMsg("");
    const res = await donateToStory(storyId, amount);
    setLoading(false);
    
    if (res.success) {
      setMsg("Đã tặng thưởng thành công! Cảm ơn đạo hữu.");
      router.refresh();
      setTimeout(() => setMsg(""), 3000);
    } else {
      setMsg(res.message || "Lỗi tặng thưởng");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white/[0.02] border border-white/10 rounded-2xl mt-8">
      <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/20 mb-3">
        <Heart className="w-6 h-6 text-rose-400 fill-current" />
      </div>
      <h3 className="text-lg font-bold text-slate-100 mb-4">Tặng Thưởng Tác Giả</h3>
      
      <div className="flex items-center gap-2 mb-5 bg-black/40 p-1.5 rounded-xl border border-white/5">
        {[50, 100, 500, 1000].map(val => (
          <button
            key={val}
            onClick={() => setAmount(val)}
            className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              amount === val 
                ? "bg-[#d4af37] text-slate-950 shadow-sm" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {val}
          </button>
        ))}
      </div>
      
      <button 
        onClick={handleDonate}
        disabled={loading}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-amber-300 font-bold py-2.5 px-6 rounded-xl border border-white/10 hover:border-[#d4af37]/40 transition-all disabled:opacity-50 text-sm"
      >
        <Gem className="w-4 h-4 text-[#d4af37] fill-current" />
        <span>Tặng {amount} Linh Thạch</span>
      </button>
      
      {msg && <p className={`mt-3 text-sm font-medium ${msg.includes("thành công") ? "text-emerald-400" : "text-red-400"}`}>{msg}</p>}
    </div>
  );
}
