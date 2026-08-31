"use client";

import { useState } from "react";
import { updateDisplayName } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Edit2, Check, X } from "lucide-react";

export function DisplayNameForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Tên không được để trống");
      return;
    }
    if (name.trim() === initialName) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    setError("");
    const res = await updateDisplayName(name);
    
    if (res.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      setError(res.message || "Có lỗi xảy ra");
    }
    setLoading(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2.5">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{initialName}</h2>
        <button 
          type="button"
          onClick={() => setIsEditing(true)}
          className="p-2 text-slate-400 hover:text-[#d4af37] bg-white/5 hover:bg-white/10 transition-all rounded-xl border border-white/5 min-w-[36px] min-h-[36px] flex items-center justify-center"
          title="Đổi tên hiển thị"
          aria-label="Đổi tên hiển thị"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-xs">
      <div className="flex items-center gap-2">
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          className="bg-black/60 border border-[#d4af37]/40 rounded-xl px-3.5 py-2 text-white text-base font-bold flex-1 focus:outline-none focus:border-[#d4af37] min-h-[44px]"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setName(initialName);
              setIsEditing(false);
              setError("");
            }
          }}
        />
        <button 
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Lưu"
        >
          <Check className="w-4 h-4" />
        </button>
        <button 
          type="button"
          onClick={() => {
            setName(initialName);
            setIsEditing(false);
            setError("");
          }}
          disabled={loading}
          className="p-2.5 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Hủy"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
    </div>
  );
}
