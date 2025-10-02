import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function LatestNewsSection() {
  const newsItems = [
    {
      title: 'The Future of Campus Management',
      description: 'Discover how AI is shaping the future of education...',
      image: 'https://placehold.co/550x310.png',
      aiHint: 'education technology',
      link: '#'
    },
    {
      title: 'New Feature: Parent Portal',
      description: "We're excited to launch our new portal for parents...",
      image: 'https://placehold.co/550x310.png',
      aiHint: 'students collaborating',
      link: '#'
    },
    {
      title: 'CampusConnect 2.0 is Here!',
      description: 'A completely redesigned experience with new features...',
      image: 'https://placehold.co/550x310.png',
      aiHint: 'graduation ceremony',
      link: '#'
    }
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            Latest News
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Stay Updated
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Read our latest articles and discover new features.
          </p>
        </div>
        <div className="mx-auto max-w-4xl space-y-8">
          {newsItems.map((item, index) => (
            <div key={index} className="group grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center border-b pb-8 last:border-b-0">
              <div className="md:col-span-1 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  width="550"
                  height="310"
                  alt={item.title}
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={item.aiHint}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                <Button variant="link" className="px-0 mt-2">
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
