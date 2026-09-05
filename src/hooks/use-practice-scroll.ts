"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/** Scroll the practice editor into view when opening a practice route. */
export function usePracticeScrollToEditor() {
  const pathname = usePathname();

  React.useEffect(() => {
    if (
      !pathname.includes("/practice") &&
      !pathname.includes("/coding") &&
      !pathname.includes("/leetcode")
    ) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      const editor = document.getElementById("practice-editor");
      if (editor) {
        const top = editor.getBoundingClientRect().top + window.scrollY - 56 - 12;
        window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
        return;
      }
      window.scrollTo({ top: 0, behavior: "auto" });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);
}
