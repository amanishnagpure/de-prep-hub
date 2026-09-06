"use client";

import * as React from "react";
import { cn } from "cn";

type ResizableSplitProps = {
  direction?: "horizontal" | "vertical";
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  first: React.ReactNode;
  second: React.ReactNode;
};

export function ResizableSplit({
  direction = "horizontal",
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  className,
  first,
  second,
}: ResizableSplitProps) {
  const [size, setSize] = React.useState(defaultSize);
  const dragging = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onPointerDown = (event: React.PointerEvent) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ratio =
      direction === "horizontal"
        ? ((event.clientX - rect.left) / rect.width) * 100
        : ((event.clientY - rect.top) / rect.height) * 100;
    setSize(Math.min(maxSize, Math.max(minSize, ratio)));
  };

  const onPointerUp = (event: React.PointerEvent) => {
    dragging.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const isHorizontal = direction === "horizontal";

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex min-h-0 min-w-0",
        isHorizontal ? "flex-row" : "flex-col",
        className
      )}
    >
      <div
        className="min-h-0 min-w-0 overflow-hidden"
        style={isHorizontal ? { width: `${size}%` } : { height: `${size}%` }}
      >
        {first}
      </div>
      <div
        role="separator"
        aria-orientation={isHorizontal ? "vertical" : "horizontal"}
        aria-label="Resize panels"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className={cn(
          "shrink-0 touch-none bg-border transition-colors hover:bg-primary/40 active:bg-primary/60",
          isHorizontal ? "w-1 cursor-col-resize" : "h-1 cursor-row-resize"
        )}
      />
      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{second}</div>
    </div>
  );
}
