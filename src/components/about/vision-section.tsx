
'use client';

import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Eye } from 'lucide-react';

export function VisionSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      ref={ref}
      className={cn(
        'w-full py-12 md:py-24 lg:py-32 bg-background transition-opacity duration-700 ease-out',
        inView ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div
            className={cn(
              'space-y-6 transition-all duration-700 ease-out',
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            )}
          >
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">
              Our Vision
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Shaping the Future of Learning.
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Our vision is to create a globally connected educational
              ecosystem where{' '}
              <span className="text-primary font-semibold">technology</span> and
              human potential converge. We aim to break down barriers, foster{' '}
              <span className="text-primary font-semibold">
                lifelong learning
              </span>
              , and equip the next generation with the tools they need to build
              a better future.
            </p>
          </div>
          <div
            className={cn(
              'flex justify-center transition-all duration-700 ease-out delay-200',
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            )}
          >
            <Image
              src="https://picsum.photos/seed/vision-img/600/600"
              width={600}
              height={600}
              alt="Our Vision"
              className="overflow-hidden rounded-xl object-cover"
              data-ai-hint="futuristic education"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
