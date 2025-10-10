"use client"

import * as React from 'react';
import { PublicHeader } from '@/components/shared/public-header';
import { PublicFooter } from '@/components/shared/public-footer';
import { AnnouncementCard } from '@/components/announcements/announcement-card';
import { mockAnnouncements } from '@/lib/mock-data';
import { Megaphone } from 'lucide-react';
import { HighlightedAnnouncementCard } from '@/components/announcements/highlighted-announcement-card';
import { Announcement } from '@/lib/types';
import { AnnouncementModal } from '@/components/announcements/announcement-modal';

export default function AnnouncementsPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState<Announcement | null>(null);

  const publishedAnnouncements = mockAnnouncements
    .filter(a => a.isPublished)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const [latestAnnouncement, ...otherAnnouncements] = publishedAnnouncements;

  const handleOpenModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const handleCloseModal = () => {
    setSelectedAnnouncement(null);
  };

  return (
    <>
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
              {latestAnnouncement && (
                <div className="mb-12 cursor-pointer" onClick={() => handleOpenModal(latestAnnouncement)}>
                  <HighlightedAnnouncementCard announcement={latestAnnouncement} />
                </div>
              )}
              <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
                {otherAnnouncements.map(announcement => (
                  <div key={announcement.id} className="cursor-pointer" onClick={() => handleOpenModal(announcement)}>
                    <AnnouncementCard announcement={announcement} />
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>
        <PublicFooter />
      </div>
      
      <AnnouncementModal 
        isOpen={!!selectedAnnouncement}
        onOpenChange={handleCloseModal}
        announcement={selectedAnnouncement}
      />
    </>
  );
}
