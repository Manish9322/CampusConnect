
'use client';

import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { Target } from 'lucide-react';

export function MissionSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="w-full bg-background py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div
            className={cn(
              'space-y-6 transition-all duration-700 ease-out',
              inView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-12'
            )}
          >
            <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
              <Target className="mr-2 h-4 w-4 text-primary" />
              Our Mission
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Empowering Education, Together.
            </h2>
            <p className="max-w-xl text-muted-foreground md:text-xl/relaxed">
              Our mission is to empower students, teachers, and administrators
              with <span className="font-semibold text-primary">intuitive tools</span> that
              foster <span className="font-semibold text-primary">collaboration</span>, enhance
              learning, and simplify campus management.
            </p>
            <p className="max-w-xl text-muted-foreground md:text-xl/relaxed">
              We believe in the power of{' '}
              <span className="font-semibold text-accent">technology</span> to
              create a more connected and efficient educational environment
              for everyone.
            </p>
          </div>
          <div
            className={cn(
              'flex items-center justify-center transition-all duration-700 ease-out delay-200',
              inView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            )}
          >
            <Image
              src="https://picsum.photos/seed/mission/600/600"
              width={600}
              height={600}
              alt="Mission"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
              data-ai-hint="team collaboration education"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
