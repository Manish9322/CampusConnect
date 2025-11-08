"use client"

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useGetNewsQuery } from '@/services/api';
import { Skeleton } from '../ui/skeleton';
import { EmptyState } from '../shared/empty-state';

export function LatestNewsSection() {
  const { data: news = [], isLoading } = useGetNewsQuery(undefined);

  // Directly use the latest news items without filtering by isPublished on the landing page
  const latestNewsItems = news.slice(0, 4);
  const [latestNews, ...otherNews] = latestNewsItems;

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-72" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
             <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <Skeleton className="w-full h-80 rounded-lg" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                   <Skeleton className="h-8 w-32" />
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-8">
                {[...Array(3)].map((_, index) => (
                  <div key={index}>
                    <div className="group grid grid-cols-[100px_1fr] items-center gap-6">
                      <Skeleton className="h-24 w-24 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                      </div>
                    </div>
                    {index < 2 && <hr className="mt-8" />}
                  </div>
                ))}
              </div>
          </div>
        </div>
      </section>
    )
  }

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
        {latestNewsItems.length === 0 ? (
          <EmptyState title="No News Yet" description="Check back later for the latest updates from campus."/>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
            {latestNews && (
              <div className="group flex flex-col justify-center space-y-6">
                <Link href={`/news/${latestNews.slug}`} className="space-y-4">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={latestNews.bannerImage}
                      width="600"
                      height="340"
                      alt={latestNews.title}
                      className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold tracking-tight group-hover:text-primary transition-colors">{latestNews.title}</h3>
                  <p className="max-w-prose text-muted-foreground md:text-lg">{latestNews.shortDescription}</p>
                  <Button variant="link" className="px-0 text-lg">
                    Read More <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            )}
            <div className="flex flex-col justify-center space-y-8">
              {otherNews.map((item, index) => (
                <div key={index}>
                  <Link href={`/news/${item.slug}`} className="group grid grid-cols-[100px_1fr] items-center gap-6">
                    <div className="overflow-hidden rounded-lg">
                      <Image
                        src={item.bannerImage}
                        width="100"
                        height="100"
                        alt={item.title}
                        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.shortDescription}</p>
                    </div>
                  </Link>
                  {index < otherNews.length - 1 && <hr className="mt-8" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
