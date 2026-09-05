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

  React.useEffect(() => {
    setSelectedId(resolveId(parsedId));
  }, [parsedId, resolveId]);

  return [selectedId, setSelectedId];
}
