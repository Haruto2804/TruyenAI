"use client";

import { useEffect } from "react";
import { updateReadingProgress } from "@/app/actions/library";

interface ProgressTrackerProps {
  storyId: string;
  chapterId: string;
  storySlug?: string;
  storyTitle?: string;
  chapterNo?: number;
  chapterTitle?: string;
}

export function ProgressTracker({
  storyId,
  chapterId,
  storySlug,
  storyTitle,
  chapterNo,
  chapterTitle,
}: ProgressTrackerProps) {
  useEffect(() => {
    updateReadingProgress(storyId, chapterId).catch(console.error);

    if (storySlug && storyTitle && chapterNo) {
      try {
        localStorage.setItem(
          "thien_thu_last_read",
          JSON.stringify({
            storySlug,
            storyTitle,
            chapterNo,
            chapterTitle: chapterTitle || `Chương ${chapterNo}`,
            updatedAt: Date.now(),
          })
        );
      } catch {}
    }
  }, [storyId, chapterId, storySlug, storyTitle, chapterNo, chapterTitle]);

  return null;
}
