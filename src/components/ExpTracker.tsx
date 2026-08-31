"use client";

import { useEffect, useState } from "react";
import { addExpToUser } from "@/app/actions";

export function ExpTracker({ chapterId }: { chapterId: string }) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const trackRead = async () => {
      const result = await addExpToUser(chapterId);
      if (result.success) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    };
    
    // Give them EXP after being on the page for 2 seconds
    const timer = setTimeout(trackRead, 2000);
    return () => clearTimeout(timer);
  }, [chapterId]);

  if (!showToast) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
      <span className="text-xl">✨</span>
      <span className="font-medium">Bạn nhận được +10 EXP!</span>
    </div>
  );
}
