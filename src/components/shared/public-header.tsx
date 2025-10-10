import Link from 'next/link';
import { Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';

interface PublicHeaderProps {
  active?: 'about' | 'contact' | 'announcements';
}

export function PublicHeader({ active }: PublicHeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Building2 className="h-6 w-6" />
          <span className="text-xl font-bold">CampusConnect</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/announcements"
            className={cn(
              'hidden md:block transition-colors hover:text-primary-foreground/80 px-4',
              active === 'announcements' && 'font-bold'
            )}
          >
            Announcements
          </Link>
          <Link
            href="/about"
            className={cn(
              'hidden md:block transition-colors hover:text-primary-foreground/80 px-4',
              active === 'about' && 'font-bold'
            )}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={cn(
              'hidden md:block transition-colors hover:text-primary-foreground/80 px-4',
              active === 'contact' && 'font-bold'
            )}
          >
            Contact
          </Link>
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <User className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
