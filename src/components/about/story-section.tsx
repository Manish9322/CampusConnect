
'use client'

import { Briefcase, Building, Milestone, Rocket, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetJourneyQuery } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap: { [key: string]: React.ElementType } = {
  Milestone: Milestone,
  Rocket: Rocket,
  Building: Building,
  Users: Users,
  Briefcase: Briefcase,
};

export function StorySection() {
  const { data: history = [], isLoading } = useGetJourneyQuery(undefined);

  const sortedHistory = [...history].sort((a, b) => a.order - b.order);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-16">
          {[...Array(3)].map((_, index) => (
            <div key={index} className={cn('relative flex items-center', index % 2 === 0 ? 'justify-start' : 'justify-end')}>
              <div className={cn('w-1/2', index % 2 === 0 ? 'pr-8' : 'pl-8')}>
                <div className={cn('p-4 rounded-lg bg-muted space-y-2')}>
                  <Skeleton className="h-6 w-20 mb-2" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="space-y-16">
        {sortedHistory.map((item, index) => {
            const Icon = iconMap[item.icon] || Milestone;
            return (
              <div
                key={index}
                className={cn(
                  'relative flex items-center',
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                )}
              >
                <div
                  className={cn(
                    'w-1/2',
                    index % 2 === 0 ? 'pr-8' : 'pl-8'
                  )}
                >
                  <div
                    className={cn(
                      'p-4 rounded-lg bg-muted space-y-2',
                       index % 2 === 0 ? 'text-left' : 'text-right'
                    )}
                  >
                     <div className={cn("inline-block px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground font-semibold mb-2")}>
                      {item.year}
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 bg-background rounded-full border-2 border-border z-10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            )
        })}
      </div>
    );
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
            Our Story
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            The Journey of CampusConnect
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            From a simple idea to a thriving platform, here's a look at our history.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-border" aria-hidden="true">
            {!isLoading && sortedHistory.length > 0 && (
                <>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-primary"></div>
                </>
            )}
          </div>
          {renderContent()}
        </div>
      </div>
    </section>
  );
}
