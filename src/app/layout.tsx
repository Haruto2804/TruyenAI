import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Literata } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { auth } from "@/auth";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

const literata = Literata({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Thiên Thư AI - Kho Tàng Kỳ Thư",
  description: "Kho Tàng Kỳ Thư Vô Tận Từ Trí Tuệ Nhân Tạo",
};

// Next.js 15+ App Router type for Layout
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${literata.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 1. Chặn triệt để gesture zoom trên iOS WebKit (Safari, Chrome iOS, in-app iOS)
                var preventGesture = function(e) { e.preventDefault(); };
                ['gesturestart', 'gesturechange', 'gestureend'].forEach(function(evt) {
                  document.addEventListener(evt, preventGesture, { passive: false, capture: true });
                  window.addEventListener(evt, preventGesture, { passive: false, capture: true });
                });

                // 2. Chặn đa chạm (pinch-in thu nhỏ / pinch-out phóng to) trên MỌI trình duyệt di động
                var preventMultiTouch = function(e) {
                  if (e.touches && e.touches.length > 1) {
                    e.preventDefault();
                  }
                };
                document.addEventListener('touchstart', preventMultiTouch, { passive: false, capture: true });
                document.addEventListener('touchmove', preventMultiTouch, { passive: false, capture: true });
                window.addEventListener('touchmove', preventMultiTouch, { passive: false, capture: true });

                // 3. Chặn double-tap phóng to / thu nhỏ ngoài ý muốn
                var lastTouchEnd = 0;
                document.addEventListener('touchend', function(e) {
                  var now = Date.now();
                  if (now - lastTouchEnd <= 300) {
                    var target = e.target;
                    var isFormInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');
                    if (!isFormInput) {
                      e.preventDefault();
                    }
                  }
                  lastTouchEnd = now;
                }, { passive: false });

                // 4. Chặn Ctrl + Wheel (Pinch trackpad / chuột) trên tablet/laptop
                window.addEventListener('wheel', function(e) {
                  if (e.ctrlKey) {
                    e.preventDefault();
                  }
                }, { passive: false, capture: true });
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#09090b] text-slate-100 font-sans selection:bg-[#d4af37]/30 selection:text-white">

        
        {/* Glow nền mờ tạo chiều sâu */}
        <div className="pointer-events-none fixed inset-0 flex justify-center z-0">
          <div className="h-[30rem] w-[50rem] rounded-full bg-[#d4af37]/5 blur-[120px] opacity-60" />
        </div>

        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#09090b]/70 backdrop-blur-xl shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between relative z-10">
            <Link 
              href="/" 
              className="flex items-center gap-2 group transition-all duration-300 py-2 min-h-[44px] outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded-lg"
              aria-label="Trang chủ Thiên Thư AI"
            >
              <BookOpen className="h-6 w-6 text-[#d4af37] group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#d4af37] to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
                Thiên Thư AI
              </span>
            </Link>
            <div className="relative z-10 flex items-center min-h-[44px]">
              <UserMenu />
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-3 sm:px-4 py-6 sm:py-10 relative z-10">
          {children}
        </main>

        {/* Mobile Thumb-Friendly Bottom Navigation */}
        <MobileBottomNav isAdmin={isAdmin} />

        <footer className="border-t border-white/5 py-8 pb-24 md:pb-8 mt-auto relative z-10">
          <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Thiên Thư AI. Tự động hóa bởi Antigravity.
          </div>
        </footer>
      </body>
    </html>
  );
}

