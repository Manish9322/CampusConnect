import { PublicHeader } from '@/components/shared/public-header';
import { AboutHero } from '@/components/about/about-hero';
import { MissionSection } from '@/components/about/mission-section';
import { VisionSection } from '@/components/about/vision-section';
import { StorySection } from '@/components/about/story-section';
import { PublicFooter } from '@/components/shared/public-footer';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader active="about" />
      <main className="flex-1">
        <AboutHero />
        <MissionSection />
        <VisionSection />
        <StorySection />
      </main>
      <PublicFooter />
    </div>
  );
}
