"use client";

import { useEffect, useState, useRef } from "react";
import { addExpToUser } from "@/app/actions";

export function ExpTracker({ chapterId }: { chapterId: string }) {
  const [showToast, setShowToast] = useState(false);
  const hasTriggered = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    // Tăng bộ đếm thời gian mỗi giây
    timerRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = async () => {
      // Nếu đã cộng EXP rồi thì bỏ qua
      if (hasTriggered.current) return;
      
      // Chưa đủ 60 giây thì chưa xét
      if (timeSpent < 60) return;

      // Tính toán phần trăm cuộn trang
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);

      // Đã cuộn được 70% trang và ở lại đủ 60 giây
      if (scrollPercent >= 0.7) {
        hasTriggered.current = true; // Khóa lại, không gửi request 2 lần
        window.removeEventListener("scroll", handleScroll);
        
        const result = await addExpToUser(chapterId);
        if (result.success) {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [timeSpent, chapterId]);

  if (!showToast) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce z-50">
      <span className="text-xl">✨</span>
      <span className="font-medium">Bạn nhận được +10 EXP!</span>
    </div>
  );
}
