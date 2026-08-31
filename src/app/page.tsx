import Link from "next/link";
import prisma from "@/lib/prisma";
import { BookOpen, PackageOpen } from "lucide-react";

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
    <div className="space-y-10 sm:space-y-12 pb-28 sm:pb-12">
      {/* Hero Section */}
      <section className="text-center py-16 space-y-6 relative">
        {/* Glow effect behind title with design-spells pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-[#d4af37]/10 blur-[80px] rounded-full pointer-events-none animate-pulse" />
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white relative">
          Kho Tàng <span className="bg-gradient-to-r from-[#d4af37] via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">Kỳ Thư</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium">
          Đọc truyện mượt mà, không quảng cáo, tối ưu 100% cho thiết bị di động.
        </p>
      </section>

      {/* Main Content Section */}
      <section>
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 flex items-center gap-3">
            <div className="p-2 bg-[#d4af37]/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-[#d4af37]" strokeWidth={2.5} />
            </div>
            Mới Cập Nhật
          </h2>
        </div>

        {stories.length === 0 ? (
          /* ux-feedback: Proper Empty State with ux-copy tone */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            <PackageOpen className="size-16 text-slate-500 mb-4 opacity-50" strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-slate-200 mb-2">Chưa có gì ở đây cả!</h3>
            <p className="text-slate-400 font-medium max-w-sm mx-auto mb-6">
              Tàng thư các hiện đang trống. Hãy thử khám phá các tác phẩm kinh điển hoặc quay lại sau nhé.
            </p>
            <button className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl font-medium transition-colors border border-white/5 min-h-[44px]">
              Khám phá ngẫu nhiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {stories.map((story) => (
              <Link 
                key={story.id} 
                href={`/truyen/${story.slug}`} 
                className="group block outline-none"
                aria-label={`Đọc truyện ${story.title}`}
              >
                <div className="relative flex flex-col h-full overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[#d4af37]/60 group-hover:shadow-[0_15px_40px_rgba(212,175,55,0.2)] group-focus-visible:ring-2 group-focus-visible:ring-[#d4af37]">
                  
                  {/* Cover Image Thumbnail Container (Chuẩn tỉ lệ dọc 2:3 của bìa tiểu thuyết & manhwa) */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-950 shadow-lg border border-white/10">
                    {story.coverUrl ? (
                      <img
                        src={story.coverUrl}
                        alt={story.title}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      /* Stylized fantasy dark-gold placeholder */
                      <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
                          <BookOpen className="h-10 w-10 text-[#d4af37]/70" strokeWidth={1.75} />
                        </div>
                      </div>
                    )}

                    {/* Gradient Overlay for bottom text clarity */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />

                    {/* Genre Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-lg border border-white/10 bg-black/80 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-amber-200 backdrop-blur-md shadow-sm">
                        {story.genre || 'Tiên Hiệp'}
                      </span>
                    </div>

                    {/* Chapter Count Badge */}
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="rounded-lg border border-white/10 bg-black/80 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-slate-200 backdrop-blur-md shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                        {story._count.chapters} chương
                      </span>
                    </div>

                    {/* Shimmer Light Reflection on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none" />
                  </div>

                  {/* Story Details */}
                  <div className="flex flex-1 flex-col pt-3 pb-1 px-1">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-100 group-hover:text-[#d4af37] transition-colors line-clamp-2 leading-snug mb-1.5">
                      {story.title}
                    </h3>
                    
                    {story.summary ? (
                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed font-light">
                        {story.summary}
                      </p>
                    ) : (
                      <p className="text-slate-500 italic text-xs">Chưa có tóm tắt.</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
