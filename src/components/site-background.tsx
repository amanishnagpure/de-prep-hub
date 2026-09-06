export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute -left-[20%] -top-[30%] h-[70%] w-[70%] rounded-full opacity-80 blur-[100px]"
        style={{ background: "var(--mesh-purple)" }}
      />
      <div
        className="absolute -right-[15%] top-[5%] h-[55%] w-[55%] rounded-full opacity-70 blur-[90px]"
        style={{ background: "var(--mesh-blue)" }}
      />
      <div
        className="absolute bottom-[-20%] left-[30%] h-[50%] w-[60%] rounded-full opacity-60 blur-[100px]"
        style={{ background: "var(--mesh-pink)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_72%)]" />
    </div>
  );
}
