
'use client';

import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { Target, Users, BookOpen, BrainCircuit } from 'lucide-react';

export function MissionSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const missionPoints = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Empower Users',
      subtitle: 'Tools for Everyone',
      description: 'Provide intuitive tools for students, teachers, and admins to excel in their roles.',
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: 'Enhance Learning',
      subtitle: 'Fostering Growth',
      description: 'Foster collaboration and simplify academic management to create a better learning environment.',
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: 'Drive Efficiency',
      subtitle: 'Smart & Connected',
      description: 'Leverage technology to build a connected and efficient educational ecosystem.',
    },
  ];

  return (
    <section
      ref={ref}
      className={cn(
        'relative w-full overflow-hidden bg-muted py-20 md:py-32 lg:py-40 transition-opacity duration-700 ease-out',
        inView ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/5 opacity-50 blur-3xl"></div>
        <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-accent/5 opacity-50 blur-3xl"></div>
      </div>
      <div className="relative container px-4 md:px-6 z-10">
        <div
          className={cn(
            'flex flex-col items-center space-y-4 text-center transition-all duration-700 ease-out',
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          )}
        >
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            Our Core Mission
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            To empower educational institutions with{' '}
            <span className="text-primary">intuitive technology</span> that fosters collaboration and{' '}
            <span className="text-accent">unlocks potential</span>.
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            We are dedicated to building a seamless, unified platform that simplifies complexities and elevates the educational experience for everyone involved.
          </p>

          <div className="w-full max-w-5xl pt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {missionPoints.map((point, index) => (
                <div
                  key={index}
                  className={cn(
                    'group relative flex flex-col items-center gap-4 rounded-xl border bg-background/50 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl',
                    `delay-${150 * (index + 1)}`
                  )}
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
        </div>
      </div>
    </section>
  );
}
