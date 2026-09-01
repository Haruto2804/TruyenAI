import { BrandLoader } from "@/components/BrandLoader";

export default function ChapterLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Background ambient lighting */}
      <div className="relative">
        <div className="absolute -top-10 left-1/3 w-80 h-80 bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* Prominent Centered Brand Loader */}
      <div className="min-h-[55vh] flex items-center justify-center">
        <BrandLoader
          text="Thiên Thư AI"
          subtext="Đang mở văn phong chương mới..."
        />
      </div>
    </div>
  );
}
