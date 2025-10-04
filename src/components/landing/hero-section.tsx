import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, School, Users2, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-gradient-to-br from-background to-muted/50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium text-primary">
                The Future of Education Management
              </div>
              <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl xl:text-6xl/none">
                Empowering Educational Institutions with AI
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                CampusConnect is an all-in-one, AI-driven platform that seamlessly connects students, teachers, and administrators to create a more efficient and engaging learning environment.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 shadow-lg">
                <Link href="/login">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="shadow-sm">
                <Link href="/contact">Request a Demo</Link>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <School className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-bold">50+</span>
                </div>
                <p className="text-sm text-muted-foreground">Institutions</p>
              </div>
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-bold">10k+</span>
                </div>
                <p className="text-sm text-muted-foreground">Users</p>
              </div>
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-bold">1k+</span>
                </div>
                <p className="text-sm text-muted-foreground">Classes Managed</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="https://placehold.co/600x600.png"
              width="600"
              height="600"
              alt="Campus"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last animate-in fade-in zoom-in-95 duration-500"
              data-ai-hint="university students collaborating"
            />
            <div className="absolute -bottom-8 -right-4 w-48 hidden md:block">
              <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-xl border">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <Avatar className="border-2 border-background h-10 w-10">
                      <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="male portrait" />
                      <AvatarFallback>U1</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background h-10 w-10">
                      <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="female portrait" />
                      <AvatarFallback>U2</AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Trusted by leading educators worldwide.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
