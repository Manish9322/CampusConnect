'use client';

import { Award, Briefcase, Smile, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function Counter({
  to,
  duration = 2,
}: {
  to: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    const from = 0;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration * 1000 / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = (frame / totalFrames);
      const currentCount = Math.round(to * progress);
      setCount(currentCount);

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [isInView, to, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// Dummy useInView hook
function useInView(ref: React.RefObject<HTMLElement>, options: { once: boolean; margin: string }) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, { threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isInView;
}

export function AchievementsSection() {
  const achievements = [
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      value: 150,
      label: 'Projects Completed',
    },
    {
      icon: <Smile className="h-8 w-8 text-primary" />,
      value: 99,
      label: 'Happy Clients',
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      value: 25,
      label: 'Awards Won',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      value: 5,
      label: 'Years in Business',
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            Our Achievements
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            A Track Record of Success
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            We pride ourselves on delivering excellence and achieving great results for our clients and community.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">
          {achievements.map((achievement) => (
            <div key={achievement.label} className="flex flex-col items-center text-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                {achievement.icon}
              </div>
              <div className="grid gap-1">
                <div className="text-4xl font-bold tracking-tighter text-primary">
                  <Counter to={achievement.value} />+
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {achievement.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
