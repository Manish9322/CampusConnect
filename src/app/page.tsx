import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { PowerfulToolsSection } from '@/components/landing/powerful-tools-section';
import { AiFeatureSection } from '@/components/landing/ai-feature-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { LatestNewsSection } from '@/components/landing/latest-news-section';
import { OurTeamSection } from '@/components/landing/our-team-section';
import { FaqSection } from '@/components/landing/faq-section';
import { CtaSection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <PowerfulToolsSection />
        <AiFeatureSection />
        <TestimonialsSection />
        <LatestNewsSection />
        <OurTeamSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
