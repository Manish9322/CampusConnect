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
        <div className="mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="group">
              <Link href={latestNews.link}>
                <div className="overflow-hidden rounded-lg">
                    <Image
                    src={latestNews.image}
                    width="550"
                    height="310"
                    alt={latestNews.title}
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={latestNews.aiHint}
                    />
                </div>
                <h3 className="mt-4 text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors">{latestNews.title}</h3>
                <p className="mt-2 text-muted-foreground">{latestNews.description}</p>
                <Button variant="link" className="px-0 mt-2">
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-8">
              {otherNews.map((item, index) => (
                <div key={index} className="group grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center gap-4">
                  <Link href={item.link} className="block overflow-hidden rounded-lg">
                     <Image
                        src={item.image}
                        width="120"
                        height="80"
                        alt={item.title}
                        className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={item.aiHint}
                    />
                  </Link>
                  <div>
                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                      <Link href={item.link}>{item.title}</Link>
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
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