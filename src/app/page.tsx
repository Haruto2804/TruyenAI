import Link from "next/link";
import prisma from "@/lib/prisma";
import { BookOpen } from "lucide-react";

export default async function Home() {
  const stories = await prisma.story.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { chapters: true }
      }
    }
  });

  return (
    <div className="space-y-8">
      <section className="text-center py-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Kho Tàng <span className="text-[#d4af37]">Kỳ Thư</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Đọc truyện mượt mà, không quảng cáo, tối ưu 100% cho thiết bị di động.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[#d4af37]" /> Mới Cập Nhật
          </h2>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <p className="text-slate-400">Chưa có truyện nào được đăng tải.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Link key={story.id} href={`/truyen/${story.slug}`}>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800 transition-all hover:border-slate-600 group">
                  <h3 className="font-bold text-lg text-slate-200 group-hover:text-[#d4af37] transition-colors line-clamp-1 mb-2">
                    {story.title}
                  </h3>
                  <div className="flex items-center text-sm text-slate-400 mb-3 gap-3">
                    <span className="bg-slate-900 px-2 py-1 rounded text-xs">
                      {story.genre || 'Tiên Hiệp'}
                    </span>
                    <span>{story._count.chapters} chương</span>
                  </div>
                  {story.summary && (
                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                      {story.summary}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
