
"use client";

import * as React from 'react';
import { PublicHeader } from '@/components/shared/public-header';
import { PublicFooter } from '@/components/shared/public-footer';
import { useParams } from 'next/navigation';
import { useGetNewsItemQuery, useUpdateNewsInteractionMutation, useAddCommentMutation } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Calendar, User, ThumbsUp, Share2, MessageSquare, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon } from 'react-share';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function NewsDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data, error, isLoading } = useGetNewsItemQuery(slug, { skip: !slug });
  const [updateInteraction] = useUpdateNewsInteractionMutation();
  const [addComment] = useAddCommentMutation();
  const { toast } = useToast();

  const [comment, setComment] = React.useState("");
  const [commenterName, setCommenterName] = React.useState("");
  
  const handleLike = () => {
    updateInteraction({ slug, action: 'like' });
  };
  
  const handleShare = () => {
    updateInteraction({ slug, action: 'share' });
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && commenterName.trim()) {
      try {
        await addComment({ newsId: data.newsItem._id, authorName: commenterName, content: comment }).unwrap();
        setComment("");
        setCommenterName("");
        toast({ title: "Comment posted!" });
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

  const { newsItem, comments, relatedNews } = data;
  const readTime = Math.ceil(newsItem.content.split(' ').length / 200);
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
                            <Clock className="h-4 w-4" />
                            <span>{readTime} min read</span>
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
                                  <FacebookShareButton url={shareUrl} title={newsItem.title}><FacebookIcon size={32} round /></FacebookShareButton>
                                  <TwitterShareButton url={shareUrl} title={newsItem.title}><TwitterIcon size={32} round /></TwitterShareButton>
                                  <LinkedinShareButton url={shareUrl} title={newsItem.title}><LinkedinIcon size={32} round /></LinkedinShareButton>
                                  <WhatsappShareButton url={shareUrl} title={newsItem.title}><WhatsappIcon size={32} round /></WhatsappShareButton>
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
                                    <Button type="submit">
                                        <Send className="mr-2 h-4 w-4" /> Post Comment
                                    </Button>
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
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
                
                <aside className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Related News</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {relatedNews.map((related: any) => (
                                <Link key={related._id} href={`/news/${related.slug}`} className="block group">
                                    <div className="flex items-center gap-4">
                                        <Image src={related.bannerImage} alt={related.title} width={80} height={80} className="rounded-md object-cover w-20 h-20"/>
                                        <div>
                                            <p className="font-semibold leading-tight group-hover:text-primary">{related.title}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{new Date(related.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
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
