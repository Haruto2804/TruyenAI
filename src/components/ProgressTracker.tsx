"use client";

import { useEffect } from "react";
import { updateReadingProgress } from "@/app/actions/library";

export function ProgressTracker({ storyId, chapterId }: { storyId: string, chapterId: string }) {
  useEffect(() => {
    updateReadingProgress(storyId, chapterId).catch(console.error);
  }, [storyId, chapterId]);

  return null;
}
