import { SiteContainer } from "@/components/site-container";

interface PracticeSectionShellProps {
  children: React.ReactNode;
}

export function PracticeSectionShell({ children }: PracticeSectionShellProps) {
  return (
    <div className="min-h-[calc(100dvh-3rem)] bg-background">
      <SiteContainer wide className="py-4 sm:py-6">
        {children}
      </SiteContainer>
    </div>
  );
}
