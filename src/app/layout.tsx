import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thiên Thư AI - Kho Tàng Kỳ Thư",
  description: "Kho Tàng Kỳ Thư Vô Tận Từ Trí Tuệ Nhân Tạo",
};

// Next.js 15+ App Router type for Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-50">
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-brand hover:text-brand-hover transition-colors">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold text-lg tracking-tight">Thiên Thư AI</span>
            </Link>
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-slate-800 py-6 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Thiên Thư AI. Tự động hóa bởi Antigravity.
          </div>
        </footer>
      </body>
    </html>
  );
}
