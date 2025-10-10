import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Announcement, AnnouncementCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface HighlightedAnnouncementCardProps {
  announcement: Announcement;
}

const categoryColors: Record<AnnouncementCategory, string> = {
    General: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Event: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    Academic: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Urgent: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
}

export function HighlightedAnnouncementCard({ announcement }: HighlightedAnnouncementCardProps) {
  return (
    <Card className="flex flex-col h-full bg-gradient-to-br from-card to-muted/50 border-2 border-primary/20 shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge className={cn(categoryColors[announcement.category], "shrink-0")}>{announcement.category}</Badge>
            <Badge variant="outline" className="border-primary/50 text-primary">Latest</Badge>
          </div>
        </div>
        <CardTitle className="text-2xl md:text-3xl pt-2">{announcement.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground">{announcement.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t pt-4 mt-auto">
        <div className="text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 sm:gap-4 items-start mb-4 sm:mb-0">
            <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Posted by {announcement.author}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>On {new Date(announcement.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </div>
         <Button variant="ghost">Read More <ArrowRight className="ml-2 h-4 w-4" /></Button>
      </CardFooter>
    </Card>
  );
}
