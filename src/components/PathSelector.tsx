"use client";

import { useState } from "react";
import { updateUserPath } from "@/app/actions";
import { PATH_NAMES, PathType } from "@/lib/levels";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Check, Sparkles } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_2px_15px_rgba(212,175,55,0.25)] hover:brightness-110 disabled:opacity-50 min-h-[44px]"
    >
      {pending ? "Đang lưu..." : "Lưu Hệ Tu Luyện"}
    </button>
  );
}

export function PathSelector({ currentPath }: { currentPath: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState(currentPath);
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData: FormData) => {
    const newPath = formData.get("path") as string;
    const res = await updateUserPath(newPath);
    if (res.success) {
      setMessage("Đã cập nhật Hệ Tu Luyện thành công!");
      router.refresh();
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {(Object.entries(PATH_NAMES) as [PathType, string][]).map(([key, name]) => {
          const isSelected = selected === key;
          return (
            <label 
              key={key} 
              className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between min-h-[52px] select-none ${
                isSelected 
                  ? "border-[#d4af37] bg-[#d4af37]/15 shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
                  : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <input 
                type="radio" 
                name="path" 
                value={key} 
                checked={isSelected} 
                onChange={() => setSelected(key)}
                className="hidden"
              />
              <div className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${isSelected ? "text-[#d4af37]" : "text-slate-500"}`} />
                <span>Hệ {name}</span>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[#d4af37] text-slate-950 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </label>
          );
        })}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <SubmitButton />
        {message && (
          <span className="text-emerald-400 text-xs sm:text-sm font-semibold flex items-center gap-1.5">
            <Check className="w-4 h-4" /> {message}
          </span>
        )}
      </div>
    </form>
  );
}
