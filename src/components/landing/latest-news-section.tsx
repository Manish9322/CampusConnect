import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function LatestNewsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
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
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <Image
              src="https://placehold.co/550x310.png"
              width="550"
              height="310"
              alt="News 1"
              className="aspect-video object-cover"
              data-ai-hint="education technology"
            />
            <CardHeader>
              <CardTitle>The Future of Campus Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Discover how AI is shaping the future of education...</p>
              <Button variant="link" className="px-0 mt-4">Read More <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </CardContent>
          </Card>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <Image
              src="https://placehold.co/550x310.png"
              width="550"
              height="310"
              alt="News 2"
              className="aspect-video object-cover"
              data-ai-hint="students collaborating"
            />
            <CardHeader>
              <CardTitle>New Feature: Parent Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">We're excited to launch our new portal for parents...</p>
              <Button variant="link" className="px-0 mt-4">Read More <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </CardContent>
          </Card>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <Image
              src="https://placehold.co/550x310.png"
              width="550"
              height="310"
              alt="News 3"
              className="aspect-video object-cover"
              data-ai-hint="graduation ceremony"
            />
            <CardHeader>
              <CardTitle>CampusConnect 2.0 is Here!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">A completely redesigned experience with new features...</p>
              <Button variant="link" className="px-0 mt-4">Read More <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
