import { HomeHero } from "@/components/home/home-hero";
import { HomeDashboard } from "@/components/home/home-dashboard";
import { OnboardingModal } from "@/components/onboarding-modal";

export default function HomePage() {
  return (
    <div className="flex-1">
      <OnboardingModal />
      <HomeHero />
      <HomeDashboard />
    </div>
  );
}
