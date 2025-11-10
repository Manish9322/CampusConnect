
"use client";

import { Phone, Mail, MapPin, Twitter, Linkedin, Github } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetContactSettingsQuery } from '@/services/api';
import { Skeleton } from '../ui/skeleton';

const platformIcons: { [key: string]: React.ElementType } = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Twitter: Twitter,
};

export function ContactInfo() {
  const { data: settings, isLoading } = useGetContactSettingsQuery(undefined);

  if (isLoading) {
    return (
        <Card>
            <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                 <div>
                    <Skeleton className="h-6 w-24 mb-4" />
                    <div className="flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <Skeleton className="h-12 w-12 rounded-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
  }

  const contactDetails = [
    { icon: <Mail />, text: settings?.email || "contact@campusconnect.com", href: `mailto:${settings?.email}` },
    { icon: <Phone />, text: settings?.phone || "(123) 456-7890", href: `tel:${settings?.phone}` },
    { icon: <MapPin />, text: settings?.address || "123 University Ave, Learnington, ED 54321", href: '#' },
  ];
  
  const socialLinks = settings?.socials || [];


  return (
    <Card className="animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {contactDetails.map((detail, index) => (
            <a key={index} href={detail.href} className="flex items-center gap-4 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {detail.icon}
              </div>
              <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">{detail.text}</span>
            </a>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = platformIcons[link.platform];
                return Icon ? (
                  <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-muted hover:bg-primary/20 transition-colors">
                      <Icon />
                      <span className="sr-only">{link.platform}</span>
                  </a>
                ) : null;
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

    