"use client";

import { useEffect, useRef } from "react";
import { saveProgress } from "../lib/actions/progress";

export default function ProgressTracker({
  seriesId,
  chapterId,
}: {
  seriesId: number;
  chapterId: number;
}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleScroll() {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const scrollable = document.body.scrollHeight - window.innerHeight;
        const percent =
          scrollable > 0
            ? Math.min(100, Math.round((window.scrollY / scrollable) * 100))
            : 100;
        saveProgress(seriesId, chapterId, percent);
      }, 800);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [seriesId, chapterId]);

  return null;
}
