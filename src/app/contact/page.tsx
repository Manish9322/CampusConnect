import { PublicHeader } from '@/components/shared/public-header';
import { PublicFooter } from '@/components/shared/public-footer';
import { ContactHero } from '@/components/contact/contact-hero';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactInfo } from '@/components/contact/contact-info';
import { MapSection } from '@/components/contact/map-section';
import { FaqSection } from '@/components/landing/faq-section';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader active="contact" />
      <main className="flex-1">
        <ContactHero />
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-8">
                <ContactForm />
              </div>
              <div className="space-y-8">
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>
        <MapSection />
        <FaqSection />
      </main>
      <PublicFooter />
    </div>
  );
}
