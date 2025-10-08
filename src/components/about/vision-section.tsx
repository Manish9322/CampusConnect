
'use client';

import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { Globe, Users, Infinity } from 'lucide-react';

export function VisionSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const visionPoints = [
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: 'Global Connection',
      subtitle: 'Breaking Barriers',
      description: 'A world where geographical boundaries do not limit access to quality education.',
    },
    {
      icon: <Infinity className="h-8 w-8 text-primary" />,
      title: 'Lifelong Learning',
      subtitle: 'Continuous Growth',
      description: 'An ecosystem that supports continuous personal and professional development for all.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Future-Ready Generation',
      subtitle: 'Empowering Innovators',
      description: 'Equipping the next generation with the tools and mindset to innovate and build a better future.',
    },
  ];

  return (
    <section
      ref={ref}
      className={cn(
        'w-full py-12 md:py-24 lg:py-32 bg-background transition-opacity duration-700 ease-out',
        inView ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-10 lg:gap-12 text-center">
          <div
            className={cn(
              'space-y-6 text-center transition-all duration-700 ease-out',
              inView ? 'opacity-100 -translate-y-0' : 'opacity-0 translate-y-12'
            )}
          >
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">
              Our Vision
            </div>
          </div>

          <div
            className={cn(
              'w-full max-w-5xl transition-all duration-700 ease-out delay-200',
              inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            )}
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {visionPoints.map((point, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col items-center gap-4 rounded-xl border bg-background/50 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  style={{ animationDelay: `${150 * (index + 1)}ms` }}
                >
                  <div className="absolute top-0 -translate-y-1/2 rounded-full border-4 border-muted bg-background p-4 shadow-md transition-transform duration-300 group-hover:scale-110">
                    {point.icon}
                  </div>
                  <div className="space-y-2 pt-12">
                    <h3 className="text-xl font-bold text-foreground">{point.title}</h3>
                    <p className="text-sm font-semibold text-accent">{point.subtitle}</p>
                    <p className="text-sm text-muted-foreground pt-2">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={cn(
              'space-y-6 text-center transition-all duration-700 ease-out delay-100',
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            )}
          >
            <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed">
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Shaping the Future of Learning.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
