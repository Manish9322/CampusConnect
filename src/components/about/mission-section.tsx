
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
      description: 'Provide intuitive tools for students, teachers, and admins.',
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: 'Enhance Learning',
      description: 'Foster collaboration and simplify academic management.',
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: 'Drive Efficiency',
      description: 'Leverage technology to create a connected and efficient ecosystem.',
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
            'flex flex-col items-center space-y-8 text-center transition-all duration-700 ease-out',
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          )}
        >
          <div className="inline-flex items-center rounded-full bg-background px-4 py-2 text-sm font-medium shadow-sm">
            <Target className="mr-2 h-5 w-5 text-primary" />
            Our Core Mission
          </div>

          <p className="max-w-3xl text-3xl font-bold !leading-tight tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            To empower educational institutions with{' '}
            <span className="text-primary">intuitive technology</span> that fosters collaboration and{' '}
            <span className="text-accent">unlocks potential</span>.
          </p>

          <div className="w-full max-w-4xl pt-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {missionPoints.map((point, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex flex-col items-center gap-4 rounded-xl border bg-background p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl',
                    `delay-${150 * (index + 1)}`
                  )}
                  style={{ animationDelay: `${150 * (index + 1)}ms` }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    {point.icon}
                  </div>
                  <h3 className="text-lg font-bold">{point.title}</h3>
                  <p className="text-sm text-muted-foreground">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
