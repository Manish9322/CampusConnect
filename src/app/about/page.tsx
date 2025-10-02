import { PublicHeader } from '@/components/shared/public-header';
import { AboutHero } from '@/components/about/about-hero';
import { MissionSection } from '@/components/about/mission-section';
import { VisionSection } from '@/components/about/vision-section';
import { WhyChooseUsSection } from '@/components/about/why-choose-us-section';
import { CoreValuesSection } from '@/components/about/core-values-section';
import { StorySection } from '@/components/about/story-section';
import { PublicFooter } from '@/components/shared/public-footer';
import { OurTeamSection } from '@/components/landing/our-team-section';
import { AchievementsSection } from '@/components/about/achievements-section';
import { PartnersSection } from '@/components/about/partners-section';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader active="about" />
      <main className="flex-1">
        <AboutHero />
        <MissionSection />
        <VisionSection />
        <AchievementsSection />
        <WhyChooseUsSection />
        <CoreValuesSection />
        <StorySection />
        <OurTeamSection />
        <PartnersSection />
      </main>
      <PublicFooter />
    </div>
  );
}
