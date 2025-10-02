import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function LatestNewsSection() {
  const newsItems = [
    {
      title: 'The Future of Campus Management',
      description: 'Discover how AI is shaping the future of education and creating smarter, more connected learning environments for students and educators alike.',
      image: 'https://placehold.co/550x310.png',
      aiHint: 'education technology',
      link: '#'
    },
    {
      title: 'New Feature: Parent Portal',
      description: "We're excited to launch our new portal for parents, enhancing communication and involvement.",
      image: 'https://placehold.co/550x310.png',
      aiHint: 'students collaborating',
      link: '#'
    },
    {
      title: 'CampusConnect 2.0 is Here!',
      description: 'A completely redesigned experience with powerful new features and a streamlined interface.',
      image: 'https://placehold.co/550x310.png',
      aiHint: 'graduation ceremony',
      link: '#'
    }
  ];

  const [latestNews, ...otherNews] = newsItems;

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">
            Latest News
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Stay Updated
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Read our latest articles and discover new features.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="group flex flex-col justify-center space-y-6">
            <Link href={latestNews.link} className="space-y-4">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={latestNews.image}
                  width="600"
                  height="340"
                  alt={latestNews.title}
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={latestNews.aiHint}
                />
              </div>
              <h3 className="text-2xl md:text-4xl font-bold tracking-tight group-hover:text-primary transition-colors">{latestNews.title}</h3>
              <p className="max-w-prose text-muted-foreground md:text-lg">{latestNews.description}</p>
              <Button variant="link" className="px-0 text-lg">
                Read More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-col justify-center space-y-8">
            {otherNews.map((item, index) => (
              <div key={index}>
                <Link href={item.link} className="group grid grid-cols-[100px_1fr] items-center gap-6">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      width="100"
                      height="100"
                      alt={item.title}
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={item.aiHint}
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                </Link>
                {index < otherNews.length - 1 && <hr className="mt-8" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}