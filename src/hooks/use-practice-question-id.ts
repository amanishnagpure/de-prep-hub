"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

export function usePracticeQuestionId(
  questions: { id: number }[],
  defaultId?: number
): [number, React.Dispatch<React.SetStateAction<number>>] {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const parsedId = idParam ? Number(idParam) : null;

  const resolveId = React.useCallback(
    (candidate: number | null) => {
      if (candidate && questions.some((question) => question.id === candidate)) {
        return candidate;
      }
      return defaultId ?? questions[0]?.id ?? 1;
    },
    [defaultId, questions]
  );

  const [selectedId, setSelectedId] = React.useState(() => resolveId(parsedId));
  const skipMobileScroll = React.useRef(true);

  React.useEffect(() => {
    setSelectedId(resolveId(parsedId));
  }, [parsedId, resolveId]);

  React.useEffect(() => {
    if (skipMobileScroll.current) {
      skipMobileScroll.current = false;
      return;
    }
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;

    const editor = document.getElementById("practice-editor");
    if (!editor) return;

    const top = editor.getBoundingClientRect().top + window.scrollY - 56 - 12;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [selectedId]);

  return [selectedId, setSelectedId];
}
