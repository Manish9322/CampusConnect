
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetContactSettingsQuery } from "@/services/api";
import { Github, Linkedin, Rss, Twitter } from "lucide-react";

const platformIcons: { [key: string]: React.ElementType } = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Twitter: Twitter,
};

export function SocialFollowCard() {
  const { data: settings, isLoading } = useGetContactSettingsQuery(undefined);

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
            </CardContent>
        </Card>
    )
  }

  const socialLinks = settings?.socials || [];

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
                <Rss className="h-5 w-5 text-primary" />
                Follow Us
            </CardTitle>
            <CardDescription>Stay connected on social media.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          {socialLinks.map((link) => {
            const Icon = platformIcons[link.platform];
            return Icon ? (
              <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-muted hover:bg-primary/20 transition-colors">
                  <Icon />
                  <span className="sr-only">{link.platform}</span>
              </a>
            ) : null;
          })}
        </CardContent>
    </Card>
  )
}
