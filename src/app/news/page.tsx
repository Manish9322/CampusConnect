
"use client"

import * as React from 'react';
import { PublicHeader } from '@/components/shared/public-header';
import { PublicFooter } from '@/components/shared/public-footer';
import { Newspaper } from 'lucide-react';
import { useGetNewsQuery } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default function NewsListPage() {
  const { data: news = [], isLoading } = useGetNewsQuery(undefined);
  const [filter, setFilter] = React.useState("All");
  
  const publishedNews = news.filter((item: any) => item.isPublished);

  const categories = ["All", ...Array.from(new Set(publishedNews.map((item: any) => item.category)))];

  const filteredNews = publishedNews.filter((item: any) => filter === "All" || item.category === filter);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-40 w-full" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-8 w-24" />
                    </CardFooter>
                </Card>
            ))}
        </div>
      );
    }
    if (filteredNews.length === 0) {
        return (
            <div className="container px-4 md:px-6">
                <EmptyState 
                    title="No News Found" 
                    description="There are no news articles for this category." 
                />
            </div>
        )
    }
    return (
        <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
        {filteredNews.map((item: any) => (
            <Link key={item._id} href={`/news/${item.slug}`} className="group">
                <Card className="h-full flex flex-col">
                    <CardHeader className="p-0">
                        <Image src={item.bannerImage} alt={item.title} width={600} height={400} className="rounded-t-lg object-cover aspect-video" />
                    </CardHeader>
                    <CardContent className="flex-1 pt-6">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{item.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-2">{item.shortDescription}</CardDescription>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{item.category}</span>
                        <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                    </CardFooter>
                </Card>
            </Link>
        ))}
        </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-muted/40">
        <PublicHeader active="news"/>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Newspaper className="h-12 w-12 text-primary" />
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Campus News
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  The latest stories, events, and achievements from across our campus community.
                </p>
              </div>
            </div>
          </section>

          <section className="w-full pb-12 md:pb-24 lg:pb-32">
            <div className="container px-4 md:px-6">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setFilter(cat as string)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                            >
                                {cat as string}
                            </button>
                        ))}
                    </div>
                </div>
                {renderContent()}
            </div>
          </section>
        </main>
        <PublicFooter />
      </div>
    </>
  );
}
