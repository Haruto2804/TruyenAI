"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime errors for server observability
    console.error("[Runtime Error Boundary]:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="relative max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-slate-950/90 border border-rose-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl text-center space-y-6">
        {/* Mystic Aura */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/10 border border-rose-500/40 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.2)]">
          <AlertTriangle className="w-12 h-12 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-rose-400 font-bold">
            Thần Niệm Bị Gián Đoạn
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
            Khí Tức Bất Ổn
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            Hệ thống gặp sự cố trong quá trình giao hòa thần niệm với linh mạch. Đạo hữu có thể thử ngưng tụ lại hoặc quay về Tàng Kinh Các.
          </p>
          {error.digest && (
            <p className="text-[11px] text-slate-500 font-mono">
              Mã ấn: {error.digest}
            </p>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử Tái Kết Nối</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm border border-white/10 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
