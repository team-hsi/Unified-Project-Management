import Features from "@/feature/landing/needs";
import { IntegrationsSection } from "@/feature/landing/features";
import FooterSection from "@/feature/landing/footer";
import HeroSection from "@/feature/landing/hero-section";
import TeamSection from "@/feature/landing/team";

export default function KanbanExample() {
  return (
    <div className="h-[calc(100vh-100px)]">
      <HeroSection />
      <IntegrationsSection />
      <Features />
      <TeamSection />
      <FooterSection />
    </div>
  );
}
