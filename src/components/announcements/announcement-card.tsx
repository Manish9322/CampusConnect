
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Announcement, AnnouncementCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Calendar, User } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: Announcement;
}

const categoryColors: Record<AnnouncementCategory, string> = {
    General: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Event: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    Academic: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Urgent: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <Badge className={cn(categoryColors[announcement.category], "shrink-0")}>{announcement.category}</Badge>
        </div>
        <CardTitle className="text-xl pt-2">{announcement.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm">{announcement.content}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 sm:gap-4 items-start border-t pt-4 mt-auto">
        <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Posted by {announcement.author}</span>
        </div>
        <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>On {new Date(announcement.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
