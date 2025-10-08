
import { Briefcase, Building, Milestone, Rocket, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StorySection() {
  const history = [
    {
      year: '2020',
      title: 'The Idea Was Born',
      description: 'A small team of educators and developers came together with a shared vision: to simplify campus management through technology.',
      icon: <Milestone className="h-6 w-6 text-primary" />,
    },
    {
      year: '2021',
      title: 'CampusConnect Launched',
      description: 'After months of development, we launched the first version of CampusConnect, focusing on attendance and basic student management.',
      icon: <Rocket className="h-6 w-6 text-primary" />,
    },
    {
      year: '2022',
      title: 'First 10 Institutions',
      description: 'We celebrated a major milestone by onboarding our first 10 institutional partners, gathering valuable feedback.',
      icon: <Building className="h-6 w-6 text-primary" />,
    },
    {
      year: '2023',
      title: 'Expanding the Team',
      description: 'Our team grew, bringing in new talent to accelerate development and enhance our platform\'s capabilities.',
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      year: '2024',
      title: 'The Future is Bright',
      description: 'With AI-driven insights and a growing community, we continue to innovate and shape the future of education.',
      icon: <Briefcase className="h-6 w-6 text-primary" />,
    },
  ];

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
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-border" aria-hidden="true"></div>
          <div className="space-y-16">
            {history.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'relative flex items-center justify-between w-full',
                  index % 2 !== 0 && 'flex-row-reverse'
                )}
              >
                <div className="w-[calc(50%-2.5rem)]">
                  <div
                    className={cn(
                      'space-y-2',
                      index % 2 === 0 ? 'text-left' : 'text-right'
                    )}
                  >
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                  <div className="flex items-center justify-center w-24 h-12 rounded-full bg-secondary">
                    <span className="font-bold text-secondary-foreground">{item.year}</span>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-background rounded-full border-2 border-border">
                    {item.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
