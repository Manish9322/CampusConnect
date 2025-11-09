
"use client";

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Github, Twitter } from 'lucide-react';
import { useGetStaffQuery } from '@/services/api';
import { Skeleton } from '../ui/skeleton';

const platformIcons: { [key: string]: React.ElementType } = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Twitter: Twitter,
};

export function OurTeamSection() {
  const { data: teamMembers = [], isLoading } = useGetStaffQuery({});

  const renderContent = () => {
    if(isLoading) {
      return (
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-4 lg:gap-x-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-background/50" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-5 w-24 mx-auto bg-background/50" />
                <Skeleton className="h-4 w-32 mx-auto bg-background/50" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-4 lg:gap-x-8">
        {teamMembers.map((member: any) => {
          return (
            <div key={member.name} className="flex flex-col items-center text-center group">
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 transition-transform duration-300 ease-in-out group-hover:scale-105">
                  <AvatarImage src={member.image} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full border-2 border-transparent transition-all duration-300 group-hover:border-primary"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-primary">{member.name}</h3>
                <p className="text-sm font-medium text-muted-foreground">{member.role}</p>
                <div className="mt-2 flex justify-center gap-4">
                  {member.socials.map((social: any, index: number) => {
                    const Icon = platformIcons[social.platform];
                    return Icon ? (
                      <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Icon className="h-5 w-5" />
                      </a>
                    ) : null
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    );
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            Our Team
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Meet the Innovators
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            The passionate minds dedicated to improving education through technology.
          </p>
        </div>
        {renderContent()}
      </div>
    </section>
  );
}
