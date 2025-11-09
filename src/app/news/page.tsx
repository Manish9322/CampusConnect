
"use client"

import * as React from 'react';
import { PublicHeader } from '@/components/shared/public-header';
import { PublicFooter } from '@/components/shared/public-footer';
import { Search } from 'lucide-react';
import { useGetNewsQuery } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewsListPage() {
  const { data: news = [], isLoading } = useGetNewsQuery(undefined);
  const [filter, setFilter] = React.useState("All");
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const categories = ["All", ...Array.from(new Set(news.map((item: any) => item.category)))];

  const filteredNews = news.filter((item: any) => {
    const matchesCategory = filter === "All" || item.category === filter;
    const matchesSearch = searchTerm === "" || 
                          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return item.isPublished && matchesCategory && matchesSearch;
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-3">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            ))}
        </div>
      );
    }
    if (filteredNews.length === 0) {
        return (
            <div className="container px-4 md:px-6">
                <EmptyState 
                    title="No News Found" 
                    description={searchTerm ? "No articles match your search." : "There are no news articles for this category."}
                />
            </div>
        )
    }
    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredNews.map((item: any) => (
            <Link key={item._id} href={`/news/${item.slug}`} className="group block">
                <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 border hover:border-primary/50">
                    <div className="aspect-video overflow-hidden">
                        <Image 
                            src={item.bannerImage} 
                            alt={item.title} 
                            width={600} 
                            height={400} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <Badge variant="outline" className="w-fit mb-2">{item.category}</Badge>
                        <h3 className="text-xl font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3 flex-1">
                            {item.shortDescription}
                        </p>
                        <p className="text-xs text-muted-foreground mt-4">
                            {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
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
          <section className="relative w-full py-20 md:py-28 lg:py-36 bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/news-hero/1200/600')"}}>
             <div className="absolute inset-0 bg-primary/80" />
             <div
                className="absolute inset-0 bg-repeat opacity-5"
                style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            ></div>
            <div className="relative container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-6 text-center text-primary-foreground">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Campus News
                </h1>
                <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                  The latest stories, events, and achievements from across our campus community.
                </p>
                <div className="w-full max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="search"
                      placeholder="Search news articles..."
                      className="w-full rounded-full bg-background/90 text-foreground pl-12 pr-4 h-12 shadow-none border-border/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-2 flex-wrap bg-muted p-1 rounded-full">
                        {categories.map(cat => (
                            <Button 
                                key={cat as string}
                                variant={filter === cat ? 'default' : 'ghost'}
                                onClick={() => setFilter(cat as string)}
                                className="rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                {cat as string}
                            </Button>
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
