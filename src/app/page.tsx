import { OnboardingModal } from "@/components/onboarding-modal";
import { PlatformHomeDashboard } from "@/components/platform/platform-home-dashboard";
import { PlatformHomeHero } from "@/components/platform/platform-home-hero";

export default function HomePage() {
  return (
    <div className="flex-1">
      <OnboardingModal />
      <PlatformHomeHero />
      <PlatformHomeDashboard />
    </div>
  );
}
