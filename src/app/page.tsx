import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CalendarCheck, Users, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">CampusConnect</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link
              href="/about"
              className="transition-colors hover:text-primary-foreground/80"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-primary-foreground/80"
            >
              Contact
            </Link>
             <Link
              href="/login"
              className="transition-colors hover:text-primary-foreground/80"
            >
              Login
            </Link>
          </nav>
          <Button className="md:hidden" variant="ghost" size="icon" asChild>
            {/* Add mobile menu functionality here if needed */}
            <Link href="/login">
                <Users className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-primary sm:text-5xl xl:text-6xl/none">
                    Welcome to CampusConnect
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    The all-in-one platform for managing your campus life.
                    Seamlessly connect students, teachers, and administrators.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">Get Started</Link>
                  </Button>
                </div>
              </div>
               <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Campus"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                data-ai-hint="university campus"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  A Better Way to Manage Education
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides robust features for every role within
                  your institution.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <Users className="h-10 w-10 mb-4 text-accent" />
                  <CardTitle>For Students</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Easily check your attendance, view grades, and communicate
                    with teachers.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <GraduationCap className="h-10 w-10 mb-4 text-accent" />
                  <CardTitle>For Teachers</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Take attendance, manage your classes, and post assignments
                    all in one place.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                   <CalendarCheck className="h-10 w-10 mb-4 text-accent" />
                  <CardTitle>For Admins</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Oversee all school operations, manage student and teacher
                    data, and view analytics.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 CampusConnect. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
