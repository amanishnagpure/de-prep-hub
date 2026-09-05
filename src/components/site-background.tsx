export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div
        className="absolute inset-0 opacity-100 dark:opacity-80"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 50% -15%, var(--glow), transparent 55%),
            radial-gradient(ellipse 50% 40% at 100% 0%, oklch(0.58 0.08 220 / 0.06), transparent 50%),
            radial-gradient(ellipse 40% 35% at 0% 30%, oklch(0.62 0.1 180 / 0.05), transparent 50%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.5 0.02 265 / 6%) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.5 0.02 265 / 6%) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 0%, black 20%, transparent 75%)",
        }}
      />
    </div>
  );
}
