"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function DeleteButton({ message = "Bạn có chắc muốn xóa?" }: { message?: string }) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="text-red-400 hover:text-red-300 font-medium flex items-center justify-end gap-1 disabled:opacity-50"
      onClick={(e) => {
        if (!confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 className="w-4 h-4" /> {pending ? "Đang xóa..." : "Xóa"}
    </button>
  );
}
