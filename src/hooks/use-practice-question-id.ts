"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function usePracticeQuestionId(
  questions: { id: number }[],
  defaultId?: number,
  options?: { syncToUrl?: boolean }
): [number, React.Dispatch<React.SetStateAction<number>>] {
  const router = useRouter();
  const pathname = usePathname();
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

  const [selectedId, setSelectedIdState] = React.useState(() => resolveId(parsedId));
  const skipMobileScroll = React.useRef(true);

  React.useEffect(() => {
    setSelectedIdState(resolveId(parsedId));
  }, [parsedId, resolveId]);

  const setSelectedId = React.useCallback(
    (value: React.SetStateAction<number>) => {
      setSelectedIdState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        if (options?.syncToUrl && next) {
          const params = new URLSearchParams(searchParams.toString());
          params.set("id", String(next));
          params.delete("slug");
          const query = params.toString();
          router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        }
        return next;
      });
    },
    [options?.syncToUrl, pathname, router, searchParams]
  );

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
