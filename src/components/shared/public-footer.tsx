"use client";

import * as React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { FeedbackModal } from './feedback-modal';
import { cn } from '@/lib/utils';

interface PublicFooterProps {
  className?: string;
}

export function PublicFooter({ className }: PublicFooterProps) {
  const [isFeedbackModalOpen, setFeedbackModalOpen] = React.useState(false);

  return (
    <>
      <footer className={cn("flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t", className)}>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} CampusConnect. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex items-center gap-4 sm:gap-6">
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Button variant="link" className="text-xs hover:underline underline-offset-4 px-0 h-auto" onClick={() => setFeedbackModalOpen(true)}>Provide Feedback</Button>
        </nav>
      </footer>
      <FeedbackModal isOpen={isFeedbackModalOpen} onOpenChange={setFeedbackModalOpen} />
    </>
  );
}
