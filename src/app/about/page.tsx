import { Building2, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
       <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">CampusConnect</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/about"
              className="hidden md:block font-bold"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hidden md:block transition-colors hover:text-primary-foreground/80"
            >
              Contact
            </Link>
             <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Login</span>
                </Link>
              </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About CampusConnect
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                We are dedicated to revolutionizing the educational experience by providing a seamless, unified platform for academic institutions.
              </p>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Our Mission
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                To empower students, teachers, and administrators with intuitive tools that foster collaboration, enhance learning, and simplify campus management. We believe in the power of technology to create a more connected and efficient educational environment.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="https://placehold.co/550x310.png"
                width="550"
                height="310"
                alt="Our Mission"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                data-ai-hint="team collaboration"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 CampusConnect. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
