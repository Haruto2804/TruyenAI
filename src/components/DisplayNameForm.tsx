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
      <div className="flex items-center gap-2 group">
        <h2 className="text-2xl font-bold text-white">{initialName}</h2>
        <button 
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-slate-500 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-slate-800"
          title="Đổi tên hiển thị"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xl font-bold w-48 focus:outline-none focus:border-indigo-500"
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
          onClick={handleSave}
          disabled={loading}
          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
        </button>
        <button 
          onClick={() => {
            setName(initialName);
            setIsEditing(false);
            setError("");
          }}
          disabled={loading}
          className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
