export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 hero-glow" />
      <div
        className="absolute inset-0 grid-fade opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.5 0.02 250 / 8%) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.5 0.02 250 / 8%) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/8" />
      <div className="absolute top-[40%] -right-24 h-64 w-64 rounded-full bg-chart-2/10 blur-3xl" />
      <div className="absolute bottom-0 -left-16 h-56 w-56 rounded-full bg-chart-4/10 blur-3xl" />
    </div>
  );
}
