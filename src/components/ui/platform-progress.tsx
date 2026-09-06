import { cn } from "cn";

export function PlatformProgress({
  value,
  label,
  accent,
  subtle = false,
  className,
}: {
  value: number;
  label?: string;
  accent?: string;
  subtle?: boolean;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <div className="mb-3 flex items-center justify-between gap-3 type-meta">
          <span className="text-foreground">{label}</span>
          <span className="tabular-nums text-muted-foreground">{pct}%</span>
        </div>
      ) : null}
      <div
        className="platform-progress-track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="platform-progress-fill"
          style={{
            width: `${pct}%`,
            ...(accent
              ? {
                  background: subtle
                    ? `color-mix(in srgb, ${accent} 55%, var(--platform-border))`
                    : `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 55%, white))`,
                }
              : {}),
          }}
        />
      </div>
    </div>
  );
}
