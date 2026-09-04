"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface DeleteButtonProps {
  message?: string;
  className?: string;
  label?: string;
}

export function DeleteButton({ 
  message = "Bạn có chắc muốn xóa?",
  className,
  label = "Xóa"
}: DeleteButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={
        className || 
        "text-rose-400 hover:text-rose-300 font-medium inline-flex items-center justify-center gap-1.5 disabled:opacity-50 min-h-[38px] px-2.5 py-1.5 rounded-lg transition-all"
      }
      onClick={(e) => {
        if (!confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 className="w-4 h-4 shrink-0" />
      <span>{pending ? "Đang xóa..." : label}</span>
    </button>
  );
}
