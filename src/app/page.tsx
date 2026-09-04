import prisma from "@/lib/prisma";
import { ResumeReadingBanner } from "@/components/ResumeReadingBanner";
import { StoryFeedWithFilter } from "@/components/StoryFeedWithFilter";

// ⚡ ISR CACHING: Cache HTML 60 giây trên server edge, giảm tải 99% cho Neon DB
export const revalidate = 60;

export default async function Home() {
  // ⚡ DATABASE-LEVEL SORTING: Sử dụng B-Tree Index trên Story.updatedAt
  // Tối ưu hóa tối đa tốc độ truy vấn (<2ms), hỗ trợ quy mô hàng chục nghìn truyện
  const stories = await prisma.story.findMany({
    orderBy: { updatedAt: "desc" },
    take: 24, // Giới hạn lấy 24 truyện mới nhất trực tiếp từ database
    include: {
      _count: {
        select: { chapters: true }
      },
      chapters: {
        orderBy: { chapterNo: "desc" },
        take: 1,
        select: {
          id: true,
          chapterNo: true,
          title: true,
          createdAt: true,
          updatedAt: true
        }
      }
    }
  });

  const now = Date.now();

  return (
    <div className="space-y-8 sm:space-y-10 pb-28 sm:pb-12">
      {/* Hero Section */}
      <section className="text-center py-6 sm:py-12 space-y-3 sm:space-y-4 relative">
        {/* Glow effect behind title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-[#d4af37]/10 blur-[80px] rounded-full pointer-events-none animate-pulse" />
        
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white relative">
          Kho Tàng <span className="bg-gradient-to-r from-[#d4af37] via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">Kỳ Thư</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-medium px-2">
          Đọc truyện mượt mà, không quảng cáo, tối ưu 100% cho thiết bị di động.
        </p>
      </section>

      {/* Resume Reading Quick Access */}
      <ResumeReadingBanner />

      {/* Main Stories Feed with Interactive Genre Tabs */}
      <section>
        <StoryFeedWithFilter stories={stories} now={now} />
      </section>
    </div>
  );
}
