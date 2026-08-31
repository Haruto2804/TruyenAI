"use client";

import { useState } from "react";
import { updateUserPath } from "@/app/actions";
import { PATH_NAMES, PathType } from "@/lib/levels";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-lg shadow-indigo-900/20 disabled:opacity-50"
    >
      {pending ? "Đang lưu..." : "Lưu thay đổi"}
    </button>
  );
}

export function PathSelector({ currentPath }: { currentPath: string }) {
  const [selected, setSelected] = useState(currentPath);
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData: FormData) => {
    const newPath = formData.get("path") as string;
    const res = await updateUserPath(newPath);
    if (res.success) {
      setMessage("Đã cập nhật Hệ Tu Luyện thành công!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.entries(PATH_NAMES) as [PathType, string][]).map(([key, name]) => (
          <label 
            key={key} 
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
              selected === key 
                ? "border-emerald-500 bg-emerald-500/10" 
                : "border-slate-800 bg-slate-900 hover:border-slate-700"
            }`}
          >
            <input 
              type="radio" 
              name="path" 
              value={key} 
              checked={selected === key} 
              onChange={() => setSelected(key)}
              className="hidden"
            />
            <div className="text-center font-medium text-slate-200">Hệ {name}</div>
          </label>
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        <SubmitButton />
        {message && <span className="text-emerald-400 text-sm">{message}</span>}
      </div>
    </form>
  );
}
