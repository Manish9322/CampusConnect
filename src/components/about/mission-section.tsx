
'use client';

import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { Target } from 'lucide-react';

export function MissionSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      ref={ref}
      className="relative w-full py-20 md:py-32 lg:py-40 bg-cover bg-center"
      style={{ backgroundImage: "url('https://picsum.photos/seed/mission/1200/800')" }}
      data-ai-hint="team collaboration education"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/70" />
      <div className="relative container px-4 md:px-6">
        <div
          className={cn(
            'flex flex-col items-center space-y-6 text-center text-primary-foreground transition-all duration-700 ease-out',
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          )}
        >
          <div className="inline-flex items-center rounded-full border-2 border-primary-foreground/50 bg-primary-foreground/10 px-4 py-2 text-sm font-medium">
            <Target className="mr-2 h-5 w-5" />
            Our Mission
          </div>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Empowering Education, Together.
          </h2>
          <p className="max-w-3xl text-primary-foreground/80 md:text-xl/relaxed">
            Our mission is to empower students, teachers, and administrators with{' '}
            <span className="font-semibold text-background">intuitive tools</span> that foster{' '}
            <span className="font-semibold text-background">collaboration</span>, enhance learning, and simplify campus management. We believe in the power of technology to create a more connected and efficient educational environment for everyone.
          </p>
        </div>
      </div>
    </section>
  );
}
