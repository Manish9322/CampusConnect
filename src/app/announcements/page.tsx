
import { PublicHeader } from '@/components/shared/public-header';
import { PublicFooter } from '@/components/shared/public-footer';
import { AnnouncementCard } from '@/components/announcements/announcement-card';
import { mockAnnouncements } from '@/lib/mock-data';
import { Megaphone } from 'lucide-react';

export default function AnnouncementsPage() {
  const publishedAnnouncements = mockAnnouncements.filter(a => a.isPublished);

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <PublicHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Megaphone className="h-12 w-12 text-primary" />
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Campus Announcements
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Stay up-to-date with the latest news, events, and important information from across the campus.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full pb-12 md:pb-24 lg:pb-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
              {publishedAnnouncements.map(announcement => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </div>
  );
}
