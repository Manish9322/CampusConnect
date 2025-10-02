import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function OurTeamSection() {
  const teamMembers = [
    { name: 'John Doe', role: 'CEO & Founder', initials: 'JD', aiHint: 'man ceo' },
    { name: 'Jane Smith', role: 'Lead Developer', initials: 'JS', aiHint: 'woman developer' },
    { name: 'Mike Brown', role: 'UX/UI Designer', initials: 'MB', aiHint: 'man designer' },
    { name: 'Sarah Wilson', role: 'Marketing Head', initials: 'SW', aiHint: 'woman marketing' },
  ];

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
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-4 lg:gap-x-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center group">
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 transition-transform duration-300 ease-in-out group-hover:scale-105">
                  <AvatarImage src={`https://placehold.co/128x128.png`} data-ai-hint={member.aiHint} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-primary">{member.name}</h3>
                <p className="text-sm font-medium text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
