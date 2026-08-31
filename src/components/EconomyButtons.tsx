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
    <div className="flex flex-col items-center justify-center p-12 bg-slate-800/50 rounded-2xl border-2 border-amber-500/20 text-center">
      <Lock className="w-16 h-16 text-amber-500/50 mb-4" />
      <h3 className="text-xl font-bold text-slate-200 mb-2">Chương VIP</h3>
      <p className="text-slate-400 mb-6 max-w-md">
        Nội dung chương này đã được khóa. Mở khóa để ủng hộ tác giả và tiếp tục theo dõi câu chuyện.
      </p>
      
      <button 
        onClick={handleUnlock}
        disabled={loading}
        className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
      >
        <span>{loading ? "Đang xử lý..." : "Mở khóa bằng"}</span>
        <span className="font-black text-lg">{price}</span>
        <span>💎</span>
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
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-2xl mt-8">
      <Heart className="w-8 h-8 text-rose-500 mb-3" />
      <h3 className="text-lg font-bold text-slate-200 mb-4">Tặng Thưởng Tác Giả</h3>
      <div className="flex items-center gap-2 mb-4 bg-slate-800 p-1.5 rounded-full">
        {[50, 100, 500, 1000].map(val => (
          <button
            key={val}
            onClick={() => setAmount(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              amount === val ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-700"
            }`}
          >
            {val}
          </button>
        ))}
      </div>
      
      <button 
        onClick={handleDonate}
        disabled={loading}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded-full border border-slate-700 transition-colors disabled:opacity-50"
      >
        <Gem className="w-4 h-4 text-amber-400" />
        <span>Tặng {amount} 💎</span>
      </button>
      
      {msg && <p className={`mt-3 text-sm font-medium ${msg.includes("thành công") ? "text-emerald-400" : "text-red-400"}`}>{msg}</p>}
    </div>
  );
}
