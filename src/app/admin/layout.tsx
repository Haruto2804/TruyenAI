import Link from "next/link";
import { Settings, BookOpen } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" /> Admin Studio
        </h2>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
            Quản lý truyện
          </Link>
          <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
            <BookOpen className="w-4 h-4" /> Xem Website
          </Link>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
