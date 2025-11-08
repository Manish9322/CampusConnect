
"use client";

import * as React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { FeedbackModal } from './feedback-modal';

export function PublicFooter() {
  const [isFeedbackModalOpen, setFeedbackModalOpen] = React.useState(false);

  return (
    <>
      <footer className="flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} CampusConnect. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex items-center gap-4 sm:gap-6">
          <Button variant="outline" size="sm" onClick={() => setFeedbackModalOpen(true)}>Provide Feedback</Button>
          <Link href="/terms" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
            Privacy Policy
          </Link>
        </nav>
      </footer>
      <FeedbackModal isOpen={isFeedbackModalOpen} onOpenChange={setFeedbackModalOpen} />
    </>
  );
}
