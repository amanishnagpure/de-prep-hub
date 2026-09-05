export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-500">
      {children}
    </div>
  );
}
