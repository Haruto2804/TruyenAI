"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ChapterKeyboardNavProps {
  prevUrl?: string | null;
  nextUrl?: string | null;
  storyUrl: string;
}

export function ChapterKeyboardNav({ prevUrl, nextUrl, storyUrl }: ChapterKeyboardNavProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when typing inside inputs, textareas, or modal popups
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Do not trigger if Alt, Ctrl, or Cmd is pressed (avoid interfering with browser shortcuts)
      if (e.altKey || e.ctrlKey || e.metaKey) {
        return;
      }

      if (e.key === "ArrowLeft" && prevUrl) {
        e.preventDefault();
        router.push(prevUrl);
      } else if (e.key === "ArrowRight" && nextUrl) {
        e.preventDefault();
        router.push(nextUrl);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevUrl, nextUrl, storyUrl, router]);

  return (
    <div className="hidden sm:flex items-center justify-center gap-4 py-2 text-[11px] text-slate-500 select-none">
      <span className="flex items-center gap-1.5">
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono text-[10px] border border-white/10">←</kbd>
        <span>Chương trước</span>
      </span>
      <span className="text-slate-700">•</span>
      <span className="flex items-center gap-1.5">
        <span>Chương sau</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono text-[10px] border border-white/10">→</kbd>
      </span>
    </div>
  );
}
