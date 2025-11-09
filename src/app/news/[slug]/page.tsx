
"use client";

import * as React from 'react';
import { PublicHeader } from '@/components/shared/public-header';
import { PublicFooter } from '@/components/shared/public-footer';
import { useParams } from 'next/navigation';
import { useGetNewsItemQuery, useUpdateNewsInteractionMutation, useAddCommentMutation } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Calendar, User, ThumbsUp, Share2, Eye, Folder, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton } from 'react-share';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const SocialIconWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${className}`}>
    {children}
  </div>
);

export default function NewsDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data, error, isLoading, refetch } = useGetNewsItemQuery(slug, { skip: !slug });
  const [updateInteraction] = useUpdateNewsInteractionMutation();
  const [addComment] = useAddCommentMutation();
  const { toast } = useToast();

  const [comment, setComment] = React.useState("");
  const [commenterName, setCommenterName] = React.useState("");
  
  const wordCount = comment.split(/\s+/).filter(Boolean).length;
  const MAX_WORDS = 25;

  const handleLike = () => {
    updateInteraction({ slug, action: 'like' });
  };
  
  const handleShare = () => {
    updateInteraction({ slug, action: 'share' });
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wordCount > MAX_WORDS) {
      toast({
        title: "Comment is too long",
        description: `Please limit your comment to ${MAX_WORDS} words.`,
        variant: "destructive"
      });
      return;
    }
    if (comment.trim() && commenterName.trim()) {
      try {
        await addComment({ newsId: data.newsItem._id, authorName: commenterName, content: comment }).unwrap();
        setComment("");
        setCommenterName("");
        toast({ 
          title: "Comment Submitted!",
          description: "Your comment is awaiting moderation and will be visible after approval."
        });
      } catch (err) {
        toast({ title: "Error posting comment", variant: "destructive" });
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <PublicHeader />
        <main className="container mx-auto px-4 py-8 md:py-12">
            <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-4 w-1/2 mx-auto mb-8" />
            <Skeleton className="w-full aspect-video rounded-lg mb-8" />
            <div className="prose prose-lg mx-auto">
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-4" />
            </div>
        </main>
        <PublicFooter />
      </>
    );
  }

  if (error || !data) {
    return <div>Error loading news article.</div>;
  }

  const { newsItem, comments, relatedNews, trendingNews, categories } = data;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <PublicHeader active="news"/>
      <main>
        <article>
          <header className="relative">
            <Image src={newsItem.bannerImage} alt={newsItem.title} width={1600} height={800} className="w-full h-[60vh] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <div className="container mx-auto px-4">
                    <Badge variant="secondary" className="mb-4">{newsItem.category}</Badge>
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">{newsItem.title}</h1>
                    <p className="mt-4 max-w-2xl text-lg text-white/80">{newsItem.shortDescription}</p>
                </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid lg:grid-cols-4 gap-12">
                <div className="lg:col-span-3">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-8">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>By {newsItem.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(newsItem.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>{newsItem.visitCount} views</span>
                        </div>
                    </div>
                    
                    <div className="prose prose-lg max-w-none">
                        {newsItem.content}
                    </div>
                    
                    <Separator className="my-8" />
                    
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={handleLike}>
                            <ThumbsUp className="mr-2 h-4 w-4" /> Like ({newsItem.likes})
                        </Button>
                        <Popover onOpenChange={(open) => open && handleShare()}>
                          <PopoverTrigger asChild>
                            <Button variant="outline">
                                <Share2 className="mr-2 h-4 w-4" /> Share ({newsItem.shares})
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto">
                              <div className="flex gap-2">
                                  <FacebookShareButton url={shareUrl} title={newsItem.title}>
                                    <SocialIconWrapper className="bg-primary text-primary-foreground">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.603 0 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/></svg>
                                    </SocialIconWrapper>
                                  </FacebookShareButton>
                                  <TwitterShareButton url={shareUrl} title={newsItem.title}>
                                    <SocialIconWrapper className="bg-primary text-primary-foreground">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15"/></svg>
                                    </SocialIconWrapper>
                                  </TwitterShareButton>
                                  <LinkedinShareButton url={shareUrl} title={newsItem.title}>
                                    <SocialIconWrapper className="bg-primary text-primary-foreground">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/></svg>
                                    </SocialIconWrapper>
                                  </LinkedinShareButton>
                                  <WhatsappShareButton url={shareUrl} title={newsItem.title}>
                                    <SocialIconWrapper className="bg-primary text-primary-foreground">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>
                                    </SocialIconWrapper>
                                  </WhatsappShareButton>
                              </div>
                          </PopoverContent>
                        </Popover>
                    </div>

                    <section className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
                        <Card>
                            <CardContent className="p-6">
                                <form onSubmit={handlePostComment} className="space-y-4">
                                    <Input value={commenterName} onChange={(e) => setCommenterName(e.target.value)} placeholder="Your Name" required />
                                    <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." required />
                                    <div className="flex justify-between items-center">
                                      <Button type="submit">Post Comment</Button>
                                      <p className={`text-sm ${wordCount > MAX_WORDS ? 'text-red-500' : 'text-muted-foreground'}`}>{wordCount}/{MAX_WORDS} words</p>
                                    </div>
                                </form>
                                <Separator className="my-6" />
                                <div className="space-y-6">
                                    {comments.map((c: any) => (
                                        <div key={c._id} className="flex gap-4">
                                            <Avatar>
                                                <AvatarFallback>{c.authorName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{c.authorName}</p>
                                                <p className="text-sm text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</p>
                                                <p className="mt-2">{c.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {comments.length === 0 && (
                                        <p className="text-muted-foreground text-center">Be the first to comment!</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
                
                <aside className="lg:col-span-1 space-y-8 sticky top-24 self-start">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Folder className="h-5 w-5 text-primary" />
                                Related News
                            </CardTitle>
                            <CardDescription>More from this category.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {relatedNews.length > 0 ? (
                                relatedNews.map((related: any) => (
                                <Link key={related._id} href={`/news/${related.slug}`} className="block group">
                                    <div className="flex items-center gap-4">
                                        <Image src={related.bannerImage} alt={related.title} width={80} height={80} className="rounded-md object-cover w-20 h-20"/>
                                        <div>
                                            <p className="font-medium text-sm leading-snug group-hover:text-primary transition-colors">{related.title}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{new Date(related.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </Link>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No related news found.</p>
                            )}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Flame className="h-5 w-5 text-primary" />
                                Trending
                            </CardTitle>
                             <CardDescription>What others are reading.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {trendingNews.map((trending: any) => (
                                <Link key={trending._id} href={`/news/${trending.slug}`} className="block group">
                                    <p className="font-medium text-sm leading-snug group-hover:text-primary transition-colors">{trending.title}</p>
                                    <p className="text-xs text-muted-foreground">{trending.visitCount} views</p>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Folder className="h-5 w-5 text-primary" />
                                Categories
                            </CardTitle>
                            <CardDescription>Explore different topics.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {categories.map((category: string) => (
                                <Link key={category} href={`/news?category=${category}`}>
                                    <Badge variant="secondary">{category}</Badge>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </aside>
            </div>
          </div>
        </article>
      </main>
      <PublicFooter />
    </>
  );
}
