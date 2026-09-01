import { BrandLoader } from "@/components/BrandLoader";

export default function StoryLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10 pb-28 md:pb-12">
      {/* Background ambient lighting for page */}
      <div className="relative">
        <div className="absolute -top-10 left-1/4 w-96 h-96 bg-[#d4af37]/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      {/* Prominent Centered Brand Loader */}
      <div className="min-h-[55vh] flex items-center justify-center">
        <BrandLoader
          text="Thiên Thư AI"
          subtext="Đang tra cứu hồ sơ kỳ thư..."
        />
      </div>
    </div>
  );
}
